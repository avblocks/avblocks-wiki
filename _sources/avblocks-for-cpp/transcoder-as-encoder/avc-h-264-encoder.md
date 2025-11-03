---
title: AVC / H.264 Encoder (Push)
html_meta:
    description: This article explains how you can use Transcoder to encode an AVC / H.264 elementary stream from raw video frames.
taxonomy:
    category: docs
---

# AVC / H.264 Encoder (Push)

This article explains how you can use [Transcoder::push](https://doc.avblocks.com/core/latest/classprimo_1_1avblocks_1_1_transcoder.html#abb8fa7942b3e84e0275c793dfbe2c3a0) to encode an AVC / H.264 elementary stream from raw YUV frames.

## Source Video

As video input we use the `foreman_qcif.yuv` file from the [AVBlocks Assets](https://github.com/avblocks/avblocks-assets/releases) archive. After downloading and unzipping you will find `foreman_qcif.yuv` in the `vid` subdirectory.


## Code

This code shows how you can encode raw uncompressed YUV frames into an H.264 stream. Two Transcoder objects are used, one to read the raw YUV frames from a file, and another to encode the raw frames to AVC / H.264 Annex B stream. The encoding is done via the `Transcoder::push` method.   

### Windows

#### Initialize AVBlocks

``` cpp
void encode_h264_stream()
{
    Library::initialize();

    encode_h264_stream(L"foreman_qcif.yuv", L"foreman_qcif.h264");

    Library::shutdown();
}
```

#### Configure YUV Reader Transcoder

``` cpp
p::ref<Transcoder> create_yuv_reader(const char_t* inputFile)
{
    // Create VideoStreamInfo, MediaPin, and MediaSocket describing the YUV input

    // VideoStreamInfo
    p::ref<VideoStreamInfo> yuvInVideo(Library::createVideoStreamInfo());
    yuvInVideo->setStreamType(StreamType::UncompressedVideo);
    yuvInVideo->setFrameRate(30.0);
    yuvInVideo->setFrameWidth(176);
    yuvInVideo->setFrameHeight(144);
    yuvInVideo->setColorFormat(ColorFormat::YUV420);
    yuvInVideo->setScanType(ScanType::Progressive);

    // MediaPin
    p::ref<MediaPin> yuvInPin(Library::createMediaPin());
    yuvInPin->setStreamInfo(yuvInVideo.get());

    // MediaSocket
    p::ref<MediaSocket> yuvInSocket(Library::createMediaSocket());
    yuvInSocket->setStreamType(StreamType::UncompressedVideo);
    yuvInSocket->setFile(inputFile);

    yuvInSocket->pins()->add(yuvInPin.get());

    // Create VideoStreamInfo, MediaPin, and MediaSocket describing the YUV output
    // This is the same as the input, but no output file is set on the MediaSocket, 
    // because we want to pull frames one by one using Transcoder::pull

    // VideoStreamInfo
    p::ref<VideoStreamInfo> yuvOutVideo(Library::createVideoStreamInfo());
    yuvOutVideo->setStreamType(StreamType::UncompressedVideo);
    yuvOutVideo->setFrameRate(30.0);
    yuvOutVideo->setFrameWidth(176);
    yuvOutVideo->setFrameHeight(144);
    yuvOutVideo->setColorFormat(ColorFormat::YUV420);
    yuvOutVideo->setScanType(ScanType::Progressive);

    // MediaPin
    p::ref<MediaPin> yuvOutPin(Library::createMediaPin());
    yuvOutPin->setStreamInfo(yuvOutVideo.get());

    // MediaSocket
    p::ref<MediaSocket> yuvOutSocket(Library::createMediaSocket());
    yuvOutSocket->setStreamType(StreamType::UncompressedVideo);

    yuvOutSocket->pins()->add(yuvOutPin.get());

    // Create Transcoder
    p::ref<Transcoder> yuvReader(Library::createTranscoder());
    yuvReader->inputs()->add(yuvInSocket.get());
    yuvReader->outputs()->add(yuvOutSocket.get());

    return yuvReader;
}
```

#### Configure AVC / H.264 Encoder Transcoder

``` cpp
p::ref<Transcoder> create_h264_encoder(const char_t* outputFile, HardwareEncoder::Enum hardware)
{
    // Create VideoStreamInfo, MediaPin, and MediaSocket describing the YUV input

    // VideoStreamInfo
    p::ref<VideoStreamInfo> yuvInVideo(Library::createVideoStreamInfo());
    yuvInVideo->setStreamType(StreamType::UncompressedVideo);
    yuvInVideo->setFrameRate(30.0);
    yuvInVideo->setFrameWidth(176);
    yuvInVideo->setFrameHeight(144);
    yuvInVideo->setColorFormat(ColorFormat::YUV420);
    yuvInVideo->setScanType(ScanType::Progressive);

    // MediaPin
    p::ref<MediaPin> yuvInPin(Library::createMediaPin());
    yuvInPin->setStreamInfo(yuvInVideo.get());

    // MediaSocket
    p::ref<MediaSocket> yuvInSocket(Library::createMediaSocket());
    yuvInSocket->setStreamType(StreamType::UncompressedVideo);

    yuvInSocket->pins()->add(yuvInPin.get());

    // Create VideoStreamInfo, MediaPin, and MediaSocket describing the H.264 output
    
    // VideoStreamInfo
    p::ref<VideoStreamInfo> h264OutVideo(Library::createVideoStreamInfo());
    h264OutVideo->setStreamType(StreamType::H264);
    h264OutVideo->setFrameRate(30.0);
    h264OutVideo->setFrameWidth(176);
    h264OutVideo->setFrameHeight(144);
    h264OutVideo->setColorFormat(ColorFormat::YUV420);
    h264OutVideo->setScanType(ScanType::Progressive);

    // MediaPin
    p::ref<MediaPin> h264OutPin(Library::createMediaPin());
    h264OutPin->setStreamInfo(h264OutVideo.get());

    // Enable \ disable hardware acceleration
    h264OutPin->params()->addInt(Param::HardwareEncoder, hardware);
    
    // MediaSocket
    p::ref<MediaSocket> h264OutSocket(Library::createMediaSocket());
    h264OutSocket->setStreamType(StreamType::H264);
    // Default subtype for StreamType::H264 is StreamSubType::AVC1, 
    // so we don't need to set it explicitly here
    // h264OutSocket->setStreamSubType(StreamSubType::AVC1);
    h264OutSocket->setFile(outputFile);

    h264OutSocket->pins()->add(h264OutPin.get());

    // Transcoder
    p::ref<Transcoder> h264Encoder(Library::createTranscoder());
    h264Encoder->inputs()->add(yuvInSocket.get());
    h264Encoder->outputs()->add(h264OutSocket.get());

    return h264Encoder;
}
```

#### Open Transcoders

``` cpp
void encode_h264_stream(const char_t* inputFile, const char_t* outputFile)
{
    // Create a reader to simulate raw video frames. In reality you will likely
    // have a different raw video source, for example some kind of video capture device.
    p::ref<Transcoder> yuvReader = create_yuv_reader(inputFile);

    // Create a H.264 encoder. We will pass the raw video frames to it to encode them as H.264
    p::ref<Transcoder> h264Encoder = create_h264_encoder(outputFile, HardwareEncoder::Auto);
    if (yuvReader->open())
    {
        if (h264Encoder->open())
        {
            encode_h264_stream(yuvReader.get(), h264Encoder.get());

            h264Encoder->close();
        }

        yuvReader->close();
    }
}
```

#### Call Transcoder::pull and Transcoder::push

``` cpp
void encode_h264_stream(Transcoder* yuvReader, Transcoder* h264Encoder)
{
    int32_t inputIndex = 0;
    p::ref<MediaSample> yuvFrame(Library::createMediaSample());

    while (true)
    {
        // Simulate a raw frame
        // Each call to Transcoder::pull returns one video frame.
        if (!yuvReader->pull(inputIndex, yuvFrame.get()))
            break;

        // Pass the raw video frame to Transcoder::push to encode it as AVC / H.264
        if (!h264Encoder->push(0, yuvFrame.get()))
            break;
    }

    h264Encoder->flush();
}
```

#### Complete C++ Code

``` cpp
#include <primo/avblocks/avb.h>
#include <primo/platform/reference++.h>

// link with AVBlocks64.lib
#pragma comment(lib, "./avblocks/lib/x64/AVBlocks64.lib")

namespace p = primo;

using namespace p::codecs;
using namespace p::avblocks;

p::ref<Transcoder> create_yuv_reader(const char_t* inputFile)
{
    // Create VideoStreamInfo, MediaPin, and MediaSocket describing the YUV input

    // VideoStreamInfo
    p::ref<VideoStreamInfo> yuvInVideo(Library::createVideoStreamInfo());
    yuvInVideo->setStreamType(StreamType::UncompressedVideo);
    yuvInVideo->setFrameRate(30.0);
    yuvInVideo->setFrameWidth(176);
    yuvInVideo->setFrameHeight(144);
    yuvInVideo->setColorFormat(ColorFormat::YUV420);
    yuvInVideo->setScanType(ScanType::Progressive);

    // MediaPin
    p::ref<MediaPin> yuvInPin(Library::createMediaPin());
    yuvInPin->setStreamInfo(yuvInVideo.get());

    // MediaSocket
    p::ref<MediaSocket> yuvInSocket(Library::createMediaSocket());
    yuvInSocket->setStreamType(StreamType::UncompressedVideo);
    yuvInSocket->setFile(inputFile);

    yuvInSocket->pins()->add(yuvInPin.get());

    // Create VideoStreamInfo, MediaPin, and MediaSocket describing the YUV output
    // This is the same as the input, but no output file is set on the MediaSocket, 
    // because we want to pull frames one by one using Transcoder::pull

    // VideoStreamInfo
    p::ref<VideoStreamInfo> yuvOutVideo(Library::createVideoStreamInfo());
    yuvOutVideo->setStreamType(StreamType::UncompressedVideo);
    yuvOutVideo->setFrameRate(30.0);
    yuvOutVideo->setFrameWidth(176);
    yuvOutVideo->setFrameHeight(144);
    yuvOutVideo->setColorFormat(ColorFormat::YUV420);
    yuvOutVideo->setScanType(ScanType::Progressive);

    // MediaPin
    p::ref<MediaPin> yuvOutPin(Library::createMediaPin());
    yuvOutPin->setStreamInfo(yuvOutVideo.get());

    // MediaSocket
    p::ref<MediaSocket> yuvOutSocket(Library::createMediaSocket());
    yuvOutSocket->setStreamType(StreamType::UncompressedVideo);

    yuvOutSocket->pins()->add(yuvOutPin.get());

    // Create Transcoder
    p::ref<Transcoder> yuvReader(Library::createTranscoder());
    yuvReader->inputs()->add(yuvInSocket.get());
    yuvReader->outputs()->add(yuvOutSocket.get());

    return yuvReader;
}

p::ref<Transcoder> create_h264_encoder(const char_t* outputFile, HardwareEncoder::Enum hardware)
{
    // Create VideoStreamInfo, MediaPin, and MediaSocket describing the YUV input

    // VideoStreamInfo
    p::ref<VideoStreamInfo> yuvInVideo(Library::createVideoStreamInfo());
    yuvInVideo->setStreamType(StreamType::UncompressedVideo);
    yuvInVideo->setFrameRate(30.0);
    yuvInVideo->setFrameWidth(176);
    yuvInVideo->setFrameHeight(144);
    yuvInVideo->setColorFormat(ColorFormat::YUV420);
    yuvInVideo->setScanType(ScanType::Progressive);

    // MediaPin
    p::ref<MediaPin> yuvInPin(Library::createMediaPin());
    yuvInPin->setStreamInfo(yuvInVideo.get());

    // MediaSocket
    p::ref<MediaSocket> yuvInSocket(Library::createMediaSocket());
    yuvInSocket->setStreamType(StreamType::UncompressedVideo);

    yuvInSocket->pins()->add(yuvInPin.get());

    // Create VideoStreamInfo, MediaPin, and MediaSocket describing the H.264 output
    
    // VideoStreamInfo
    p::ref<VideoStreamInfo> h264OutVideo(Library::createVideoStreamInfo());
    h264OutVideo->setStreamType(StreamType::H264);
    h264OutVideo->setFrameRate(30.0);
    h264OutVideo->setFrameWidth(176);
    h264OutVideo->setFrameHeight(144);
    h264OutVideo->setColorFormat(ColorFormat::YUV420);
    h264OutVideo->setScanType(ScanType::Progressive);

    // MediaPin
    p::ref<MediaPin> h264OutPin(Library::createMediaPin());
    h264OutPin->setStreamInfo(h264OutVideo.get());

    // Enable \ disable hardware acceleration
    h264OutPin->params()->addInt(Param::HardwareEncoder, hardware);
    
    // MediaSocket
    p::ref<MediaSocket> h264OutSocket(Library::createMediaSocket());
    h264OutSocket->setStreamType(StreamType::H264);
    // Default subtype for StreamType::H264 is StreamSubType::AVC1, 
    // so we don't need to set it explicitly here
    // h264OutSocket->setStreamSubType(StreamSubType::AVC1);
    h264OutSocket->setFile(outputFile);

    h264OutSocket->pins()->add(h264OutPin.get());

    // Transcoder
    p::ref<Transcoder> h264Encoder(Library::createTranscoder());
    h264Encoder->inputs()->add(yuvInSocket.get());
    h264Encoder->outputs()->add(h264OutSocket.get());

    return h264Encoder;
}

void encode_h264_stream(Transcoder* yuvReader, Transcoder* h264Encoder)
{
    int32_t inputIndex = 0;
    p::ref<MediaSample> yuvFrame(Library::createMediaSample());

    while (true)
    {
        // Simulate a raw frame
        // Each call to Transcoder::pull returns one video frame.
        if (!yuvReader->pull(inputIndex, yuvFrame.get()))
            break;

        // Pass the raw video frame to Transcoder::push to encode it as AVC / H.264
        if (!h264Encoder->push(0, yuvFrame.get()))
            break;
    }

    h264Encoder->flush();
}

void encode_h264_stream(const char_t* inputFile, const char_t* outputFile)
{
    // Create a reader to simulate raw video frames. In reality you will likely
    // have a different raw video source like for example some kind of video capture device.
    p::ref<Transcoder> yuvReader = create_yuv_reader(inputFile);

    // Create a H.264 encoder. We will pass the raw video frames to it to encode them as H.264
    p::ref<Transcoder> h264Encoder = create_h264_encoder(outputFile, HardwareEncoder::Auto);
    if (yuvReader->open())
    {
        if (h264Encoder->open())
        {
            encode_h264_stream(yuvReader.get(), h264Encoder.get());

            h264Encoder->close();
        }

        yuvReader->close();
    }
}

void encode_h264_stream()
{
    Library::initialize();

    encode_h264_stream(L"foreman_qcif.yuv", L"foreman_qcif.h264");

    Library::shutdown();
}

int main(int argc, const char * argv[]) {
    encode_h264_stream();
    return 0;
}
```

#### How to run

[Create a C++ console application ](../getting-started-windows/create-a-c-plus-console-app-in-visual-studio) in Visual Studio and use the code from this article. 

Copy the `foreman_qcif.yuv` file from the assets archive to `x64/Debug` under the project's directory.

Run the application in Visual Studio. 
