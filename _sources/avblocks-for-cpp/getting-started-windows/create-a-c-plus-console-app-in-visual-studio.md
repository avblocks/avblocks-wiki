---
title: Create a C++ Console App in Visual Studio on Windows
html_meta:
    description: This topic describes the steps needed to configure a C++ console application in Visual Studio.
taxonomy:
    category: docs
---

# Create a Console App in Visual Studio on Windows

This topic describes the steps needed to configure a C++ Console App in Visual Studio. These steps have been verified to work with Visual Studio 2022 Community Edition, on Windows 11.

The code snippets used in this article are from the [simple_converter Windows sample](https://github.com/avblocks/avblocks-cpp/tree/main/samples/windows/simple_converter).
This sample takes a WMV media file as input and converts it to H.265/HEVC video and AAC audio in MP4 container.

## Create the Visual Studio project

1. Create a C++, Console App in Visual Studio. Name the project `simple-converter`. Check `Place solution and project in the same directory`. 

2. [Download](https://github.com/avblocks/avblocks-core/releases/) the 64 bit version of AVBlocks for C++ (Windows). The file you need will have a name similar to `avblocks-v3.4.0-demo.1-windows.zip` - the version number may differ. 

3. Extract the ZIP archive in a location of your choice, then copy the `include` and `lib` directories to the `avblocks` subdirectory of the Visual Studio solution directory. The Visual Studio solution is the directory that contains the `simple-converter.sln` solution file.
    
    You should end up with a directory structure similar to the following:

    ```
    simple-converter
    ├───avblocks
    │   ├───include
    │   └───lib
    ├───simple-converter.cpp
    ├───simple-converter.sln
    └───simple-converter.vcxproj
    ```

4. Replace the contents of `simple-converter.cpp` with this code:

    ```cpp
    #include <primo/avblocks/avb.h>
    #include <primo/platform/reference++.h>
    #include <primo/platform/ustring.h>

    #include <windows.h>

    // link with AVBlocks64.lib
    #pragma comment(lib, "./avblocks/lib/x64/AVBlocks64.lib")

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

5. In Visual Studio, select `Build | Configuration Manager` from the menu, then select the `x64` platform to the solution platforms.

6. In Visual Studio, select `Project | simple-converter Properties` from the menu, then `C++ | General`, then add `./avblocks/include` to `Additional Include Directories`.

7. Build the project (Ctrl + Shift + B).

8. Copy the file `AVBlocks64.dll` from `avblocks/lib/x64` to `x64/Debug`. 

## Run the application

1. Download the `Wildlife.wmv` sample file and save it in the Visual Studio solution directory (next to the `simple-converter.sln` solution file):

    ```powershell
    Invoke-WebRequest `
    -Uri https://archive.org/download/WildlifeSampleVideo/Wildlife.wmv `
    -OutFile Wildlife.wmv
    ```

2. Copy the file `AVBlocks64.dll` from `avblocks/lib/x64` to `x64/Debug`. 

3. Run the application in Visual Studio. Wait a few seconds for the Transcoder to finish. The converted file `Wildlife_h265_aac.mp4` will be in the solution directory.   

## Troubleshooting

* You may get `The program can't start because AVBlocks64.dll is missing from your computer. Try reinstalling the program to fix this problem.` or a similar message. To fix that, copy the file `AVBlocks64.dll` from `avblocks/lib/x64` to `x64/Debug`.

* `transcoder->open()` may fail if there is already a file `Wildlife_h265_aac.mp4` in the project directory. Delete `Wildlife_h265_aac.mp4` to solve that.   
