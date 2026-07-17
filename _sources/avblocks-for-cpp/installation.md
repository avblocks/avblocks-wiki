---
title: Installation
html_meta:
    description: Download and install the AVBlocks demo version on Linux, macOS, or Windows.
taxonomy:
    category: docs
---

# Installation

Download and install the AVBlocks demo version on your platform.

## Linux

### Download

```bash
AVBLOCKS_BASE_URL="https://github.com/avblocks/avblocks-core/releases/download"
AVBLOCKS_VERSION="v3.4.0-demo.1"

curl -L \
  -o "avblocks-${AVBLOCKS_VERSION}-linux.tar.gz" \
  "${AVBLOCKS_BASE_URL}/${AVBLOCKS_VERSION}/avblocks-${AVBLOCKS_VERSION}-linux.tar.gz"
```

### Verify Integrity (Optional)

```bash
curl -L \
  -o "avblocks-${AVBLOCKS_VERSION}-linux.tar.gz.sha256" \
  "${AVBLOCKS_BASE_URL}/${AVBLOCKS_VERSION}/avblocks-${AVBLOCKS_VERSION}-linux.tar.gz.sha256"

sha256sum -c "avblocks-${AVBLOCKS_VERSION}-linux.tar.gz.sha256"
```

### Extract

```bash
mkdir -p ./avblocks
tar -xzf "avblocks-${AVBLOCKS_VERSION}-linux.tar.gz" -C ./avblocks --strip-components=1
```

The extracted files will be placed under `./avblocks/`.

---

## macOS

### Download

```bash
AVBLOCKS_BASE_URL="https://github.com/avblocks/avblocks-core/releases/download"
AVBLOCKS_VERSION="v3.4.0-demo.1"

curl -L \
  -o "avblocks-${AVBLOCKS_VERSION}-darwin.zip" \
  "${AVBLOCKS_BASE_URL}/${AVBLOCKS_VERSION}/avblocks-${AVBLOCKS_VERSION}-darwin.zip"
```

### Verify Integrity (Optional)

```bash
curl -L \
  -o "avblocks-${AVBLOCKS_VERSION}-darwin.zip.sha256" \
  "${AVBLOCKS_BASE_URL}/${AVBLOCKS_VERSION}/avblocks-${AVBLOCKS_VERSION}-darwin.zip.sha256"

shasum -a 256 "avblocks-${AVBLOCKS_VERSION}-darwin.zip"
```

The output should match the contents of the `.sha256` file.

### Extract

```bash
mkdir -p ./avblocks
unzip -q "avblocks-${AVBLOCKS_VERSION}-darwin.zip" -d ./avblocks
```

The extracted files will be placed under `./avblocks/`.

---

## Windows

### Download

```powershell
$BaseUrl = "https://github.com/avblocks/avblocks-core/releases/download"
$Version = "v3.4.0-demo.1"

Invoke-WebRequest `
    -Uri "${BaseUrl}/${Version}/avblocks-${Version}-windows.zip" `
    -OutFile "avblocks-${Version}-windows.zip"
```

### Verify Integrity (Optional)

```powershell
$BaseUrl = "https://github.com/avblocks/avblocks-core/releases/download"
$Version = "v3.4.0-demo.1"

Invoke-WebRequest `
    -Uri "${BaseUrl}/${Version}/avblocks-${Version}-windows.zip.sha256" `
    -OutFile "avblocks-${Version}-windows.zip.sha256"

Get-FileHash -Algorithm SHA256 "avblocks-${Version}-windows.zip"
```

The output should match the contents of the `.sha256` file.

### Extract

```powershell
Expand-Archive `
    -Path "avblocks-${Version}-windows.zip" `
    -DestinationPath "./avblocks" -Force
```

The extracted files will be placed under `.\avblocks\`.
