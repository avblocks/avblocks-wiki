---
title: Upscale Video
metadata:
    description: This article explains how to scale a video up to Full HD (1080p) with AVBlocks.
taxonomy:
    category: docs
---

# Upscale Video

This article explains how to scale a 480p (854x480) video up to Full HD 1080p (1920x1080) video.

## Source Video

For a source video we use the MP4 file from the TED talk video [What's the next window into our universe?](https://archive.org/details/AndrewConnolly_2014) by Andrew Connolly. The original video format is Wide 480p or 16:9, 854 x 480.

## Code

This code takes an MP4 file with H.264 video and AAC audio, and scales the video stream up to Full HD 1920x1080 (1080p) using bicubic method for interpolation. The audio stream is copied from the source as is.    

### Windows
   
``` cpp
// UpscaleVideo.cpp : Defines the entry point for the console application.
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
        using namespace Param::Video;

        // create input socket
        ref<MediaSocket> inputSocket (Library::createMediaSocket(inputInfo.get()));

        // create output socket
        ref<MediaSocket> outputSocket (Library::createMediaSocket(outputInfo.get())); 
        outputSocket->setFile(L"AndrewConnolly_2014_1080p.mp4");

        // get output video pin
        auto outVideoPin = outputSocket->pins()->at(0); 
        
        // set the new frame width and height to 1920 x 1080
        auto outVideoStream = static_cast<VideoStreamInfo*>(outVideoPin->streamInfo()); 
        outVideoStream->setFrameWidth(1920);
        outVideoStream->setFrameHeight(1080);
    
        // set the resize interpolation method:
        // InterpolationMethod::Cubic is best for upscaling (however, it is slow)
        ref<ParameterList> outVideoPinParams (Library::createParameterList()); 

        ref<IntParameter> interpolationMethod (Library::createIntParameter()); 
        interpolationMethod->setName(Resize::InterpolationMethod);
        interpolationMethod->setValue(InterpolationMethod::Cubic);

        outVideoPinParams->add(interpolationMethod.get());

        outVideoPin->setParams(outVideoPinParams.get());

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

Run the application in Visual Studio. Wait a few seconds for the Transcoder to finish. The converted file `AndrewConnolly_2014_1080p.mp4` will be in the project directory.
