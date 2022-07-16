---
title: Crop Video
metadata:
    description: This article explains how you can crop video with AVBlocks.
taxonomy:
    category: docs
---

# Crop Video

This article explains how you can crop a 16:9 video to a 4:3 video.

## Source Video

For a source video we use the MP4 file from the TED talk video [What's the next window into our universe?](https://archive.org/details/AndrewConnolly_2014) by Andrew Connolly. The original video format is Wide 480p or 16:9, 854 x 480.

## Code

This code takes an MP4 file with 16:9 480p (854x480) video and AAC audio, and crops the video to 4:3 640x480. The audio stream is copied from the source as is.    

### Windows
   
``` cpp
// CropVideo.cpp : Defines the entry point for the console application.
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
        outputSocket->setFile(L"AndrewConnolly_2014_640x480.mp4");

        // get output video pin
        auto outVideoPin = outputSocket->pins()->at(0);

        auto outVideoStream = static_cast<VideoStreamInfo*>(outVideoPin->streamInfo()); 

        // set the new frame width and height to 640 x 480
        outVideoStream->setFrameWidth(640);
        outVideoStream->setFrameHeight(480);

        // set the display ratio to 4:3
        outVideoStream->setDisplayRatioWidth(4);
        outVideoStream->setDisplayRatioHeight(3);

        // set Crop::Left and Crop::Right 
        ref<ParameterList> outVideoPinParams (Library::createParameterList()); 

        // The input video is 854x480. 
        // To make it 640x480 we have to cut (854 - 640) / 2 pixels from each side.

        ref<IntParameter> cropLeft (Library::createIntParameter());
        cropLeft->setName(Crop::Left);
        cropLeft->setValue((854 - 640) / 2);

        outVideoPinParams->add(cropLeft.get());

        ref<IntParameter> cropRight (Library::createIntParameter());
        cropRight->setName(Crop::Right);
        cropRight->setValue((854 - 640) / 2);

        outVideoPinParams->add(cropRight.get());

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

Run the application in Visual Studio. Wait a few seconds for the Transcoder to finish. The converted file `AndrewConnolly_2014_640x480.mp4` will be in the project directory.
    
         
    
         