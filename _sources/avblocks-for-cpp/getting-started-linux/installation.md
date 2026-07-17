---
title: Installation - Linux
html_meta:
    description: Download and install the AVBlocks demo version on Linux.
taxonomy:
    category: docs
---

# Installation - Linux

Download and install the AVBlocks library on Linux.

## Download

Download the latest demo release using `curl`:

```bash
curl -L -o avblocks-v3.4.0-demo.1-linux.tar.gz https://github.com/avblocks/avblocks-core/releases/download/v3.4.0-demo.1/avblocks-v3.4.0-demo.1-linux.tar.gz
```

## Verify Integrity (Optional)

Download the SHA-256 checksum file and verify the download:

```bash
curl -L -o avblocks-v3.4.0-demo.1-linux.tar.gz.sha256 https://github.com/avblocks/avblocks-core/releases/download/v3.4.0-demo.1/avblocks-v3.4.0-demo.1-linux.tar.gz.sha256
sha256sum -c avblocks-v3.4.0-demo.1-linux.tar.gz.sha256
```

## Extract

Extract the archive to your desired installation directory (e.g. `/opt/avblocks`):

```bash
sudo mkdir -p /opt/avblocks
sudo tar -xzf avblocks-v3.4.0-demo.1-linux.tar.gz -C /opt/avblocks
```

The extracted files will be placed under `/opt/avblocks/`.

## Next Steps

Proceed to [create a C++ command-line tool with CMake](create-cpp-command-line-tool-cmake.md) or [developing with VS Code](developing-with-vscode.md).
