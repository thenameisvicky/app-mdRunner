---
title: How User Interface runs on Browser engine (Chromium)
date: 2025-10-27
---

## How the UI bundle reaches the browser?

- DNS resolution getting the destination IP (where the build is located)- wanna know how? take a look at **Networking card**.
- The browser uses https or http to talk to the destination IP.
- HTTPS uses TLS(Transport Layer Security) -- ensuring the connection is encrypted and secure.
- A TCP connection is established via 3-way handskake (SYNC, SYNC-ACK, ACK).
- After TCP connection Acknowledged the browser sends a request for the resource Get/HTTPS/1.1 host: arkasoft.ai.
- The DNS Authoritive gets the request and route it to the server or CDN according to the configuration.
- The CDN returns pre built HTML, CSS and JS files to the browser.
- Those files will be downloaded in the browser.

## Browser Process Architecture

Modern browsers like Chrome, Edge, Brave and Opera use a multi-process sandboxed architecture (Isolated from outside world), ofter called as **"site isolation"** or **"processs-per-site-instance"**.
Which means -

1. Each tab get's it's own isolated **Renderer Process**.
2. The **Browser**, **GPU** and **Network** Process are shared globally across all tabs.
3. Additionaly **Utility** process spawned as needed.
4. Each cross-origin `<iframe>` may also get its own Renderer Process (OOPIF), allowing site isolation within a single tab.

|Process Type   |Shared or Per-Tab?|Description      |
|---------------|------------------|-----------------|
|Browser Process|Shared|Coordinates tabs, manages UI, networking, permissions.|
|Renderer Process|Per tab|Parses HTML/CSS/JS, builds DOM/CSSOM, executes V8, handles layout/paint.|
|GPU Process|Shared|Handles rasterization, compositing, hardware acceleration.|
|Network Process|Shared|Handles HTTP(S), DNS, cache, sockets for all tabs.|
|Audio / Media Utility Processes|Shared|Decode and play audio/video. Spawned when needed.|
|Extension / Plugin Processes|Depends on extensions|Each extension runs isolated.|
|Service Worker Process|Per origin (on demand)|Runs in background for caching, sync, push events.|

To witness this open google chrome's Task manager tab and look for processes.

## Inter Process Communication System

Here is where Chromium browsers **cook**, it's what enables sandboxing, smooth parallel, rendering and security isolation without processes getting out of sync.

- Each process in a browser is isolated for security, stability and performance.
- Still they need to talk, renderer needs to fetch resources, paint via GPU and browser process needs to receive UI events - clicks, scrolls and deliver them to right renderer.
- Chromium implements it's own IPC system on top of Mojo - IPC system.
- Internally each process has an IPC channel to others.
- They exchange serialized messages (a byte stream that can travel through IPC, deserialized on receiver side) like small packets.
so browsers use IPC - Inter Process Communication to pass structured messages between processes safely.

| Source → Target        | Channel Purpose                                                                             |
| ---------------------- | ------------------------------------------------------------------------------------------- |
| Browser → Renderer     | Navigation, lifecycle control (create tab, close tab, resize window, deliver input events). |
| Renderer → Browser     | User actions (form submit, link click, console logs, JS dialogs).                           |
| Renderer → Network     | Resource requests (fetch HTML, CSS, JS, images).                                            |
| Network → Renderer     | Streams response data back in chunks.                                                       |
| Renderer → GPU         | Sends display lists, texture handles, frame metadata.                                       |
| GPU → Renderer         | Frame acknowledgement, texture ready signals.                                               |
| Browser → GPU          | Final compositing + display submission.                                                     |

- **Inside IPC system**
  - Modern chromium uses a library called Mojo IPC to handle all communication, it's built on message pipes bi-directonal channels which shares memory for efficiency.
Mojo concepts -
    - **Message Pipes** bidirectional communication channel like a socket pair (Two end points which can comminicate).
    - **Message** binary packet containing serialized data+metadata.
    - **Interface** defines the type of messages just like a singleton class but as a package it is shared and used.
    - **Sharedbuffer** shared memory region both processes can map.
    - **Task Runner** each thread has one, handles message dispatch.
