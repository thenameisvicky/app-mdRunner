---
title: Building a developer Tool - v8 Trace
date: 2025-11-26
---

## Features to be built

- Showing the memory leak pattern detection - show the object that have escaped GCs and staying unwanted in the memory.
- Showing the currnet function references (the actual function name in the code).
- Showing what object is inside the New, Old and Large Space.
- Showing what object is inside the hiddden class and its structure.
- On hovering showing the command in tooltip to witness the stuff.
- Yet to decide this is gona be an extension or dev tool.

## Stuffs I learned during the development of this tool

- About v8 to it's low level.
- About Chromium Architecture and IPC to it's low level.
- About OS kernals, CPUs - just basics cause it is enough.

## Requirements (APIs to learn)

- **CDP - Chrome Devtool Protocol**
  - HeapProfiler.startSampling.
  - HeapProfiler.takeHeapSnapshot.
  - HeapProfiler.getObjectByHeapObjectId.
  - Runtime.getProperties.
  - Profiler.startPreciseCoverage.
  - Debugger.scriptParsed events.
  - Runtime.consoleAPICalled.
- **v8 Heap Statistics**
  - V8.getHeapStatistics().

## Components to build

- **Heap Sampling Engine**
  - Enable heap sampling.
  - Collect samples periodically.
  - Compare heap deltas.
  - Detect growing objects.
  - Group by constructor name.
  - Flag suspicious growth.
- **Object Reference Tracking**
  - Finding Heap ID.
  - Call `HeapProfiler.getObjectByHeapObjectId()`.
  - Inspecting it's properites with `Runtime.getProperties()`.
  - This will give object name, structure and reference graph.
- **v8 space usage tracking**
  - Using `Runtime.getProperties()` and `V8.getHeapStatistics()`.
  - To track and show total space and used space for New, Old, Large, code and Map space.
- **Function Call Tracking**
  - Using these `Debugger.setInstrumentationBreakpoint`, `Debugger.scriptParsed`, `Runtime.consoleAPICalled`, `Profiler.startPreciseCoverage`.
  - These can show the current executing function name, file and line number.
- **Memory Leak Detection Algorithum**
  - Growing Old Space Allocation - Continously growing.
  - Retained size increases - Track retained size of objects by constructor.
  - Detached DOM nodes - Find nodes not connected to DOM tree.
  - Event Listeners not removed - Track listener allocation.

## Architecture

- manifest.json
- devTools.html
- panel.html
- devTools.js
- panel.js
- background.js

## Development Journal - You can ignore this

### Phase 1 - Reading the codebase

- **December 03 2025 01:45**
  - Writing code for this whole application from scratch slows me down, so i outsmarted myself and cloned an existing application source code which is open source and read the codebase understand the architecture, functionality flow and make improvements.
  - Understanding speed depends on how fast you want to fail and learn in my story i failed a lot than win i learned from my failures.
  - I have cloned memlab to learn i am starting now.
  - Licencing, bug bounty and contributing -
    - You need to fork and raise PR againts main branch, before this you have to sumbit CLA to raise a PR -> and run tests making sure it passes and also the lint, MIT licenced and yeah it seems you have a bug bounty postin it in facebook link Privately not Publicly.
  - Readme.md in root -
    - According to the usage guide in Readme.md file it seems we have to write puppeteer code to mimic the interactions and using chromium and v8 APIs the datas are gathered and shown in the CLI but it shows in internal references not the acutal function names or object names that we wrote it seems.
    - It looks like we have to run a single script that covers all those heap snapshots and from that using a command we can get the growing object's heap id by sending the heap id as prop we could get the object name form the v8 API.
    - We can also write this as a test and run the test files to ensure there are no memory leak before deployment.
    - It requireds node 16 or more to run this npm package.
  - Runnig the app in dev mode (npm run dev) -
    - Ran npm run dev nothing happned i was expecting a chromium window to open and show some samples of leak detection but it seems we have to dig deep our selfs, finding the entry point by looking at the package.json in root.
    - Architecture seems to be a monolith repository lookin at the folder structure, this is good structure for a open source repo.
    - Got it i found 2 difference Readme.md files in website and package directories.
  - Readme.md website directory -
    - Unlike the root package manager this uses yarn to manage packages.
    - Running yarn start starts the server and client in local it seems.
    - I just ignored the deployment stuffs cause for now it is not needed.
  - Readme.md packages directory -
    - Twist here this directory seems to have a lot of packages like api, core, e2e, lens, heap-analysis and cli.
    - It seems like this is a lot bigger to explore so skipping this for now and reading the website directory.
  - That's it for today time is already 3 AM.
- **December 06 2025 18:23**
  - Website Directory -
    - Ignore this directory this is useless for us.
  - Inside packages/core -
    - This is the core of memlab 