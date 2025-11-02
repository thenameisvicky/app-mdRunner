---
title: How User Interface runs on browser engine
date: 2025-10-27
---

## How the UI bundle reaches the browser?

- DNS resolution getting the destination IP (where the build is located).
- The browser uses https ot http to talk to the destination IP.
- HTTPS uses TLS(Transport Layer Security) -- ensuring the connection is encrypted and secure.
- A TCP connection is established via 3-way handskake (SYNC, SYNC-ACK, ACK).
- After TCP connection Acknowledged the browser sends a request for the resource Get/HTTPS/1.1 host: arkasoft.ai.
- The DNS Authoritive gets the request and route it to the server or CDN according to the configuration.
- The CDN returns pre built HTML, CSS and JS files to the browser.
- Those files will be downloaded in the browser.

## Browser Process Architecture

Modern browsers like Chrome, Edge, Brave and Opera use a multi-process sandboxed architecture, ofter called as **"site isolation"** or **"processs-per-site-instance"**.
Which means -

1. Each tab get's it's own isolated **Renderer Process**.
2. The **Browser**, **GPU** and **Network** Process are shared globally across all tabs.
3. Additionaly **Utility** process spawned as needed.

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

## Inter Process Communication among processes

Here is where Chromium browsers **cook**, it's what enables sandboxing, smooth parallel, rendering and security isolation without processes getting out of sync.

- Each process in a browser is isolated for security, stability and performance.
- Still they need to talk, renderer needs to fetch resources, paint via GPU and browser process needs to receive UI events - clicks, scrolls and deliver them to right renderer.
- Chromium implements it's own IPC system on top of Mojo - IPC system.
- Internally each process has an IPC channel to others.
- They exchange serialized messages like small packets.

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

### Inside IPC system

Modern chromium uses a library called Mojo IPC to handle all communication, it's built on message pipes bi-directonal channels which shares memory for efficiency.
Mojo concepts -

- **Message Pipes** bidirectional communication channel like a socket pair.
- **Message** binary packet containing serialized data+metadata.
- **Interface** defines the type of messages like RPC interface.
- **Sharedbuffer** shared memory region both processes can map.
- **Task Runner** each thread has one, handles message dispatch.

#### Typical IPC workflows

- **Navigation / Input Event Flow** - User clicks a Link
    1. Browser process captures the click event.
    2. Browser -> Renderer: Handle click at co-ordinates(x, y).
    3. Renderer main thread dispatches the event to DOM -> Js event listener.
    4. Js may call `window.location = ...`
    5. Renderer -> Browser: Navigation request URL.
    6. Browser: Validates URL, creates new renderer (if cross orgin).
    7. Network -> Renderer: Starts streaming HTML byte codes of new page.
    8. Renderer: Parses -> Paints -> Composited frame sent to GPU.
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
  All of this happens every frame (16.6ms) for 60fps animation.
- **Security Boundary (Sandboxing)**
    1. Rednerer process runs in restricted sandboxes (no file, OS access).
    2. They must ask Browser process to do privileged actions
       - Read/write clipboard.
       - Access camera/mic.
       - Open file picker.
       - Navigate top-level window (auto navigate to another tab in onClick event).
    Browser process acts as **Broker** allowing safer actions.

#### Data Transfer Mechanisims

| Type                  | Used For            | Mechanism                        |
| --------------------- | ------------------- | -------------------------------- |
| Small messages        | Commands, events    | Serialized Mojo messages         |
| Large binary data     | Frames, images      | SharedMemory handles             |
| Async callbacks       | JS promises, events | Mojo callback interfaces         |
| Streaming             | Network responses   | DataPipe (like readable streams) |

#### Frame Rendering IPC chain

[Browser UI Thread]
     ↓  (Input events via IPC)
[Renderer Main Thread]
     ↓  (Layout + Style)
[Renderer Compositor Thread]
     ↓  (Frame metadata → GPU)
[GPU Process Raster Threads]
     ↓  (Rasterize)
[GPU Process Compositor Thread]
     ↓  (Composite frame)
[Browser → OS Compositor]
     ↓
[Display on Screen]
Each ↓ step involves Mojo IPC or shared memory sync between processes.

#### Performance Implications

- IPC is fast, but not free - each message = context switch + serialization.
- Browser pipelines **batch** messages (frames, metadata, resource requests).
- Shared memory avoids copying large data (especially textures & images).
- Jank often happens when Main

## Critical Rendering Path

