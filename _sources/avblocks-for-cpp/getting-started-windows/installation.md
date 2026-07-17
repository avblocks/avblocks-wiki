---
title: Installation - Windows
html_meta:
    description: Download and install the AVBlocks demo version on Windows.
taxonomy:
    category: docs
---

# Installation - Windows

Download and install the AVBlocks library on Windows using PowerShell.

## Download

Download the latest demo release using PowerShell's `Invoke-WebRequest`:

```powershell
Invoke-WebRequest -Uri "https://github.com/avblocks/avblocks-core/releases/download/v3.4.0-demo.1/avblocks-v3.4.0-demo.1-windows.zip" -OutFile "avblocks-v3.4.0-demo.1-windows.zip"
```

## Verify Integrity (Optional)

Download the SHA-256 checksum file and verify the download:

```powershell
Invoke-WebRequest -Uri "https://github.com/avblocks/avblocks-core/releases/download/v3.4.0-demo.1/avblocks-v3.4.0-demo.1-windows.zip.sha256" -OutFile "avblocks-v3.4.0-demo.1-windows.zip.sha256"
Get-FileHash -Algorithm SHA256 "avblocks-v3.4.0-demo.1-windows.zip"
```

Compare the output with the contents of the `.sha256` file. The expected checksum is:

```
b3938b181a689d1b5f7788e37073eddec33cbc2380581829af2af48b7a7d07d9
```

## Extract

Extract the ZIP archive to your desired installation directory (e.g. `C:\Program Files\avblocks`):

```powershell
Expand-Archive -Path "avblocks-v3.4.0-demo.1-windows.zip" -DestinationPath "C:\Program Files\avblocks" -Force
```

The extracted files will be placed under `C:\Program Files\avblocks\`.

## Next Steps

Proceed to [create a C++ command-line tool with CMake](create-cpp-command-line-tool-cmake.md), [developing with VS Code](developing-with-vscode.md), or [create a C++ console app in Visual Studio](create-a-c-plus-console-app-in-visual-studio.md).
