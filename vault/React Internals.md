---
title: React Internals
Date: November 15 2025
---

## Framework Rendering Lifecycles

Modern frameworks abstract the browser’s render loop:

- **React** – Reconciliation → Virtual DOM diff → Commit phase → Paint.
- **Vue** – Reactive tracking → Template patching.
- **SolidJS / Signals** – Fine-grained reactivity → Direct DOM updates.

All aim to minimize layout recalculation and reduce reflows.