Once HTML, CSS and JS files reaches the browser, it needs to be transformed into visual pixels from raw bytes on the screen, this transformation is initiated by a pipeline called **Critical Rendering Path**, ofcourse every single browser has it

  1. HTML Parser -
     - Reads the raw HTML stream token by token, converting it into a **DOM** - A Tree structure representing every node and it's releationship.
     - As the HTML parser encounters external resources like ```<link>,<script>,<img>``` a **preload scanner** runs in parallel, It looks ahead to discover external dependencies early and schedules network requests before the full HTML is parsed - in same thread sharing same resource and memory.
     - CSS files are render blocking files the DOM won't get rendered until CSSOM is built.
  2. CSS Parser - Buids the CSSOM (CSS Object Model).
  3. JS Engine - Executes the JS file.
  4. Render Tree Creation - Combines DOM+CSSOM, CSS blocks the render tree creation.
  5. Layout and Paint - Determines positions -> paints the pixels -> composing.

### GPU Compositing and Rendering

After layout and paint, the browser moves into GPU compositing:

1. **Paint** → Converts elements into draw commands.
2. **Compositing** → Divides page into layers (e.g., for transforms, videos, opacity).
3. **Rasterization** → GPU converts layers into textures.
4. **Compositor Thread** → Combines layers into final frame.
5. **Frame Submission** → GPU swaps buffers → visible pixels.

CSS properties like `transform`, `opacity`, and `will-change` can trigger GPU acceleration — reducing reflow and improving animation smoothness.

## Caching and optimization layer

To make UI fast

- **Browser Cache** : Reuses static assets JS, CSS and Images.
- **CDN Cache** : Stores copies close to the user's orgin.
- **Service Workers** : Offline support and caching - PWA Pattern.
- **Lazy Loading**: Loads only the UI components currently needed.

## User Interaction

Once the Page is painted

- JS starts listening to user events.
- The browser re-renders parts of the page when data or state changes.
- Modern frameworks handled this efficiently with virtual DOM, signals or reactivity systems.

### Runtime Rendering Performance

At runtime, the browser continuously recalculates style, layout, and paint as the user interacts.

| Issue | Description | Optimization |
|-------|--------------|---------------|
| **Layout Thrashing** | Frequent DOM reads & writes | Batch DOM operations or use `requestAnimationFrame` |
| **Forced Reflows** | Accessing layout metrics after mutations | Cache values before DOM changes |
| **Paint Storms** | Changing non-GPU composited properties | Use `transform` or `opacity` |
| **Long Tasks (>50ms)** | JS blocking main thread | Break work with `setTimeout` or move to Web Worker |

### Web Workers and Worklets

To prevent the main thread from blocking:

- **Web Workers** – Run scripts in parallel threads, no DOM access but great for heavy computation.
- **Shared Workers** – Allow multiple tabs to share state.
- **Worklets** – Lightweight V8 contexts for visual tasks (e.g., CSS Paint API, Animation Worklet).

Off-main-thread execution is key to keeping UI smooth at 60fps.

## Modern UI Delivery Architectures

Architecture Styles the UI been served

|Architecture|Rendering|Example Stack| Benifit|
|------------|---------|-------------|--------|
|Static site|Built once served from CDN|Astro, Gatsby|Super fast|
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

## Deep dive into system level

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

### 2. Memory layout in V8

V8 splits memory into main sections

- Call Stack -
  - Stores function frames - local variables, arguments and return address.
  - Small and limited memory consumption.
  - Every function call pushes a frame into call stack after return it is popped.
  - If recursive or infinite -> **Maximum call stack size exceeded**.
   |Engine / Environment|Typical Call Stack Limit|
   |--------------------|------------------------|
   | Chrome (V8)|~10,000–16,000 calls|
   | Node.js (V8)|~10,000–20,000 calls|
   | Firefox (SpiderMonkey)|~8,000–12,000 calls|
   | Safari (JavaScriptCore)|~10,000 calls|
   | Edge / IE (Chakra)|~10,000 calls|
- Heap -
  - Where objects, arrays, closures and references live.
  - Managed by V8's Garbage Collector - GC.
  - Divided into
    - New space -> Small, short lived objects (local variables).
    - Old space -> Promoted long-lived objects (closures,globals,caches).
    - Code space -> Compiled machine code.
    - Map space -> Hidden classes metadata.
    - Large Object space -> big arrays, large bufers, etc.
- Garbage collection in V8 -
  - V8 uses Generational garbage collection.
  - Most object die young -> handle them fast.
  - GC uses 2 primary strategies.
   |Space|Collector|Description|
   |-----|---------|-----------|
   |New Space|**Scavenger (Minor GC)**| Copies live objects from "from" --> "to" space; clears dead quickly|
   |Old Space|**Mark-Sweep + Mark-Compact (Major GC)**| Traverses all reachable objects, frees unreachable memory|

  - In new V8 GC runs in seperate thread.
  - If your build has many large objects or retained closures, GC pauses this will cause frame drop --> Laggy UI.

