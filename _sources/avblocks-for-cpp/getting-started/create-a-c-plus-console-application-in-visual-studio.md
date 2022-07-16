---
title: Create a C++ console application in Visual Studio
metadata:
    description: This topic describes the steps needed to configure a C++ console application in Visual Studio.
taxonomy:
    category: docs
---

# Create a C++ console application in Visual Studio

This topic describes the steps needed to configure a C++ console application in Visual Studio.


## Create the Visual Studio project

1. Create a Visual C++, Win32 Console Application in Visual Studio 2015. Name the project 'SimpleConverter'.
2. [Download](https://avblocks.com/download/) the 64 bit version of AVBlocks for C++ (Windows). The file you need will have a name similar to `AVBlocks.1.25.0.x64.Demo.zip` - the version number may differ. 
3. Unzip in a location of your choice, then copy the `include` and `lib` directories to the project directory.
4. Add `AVBlocks.h` and `AVBlocks64.lib` to `stdafx.h`:

```cpp
// stdafx.h : include file for standard system include files,
// or project specific include files that are used frequently, but
// are changed infrequently
//

#pragma once

#include "targetver.h"

#include <stdio.h>
#include <tchar.h>

// TODO: reference additional headers your program requires here

// the main AVBlocks header
#include "include\AVBlocks.h"

// needed for C++11 features
#include "include\PrimoReference++.h"

// link with AVBlocks64.lib
#pragma comment(lib, "lib\\AVBlocks64.lib")
```		
5. In Visual Studio, select 'BUILD | Configuration Manager' from the menu, then add the 'x64' platform to the solution platforms.
6. Build the project.
7. Copy the file `AVBlocks64.dll` from `lib` to `x64\Debug`. 
8. Replace the contents of 'SimpleConverter.cpp' with this code:

```cpp
// SimpleConverter.cpp : Defines the entry point for the console application.
//

#include "stdafx.h"

using namespace primo::codecs;
using namespace primo::avblocks;

int _tmain(int argc, _TCHAR* argv[])
{
    // needed for WMV
    CoInitializeEx(nullptr, COINITBASE_MULTITHREADED);

    Library::initialize();

    auto inputInfo = primo::make_ref(Library::createMediaInfo());
    inputInfo->setInputFile(L"Wildlife.wmv");

    if (inputInfo->load()) {
        auto inputSocket = primo::make_ref(Library::createMediaSocket(inputInfo.get()));
        auto outputSocket = primo::make_ref(Library::createMediaSocket(Preset::iPad_H264_720p));
        outputSocket->setFile(L"Wildlife.mp4");

        auto transcoder = primo::make_ref(Library::createTranscoder());
        transcoder->inputs()->add(inputSocket.get());
        transcoder->outputs()->add(outputSocket.get());

        if (transcoder->open()) {
            transcoder->run();
            transcoder->close();
        }
    }

    Library::shutdown();

    CoUninitialize();

    return 0;
}
```

## Run the application

1. Download the `Wildlife.wmv` HD movie from the [Internet Archive](https://archive.org/download/WildlifeHd/Wildlife.wmv) and save it in the project directory.
2. Run the application in Visual Studio. Wait a few seconds for the Transcoder to finish. The converted file `Wildlife.mp4` will be in the project directory.   
	
## Troubleshooting

* You may get "The program can't start because AVBlocks64.dll is missing from your computer. Try reinstalling the program to fix this problem." or a similar message. To fix that, copy the file `AVBlocks64.dll` from `lib` to `x64\Debug`.

* transcoder->open() may fail if there is already a file `Wildlife.mp4` in the project directory. Delete `Wildlife.mp4` to solve that.   
