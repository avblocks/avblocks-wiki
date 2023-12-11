---
title: Developing with Visual Studio Code
metadata:
    description: This page describes the steps needed to setup Visual Studio Code for AVBlocks development on macOS
taxonomy:
    category: docs
---

# Developing with Visual Studio Code

This topic describes the steps needed to setup Visual Studio Code for AVBlocks development on macOS. These steps have been verified to work with Xcode 15.0.1, on macOS Ventura 13.5.2.

## Visual Studio Code

Download and install from [Visual Studio Code](https://code.visualstudio.com/download) site.

Open Visual Studio Code and press `Cmd + Shift + p`. Select `Shell Command: Install 'code' command in PATH`. 

Also install the [C/C++ extension](https://marketplace.visualstudio.com/items?itemName=ms-vscode.cpptools).

## Create CMake project 

Follow the steps in [Create a Command Line Tool using CMake](create-cpp-command-line-tool-cmake) to create a CMake project.

## Automate the build

Add the following Visual Studio Code specific files to the `.vscode` subdir:

### `.vscode/tasks.json`

```json
{
    "version": "2.0.0",
    "tasks": [
        {
            "label": "Build",
            "type": "shell",
            "osx": {
                "command": "${workspaceFolder}/build.sh",
            },
            "group": {
                "kind": "build",
                "isDefault": true
            }
        }
    ]
}
```

## Setup Debugging

Add the following Visual Studio Code specific files to the `.vscode` subdir:

### `.vscode/launch.json`

```json
{
    "version": "0.2.0",
    "configurations": [
        {
            "name": "Launch (gdb)",
            "type": "cppdbg",
            "request": "launch",
            "cwd": "${workspaceFolder}",
            "osx": {
                "program": "${workspaceFolder}/build/debug/simple-converter",
                "MIMode": "lldb",
            },
        }    
    ]
}
```

## Test the build

Test the build by pressing `Cmd + B`. Visual Studio Code should execute the `build.sh` script automatically.

## Test the debugging

Set a breakpoint on the first line of `int main(int argc, const char *argv[])` inside `src/main.cpp`. Press `F5` to launch the debugger. It should stop at the breakpoint.