### 3. How build Affects memory

When you run ```npm run build``` - the tool (webpack, rspack, turbopack) produces -

- Bundled (Js) the code to be parsed and compiled by V8 engine.
- Assets (CSS, images) which are handled by the rendering pipeline.
- Source Maps for debugging.
- All those mentioned above are configurable in the config file.
The larger the JS bundle the more memory it requires to perform the following
- Parse it (AST generation performed by CPU + RAM).
- Compile it (JIT compilation - more memory).
- Execute and retain objects in heap.

The bundle size is directly propotional to performance (startup time, memory usage and GC pressure).Large bundles mean parsing time, JIT compilation and heap allocation are higher cost.

- This is why code spliting, lazy loading and tree shaking are not just buzzing words - those are memory management strategies.

### 4. Execution flow (Inside engine)

Here is what happens once JS hits runtime -

- **Parsing** JS code turned into tokens and Abstract Syntax Tree will get generated, large bundles slow this down.
- **Interpretation (Ignition Interpreter)** generates byte code from AST and starts executing immediately (fast startup).
- **Optimization (TurboFan JIT)** Hot functions - functions which repeatedly executed gets recompiled to optimized machine code, deoptimized if the shape of class's objects or any other object break.
- **Execution** Bytecode/Machine code runs using the call stack + heap allocations, Event loop coordinates async executions/tasks.

### 5. Event loop + Queues

- **Call stack** runs synchronous code.
- **Heap** stores memory.
- **Callback Queue** holds async callbacks (ex: setTimeout).
- **Microtask Queue** holds promises, mutation observers(ex: internal hooks such as useEffect()).
- V8's event loop constantly checks

```js
while (true) {
  executeStack();
  processMicrotasks();
  renderFrame();
  waitForNextTick();
}
```

This is how animations, API calls and UI updates synchronize.

### 6. Framework Rendering Lifecycles

Modern frameworks abstract the browser’s render loop:

- **React** – Reconciliation → Virtual DOM diff → Commit phase → Paint.
- **Vue** – Reactive tracking → Template patching.
- **SolidJS / Signals** – Fine-grained reactivity → Direct DOM updates.

All aim to minimize layout recalculation and reduce reflows.

### 7. Why bundle size and code structure matter?

| Problem                     | Cause                       | Engine Effect            |
| --------------------------- | --------------------------- | ------------------------ |
| Large JS bundle             | Over-imported libs          | High parse & JIT cost    |
| Memory leaks                | Event listeners not removed | Heap grows → GC pressure |
| Many closures               | Retained references         | Old space bloats         |
| Re-render heavy React comps | Frequent DOM diffing        | CPU & GC thrashing       |
| Inline large JSON           | Direct memory allocation    | Heap fragmentation       |

### 8. Profiling and Performance Metrics

Measure what your browser is doing:

| Metric | Description | Tool |
|--------|--------------|------|
| **FCP** | First Contentful Paint | Lighthouse |
| **LCP** | Largest Contentful Paint | Core Web Vitals |
| **TTI** | Time to Interactive | Performance tab |
| **CLS** | Layout stability metric | Chrome DevTools |
| **Memory Snapshot** | Track heap allocations | Chrome → Memory |
| **Flamegraph** | Visualize function cost | Chrome Profiler |

## Security and Future Trends

### 1. Security Context

- **CSP (Content Security Policy)** – Prevents XSS.
- **CORS (Cross-Origin Resource Sharing)** – Controls resource access.
- **SRI (Subresource Integrity)** – Validates external scripts.
- **Sandboxed renderer** – Each tab isolated for safety.

### 2. Future Browser Trends

- **Edge rendering** with Cloudflare Workers / Vercel.
- **Streaming hydration** (React 19, SolidStart).
- **Speculative prerendering** with `<speculationrules>`.
- **WebGPU** – Next-gen graphics + compute API.
- **Isomorphic frameworks** – Seamless SSR + CSR execution.

### 3. How to think like a Frontend Engineer not just a Developer

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

### WebAssembly (WASM) in the Browser

V8 can execute **WebAssembly** — a compact binary format that runs near-native speed.

- Compiled from C, C++, or Rust.
- Executes alongside JS in V8.
- Shares memory with JS via `WebAssembly.Memory`.
- Ideal for compute-heavy tasks like image processing or ML inference.
