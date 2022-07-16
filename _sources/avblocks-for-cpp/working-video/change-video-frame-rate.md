---
title: Change Video Frame Rate
metadata:
    description: This article shows how to change the frame rate of a video from 24 fps to 30 fps.
taxonomy:
    category: docs
---

# Change Video Frame Rate

This article shows how to change the frame rate of a video from 24 fps to 30 fps.

## Source Video

For a source video we use the MP4 file from the TED talk video [What's the next window into our universe?](https://archive.org/details/AndrewConnolly_2014) by Andrew Connolly. The original video format is Wide 480p or 16:9, 854 x 480.

## Code

This code takes an MP4 file encoded at 24 fps, and increases the video framerate to 30 fps. The audio stream is copied from the source as is.    

### Windows

``` cpp   
// ChangeVideoFramerate.cpp : Defines the entry point for the console application.
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
    inputInfo->setInputFile(L"AndrewConnolly_2014.mp4");

    ref<MediaInfo> outputInfo (Library::createMediaInfo());
    outputInfo->setInputFile(L"AndrewConnolly_2014.mp4");

    if (inputInfo->load() && outputInfo->load()) {
        // create input socket
        ref<MediaSocket> inputSocket (Library::createMediaSocket(inputInfo.get()));

        // create output socket
        ref<MediaSocket> outputSocket (Library::createMediaSocket(outputInfo.get()));
        outputSocket->setFile(L"AndrewConnolly_2014_30fps.mp4");

        // get output video pin
        auto outVideoPin = outputSocket->pins()->at(0); 

        // change the frame rate from 24 fps to 30 fps
        auto outVideoStream = static_cast<VideoStreamInfo*>(outVideoPin->streamInfo());
        outVideoStream->setFrameRate(30.0);

        // create a Transcoder
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

Follow the [steps](../getting-started/create-a-c-plus-console-application-in-visual-studio) to create a C++ console application in Visual Studio, but use the code from this article. 

Download the `AndrewConnolly_2014.mp4` MPEG4 file from the [Internet Archive](https://archive.org/details/AndrewConnolly_2014) and save it in the project directory.

Run the application in Visual Studio. Wait a few seconds for the Transcoder to finish. The converted file `AndrewConnolly_2014_30fps.mp4` will be in the project directory.
         