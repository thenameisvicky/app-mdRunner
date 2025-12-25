---
titile: Inter Process Communication System
Date: November 15 2025
---
# Inter Process Communication System

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
