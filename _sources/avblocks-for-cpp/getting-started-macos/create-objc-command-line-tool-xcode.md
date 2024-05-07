---
title: Create an Objective-C Command Line Tool in Xcode on macOS
metadata:
    description: This page describes the steps needed to configure an Objective-C Command Line Tool in Xcode.
taxonomy:
    category: docs
---

# Create a Command Line Tool in Xcode on macOS

This topic describes the steps needed to configure an Objective-C Command Line Tool in Xcode. These steps have been verified to work with Xcode 15.0.1, on macOS Ventura 13.5.2.

## Create the Xcode project 

1. Open Xcode, select `Create New Project`, pick `macOS` as a platform, pick `Command Line Tool` for Application 

2. Set Product Name to `simple-converter`, select `Objective-C` for language.

3. Rename `main.m` to `main.mm`. 

4. [Download](https://github.com/avblocks/avblocks-core/releases/) the 64 bit version of AVBlocks for C++ (macOS). The file you need will have a name similar to `avblocks-v3.0.1-demo.1-darwin.zip` except for the version number which may be different. 

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
    //
    //  main.mm
    //  simple-converter
    //

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

            auto inputFile = primo::ustring(L"AAP.m4v");
            auto outputFile = primo::ustring(L"AAP.mp4");

            auto inputInfo = primo::make_ref(Library::createMediaInfo());
            inputInfo->inputs()->at(0)->setFile(inputFile.u16());

            if (inputInfo->open()) {
                auto inputSocket = primo::make_ref(Library::createMediaSocket(inputInfo.get()));
                auto outputSocket = primo::make_ref(Library::createMediaSocket(Preset::Video::Generic::MP4::Base_H264_AAC));
                outputSocket->setFile(outputFile.u16());
                
                auto transcoder = primo::make_ref(Library::createTranscoder());
                transcoder->inputs()->add(inputSocket.get());
                transcoder->outputs()->add(outputSocket.get());
                
                if (transcoder->open()) {
                    transcoder->run();
                    transcoder->close();
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

1. Download the `AAP.m4v` HD movie from the [Internet Archive](https://archive.org/details/Wildlife-filming) and save it in the `build/Debug` directory.

2. Run the application in Xcode. Wait for the Transcoder to finish - it will take a few minutes. The converted file `AAP.mp4` will be in the `build/Debug` directory.   
	
## Troubleshooting

* You may get `dyld: Library not loaded: @executable_path/libAVBlocks.dylib` or a similar message. To fix that, copy the file `libAVBlocks.dylib` from `avblocks/lib` to `build/Debug`.
* `transcoder->open()` may fail if there is already a file `AAP.mp4` in the `build/Debug` directory. Delete `AAP.mp4` to solve that.         
