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

## Host Operating System (VM Equivalent)

- The home server acts like your own **private cloud instance (EC2)**.
- Install a lightweight and stable OS such as **Ubuntu Server 22.04 LTS** on bare metal.
- All commands in this document (Docker, K3s, GitHub Runner, etc.) are executed **inside this host OS**.
- You can think of this as your base **VM or compute layer** in AWS terminology.

## Minimal Cloud Stack

| Layer | Tool | Role / Purpose |
|--------|------|----------------|
| **Compute & Container Runtime** | Docker + K3s (Lightweight Kubernetes) | Host and manage containerized applications |
| **Reverse Proxy & Ingress** | Nginx | SSL termination, routing, and load balancing |
| **Object Storage** | MinIO | S3-compatible storage for static assets, backups, and frontend builds |
| **Container Registry** | DockerHub | Private image hosting for your microservices |
| **CI/CD** | GitHub Actions + Self-hosted Runner | Automated build and deployment pipelines |

## Cloud Architecture Overview

### System Preparation

- Before developing service you need to ensure the OS is clean, secure and up to date - just like provisioning a new EC2 instance.
- Run these commands to update the Operating System and install the developer tools we need to build the EC2 Instance.

#### Commands

  ```bash
  sudo apt update && sudo upgrade -y
  sudo apt install curl git unzip htop net-tools ca-certificates gnupg lsb-release -y
  ```

#### Dev tools and use cases

  | Tool | Use Case | Equivalent AWS Role |
  |------|-----------|---------------------|
  | `curl` | Download data or install scripts via URLs | Used for CLI installs |
  | `git` | Version control and pulling repos from GitHub | Similar to CodeCommit |
  | `htop` | Monitor CPU/RAM | Similar to CloudWatch Metrics |
  | `net-tools` | Network commands (`ifconfig`, `netstat`) | Networking diagnostics |
  | `ca-certificates` | HTTPS verification | Used in secure communications |
  |`gnupg` | Manages package signing keys | Security verification |
  | `lsb-release` | OS info | Used for compatibility checks |

### Compute Engine - 🐳

- In AWS EC2 provides VMs to run Applications.
- Here Docker does that with containers, which are lightweight, isolated and start instantly.
- Run these commands to install Docker in the EC2 Instance.

#### Commands

```bash
sudo apt install docker.io -y
sudo systemctl enable docker
sudo systemctl start docker
```

- These commands installs docker to manage container.
- Enables Docker to start on boot.

### K3s - ☸️

- In AWS EKS - Elastic Kubernetes Service to orchestrate containers across multiple nodes.
- We can use k3s a lightweight Kubernetes ditribution perfect for single node cloud.

#### Commands

```bash
curl -sfL https://get.k3s.io | sh -
sudo systemctl status k3s
sudo kubectl get nodes
```

- These commands installs k3s and starts it as a system service.
- A single-node Kubernetes cluster (control plane + worker) is created.
- Can manage workloads using `kubectl`.

### Nginx - Reverse Proxy / Ingress controller

- AWS uses load balancers and cloudFront to route traffic.
- Nginx will act as reverse proxy exposing the internal network IP address and Port safely to external public and private networks.
- This will reverse proxy the incoming request and deliver it to internal app safe and secure, to learn in depth about this refer **Networking** card's **Load balancing and Reverse Proxy** section.

#### Commands

```bash
sudo apt install nginx -y
sudo systemctl enable nginx
sudo systemctl start nginx
```

- Nginx listens on Port 80(HTTP) and 443(HTTPS).
- It forwards the traffic internally to docker container or kubernetes services according to the configuration.
- Can add SSL Certificates for HTTPS using Certbot or Cloudfare.

### MinIO - Object storage

- AWS S3 stores objects like images, backups and static frontend files.
- MinIO provides an S3-compatible API so Apps can store and fetch data locally just like S3.

#### Commands

```bash
docker run -d \
  -p 9000:9000 -p 9001:9001 \
  --name minio \
  -e MINIO_ROOT_USER=admin \
  -e MINIO_ROOT_PASSWORD=admin123 \
  -v ~/minio-data:/data \
  quay.io/minio/minio server /data --console-address ":9001"
```

- MinIO container runs an S3-compatible storage server.
- Data persists in `~/minio-data`.
- Creates buckets just like AWS S3.

### CI/CD via Github Actions

- Using GitHub Actions — with a self-hosted runner running inside server — to replicate a real CI/CD pipeline experience.
- Builds and deployments happen within infrastructure not on Github's cloud VM.
- Let's you to test on-premises automation similar to running pipelines in a private VPC.
- Access your Docker/kubernetes setup directly from CI/CD jobs.

### Setup

- Inside the Github repo of the project go to Settings -> Actions -> Runners -> New self-hosted runner.
- Choose linux then run the below command in Virtual Machine of your server (Terminal).

```bash
mkdir actions-runner && cd actions-runner
curl -o actions-runner-linux-x64.tar.gz -L https://github.com/actions/runner/releases/latest/download/actions-runner-linux-x64.tar.gz
tar xzf actions-runner-linux-x64.tar.gz
./config.sh --url https://github.com/<your-username>/<repo> --token <token>
sudo ./svc.sh install
sudo ./svc.sh start
```

- Verify runner is online in the Github UI.
- Then setup configure .yml, .docker files to containerize the application refer **Infrastructure** card for more info about docker, kube and other infra releated stuffs.

### Accessing Live Databases

- To connect CI/CD pipelines or containers to a live database (MySQL, PostgreSQL, MongoDB, etc.),
  ensure the database is accessible from within your home network or through a secure VPN tunnel.
- Store database credentials as **GitHub Secrets** or **Kubernetes Secrets** (never hardcode them).
- Example: `DB_HOST`, `DB_USER`, `DB_PASSWORD` in `.env` or secret manifests.

## Upcoming topics which will be added

1. Learn Terraform + Ansible to automate all of it.
2. Add observability (Prometheus + Grafana).
3. Try deploying the same infra on a free AWS or GCP tier.
4. Build 2–3 real projects on this stack (portfolio-ready).
5. Study cloud security, IAM, and network architecture.
