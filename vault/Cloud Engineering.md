## Home server

```
                             Starting my cloud journery with a minimal home server setup, scaling later.
```

- Hardware and budget
- Operating system and base setup
- Networking configurations

## Minimal Cloud Stack

|Layer|Tool|Role|
|---|---|---|
|VM & Container|Docker + K3s|App runtime|
|Reverse Proxy|Traefik / Nginx|SSL, routing|
|Storage|MinIO|S3-like object storage|
|Registry|Harbor or DockerHub|Private Docker images|
|CI/CD|GitHub Actions + self-hosted runner|Deploy pipelines|
|Monitoring|Prometheus + Grafana|(Optional) Metrics|

## Cloud Architecture

Building a private cloud with all the features of AWS

- **Cloud Networking + Security**
- **Monitoring/Logging**
- **DevOps Practices**