- **Typical IPC workflows**
  - **Navigation / Input Event Flow** - User clicks a Link
      1. Browser process captures the click event.
      2. Browser -> Renderer: Handle click at co-ordinates(x, y).
      3. Renderer main thread dispatches the event to DOM -> Js event listener.
      4. Js may call `window.location = ...`
      5. Renderer -> Browser: Navigation request URL.
      6. Browser: Validates URL, creates new renderer (if cross orgin).
      7. Network -> Renderer: Starts streaming HTML byte codes of new page.
      8. Renderer: Parses -> Paints -> Composited frame sent to GPU if there is no GPU found then chromium browser automatically fall back to software rasterizer called **SwiftShader** (emulates the GPU pipeline on CPU).
  - **Resource Fetch (Network)** - Renderer needs to load CSS or JS
      1. Renderer main thread -> sends a `FetchResource` IPC message to Network Process.
      2. Network Process -
        - Opens socket connection.
        - Sends HTTP request.
        - Streams response chunks back.
      3. Data arives via `shared memory buffers` to Renderer.
      4. Renderer parses bytes into DOM/CSSOM.
    All this happens asynchronously, Js won't block the main thread waiting for data.
  - **Rendering / Compositing Pipeline** - Once DOM & CSSOM are ready
      1. Renderer main thread: Builds the tree -> paints -> produces Display lists.
      2. Renderer compositor threads: Collects layers, builds a frame.
      3. Renderer -> GPU Process: Sends display list and layered textures via shared memory.
      4. GPU Process: Raserizes and composites into final frame.
      5. GPU -> Browser Process: "Frame ready".
      6. Browser -> OS window manager: Sumbits final framebuffer for display.
    All of this happens every frame (16.6ms) for 60fps animation. If GPU not available this pipeline happens in software using CPU else hardware using GPU.
  - **Security Boundary (Sandboxing)**
      1. Rednerer process runs in restricted sandboxes (no file, OS access).
      2. They must ask Browser process to do privileged actions
          - Read/write clipboard.
          - Access camera/mic.
          - Open file picker.
          - Navigate top-level window (auto navigate to another tab in `onClick` event).
      Browser process acts as **Broker** allowing safer actions.
- **Data Transfer Mechanisims**

  | Type                  | Used For            | Mechanism                        |
  | --------------------- | ------------------- | -------------------------------- |
  | Small messages        | Commands, events    | Serialized Mojo messages         |
  | Large binary data     | Frames, images      | SharedMemory handles             |
  | Async callbacks       | JS promises, events | Mojo callback interfaces         |
  | Streaming             | Network responses   | DataPipe (like readable streams) |

- **Performance Implications**
  - IPC is fast, but not free - each message = context switch + serialization.
  - Browser pipelines **batch** messages (frames, metadata, resource requests).
  - Shared memory avoids copying large data (especially textures & images).
  - Jank often happens.

## Deep dive into Chromium Browser Processes

- **Browser Process** -
  - Manages tabs and windows.
  - Handles network requests, downloads and caching.
  - Co-ordinates security and sandboxing.
  - Handles UI rendering.
  - Creates sandboxed Renderer Process for each Tab.
  - Inter-Process communication with Renderer Process.
  - Access OS resources.
- **Renderer Process** -
  - Handles single tab or few tabs.
  - Executes HTML, CSS and JS.
  - Runs V8 engine for JS execution.
  - Performs layout, painting and compositing.
  - Interacts with GPU or ShiftShader via compositing / rasterization.
  - Cannot access OS directly.
  - Communicate with browser process for privileged operations.
  - Ensures tab isolation for security and stability.
- **Network / Service worker Process** -
  - Handles fetch requests.
  - Manages caching HTTP cache and service workers.
  - Can respond to request offline first using cached data.
  - Runs independently of Renderer Process.
  - Allows progressive web page to work offline.
- **GPU Process** -
  - Handles all GPU-acclerated task.
  - Rasterization of layers.
  - Compositing and WebGl rendering.
  - Crashes in GPU won't affect the browser.
  - Frees up main thread in Renderer Process for JS & layout.
