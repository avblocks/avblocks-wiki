---
title: Upscale Video
html_meta:
    description: This article explains how to scale a video up to Full HD (1080p) with AVBlocks.
taxonomy:
    category: docs
---

# Upscale Video

This article explains how to scale a 480p (854x480) video up to Full HD 1080p (1920x1080) video.

## Source Video

For a source video we use the MP4 file from the TED talk video [What's the next window into our universe?](https://archive.org/details/AndrewConnolly_2014) by Andrew Connolly. The original video format is Wide 480p or 16:9, 854 x 480.

## Sample Code

This code takes an MP4 file with H.264 video and AAC audio, and scales the video stream up to Full HD 1920x1080 (1080p) using bicubic method for interpolation. The audio stream is copied from the source as is.    

The snippets in this section are from the [video_upscale macOS sample](https://github.com/avblocks/avblocks-cpp/tree/main/samples/darwin/video_upscale).

Linux and Windows samples are also available:
- [video_upscale Linux sample](https://github.com/avblocks/avblocks-cpp/tree/main/samples/linux/video_upscale)
- [video_upscale Windows sample](https://github.com/avblocks/avblocks-cpp/tree/main/samples/windows/video_upscale)


## Initialize AVBlocks

The first step in any AVBlocks application is to initialize the library. This must be done before using any other AVBlocks functionality. The `Library::initialize()` method sets up the internal state and loads necessary codecs. Always remember to call `Library::shutdown()` at the end of your program to properly clean up resources and release any allocated memory.

``` cpp
int main(int argc, char* argv[])
{
    Options opt;
    
    switch(prepareOptions(opt, argc, argv))
    {
        case Command: return 0;
        case Error:	return 1;
        case Parsed: break;
    }
    
    Library::initialize();
    
    bool result = upscaleVideo(opt);
    
    Library::shutdown();
    
    return result ? 0 : 1;
}
```


## Configure Transcoder and Upscale

This is the main upscaling function that ties everything together. First, we create an input socket that points to the source video file. Then we create the output socket using our helper function. The transcoder is the core component that performs the actual upscaling - it takes the 480p video from the input and resizes it to 1920x1080 using bicubic interpolation for the best upscaling quality.

The `setAllowDemoMode(true)` call allows the transcoder to work even without a valid license (useful for testing, but not recommended for production). We then add our input and output sockets to the transcoder, open it to prepare for processing, run the actual upscaling operation, and finally close it to clean up.

``` cpp
bool upscaleVideo(Options& opt)
{
    auto mediaInfo = primo::make_ref(Library::createMediaInfo());
    mediaInfo->inputs()->at(0)->setFile(primo::ustring(opt.inputFile));
    
    if(!mediaInfo->open())
    {
        printError("MediaInfo open:", mediaInfo->error());
        return false;
    }
    
    // create input socket
    auto inputSocket = primo::make_ref(Library::createMediaSocket(mediaInfo.get()));
    
    // create output socket
    auto outputSocket = primo::make_ref(Library::createMediaSocket(mediaInfo.get()));
    outputSocket->setFile(primo::ustring(opt.outputFile));
    
    // get output video pin
    auto outVideoPin = outputSocket->pins()->at(0); 
    
    // set the new frame width and height
    auto outVideoStream = static_cast<VideoStreamInfo*>(outVideoPin->streamInfo());
    outVideoStream->setFrameWidth(opt.width);
    outVideoStream->setFrameHeight(opt.height);
    
    // set the resize interpolation method:
    // InterpolationMethod::Cubic is best for upscaling (however, it is slow)
    auto outVideoPinParams = primo::make_ref(Library::createParameterList()); 

    auto interpolationMethod = primo::make_ref(Library::createIntParameter()); 
    interpolationMethod->setName(primo::avblocks::Param::Video::Resize::InterpolationMethod);
    interpolationMethod->setValue(primo::codecs::InterpolationMethod::Cubic);

    outVideoPinParams->add(interpolationMethod.get());

    outVideoPin->setParams(outVideoPinParams.get());
    
    // create a Transcoder
    auto transcoder = primo::make_ref(Library::createTranscoder()); 
    transcoder->setAllowDemoMode(true);
    
    // add input and output sockets
    transcoder->inputs()->add(inputSocket.get());
    transcoder->outputs()->add(outputSocket.get());

    // process
    if(transcoder->open())
    {
        transcoder->run();
        transcoder->close();
    }
    else
    {
        printError("Transcoder open:", transcoder->error());
        return false;
    }
    
    cout << "Output: " << opt.outputFile << endl;
    
    return true;
}
```

## Complete C++ Code

Here's the complete working example that demonstrates video upscaling using AVBlocks. This code combines all the previous snippets into a functional program that can be compiled and run. The main function handles command-line argument parsing, initializes AVBlocks, performs the upscaling operation, and properly shuts down the library before exiting.

``` cpp
#include <primo/avblocks/avb.h>

#include <primo/platform/reference++.h>
#include <primo/platform/error_facility.h>
#include <primo/platform/ustring.h>

#include "util.h"
#include "options.h"

#include <iostream>
#include <string>

using namespace primo::codecs;
using namespace primo::avblocks;
using namespace std;

bool upscaleVideo(Options& opt)
{
    auto mediaInfo = primo::make_ref(Library::createMediaInfo());
    mediaInfo->inputs()->at(0)->setFile(primo::ustring(opt.inputFile));
    
    if(!mediaInfo->open())
    {
        printError("MediaInfo open:", mediaInfo->error());
        return false;
    }
    
    // create input socket
    auto inputSocket = primo::make_ref(Library::createMediaSocket(mediaInfo.get()));
    
    // create output socket
    auto outputSocket = primo::make_ref(Library::createMediaSocket(mediaInfo.get()));
    outputSocket->setFile(primo::ustring(opt.outputFile));
    
    // get output video pin
    auto outVideoPin = outputSocket->pins()->at(0); 
    
    // set the new frame width and height
    auto outVideoStream = static_cast<VideoStreamInfo*>(outVideoPin->streamInfo());
    outVideoStream->setFrameWidth(opt.width);
    outVideoStream->setFrameHeight(opt.height);
    
    // set the resize interpolation method:
    // InterpolationMethod::Cubic is best for upscaling (however, it is slow)
    auto outVideoPinParams = primo::make_ref(Library::createParameterList()); 

    auto interpolationMethod = primo::make_ref(Library::createIntParameter()); 
    interpolationMethod->setName(primo::avblocks::Param::Video::Resize::InterpolationMethod);
    interpolationMethod->setValue(primo::codecs::InterpolationMethod::Cubic);

    outVideoPinParams->add(interpolationMethod.get());

    outVideoPin->setParams(outVideoPinParams.get());
    
    // create a Transcoder
    auto transcoder = primo::make_ref(Library::createTranscoder()); 
    transcoder->setAllowDemoMode(true);
    
    // add input and output sockets
    transcoder->inputs()->add(inputSocket.get());
    transcoder->outputs()->add(outputSocket.get());

    // process
    if(transcoder->open())
    {
        transcoder->run();
        transcoder->close();
    }
    else
    {
        printError("Transcoder open:", transcoder->error());
        return false;
    }
    
    cout << "Output: " << opt.outputFile << endl;
    
    return true;
}

int main(int argc, char* argv[])
{
    Options opt;
    
    switch(prepareOptions(opt, argc, argv))
    {
        case Command: return 0;
        case Error:	return 1;
        case Parsed: break;
    }
    
    Library::initialize();
    
    bool result = upscaleVideo(opt);
    
    Library::shutdown();
    
    return result ? 0 : 1;
}
```

## How to run

See the [build instructions](https://github.com/avblocks/avblocks-cpp/blob/main/docs/build-mac.md) for macOS and the [video_upscale](https://github.com/avblocks/avblocks-cpp/tree/main/samples/darwin/video_upscale) example for details.

```sh
./video_upscale --input <input.mp4> --output <output.mp4>
```

Download the `AndrewConnolly_2014.mp4` file from the Internet Archive:

```sh
curl -L -o AndrewConnolly_2014.mp4 https://archive.org/download/AndrewConnolly_2014/AndrewConnolly_2014_640x480.mp4
```

```sh
./bin/x64/video_upscale \
    --input AndrewConnolly_2014.mp4 \
    --output AndrewConnolly_2014_1080p.mp4 \
    --width 1920 --height 1080
```
