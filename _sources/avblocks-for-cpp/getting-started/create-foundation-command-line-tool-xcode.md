---
title: Create a Foundation Command Line Tool in Xcode
metadata:
    description: This page describes the steps needed to configure an Objective-C++ console application in Xcode.
taxonomy:
    category: docs
---

# Create a Foundation Command Line Tool in Xcode

This topic describes the steps needed to configure an Objective-C++ console application in Xcode.


## Create the Xcode project

1. Create a new Command Line Tool project in Xcode. Name the project 'SimpleConverter', select 'Foundation' for type.
2. Rename `main.m` to `main.mm`. 
3. Select the 'SimpleConverter' project in Xcode, and then the 'Build Settings' tab: 
	* Set the C++ Language Dialect to `C++11[-std=c++11]`
	* Set the  Build Products Path to `$(PROJECT_DIR)`
4. [Download](https://avblocks.com/download/) the 64 bit version of AVBlocks for C++ (Mac). The file you need will have a name similar to `AVBlocks.1.14.0.Demo.dmg` except for the version number which may be different. 
5. Mount the dmg, copy the tgz archive and extract it in a location of your choice, then copy the `include` and `lib` directories to the Xcode project directory.
6. Add 'AVBlocks.h', 'PrimoReference++.h', and 'PrimoUString.h' to 'SimpleConverter-Prefix.pch':

```objectivec++
//
//  Prefix header
//
//  The contents of this file are implicitly included at the beginning of every source file.
//

#ifdef __OBJC__
    #import <Foundation/Foundation.h>
#endif

// the main AVBlocks header
#include "../include/AVBlocks.h"

// needed for C++11 features
#include "../include/PrimoReference++.h"

// needed for string conversion
#include "../include/PrimoUString.h"
```

7. In Xcode, select the 'SimpleConverter' target, and then the 'Build Phases' tab:
	* Expand the 'Link Binary with Libraries' section 
	* Add the `libAVBlocks.dylib` from the `lib` directory.
8. Restart Xcode!!! Otherwise it will not pick the new Build Products Path 
8. Build the project ( ⌘B )  
9. Copy the file `libAVBlocks.dylib` from `lib` to `Debug`. 
7. Replace the contents of 'main.mm' with this code:
		
```objectivec++
//
//  main.mm
//  SimpleConverter
//
//  Copyright (c) 2014 Primo Software. All rights reserved.
//

using namespace primo;
using namespace primo::codecs;
using namespace primo::avblocks;

int main(int argc, const char * argv[])
{
    @autoreleasepool {
        
        Library::initialize();

        auto inputFile = primo::ustring(L"AAP.m4v");
        auto outputFile = primo::ustring(L"AAP.mp4");

        auto inputInfo = primo::make_ref(Library::createMediaInfo());
        inputInfo->setInputFile(inputFile.u16());

        if (inputInfo->load()) {
            auto inputSocket = primo::make_ref(Library::createMediaSocket(inputInfo.get()));
            auto outputSocket = primo::make_ref(Library::createMediaSocket(Preset::iPad_H264_720p));
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

## Run the application

1. Download the `AAP.m4v` HD movie from the [Internet Archive](https://archive.org/details/Wildlife-filming) and save it in the `Debug` directory.
2. Run the application in Xcode. Wait for the Transcoder to finish - it will take a few minutes. The converted file `AAP.mp4` will be in the `Debug` directory.   
	
## Troubleshooting

* You may get "dyld: Library not loaded: @executable_path/libAVBlocks.dylib" or a similar message. To fix that, copy the file `libAVBlocks.dylib` from `lib` to `Debug`.
* transcoder->open() may fail if there is already a file `AAP.mp4` in the `Debug` directory. Delete `AAP.mp4` to solve that.         