- **Rendering Life cycle** -
  - When typing `www.arkasoft.ai` in address bar and hitting enter the browser process captures and checks for address if address then build is requested else search term sent to **Search Engine**.
  - **Browser Process** - The Orchestrator (controller)
    - The `Browser` Process is the `Orchestrator` this is the one which controls the whole life cycle other processes.
    - The Browser process has many threads, each thread plays it's own role inside the process.
    - Mainly 5 Threads namely UI Thread, IO Thread, File Thread, Cache Thread, Process Launcher Thread, Worker/ ThreadPoll Thread.
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
    - After `Renderer` Process receives the notification form `Browser` Process via `IPC` or gets created (depnds on site instance) it gets the `HTML` Stream from `shared Memory` buffer via `ICP`.
    - Inside Renderer Process multiple thread will be working together, namely Main Thread (Blink), Compositor Thread, Worker Thread and Raster Thread.
    - After `HTML` stream is received the `HTML Parser` starts parsing tokens into DOM.
    - A `Preload Scanner` runs ahead of Parser finding `<Link>`, `<script>`, `<img>` tags early, sends resource request via `IPC` to `Network` Process.
    - The `Network` Process will resolve from cache, service worker or network.
    - Each Stream has a parser or executor -
      - `HTML` has `HTML` Parser -> `DOM`.
      - `CSS` has `CSS` Parser -> `CSSOM`.
      - `JS` has `V8` (Main Thread) -> `AST`.
    - The `Render Tree` is built using `DOM` + `CSSOM`.
    - The `<script>` triggers the `V8` execution, `V8` runs inside `Renderer` Main Thread.
    - `V8` Parses the JS code and builds **A**bstract **S**yntax **T**ree, generates `bytecode` (Ignition) Optimizes hot code (TurboFan JIT) and Executes on main thread.
    - `V8` executes `JS` on the `Renderer’s` main thread. However, `Web Workers` or `Worklets` run in separate `V8` isolates (parallel threads) within the same `Renderer` Process.
    - After Renderer builds Render Tree -> Layout Tree -> Layer Tree, it need to paint element and create display list.
    - Here `Compositor` thread will send the layer info via `shared memory` to `GPU` Process.
    - `GPU` Process rasterizes -> composites -> sumbits final frame to `OS Compositor`.
    - The `GPU` Process uses Command `Buffers` to batch drawing commands from multiple renderers before sending them to the `OS` compositor (like ANGLE for OpenGL/DirectX translation).
    - Browser Process UI thread receives "frame ready" -> presents it on screen.
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
    - Renderer -> dispatch to DOM -> triggers JS event listeners in V8.
    - DOM Mutations -> Recalculate style -> Layout -> Paint -> Composite -> GPU -> Display again.
  This happens dozens of times per second in smooth UI.
- **Caching and optimization layer** -
  - To make UI fast
    - **Browser Cache** : Reuses static assets JS, CSS and Images.
    - **CDN Cache** : Stores copies close to the user's orgin.
    - **Service Workers** : Offline support and caching - PWA Pattern.
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
    - **Worklets** – Lightweight V8 contexts for visual tasks (e.g., CSS Paint API, Animation Worklet).
Off-main-thread execution is key to keeping UI smooth at 60fps.

## Modern UI Delivery Architectures

Architecture Styles the UI been served

|Architecture|Rendering|Example Stack| Benifit|
|------------|---------|-------------|--------|
|Static site|Built once served from CDN|Astro, Gatsby, EJS|Super fast|
|CSR Client side rendering|Browser builds the UI|React, Vue|Great for Dynamic Apps|
|SSR Server side rendering|Server builds HTML|Next, Nuxt| SEO friendly, fast first paint|
|IST Incremental static regeneration|Mix of static+server|Next|Balance between SSR and static|
|Streaming SSR|Stream HTML as it's generated|React 18+, Remix|Instant perceived performance|

### Modern Delivery Optimizations

- **HTTP/2 Multiplexing** – Multiple requests share a single TCP connection.
- **HTTP/3 (QUIC)** – Runs over UDP, faster handshake and better recovery.
- **Compression** – Use Brotli over Gzip for JS and CSS.
- **Resource Hints**
  - `dns-prefetch` – Resolve domains early.
  - `preconnect` – Establish TCP/TLS before needed.
  - `preload` – Force critical assets early.
  - `prefetch` – Prepare likely next navigation.
- **ETags & Cache-Control** – Enable revalidation and versioning.

## Deep dive into V8 Internals

### 1. V8 Engine overview

- V8 is Google's Javascript & webAssembly engine.
  1. Used in chrome, Edge, Opera - browser side.
  2. Node.js, deno - server side.
  3. Electron Apps - desktop.
- It is written in C++, it's job is to
  1. Parse your JS code (source -> **A**bstract **S**yntax **T**ree).
  2. Compile it into machine code.
  3. Allocate memory (heap and stack).
  4. Manage garbage collection - GC.
  5. Execute effciently through optimizing JIT compilers - Ignition + TurboFan.

### 2. V8 Architecture

V8's heap isn't a single continous blob, It is segmented into spaces, each with its own allocator, page size and Garbage collection policy / strategy

| Space              | Purpose                                       | Page Size         | Collector                            |
| ------------------ | --------------------------------------------- | ----------------- | -------------------------------------|
| New Space          | Eden + From/To semi-spaces for young objects  | 1–8 MB            | Scavenger (Minor GC)                 |
| Old Space          | Mature objects that survived Minor GCs        | 1 MB – 8 MB pages | Mark-Sweep / Mark-Compact (Major GC) |
| Code Space         | JIT compiled code, marked as executable       | 1 MB              | Mark-Compact                         |
| Map Space          | Hidden classes (object shapes, inline caches) | 256 KB            | Mark-Compact                         |
| Large Object Space | Huge arrays, buffers > 256 KB                 | Variable          | Mark-Sweep only (never moved)        |

