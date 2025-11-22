---
title: How User Interface runs on Browser engine (Chromium)
date: 2025-10-27
---

## Introduction

This document describes about Browser Engine not Search Engine i have explained about the core concept about browser engine - chromium. This document helps you understand the vast architecture, I have only explained what is most needed if you wanna go all in you can refer the documents that i pinned in the EOF.

## How the UI bundle reaches the browser?

- DNS resolution getting the destination IP (where the build is located)- wanna know how? take a look at **Networking card**.
- The browser uses https or http to talk to the destination IP.
- HTTPS uses TLS(Transport Layer Security) -- ensuring the connection is encrypted and secure.
- A TCP connection is established via 3-way handskake (SYN, SYN-ACK, ACK).
- After TCP connection Acknowledged the browser sends a request for the resource Get/HTTPS/1.1 host: arkasoft.ai.
- The DNS Authoritive resolves with destination IP and request is sent by Browser Process, the server or CDN receives the request and returns the Build file in Chunks.
- Those files will be downloaded in the browser.

## Chromium Multi-Process Architecture

Modern browsers like Chrome, Edge, Brave and Opera use a multi-process sandboxed architecture (Isolated from outside world), ofter called as **"site isolation"** or **"processs-per-site-instance"**.
Which means, Each tab get's it's own isolated **Renderer Process**. The **Browser**, **GPU** and **Network** Process are shared globally across all tabs. Additionaly **Utility** process spawned as needed. Each cross-origin `<iframe>` may also get its own Renderer Process (OOPIF), allowing site isolation within a single tab.

- **Browser Process** -
  - Manages tabs and windows, Handles network requests, downloads, caching, Co-ordinates security and sandboxing.
  - Handles UI rendering, Creates sandboxed Renderer Process for each Tab.
  - Access OS resources.
  - **UI Thread:** Captures address bar input, initiates navigation.
  - **IO Thread:** Handles IPC with Network, Renderer, and Utility processes.
  - **Cache / File Threads:** Access local resources if needed.
  - **Process Launcher Thread:** Creates Renderer or Utility processes.
  - **Worker / ThreadPool Threads:** Background tasks, scheduling, navigation throttles (permissions, CSP, SafeBrowsing checks).
- **Network Process** -
  - Handles fetch requests, Manages caching HTTP cache and service workers.
  - Can respond to request offline first using cached data, Runs independently of Renderer Process.
  - Allows progressive web page to work offline.
  - **Network IO Thread:** TCP/TLS handshake, GET requests, response streaming.
  - **Host Resolver Thread:** DNS lookup.
  - **Cache Thread / Cookie Thread:** Reads HTTP cache or cookies if available.
- **Renderer Process** -
  - Handles single tab or few tabs, Truning HTML, CSS and JS into Pixels.
  - Runs v8 engine for JS execution.
  - Performs layout, painting and compositing.
  - Interacts with GPU or ShiftShader via compositing / rasterization, Cannot access OS directly.
  - Communicate with browser process for privileged operations like accessing mic, local file directory etc.
    - **Main Thread (Blink):**
      - HTML Parser → builds DOM
      - CSS Parser → builds CSSOM
      - JS execution (V8 engine) → AST, bytecode, TurboFan JIT
      - Event dispatch & user interaction handling
    - **Compositor Thread:**
      - Layer tree management
      - Handles scroll, animation, paint invalidation
      - Sends layer data to GPU process
    - **Raster Threads:**
      - Rasterize tiles from layers (CPU rasterization if GPU unavailable)
    - **Worker Threads / ThreadPool:**
      - Web Workers → parallel JS computation without blocking main thread
      - Worklets → lightweight contexts for animation, CSS paint, audio
    - **IO Thread (Renderer):**
      - Receives network or browser IPC messages
      - Sends resource requests to Network process (from Preload Scanner)
  - In some builds Chromium removes the dedicated renderer IO thread and uses worker threads instead.
