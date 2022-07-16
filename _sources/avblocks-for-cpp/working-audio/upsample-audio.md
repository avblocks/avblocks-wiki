---
title: Upsample Audio
metadata:
    description: This article explains how to upsample a 44.1 Khz audio clip to 48 KHz with AVBlocks.
taxonomy:
    category: docs
---

# Upsample Audio

This article explains how to upsample an audio clip from 44.1 Khz to 48 KHz.

## Source Audio

For an audio source we use the `kahvi011_kennybeltrey-hydrate.mp3` file from the [Internet Archive](https://archive.org/details/kahvi011). The original audio format is MPEG Audio Layer 3, 44.1 KHz, Joint Stereo, 136 Kbps, Variable Bit Rate

## Code

This code takes an MP3 file with 44.1 KHz audio, and converts it to an MP3 file with 48 KHz audio using polyphase resampling method. 

### Windows
   
``` cpp
// UpsampleAudio.cpp : Defines the entry point for the console application.
//

#include "stdafx.h"

using namespace primo;
using namespace primo::codecs;
using namespace primo::avblocks;

int _tmain(int argc, _TCHAR* argv[])
{
    Library::initialize();

    // start with two identical input and output configurations
    ref<MediaInfo> inputInfo (Library::createMediaInfo());
    inputInfo->inputs()->at(0)->setFile(L"kahvi011_kennybeltrey-hydrate.mp3");

    ref<MediaInfo> outputInfo (Library::createMediaInfo());
    outputInfo->inputs()->at(0)->setFile(L"kahvi011_kennybeltrey-hydrate.mp3");

    if (inputInfo->open() && outputInfo->open()) {

        // create input socket
        ref<MediaSocket> inputSocket (Library::createMediaSocket(inputInfo.get()));

        // create output socket
        ref<MediaSocket> outputSocket (Library::createMediaSocket(outputInfo.get()));
        outputSocket->setFile(L"kahvi011_kennybeltrey-hydrate_48Khz.mp3");

        // get output audio pin
        auto outAudioPin = outputSocket->pins()->at(0);

        // set output sampling rate to 48 KHz
        auto outAudioStream = static_cast<AudioStreamInfo*>(outAudioPin->streamInfo());
        outAudioStream->setSampleRate(48000);

        // create a Transcoder object
        ref<Transcoder> transcoder (Library::createTranscoder());

        // add input and output sockets
        transcoder->inputs()->add(inputSocket.get());
        transcoder->outputs()->add(outputSocket.get());

        // process
        if (transcoder->open()) {
            transcoder->run();
            transcoder->close();
        }
    }

    Library::shutdown();

    return 0;
}
```

#### How to run   

Follow the steps to [create a C++ console application in Visual Studio](../getting-started/create-a-c-plus-console-application-in-visual-studio), but use the code from this article. 

Download the `kahvi011_kennybeltrey-hydrate.mp3` song from the [Internet Archive](https://archive.org/details/kahvi011) and save it in the project directory.

Run the application in Visual Studio. Wait a few seconds for the Transcoder to finish. The converted file `kahvi011_kennybeltrey-hydrate_48Khz.mp3` will be in the project directory.

