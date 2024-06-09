---
title: Simple Audio Converter
html_meta:
    description: This topic is about building an audio converter using C++ and Visual Studio.
taxonomy:
    category: docs
---

# Simple Audio Converter

Building a simple audio converter using C++ and Visual Studio.

## Source Audio

For an audio source we use the `kahvi011_kennybeltrey-hydrate.mp3` file from the [Internet Archive](https://archive.org/details/kahvi011). The original audio format is MPEG Audio Layer 3, 44.1 KHz, Joint Stereo, 136 Kbps, Variable Bit Rate

## Code

### Windows

``` cpp
#include <primo/avblocks/avb.h>
#include <primo/platform/reference++.h>

// link with AVBlocks64.lib
#pragma comment(lib, "./avblocks/lib/x64/AVBlocks64.lib")

using namespace primo;
using namespace primo::codecs;
using namespace primo::avblocks;

int main(int argc, const char * argv[]) {
    // needed for Windows Media Codecs
    CoInitializeEx(nullptr, COINITBASE_MULTITHREADED);

    Library::initialize();

    ref<MediaInfo> inputInfo(Library::createMediaInfo());
    inputInfo->inputs()->at(0)->setFile(L"kahvi011_kennybeltrey-hydrate.mp3");

    if (inputInfo->open()) {
        ref<MediaSocket> inputSocket(Library::createMediaSocket(inputInfo.get()));
        ref<MediaSocket> outputSocket(Library::createMediaSocket(Preset::Audio::Generic::AAC));
        outputSocket->setFile(L"kahvi011_kennybeltrey-hydrate.aac");

        ref<Transcoder> transcoder(Library::createTranscoder());
        transcoder->inputs()->add(inputSocket.get());
        transcoder->outputs()->add(outputSocket.get());

        if (transcoder->open()) {
            transcoder->run();
            transcoder->close();
        }

        inputInfo->close();
    }

    Library::shutdown();

    CoUninitialize();

    return 0;
}
```

#### How to run   

Follow the [steps](../getting-started-windows/create-a-c-plus-console-app-in-visual-studio) to create a C++ console application in Visual Studio but use the code from this article. 

Download the `kahvi011_kennybeltrey-hydrate.mp3` song from the [Internet Archive](https://archive.org/details/kahvi011) and save it in the project directory.

Run the application in Visual Studio. Wait a few seconds for the Transcoder to finish. The converted file `kahvi011_kennybeltrey-hydrate.aac` will be in the project directory.