- **GPU Process** -
  - Handles all GPU-acclerated task.
  - Rasterization of layers.
  - Compositing and WebGl rendering.
  - Crashes in GPU won't affect the browser.
  - Frees up main thread in Renderer Process for JS & layout.
  - **GPU Main Thread:** Receives layers, orchestrates rasterization.
  - **Command Buffer Threads:** Converts GPU commands → hardware API (OpenGL/DirectX/Vulkan).
  - **Video / Raster Threads (optional):** Handles offloaded rasterization or video decode.

## Rendering Life Cycle

- When typing `www.arkasoft.ai` in address bar and hitting enter the browser process captures and checks for address if address then build is requested else search term sent to **Search Engine**.
- On navigation, the Browser process creates a **NavigationRequest**, applies **security** checks (CSP, COOP/COEP, CORB), selects the correct **SiteInstance** and decides if a new Renderer Process is needed (process-per-site-instance). Once the response is ready, the browser commits the navigation by swapping to a new **RenderFrameHost**.
- **Browser Process** - The Orchestrator (controller)
  - The `Browser` Process is the `Orchestrator` this is the one which controls the whole life cycle other processes.
  - The Browser process has many threads, each thread plays it's own role inside the process.
  - Mainly 5 Threads - UI Thread, IO Thread, File Thread, Cache Thread, Process Launcher Thread, Worker/ ThreadPoll Thread.
  - The moment `wwww.arkasoft.ai` is typed in address bar and hit enter, the UI thread captures the input and performs appropiate action.
  - In this case it is a `URL` so navigation action will be performed.
  - If a `searchTerm` then the query will be sent to search engine.
  - A message to `Network` Process will be built and sent by `Browser` Process via `IPC`.
  - `Browser` Process also runs navigation throttles — checks for permissions, `CSP` (Content Security Policy), SafeBrowsing, extensions, before allowing the `request` to proceed to `Network`.
- **Network Process**
  - The `Network` Process is responsible to handle every request, response sent and received.
  - It receives what to request via `IPC` from the `Browser` Process.
  - The destination IP address is found via `DNS` lookup and `Network` Process opens a `TCP`(Transmission Control Protocol) socket, performs `TLS`(Transport Layer Security) handshake (`SYN`-> `SYN-ACK` -> `TLS` negotiation).
  - The `Network` Process sends `GET/` request to the destination IP address.
  - The `Authoritive` routes the request to `CDN` or `server` according to infra configuration and the `HTML chunk` is streamed to the `Network Process`.
  - You may ask why not a `websocket` if data is gonna be `streamed`, but `websocket` is a `overkill` for this one time process.
  - Those chunks are written in a `shared memory` buffer by `Netowork` Process so both `Network` and `Renderer` Processes can access them without `copying`.
  - `Network` Process sends notification via `IPC` to `Browser` Process then,`Browser` Process creates or re-uses `Renderer` Process.
- **Renderer Process**
  - After `Renderer` Process receives the notification form `Browser` Process via `IPC` or gets created (depnds on site instance) it gets the `HTML` Stream from `shared Memory` buffer via `Mojo data pipes`.
  - Inside Renderer Process multiple thread will be working together, namely Main Thread (Blink), Compositor Thread, Worker Thread and Raster Thread.
  - After `HTML` stream is received the `HTML Parser` starts parsing tokens into DOM.
  - A `Preload Scanner` runs ahead of Parser finding `<Link>`, `<script>`, `<img>` tags early, sends resource request via `IPC` to `Network` Process.
  - The `Network` Process will resolve from cache, service worker or network.
  - Each Stream has a parser or executor -
    - `HTML` has `HTML` Parser -> `DOM`.
    - `CSS` has `CSS` Parser -> `CSSOM`.
    - `JS` has `v8` (Main Thread) -> `AST`.
  - The `Render Tree` is built using `DOM` + `CSSOM`.
  - The `<script>` triggers the `v8` execution, `v8` runs inside `Renderer` Main Thread.
  - `v8` Parses the JS code and builds **A**bstract **S**yntax **T**ree, generates `bytecode` (Ignition) Optimizes hot code (TurboFan JIT) and Executes on main thread - In depth About v8 explained below.
  - `v8` executes `JS` on the `Renderer’s` main thread. However, `Web Workers` or `Worklets` run in separate thread that `v8` isolates (parallel threads) within the same `Renderer` Process.
  - After Renderer builds Render Tree -> Layout Tree -> Layer Tree, it need to paint element and create display list.
  - Here `Compositor` thread will send the layer info via `shared memory` to `GPU` Process.
  - `GPU` Process rasterizes -> composites -> sumbits final frame to `OS Compositor`.
  - The `GPU` Process uses Command `Buffers` to batch drawing commands from multiple renderers before sending them to the `OS` compositor (like ANGLE for OpenGL/DirectX translation).
  - Browser Process UI thread receives "frame ready" from OS and presents it on screen - this is a very big process but for now this level of knowledge is enough.
  - If `GPU` not available then fallback to `SwiftShader` (software emulation of this compositor pipeline using CPU).
  - The `Renderer` has a `scheduler` that prioritizes `user-visible` tasks (input, animation, painting) over `background` JS or network `callbacks`. This is key for maintaining `60fps` responsiveness.
  - `IO` Thread handles IPC message from Browser and Network yes network can communicate with renderer directly via IPC interface Browser Process is just supervisor not a middleman.
