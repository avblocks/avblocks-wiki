---
title: Create a Command Line Tool using CMake on Windows
html_meta:
    description: This page describes the steps needed to configure CMake project for AVBlocks Command Line Tool on Windows
taxonomy:
    category: docs
---

# Create a Command Line Tool using CMake on Windows

This topic describes the steps needed to configure a CMake project for C++ Command Line Tool. Scripts are `PowerShell`.

The code snippets used in this article are from the [simple_converter Windows sample](https://github.com/avblocks/avblocks-cpp/tree/main/samples/windows/simple_converter).
This sample takes a WMV media file as input and converts it to H.265/HEVC video and AAC audio in MP4 container.

## Test that you have all tools installed

CMake:

```powershell
cmake --version
```

ninja:

```powershell
ninja --version
```

If you don't have those tools follow the steps in the [Setup C++ development environment on Windows](https://blog.primosoftware.com/setup-cpp-development-environment-windows/) post to configure a C++ development environment. 

## Create the project directory

```powershell
mkdir ~/avblocks/cmake/simple-converter
```

## Create the CMake project 

Switch to the project directory:

```powershell
cd ~/avblocks/cmake/simple-converter
```

Add `src/main.cpp`:

```cpp
#include <iostream>

int main() {
  std::cout << "Hello AVBlocks!\n";
}
```

Add `CMakeLists.txt`:

```cmake
cmake_minimum_required(VERSION 3.20)

project(simple-converter)

add_executable(simple-converter src/main.cpp)
```

Add `.gitignore`:

```powershell
.cache/
build/
```

Add `build.ps1`:

```powershell
New-Item -Force -Path ./build/debug -ItemType Directory 
Push-Location ./build/debug
    cmake -G 'Ninja' -DCMAKE_BUILD_TYPE=debug ../..
    ninja
Pop-Location
```

Add `configure.ps1`:

```powershell
$tempFile = [IO.Path]::GetTempFileName()

# get the path to Visual Studio 2022
$vs_install_dir = $(Get-VSSetupInstance | Select-VSSetupInstance -Version '[17.0,18.0]' | Select-Object -ExpandProperty InstallationPath)
$vs_common_tools = "${vs_install_dir}/Common7/Tools/"

# run VsDevCmd.bat for x64 C++ compiler and save the environment to a file
cmd /c " `"$vs_common_tools/VsDevCmd.bat`" -arch=amd64 -host_arch=amd64 && set > `"$tempFile`""

# set the environment into PowerShell
Get-Content $tempFile | Foreach-Object {
    if($_ -match "^(.*?)=(.*)$") {
        Set-Content "env:\$($matches[1])" $matches[2]
    }
}

Remove-Item $tempFile
```

You should end up with the following directory structure:

```sh
simple-converter
├── .gitignore
├── CMakeLists.txt
├── build.ps1
├── configure.ps1
└── src
    └── main.cpp
```

## Test the build

```powershell
# source configure.ps1
. .\configure.ps1

# build
./build.ps1
```

## Update for AVBlocks

1. [Download](https://github.com/avblocks/avblocks-core/releases/) the 64 bit version of AVBlocks for C++ (Windows). The file you need will have a name similar to `avblocks-v3.4.0-demo.1-windows.zip` except for the version number which may be different. 

2. Extract the archive in a location of your choice, then copy the `include` and `lib` directories to the `avblocks` subdirectory of the CMake project directory. The CMake project directory is the directory that contains the `CMakeLists.txt` file.

    You should end up with a directory structure similar to the following:

    ```sh
    simple-converter
    ├── .gitignore
    ├── CMakeLists.txt
    ├── avblocks
    │   ├── include
    │   └── lib
    ├── build.ps1
    ├── configure.ps1
    └── src
        └── main.cpp
    ```

3. Replace the contents of `.gitignore` with this code:

    ```
    .cache/
    build/
    avblocks/
    ```

3. Replace the contents of `CMakeLists.txt` with this code:

    ```cpp
    cmake_minimum_required(VERSION 3.16)

    project(simple_converter)
    set (target simple_converter)

    add_executable(${target})

    # common definitions
    target_compile_definitions(${target} PRIVATE UNICODE _UNICODE)
    
    # debug definitions
    target_compile_definitions(${target} PRIVATE  _DEBUG)

    # debug compile options
    target_compile_options(${target} PRIVATE /Zi /Od)

    # enable C++ 17 standard features
    target_compile_features(${target} PRIVATE cxx_std_17)

    # include dirs
    target_include_directories(${target} PRIVATE avblocks/include)

    # libs
    target_link_directories(${target} PRIVATE avblocks/lib/x64)
    target_link_libraries(${target} AVBlocks64.dll)

    # add /MTd or /MT compiler option 
    set_property(TARGET ${target} PROPERTY MSVC_RUNTIME_LIBRARY "MultiThreaded$<$<CONFIG:Debug>:Debug>")

    # sources
    file(GLOB source "src/*.cpp")
    target_sources(${target} PRIVATE ${source})
    ```

4. Replace the contents of `src/main.cpp` with this code:

    ```cpp
    #include <primo/avblocks/avb.h>
    #include <primo/platform/reference++.h>
    #include <primo/platform/ustring.h>

    #include <windows.h>
    #include <Shlwapi.h>

    using namespace primo;
    using namespace primo::codecs;
    using namespace primo::avblocks;

    int wmain(int argc, wchar_t* argv[])
    {
        // needed for WMV
        CoInitializeEx(nullptr, COINITBASE_MULTITHREADED);

        Library::initialize();

        auto inputFile = primo::ustring(L"Wildlife.wmv");
        auto outputFile = primo::ustring(L"Wildlife_h265_aac.mp4");

        auto inputInfo = primo::make_ref(Library::createMediaInfo());
        inputInfo->inputs()->at(0)->setFile(inputFile);

        if (inputInfo->open()) {
            auto inputSocket = primo::make_ref(
                Library::createMediaSocket(inputInfo.get())
            );

            // Start with MP4 / H.264 + AAC preset, then change video to H.265
            auto outputSocket = primo::make_ref(
                Library::createMediaSocket(Preset::Video::Generic::MP4::Base_H264_AAC)
            );

            // Get the output video stream info and modify it for H.265/HEVC
            auto outVideoStream = static_cast<VideoStreamInfo*>(outputSocket
                                                                ->pins()->at(0)
                                                                ->streamInfo());
            outVideoStream->setStreamType(StreamType::H265);
            outVideoStream->setStreamSubType(StreamSubType::HEVC_Annex_B);

            // With H.265/HEVC we can use lower bitrate, e.g. 500 kbps
            outVideoStream->setBitrate(500'000);

            // Change the output file name
            outputSocket->setFile(outputFile);

            // Create Transcoder and configure it with
            // the input and output sockets
            auto transcoder = primo::make_ref(Library::createTranscoder());
            transcoder->inputs()->add(inputSocket.get());
            transcoder->outputs()->add(outputSocket.get());

            // Allow demo mode for the transcoder when
            // using the demo version of the library
            transcoder->setAllowDemoMode(true);

            // Run the transcoder
            if (transcoder->open()) {
                transcoder->run();
                transcoder->close();
            } else {
                std::wcerr << L"transcoder->open() failed: "
                           << primo::ustring(transcoder->error()->message())
                           << std::endl;
            }
        }

        Library::shutdown();

        CoUninitialize();

        return 0;
    }
    ```

10. Build the project

    ```powershell
    . ./configure.ps1
    ./build.ps1
    ```
## Run the application

1. Download the `Wildlife.wmv` sample file and save it in the project directory:

    ```powershell
    Invoke-WebRequest `
    -Uri https://archive.org/download/WildlifeSampleVideo/Wildlife.wmv `
    -OutFile Wildlife.wmv
    ```

2. Copy the file `AVBlocks64.dll` from `avblocks/lib/x64` to `build/debug`. 

3. Run the application:

    ```powershell
    ./build/debug/simple-converter
    ```
    
    Wait for the Transcoder to finish - it will take a few seconds. The converted file `Wildlife_h265_aac.mp4` will be in the project directory.
	
## Troubleshooting

* You may get `The program can't start because AVBlocks64.dll is missing from your computer. Try reinstalling the program to fix this problem.` or a similar message. To fix that, copy the file `AVBlocks64.dll` from `avblocks/lib/x64` to `build/debug`.

* `transcoder->open()` may fail if there is already a file `Wildlife_h265_aac.mp4` in the project directory. Delete `Wildlife_h265_aac.mp4` to solve that.         
