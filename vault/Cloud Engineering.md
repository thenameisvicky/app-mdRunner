---
title: Cloud Engineering — Home Cloud Project
date: 2025-07-03
---

## Home Server Setup

This is just budget friendly requirements to learn Devops and cloud if you're building this to match the production level you will need more than just GTX.You may think can just run docker in local and put deployments from github pointing to local system's network IP address and port but that won't give you the real Devops experience.

## Hardware Overview

| Component | Model / Specification | Notes |
|------------|------------------------|--------|
| **Processor (CPU)** | AMD Ryzen 5 5600G | 6 cores / 12 threads with integrated Vega 7 GPU |
| **Memory (RAM)** | 8 GB DDR4 3200MHz (single stick) | Upgrade later to 16 GB (dual-channel) |
| **Storage (SSD)** | 256 GB NVMe | Fast boot and load times; upgrade to 500 GB+ later |
| **Motherboard** | MSI B550M-A PRO | Supports future CPU & GPU upgrades |
| **Cabinet** | Ant Esports 205 Air ARGB Mid Tower | Good airflow + tempered glass |
| **Power Supply** | 450W PSU (stock) | Sufficient for now |
| **Graphics Card (GPU)** | GTX 1650 *(planned)* | For heavier workloads and gaming later |

## Minimal Cloud Stack

| Layer | Tool | Role / Purpose |
|--------|------|----------------|
| **Compute & Container Runtime** | Docker + K3s (Lightweight Kubernetes) | Host and manage containerized applications |
| **Reverse Proxy & Ingress** | Nginx | SSL termination, routing, and load balancing |
| **Object Storage** | MinIO | S3-compatible storage for static assets, backups, and frontend builds |
| **Container Registry** | DockerHub | Private image hosting for your microservices |
| **CI/CD** | GitHub Actions + Self-hosted Runner | Automated build and deployment pipelines |

## Cloud Architecture Overview

A simplified version of an **AWS-like ecosystem** on your home server.