- **Service worker / Cache layer**
  - Service worker runs in a seperate process.
  - Intercepts `fetch()` and network requests.
  - Can respond with cached or network data.
  - Stored in cache storage API - can configure this via JS code.
  - Service workers run in their own dedicated thread inside utility Process (not inside Rendere Process).
  - They can wake up even when the page is closed, enabling background sync, push notifications and offline caching.
- **After Load**
  - Browser Process captures input (UI Thread).
  - Sends co-ordinates/events -> Renderer via IPC.
  - Renderer -> dispatch to DOM -> triggers JS event listeners in v8.
  - DOM Mutations -> Recalculate style -> Layout -> Paint -> Composite -> GPU -> Display again.
  This happens dozens of times per second in smooth UI.
- **Caching and optimization layer** -
  - To make UI fast
    - **Browser Cache** : Reuses static assets JS, CSS and Images.
    - **CDN Cache** : Stores copies close to the user's orgin.
    - **Service Workers** : Offline support and caching - PWA (Progressive Web Application - works with cached data) Pattern.
    - **Lazy Loading**: Loads only the UI components currently needed.
- **Runtime Rendering Performance** -
  - At runtime, the browser continuously recalculates style, layout, and paint as the user interacts.
  - **Layout Thrashing:** Frequent DOM reads & writes, can batch DOM opetations or use `requestAnimationFrame`.
  - **Forced Reflows:** Accessing Layout metrics after mutations, cache values before DOM changes.
  - **Paint Stroms:** Changing non-GPU composited properites, use `transform` or  `opacity`.
  - **Long Tasks (>50ms):** JS blocking main thread, break work with `setTimeout` or move to Web Worker.
- **Web Workers and Worklets** -
  - To prevent the main thread from blocking:
    - **Web Workers** – Run scripts in parallel threads, no DOM access but great for heavy computation.
    - **Shared Workers** – Allow multiple tabs to share state.
    - **Worklets** – Lightweight v8 contexts for visual tasks (e.g., CSS Paint API, Animation Worklet).
- Off-main thread execution is key to keeping UI smooth at **60fps**.

## Quick Reference Table of Threads in Rendering Life Cycle

| Stage                  | Process  | Threads Involved                        | Role                                                        |
|------------------------|----------|-----------------------------------------|-------------------------------------------------------------|
| URL input / Navigation | Browser  | UI, IO, ThreadPool, Process Launcher    | Capture input, schedule navigation, enforce security checks |
| Resource Fetch         | Network  | Network IO, Host Resolver, Cache        | DNS, TCP/TLS handshake, GET requests, stream HTML/CSS/JS    |
| Parsing & Layout       | Renderer | Main (Blink), IO                        | HTML/CSS parsing, JS execution, DOM/CSSOM, IPC              |
| Preload / Fetch        | Renderer | IO Thread, Worker Threads               | Send requests for images, scripts, CSS                      |
| JS Execution           | Renderer | Main Thread (V8), Web Workers           | AST, bytecode, JIT, parallel computation                    |
| Layer Paint            | Renderer | Main Thread, Compositor, Raster Threads | Build layers, rasterize tiles, send to GPU                  |
| Compositing & Display  | GPU      | GPU Main, Command Buffer, Raster        | Rasterize & composite layers, submit to OS                  |
| Service Worker / Cache | Utility  | Service Worker Thread, Cache Threads    | Serve cached/offline responses                              |

