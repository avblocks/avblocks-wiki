---
title: Create a Command Line Tool using CMake on Ubuntu
html_meta:
    description: This page describes the steps needed to configure a CMake project for AVBlocks Command Line Tool on Ubuntu
taxonomy:
    category: docs
---

# Create a Command Line Tool using CMake on Ubuntu

This topic describes the steps needed to configure a CMake project for C++ Command Line Tool.

The code snippets used in this article are from the [simple_converter Linux sample](https://github.com/avblocks/avblocks-cpp/tree/main/samples/linux/simple_converter). This sample takes H.264/AVC video and AAC audio in MP4 container as input and converts them to H.265/HEVC video and AAC audio in MP4 container.

## Test that you have all tools installed

C++ Compiler (g++):

```sh
g++ --version
```

CMake:

```sh
cmake --version
```

ninja:

```sh
ninja --version
```

If you don't have those tools follow the steps in the [Setup C++ development environment on Ubuntu](https://blog.primosoftware.com/setup-cpp-development-environment-ubuntu/) post to configure a C++ development environment. 

## Create the project directory

```bash
mkdir -p ~/avblocks/cmake/simple-converter
```

## Create the CMake project 

Switch to the project directory:

```bash
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
cmake_minimum_required(VERSION 3.16)

project(simple-converter)

add_executable(simple-converter src/main.cpp)
```

Add `build.sh`:

```bash
#!/usr/bin/env bash

mkdir -p ./build/debug
pushd ./build/debug
    cmake -G 'Ninja' -DCMAKE_BUILD_TYPE=Debug  ../.. && \
    ninja
    ret=$?
popd  
```

Add `.gitignore`:

```bash
.cache/
build/
```

You should end up with the following directory structure:

```sh
tree -a -L 2 simple-converter

simple-converter
├── .gitignore
├── CMakeLists.txt
├── build.sh
└── src
    └── main.cpp
```

## Test the build

```bash
chmod +x build.sh

./build.sh
```

## Update for AVBlocks

1. [Download](https://github.com/avblocks/avblocks-core/releases/) the 64 bit version of AVBlocks for C++ (Linux). The file you need will have a name similar to `avblocks-v3.4.0-demo.1-linux.tar.gz` except for the version number which may be different. 

2. Extract the archive in a location of your choice, then copy the `include` and `lib` directories to the `avblocks` subdirectory of the CMake project directory. The CMake project directory is the directory that contains the `CMakeLists.txt` file.

    You should end up with a directory structure similar to the following:

    ```sh
    simple-converter
    ├── .gitignore
    ├── CMakeLists.txt
    ├── avblocks
    │   ├── include
    │   └── lib
    ├── build.sh
    └── src
        └── main.cpp
    ```

3. Replace the contents of `.gitignore` with this code:

    ```
    .cache/
    build/
    avblocks/
    ```

4. Replace the contents of `CMakeLists.txt` with this code:

    ```cmake
    cmake_minimum_required(VERSION 3.16)

    project(simple-converter)
    set (target simple-converter)

    add_executable(${target})

    # definitions for Debug x64
    target_compile_definitions(${target} PUBLIC  _DEBUG)

    # compile options for Debug x64
    target_compile_options(${target} PRIVATE -std=c++17 -MMD -MP -MF)
    target_compile_options(${target} PRIVATE -m64 -fPIC)
    target_compile_options(${target} PRIVATE -g)

    # includes
    target_include_directories(${target} PRIVATE 
        avblocks/include
    )

    # libs
    target_link_directories(${target} PRIVATE 
        ${PROJECT_SOURCE_DIR}/avblocks/lib/x64
    )
    target_link_libraries(${target} 
        libAVBlocks64.so
    )

    # sources
    file(GLOB source "src/*.cpp")
    target_sources(${target} PRIVATE ${source})
    ```

5. Replace the contents of `src/main.cpp` with this code:

    ```cpp
    #include <primo/avblocks/avb.h>
    #include <primo/platform/reference++.h>
    #include <primo/platform/ustring.h>

    using namespace primo;
    using namespace primo::codecs;
    using namespace primo::avblocks;

    int main(int argc, const char *argv[]) {
        Library::initialize();

        auto inputFile = primo::ustring(L"Wildlife_h264_aac.mp4");
        auto outputFile = primo::ustring(L"Wildlife_h265_aac.mp4");

        auto inputInfo = primo::make_ref(Library::createMediaInfo());
        inputInfo->inputs()->at(0)->setFile(inputFile);

        if (inputInfo->open()) {
            auto inputSocket = primo::make_ref(
                Library::createMediaSocket(inputInfo.get())
            );
            
            // Start with same output as the input, which is MP4 / H.264 + AAC
            auto outputSocket = primo::make_ref(inputSocket->clone());

            // Change the video stream type to H.265 (HEVC) 
            // and the stream subtype to HEVC Annex B
            auto outVideoStream = (VideoStreamInfo*)outputSocket
                                                    ->pins()->at(0)
                                                    ->streamInfo();
            outVideoStream->setStreamType(StreamType::H265);
            outVideoStream->setStreamSubType(StreamSubType::HEVC_Annex_B);
            
            // Input is H.264/AVC at 700 kbps
            // With H.265/HEVC we can use lower bitrate, e.g. 500 kbps
            outVideoStream->setBitrate(500'000);

            // Change the output file name to Wildlife_h265_aac.mp4
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
                std::cerr << "transcoder->open() failed: " 
                          << primo::ustring(transcoder->error()->message()) 
                          << std::endl;
            }
        }

        Library::shutdown();
        return 0;
    }
    ```

6. Build the project

    ```bash
    ./build.sh
    ```

## Run the application

1. Download the `Wildlife_h264_aac.mp4` sample file and save it in the project directory:

    ```bash
    curl \
    -L -o Wildlife_h264_aac.mp4 \
    https://archive.org/download/WildlifeSampleVideo/Wildlife.mp4
    ```

2. Run the application:

    ```bash
    ./build/debug/simple-converter
    ```
    
    Wait for the Transcoder to finish - it will take a few minutes. The converted file `Wildlife_h265_aac.mp4` will be in the project directory.
	
## Troubleshooting

* `transcoder->open()` may fail if there is already a file `Wildlife_h265_aac.mp4` in the project directory. Delete `Wildlife_h265_aac.mp4` to solve that.         
