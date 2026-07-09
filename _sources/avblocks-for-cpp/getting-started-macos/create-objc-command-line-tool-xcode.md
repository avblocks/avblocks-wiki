---
title: Create an Objective-C Command Line Tool in Xcode on macOS
html_meta:
    description: This page describes the steps needed to configure an Objective-C Command Line Tool in Xcode.
taxonomy:
    category: docs
---

# Create a Command Line Tool in Xcode on macOS

This topic describes the steps needed to configure an Objective-C Command Line Tool in Xcode. 

The code snippets used in this article are from the [simple_converter](https://github.com/avblocks/avblocks-cpp/tree/main/samples/darwin/simple_converter) macOS sample.

## Create the Xcode project 

1. Open Xcode, select `Create New Project`, pick `macOS` as a platform, pick `Command Line Tool` for Application 

2. Set Product Name to `simple-converter`, select `Objective-C` for language.

3. Rename `main.m` to `main.mm`. 

4. [Download](https://github.com/avblocks/avblocks-core/releases/) the 64 bit version of AVBlocks for C++ (macOS). The file you need will have a name similar to `avblocks-v3.4.0-demo.1-darwin.zip` except for the version number which may be different. 

5. Extract the ZIP archive in a location of your choice, then copy the `include` and `lib` directories to the `avblocks` subdirectory of the Xcode project directory. The Xcode project directory is the directory that contains the `simple-converter.xcodeproj` project file.

    You should end up with a directory structure similar to the following:

    ```sh
    simple-converter
    ├── avblocks
    │   ├── include
    │   └── lib
    ├── simple-converter
    │   └── main.mm
    └── simple-converter.xcodeproj
    ```

6. In Xcode, select the `simple-converter` project in Xcode, and then the 'Build Settings' tab: 
    * Under Apple Clang - Language - C++, set the C++ Language Dialect to `C++17[-std=c++17]`
    * Under Search Paths | Header Search Paths, add the `$(PROJECT_DIR)/avblocks/include` directory to the list
    * Under linking - General | Runpath Search Paths, add `@executable_path` to the list 
    * Set the Build Products Path to `$(PROJECT_DIR)/build`

7. In Xcode, select the 'simple-converter' target, and then the 'Build Phases' tab:
	* Expand the 'Link Binary with Libraries' section 
	* Add the `libAVBlocks.dylib` from the `$(PROJECT_DIR)/avblocks/lib/x64` directory.

8. Replace the contents of `main.mm` with this code:

    ```objectivec
    #import <Foundation/Foundation.h>

    #pragma clang diagnostic push
    #pragma clang diagnostic ignored "-Weverything"

    #include <primo/avblocks/avb.h>
    #include <primo/platform/ustring.h>
    #include <primo/platform/reference++.h>

    #pragma clang diagnostic pop

    using namespace primo;
    using namespace primo::codecs;
    using namespace primo::avblocks;

    int main(int argc, const char * argv[]) {
        @autoreleasepool {
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
                //the input and output sockets
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
                    NSLog(@"transcoder->open() failed: %@", [NS stringWithUTF8String:primo::ustring(transcoder->error()->message()).c_str()]);
                }
            }
            
            Library::shutdown();
        }
        
        return 0;
    }
    ```

9. Restart Xcode!!! Otherwise it will not pick the new Build Products Path 

10. Build the project ( ⌘B )  

11. Copy the file `libAVBlocks.dylib` from `avblocks/lib/x64` to `build/Debug`. 

## Run the application

1. Download the `Wildlife_h264_aac.mp4` sample file and save it in the project directory:

    ```bash
    curl -L -o Wildlife_h264_aac.mp4 https://archive.org/download/WildlifeSampleVideo/Wildlife.mp4
    ```

2. Run the application in Xcode. Wait for the Transcoder to finish - it will take a few minutes. The converted file `Wildlife_h265_aac.mp4` will be in the `build/Debug` directory.
	
## Troubleshooting

* You may get `dyld: Library not loaded: @executable_path/libAVBlocks.dylib` or a similar message. To fix that, copy the file `libAVBlocks.dylib` from `avblocks/lib` to `build/Debug`.
* `transcoder->open()` may fail if there is already a file `Wildlife_h265_aac.mp4` in the `build/Debug` directory. Delete `Wildlife_h265_aac.mp4` to solve that.         
