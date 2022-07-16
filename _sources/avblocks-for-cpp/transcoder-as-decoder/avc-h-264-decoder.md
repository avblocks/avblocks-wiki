---
title: AVC / H.264 Decoder
metadata:
    description: This article explains how you can use Transcoder to decode an AVC / H.264 elementary stream.
taxonomy:
    category: docs
---

# AVC / H.264 Decoder

This article explains how you can use Transcoder to decode an AVC / H.264 elementary stream.

## Source Video

As video input we use the `foreman_qcif.h264` file from the [AVBlocks Assets](https://github.com/avblocks/avblocks-assets/releases) archive. After downloading and unzipping you will find `foreman_qcif.h264` in the `vid` subdirectory.

## Code

This code takes an H.264 stream, and decodes it to raw uncompressed YUV frames.

### Windows

#### Initialize AVBlocks

``` cpp
void decode_h264_stream()
{
    Library::initialize();

    decode_h264_stream(L"foreman_qcif.h264");

    Library::shutdown();
}
```

#### Configure Transcoder

``` cpp
void decode_h264_stream(const char_t* inputFile) 
{
    // Create an input socket from file
    p::ref<MediaSocket> inSocket(Library::createMediaSocket());
    inSocket->setFile(inputFile);

    // Create an output socket with one YUV 4:2:0 video pin
    p::ref<VideoStreamInfo> outStreamInfo(Library::createVideoStreamInfo());
    outStreamInfo->setStreamType(StreamType::UncompressedVideo);
    outStreamInfo->setColorFormat(ColorFormat::YUV420);
    outStreamInfo->setScanType(ScanType::Progressive);

    p::ref<MediaPin> outPin(Library::createMediaPin());
    outPin->setStreamInfo(outStreamInfo.get());

    p::ref<MediaSocket> outSocket(Library::createMediaSocket());
    outSocket->setStreamType(StreamType::UncompressedVideo);

    outSocket->pins()->add(outPin.get());

    // Create Transcoder
    p::ref<Transcoder> transcoder(Library::createTranscoder());
    transcoder->inputs()->add(inSocket.get());
    transcoder->outputs()->add(outSocket.get());

    if (transcoder->open())
    {
        decode_h264_stream(transcoder.get());

        transcoder->close();
    }
}
```

#### Call Transcoder::pull

``` cpp
void decode_h264_stream(Transcoder* transcoder)
{
    int32_t inputIndex = 0;
    p::ref<MediaSample> yuvFrame(Library::createMediaSample());

    while (transcoder->pull(inputIndex, yuvFrame.get()))
    {
        // Each call to Transcoder::pull returns a raw YUV 4:2:0 frame. 
        process_yuv_frame(yuvFrame->buffer());
    }
}
```

#### Complete C++ Code

``` cpp
// H264Decoder.cpp : Defines the entry point for the console application.
//

#include "stdafx.h"

namespace p = primo;

using namespace primo::codecs;
using namespace primo::avblocks;

static int frame_index = 0;
void process_yuv_frame(MediaBuffer* buffer)
{
    // Do something with the YUV frame, 
    // for example you can save it to a file or render the frame on the screen

    std::wcout << L"Frame Index : " << frame_index << std::endl;
    frame_index++;
}

void decode_h264_stream(Transcoder* transcoder)
{
    int32_t inputIndex = 0;
    p::ref<MediaSample> yuvFrame(Library::createMediaSample());

    while (transcoder->pull(inputIndex, yuvFrame.get()))
    {
        // Each call to Transcoder::pull returns a raw YUV 4:2:0 frame. 
        process_yuv_frame(yuvFrame->buffer());
    }
}

void decode_h264_stream(const char_t* inputFile) 
{
    // Create an input socket from file
    p::ref<MediaSocket> inSocket(Library::createMediaSocket());
    inSocket->setFile(inputFile);

    // Create an output socket with one YUV 4:2:0 video pin
    p::ref<VideoStreamInfo> outStreamInfo(Library::createVideoStreamInfo());
    outStreamInfo->setStreamType(StreamType::UncompressedVideo);
    outStreamInfo->setColorFormat(ColorFormat::YUV420);
    outStreamInfo->setScanType(ScanType::Progressive);

    p::ref<MediaPin> outPin(Library::createMediaPin());
    outPin->setStreamInfo(outStreamInfo.get());

    p::ref<MediaSocket> outSocket(Library::createMediaSocket());
    outSocket->setStreamType(StreamType::UncompressedVideo);

    outSocket->pins()->add(outPin.get());

    // Create Transcoder
    p::ref<Transcoder> transcoder(Library::createTranscoder());
    transcoder->inputs()->add(inSocket.get());
    transcoder->outputs()->add(outSocket.get());

    if (transcoder->open())
    {
        decode_h264_stream(transcoder.get());

        transcoder->close();
    }
}

void decode_h264_stream()
{
    Library::initialize();

    decode_h264_stream(L"foreman_qcif.h264");

    Library::shutdown();
}

int _tmain(int argc, _TCHAR* argv[])
{
    decode_h264_stream();
    return 0;
}
```

#### How to run

Follow the [steps](../getting-started/create-a-c-plus-console-application-in-visual-studio) to create a C++ console application in Visual Studio, but use the code from this article. 

Copy the `foreman_qcif.h264` file from the assets archive to `bin\x64\Debug` under the project's directory.

Run the application in Visual Studio. 