- Each page maintains a page list, where each page holds object allocations and metadata like mark bits and free lists.
- Key concept is objects just move in **New space** (Minor GC) but they don't move in **Large object space** (Mark sweep GC) that is why you can't use direct memory offsets across objects.
- Every memory of V8 lives across two major regions
  1. **Stack**- fast, structured, predictable Memory (function frames, primitives, call context), simple words execution stuffs goes here.
  2. **Heap**- flexible, dynamic memory (objects, arrays, closures, functions), all dynamic variables goes here.
- **Call Stack**
  1. Call stack is used for functoin calls, local variables and control flow.
  2. It's small and fast.
  3. Each function call creates a stack frame which contains
     - Return address (where to go after call).
     - Local variables.
     - Arguments passed.
     - Execution context pointer like scope chain.
  4. When function finishes (returns) the frame is popped.
  5. If recursion or infinite loop -> "Maximum call stack size exceeded" error thrown and execution stopped.
  6. Stack is linear data structure LIFO - Last In First Out so no GC needed.
- **Memory Heap**
  1. Memory heap is the space where all reference-type data lives this is managed by Garbage Collector.

### 3. Generational Garbage Collection

V8 uses a generational GC strategy, based on the empirical rule that most object die young.

- **Minor GC (Young Generation)**
- Targets the New Space-**Minor GC** (Eden + semi-space).
- Fast copying collector
  - Copy live objects `from-space` -> `to-space`.
  - Swap pointers.
  - Dead objects just vanish their space is not copied.
  - After a few cycle, surviving objects get promoted to Old Space-**Major GC**.
- **Major GC (Old Generation)**
- Runs less often but is more expensive.
- Performs mark, sweep and compact.
  1. **Mark:** Traverses from roots (globals, stack, refs) **marking** reachable objects.
  2. **Sweep:** Reclaims **unmarked** memory.
  3. **Compact:** Moves live objects together to reduce fragmentation(breaking of objects).
- Old-space objects rarely move, it only moved during **Compact** same concept used in database collection/tables.
- **Incremental and Concurrent GC**
- Incremental Marking: Breaks large mark phases into small slices to avoid blocking JS.
- Concurrent sweeping: Sweeping happens off the main thread.
- Idle-time GC: When chrome detects frame idle time, it runs GC tasks in background.
- V8 uses tri-color marking algorithum
  1. White - unmarked.
  2. Grey - pending.
  3. Black - live.
- Only if V8 thinks it's necessary to release the memory then it releases the memory to OS very rare scenario.
- GC do not delete the memory from OS, it makes sure that the memory is available for reuse.

### 4. Memory Allocation Pipeline

- **Function Frame -> Stack** - Primitive values , references.
- **Object Creation -> Heap allocation** - Allocator picks the current space.
- **Fast Allocation Path**
  - V8 uses bump pointer allocation in the New Space.
  - Super fast `top += size;`
- If no space left **Minor GC** is triggred.

### 5. Objects shapes, Hidden Classes and inline classes

- Memory effiency and JIT speed depnds on object shape and stability
- There is this concept called **Hidden Classes**, when you create an object V8 assigns it in a hidden *map* - a structure describing it's property layout.
- Adding or deleting properties changes it's shape which eventually ends up as a new **Hidden class**.
- Infinite caches (ICs) stores lookups for hot properites based on access pattern.
- Stable shapes results in fewer transitions which eventually offers faster property access and better memory allocation.
- Best practice is to initialize object fields in same order.This allows shape sharing and hidden class churn.

### 6. V8 JIT Memory spaces

- Compiled code and runtime metadata lives in specialized space.
- Code space - Generated native instructions by **TurboFan**.
- Read only space - Immutable built-ins, constrains frozen objects.
- External Memory - Buffers allocated outside V8 (Ex: Array buffer, node buffer).
- External memory is tracked via **ExternalBackingStore** so that GC will know when it's safe to release.

### 7. V8 GC Triggers and Performance Heuristics

- V8 doesn't run GC Arbitrarily -- it uses adaptive heuristics.
- Memory pressure on OS.
- Idle time budget which is detected via chromium browser's scheduler.
- Allocation rate if allocation is too fast GC will run frequently.
- If a object is promoted to to old space from new space then it will trigger major GC.
- witness with below commands -