## Site Isolation Concepts

- Chromium's site isolation is a security & stability architecture that forces difference websites to run in seperate renderer process to prevent data leakage, spectre attacks and cross-site contamination.
- **Site Instance** -
  - A site instance represents a group of documents with the same site URL.
  - Same site -> Same site instance -> Can share renderer.
  - Different site -> Different site instances -> Must use different renderer process.
- **Browsing Instance** -
  - A Browsing instance is a group of pages that can script each other.
  - Cross site navigation withing same browsing instance still requires processes swap.
- **OOPIF - Out of process iFrames** -
  - Each cross-origin iFrame gets its own renderer process.
  - Parent page and iframe communicates via IPC, not memory sharing.
  - DOM access:
    - Parent cannot read iFrame DOM.
    - iFrame cannot access parent.
- **Process per site instance** -
  - A renderer process is tied to a site instance.
  - Example -
    - arkasoft.ai -> Renderer A.
    - google.com -> Renderer B.
    - Navigating arkasoft -> github.com -> Rendere C.
- **Data Isolation** -
  - Prevents cookies, localstorage, indexedDB, sharedArrayBuffer leaking accross origins.
  - Memory isolation - a renderer cannot see heap or stack content of another renderer.
- **Crash Isolation** -
  - Renderer crashes don't take the entire browser down.
  - iFrame crashes blocks only that frame.
- **Security Threat Prevented** -
  - Spectre side-channel attacks (tricks CPU bypasses the border steals scerets from CPU cache like a shinobi).
  - Cross-site scripting via shared memory.
  - Same-process privilege esclation.

## Security Architecture

- Chromium uses a multi-layered security model: sandboxing, process isolation, premission gates and policy enforcement.
- **Sandboxing** -
  - Renderer processes run with no direct OS access.
  - It won't have permissions to read file system, open arbitary sockets, access camera or mic, spawn threads outside controlled APIs.
  - Renderer can only send IPC message to Browser Process.
- **Permission Architecture** -
  - Browser Process always asks the user for access - mic, camera, location and other system stuffs.
  - Renderer requests are always brokered by Browser process, browser verifies Origin, User gesture, Stored permissions.
- **CSP - Content Securirty Policy** -
  - Defends againts XXS, inline scripting, cross-site injections.
  - COOP + COEP -> Cross origin Isolation, required for SharedArrayBuffer, high resolution timers.
  - COOP - Cross-Origin Opener Policy, COEP - Cross-Origin Embedder Policy.
  - Together they gurantee no cross-origin pages in the same browsing context group.
  - Enables strong isolation -> sharedArrayBuffer becomes safe.
  - CROB - Cross-Origin Read Blocking, prevents renderer from reading cross-origin HTML/XML/JSON even if accidentally requested.
- **Mojo IPC Security** -
  - All inter process communication is validated.
  - Invalid/Malicious IPC closes renderer process.
- **Extension Process Isolation** -
  - EXtensions runs in isolated extension processes.
  - With isolated context inside the renderer.
- **Memory safety** -
  - Oilpan garbage collector for blink DOM objects.
  - PartitionAlloc to avoid heap exploitation.
  - MiraclePtr (Pointer sanctification).

## Event Loop / Scheduler

- Chromium renders the User Interface smoothly because Blink scheduler organizes tasks with priority tiers.
- **The Event Loop Model**
  - Renderer event loop processes Input events, Javascript callbacks, DOM updates, Render steps, Compositor commits, Idle tasks (GC, caching).
- **Blink scheduler Priorities**
  - Blink scheduler has strict priorities here is the map -
    - Highest - User Inputs.
    - High - Animations Frame via `requestAimationFrame`.
    - Medium - Rendering, style recalc.
    - Normal - Javascript callbacks, promises.
    - Low - Network events, timers.
    - Idle - GC, cleanup tasks.
  - Input and Animation get preemptive priority to maintain 60fps.
