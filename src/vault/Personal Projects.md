
## High-Impact Project List (Your Portfolio AURA)

These are chosen strategically based on your strengths:
browser internals → systems → ML infra → devtools → backend.

You only need to complete 3–4 of them for a killer profile.

🔥 A. Browser & Runtime-Level Projects

These immediately stand out because MERN devs don’t build them.

1. Chromium + V8 Visual Profiler Extension

A Chrome extension that shows:

React render cycles

Fiber tree changes

V8 GC events (Minor/Major)

New space vs Old space

Event loop tasks

Repaints + reflows

🔥 This one will explode on Twitter/LinkedIn.

2. JS Memory Leak Detector Tool

A dev tool that:

hooks into GC

detects retained objects

identifies closures capturing heavy references

visualizes leak roots

This solves a REAL problem for frontend engineers.

3. "X-17 Runtime Explorer"

Think of this as:
“Chrome DevTools for your custom engine”
You build later for your engine.

🔥 B. AI/Inference-Level Projects (Applied AI Engineer Path)
4. Mini ONNX Runtime Engine

Loads ONNX
Executes CPU inference with basic ops (Conv, MatMul, Relu)
Graph executor
Operator fusion

This one proves:

systems

ML

compiler basics

performance thinking

5. Distributed Model Runner

Use gRPC or WebSockets to run models across multiple machines.
(Perfect for your future home data center.)

6. Tiny SageMaker Clone

Features:

Train job

Deploy model

Endpoint

Versioning

Metrics dashboard

Docker-based runner

🔥 AWS recruiters LOVE this.

🔥 C. Infra + DevOps Projects
7. Home Data Center Orchestrator

A dashboard controlling:

load balancing

model deployment

logs

GPU/CPU allocation

Your future company will use this.

8. Serverless Inference Accelerator

Build a small system that:

uploads a model

automatically deploys it to Lambda-like containers

scales based on requests

🔥 D. Deep Systems Projects

Because you understand V8 internals, you can attempt:

9. A Simple JIT Engine

With bytecode + interpreter + baseline JIT.

10. A Custom GC (Copying + Mark-Sweep)

Mini GC that mirrors V8’s New/Old space setup.

⭐ FULL PROJECT LIST SUMMARY

(1) Runtime visualizer

(2) Memory leak detector

(3) X-17 Runtime explorer

(4) Mini inference engine

(5) Distributed inference runner

(6) Tiny SageMaker

(7) Home data center orchestrator

(8) Serverless inference accelerator

(9) Small JIT engine

(10) Custom garbage collector

Even doing 3–4 of these = insane portfolio.

## The Inference Engine Creation List

This is specifically for your “Mini ONNX Runtime / TensorRT Lite” type project.

You need 5 layers.

⭐ LAYER 1 — Fundamentals

Learn:

Tensors

Shapes

Broadcasting

Memory layout

NCHW / NHWC formats

Matrix multiplication (very important)

Im2col

Convolution

⭐ LAYER 2 — Graph Representation

You need:

A graph structure

Nodes (operations)

Edges (tensor flow)

Topological sorting

Execution plan

⭐ LAYER 3 — Kernel Implementations

Start with CPU kernels:

MatMul (core)

Relu

Softmax

Conv2D (bonus)

Add / Mul

This is the brain.

⭐ LAYER 4 — Runtime Execution Engine

You build:

A scheduler

An allocator

An op registry

An execution context

This is where your V8 knowledge helps.

⭐ LAYER 5 — Optimizations

Only simple ones first:

constant folding

operator fusion

memory reuse

pre-allocating tensors

simple quantization (optional)

⭐ Bonus

Make it load ONNX models:

parse ONNX protobuf

map ops to your own ops

run inference

This is the part that makes people think:

“Damn… he built an inference engine?”

🔥 Deliverables

Library: x17-infer

CLI: x17 run model.onnx input.json

Benchmark: compare with PyTorch

This alone makes you Applied AI engineer material.

## The X-17 JavaScript Engine (Your Own V8-like Engine)

Naming it after your girlfriend’s birthday is sentimental and good — it’ll keep you motivated.

This is the roadmap top compiler engineers use.

⭐ LAYER 1 — Lexer

Input JS → Tokens
Handles:

identifiers

numbers

strings

operators

keywords

whitespace

comments

⭐ LAYER 2 — Parser

Tokens → AST
Supports:

variables

functions

expressions

loops

return statements

You only need a subset (like JS Lite).

⭐ LAYER 3 — AST → Bytecode Compiler

This is where magic starts.

You create:

instructions

registers

stacks

opcodes (LOAD, ADD, CALL, JMP, RET…)

⭐ LAYER 4 — Interpreter (like V8 Ignition)

Executes bytecode.

stack frame

call frame

globals

local scope

closures (later)

⭐ LAYER 5 — VM Memory Model

Inspired by V8:

New space (bump pointer)

Old space

LO space

Map space

Code space

Implement only:

bump pointer

mark-sweep

That’s enough for version 1.

⭐ LAYER 6 — Baseline JIT (optional but killer)

Take hot bytecode → generate native code.

Even basic JIT = your engine becomes REAL.

⭐ LAYER 7 — DevTools

A debugger or inspector:

print GC

print bytecode

print AST

Makes it feel like a real engine.

🔥 Final Deliverables

x17 run file.js (JS engine CLI)

Bytecode viewer

GC log

Benchmarks against Node

If you build even 40% of this, people will think you’re a compiler engineer.