```js
--max-old-space-size=4096  # 4GB limit
--trace-gc                 # Log GC activity
--trace-gc-verbose         # Detailed stats
```

### 8. Memory leaks and Retained References

- Typical memory leaks in Js corresponds to unreleased references that prevent GC. Breif explanations about memory leak patters have listed below.
- **Global variables** (Ex: ) these persist for app lifetime to prevent this use local scope or `let`.
- **Detached DOM nodes** elements removed but still referenced, nullify reference after removal of the objects.
- **Closures capturing large objects** retain scoped values, use `WeakRefs` or explicit cleanup.
- **Event listeners on dead node** still alive in memory, Remove listeners on unmount.
- **Caches without eviction** when `Map/Set` grows, use `WeakMap` or `WeakRef` instead.

### 9. Tools for V8 memory analysis

| Tool                             | Purpose                              | Notes                      |
| -------------------------------- | ------------------------------------ | -------------------------- |
| **Chrome DevTools → Memory tab** | Heap snapshots, allocation timeline  | Visualize retained objects |
| **Node.js --inspect**            | Attach Chrome debugger to Node       | Works same as browser      |
| **`--trace-gc` logs**            | GC pause time, memory before/after   | Good for server profiling  |
| **heapdump** (Node module)       | Captures heap at runtime             | Analyze leaks offline      |
| **V8 Inspector Protocol**        | Access memory stats programmatically | For custom profiling       |

- **Typical Memory Lifespan**
  - Function creates object → goes to New Space.
  - Function returns, reference lost → object collected in Minor GC.
  - If reference survives long → moved to Old Space.
  - Large data (image buffers, 10MB+ arrays) → Large Object Space.
  - Compiled function code → Code Space.
  - Hidden classes (object shapes) → Map Space.

## Framework Rendering Lifecycles

Modern frameworks abstract the browser’s render loop:

- **React** – Reconciliation → Virtual DOM diff → Commit phase → Paint.
- **Vue** – Reactive tracking → Template patching.
- **SolidJS / Signals** – Fine-grained reactivity → Direct DOM updates.

All aim to minimize layout recalculation and reduce reflows.

## Why bundle size and code structure matter?

| Problem                     | Cause                       | Engine Effect            |
| --------------------------- | --------------------------- | ------------------------ |
| Large JS bundle             | Over-imported libs          | High parse & JIT cost    |
| Memory leaks                | Event listeners not removed | Heap grows → GC pressure |
| Many closures               | Retained references         | Old space bloats         |
| Re-render heavy React comps | Frequent DOM diffing        | CPU & GC thrashing       |
| Inline large JSON           | Direct memory allocation    | Heap fragmentation       |

## Profiling and Performance Metrics

Measure what your browser is doing:

| Metric | Description | Tool |
|--------|--------------|------|
| **FCP** | First Contentful Paint | Lighthouse |
| **LCP** | Largest Contentful Paint | Core Web Vitals |
| **TTI** | Time to Interactive | Performance tab |
| **CLS** | Layout stability metric | Chrome DevTools |
| **Memory Snapshot** | Track heap allocations | Chrome → Memory |
| **Flamegraph** | Visualize function cost | Chrome Profiler |

## WebAssembly (WASM) in the Browser

- V8 can execute **WebAssembly** — a compact binary format that runs near-native speed.
- WebAssembly runs inside the same V8 heap, but its memory is managed manually.
- `WebAssembly.Memory` is a growable linear buffer.
- You manage its allocations manually (malloc-style).
- GC ignores WASM memory — it’s treated as external memory
- Compiled from C, C++, or Rust.
- Executes alongside JS in V8.
- Ideal for compute-heavy tasks like image processing or ML inference.

## How to think like a Frontend Engineer not just a Developer

You are not writing JS code anymore, you're orchestrating **V8**.
Think like this

- Every variable = A heap allocation.
- Every closure = A persistent context.
- Every loop = CPU + stack frame growth.
- Every library = Parser + JIT compilation.

This is why run time aware architecture matters

- Use code splitting.
- Minimizze global state.
- Clean up event listeners.
- Profile with Performance Tab.
- Watch heap snapshots of retained objects.

## Coming up next

- If you want to keep expanding this “V8 deep dive” section for your writeup.
- V8 Heap Layout (diagram) – show memory regions visually.
- Minor vs Major GC timeline – illustrate when each runs.
- Allocation Fast Path (bump pointer) – small C++ example from V8 source.
- Hidden Classes transitions – diagram from JS to hidden class evolution.
- GC logs analysis – example of --trace-gc output and how to interpret it.
- Real-world memory optimization checklist for frontend frameworks – connect GC knowledge back to React/Vue runtime.