- **Task Queue Types**
  - Renderer maintains many task queues-
    - Main thread queue.
    - Input queue.
    - Animation queue.
    - JS Microtask queue (promises, setTimeOuts).
    - Timer queue.
    - Idle queue.
  - Microtasks runs after each JS call stack, before next task and painting that is why rendering will slow down.

## Back - Forward Cache (bfcache)

- Browser navigation - Back and Forward buttons, can restore pages instantly using In-Memory snapshots.
- **bfCache**
  - When user navigates away, the page is frozen not closed.
  - It's entire state is kept in memory, DOM tree, JS heap, Layout, scrool position, Event listeners, WebAssembly Memory.
  - So going back and forward - the page restored instantly no network requests, no JS re-rendering, no layout rebuild, no repaint.
  - Faster than any framework's client-side caching.
  - Active → Frozen → In bfcache → Restored OR Destroyed.
- **Scenarios when page won't enter bfCache**
  - When a page uses `unload` event and `window.close()` rules.
  - Active websockets, IndexedDB transactions, WebRTC.
  - Not cross-origin isolated when required.
  - Page embeds cross-origin iframe that is not cacheable.
- **Freezing beheavior**
  - When page enters bfCache JS timers pauses, setInterval/setTimeOut frozen.
  - `requestAnimationFrame` stops, No event loop, page cannot execute JS, workers terminated.

## Visualized

![Chromium Architecture](./visuals/ChromiumArchitectureCycle.png)

## Modern UI Delivery Architecture

- **Static site** built once served from CDN.
- **CSR** Client side Rendering browser builds the UI.
- **SSR** Server builds the HTML.
- **Streaming SSR** stream HTML as it's generated.

## Modern Delivery Optimizations

- **HTTP/2 Multiplexing** – Multiple requests share a single TCP connection.
- **HTTP/3 (QUIC)** – Runs over UDP, faster handshake and better recovery.
- **Compression** – Use Brotli over Gzip for JS and CSS.
- **Resource Hints**
  - `dns-prefetch` – Resolve domains early.
  - `preconnect` – Establish TCP/TLS before needed.
  - `preload` – Force critical assets early.
  - `prefetch` – Prepare likely next navigation.
- **ETags & Cache-Control** – Enable revalidation and versioning.

## Why bundle size and code structure matter?

| Problem                     | Cause                       | Engine Effect            |
| --------------------------- | --------------------------- | ------------------------ |
| Large JS bundle             | Over-imported libs          | High parse & JIT cost    |
| Memory leaks                | Event listeners not removed | Heap grows → GC pressure |
| Many closures               | Retained references         | Old space bloats         |
| Re-render heavy React comps | Frequent DOM diffing        | CPU & GC thrashing       |
| Inline large JSON           | Direct memory allocation    | Heap fragmentation       |

## Witnessing Performance Metrics

Measure what your browser is doing:

| Metric          | Description              | Tool            |
|-----------------|--------------------------|-----------------|
| FCP             | First Contentful Paint   | Lighthouse      |
| LCP             | Largest Contentful Paint | Core Web Vitals |
| TTI             | Time to Interactive      | Performance tab |
| CLS             | Layout stability metric  | Chrome DevTools |
| Memory Snapshot | Track heap allocations   | Chrome → Memory |
| Flamegraph      | Visualize function cost  | Chrome Profiler |

## How to think like a Frontend Engineer not just a Developer

You are not writing JS code anymore, you're orchestrating **v8**.
Think like this

- Every variable = A heap allocation.
- Every closure = A persistent context.
- Every loop = CPU + stack frame growth.
- Every library = Parser + JIT compilation.
- **This is why run time aware architecture matters**
  - Use code splitting.
  - Minimizze global state.
  - Clean up event listeners.
  - Profile with Performance Tab.
  - Watch heap snapshots of retained objects.

## If you are curious I got you

   1. Deep dive in to V8 internals - **v8 Internals** card.
   2. How modern framework works with Chromium browser - **React Internals** card.
   3. Inter Process Communication system - **Inter Process communication System** card.

> This makes you a better engineer — one that AI can’t easily replace.
