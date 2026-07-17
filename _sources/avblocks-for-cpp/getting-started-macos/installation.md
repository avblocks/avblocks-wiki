---
title: Installation - macOS
html_meta:
    description: Download and install the AVBlocks demo version on macOS.
taxonomy:
    category: docs
---

# Installation - macOS

Download and install the AVBlocks library on macOS.

## Download

Download the latest demo release using `curl`:

```bash
curl -L -o avblocks-v3.4.0-demo.1-darwin.zip https://github.com/avblocks/avblocks-core/releases/download/v3.4.0-demo.1/avblocks-v3.4.0-demo.1-darwin.zip
```

## Verify Integrity (Optional)

Download the SHA-256 checksum file and verify the download:

```bash
curl -L -o avblocks-v3.4.0-demo.1-darwin.zip.sha256 https://github.com/avblocks/avblocks-core/releases/download/v3.4.0-demo.1/avblocks-v3.4.0-demo.1-darwin.zip.sha256
shasum -a 256 avblocks-v3.4.0-demo.1-darwin.zip
```

Compare the output with the contents of the `.sha256` file. The expected checksum is:

```
2b232779e292f002cf722858b30dde63246ae71342bf24e39aeee2a18eab1910
```

## Extract

Extract the ZIP archive to your desired installation directory (e.g. `/opt/avblocks`):

```bash
sudo mkdir -p /opt/avblocks
unzip -q avblocks-v3.4.0-demo.1-darwin.zip -d /opt/avblocks
```

The extracted files will be placed under `/opt/avblocks/`.

## Next Steps

Proceed to [create a C++ command-line tool with CMake](create-cpp-command-line-tool-cmake.md), [developing with VS Code](developing-with-vscode.md), or [create an Objective-C command-line tool with Xcode](create-objc-command-line-tool-xcode.md).
