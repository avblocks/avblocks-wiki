---
title: AAC Decoder (Pull)
html_meta:
    description: This article explains how you can use Transcoder to decode an AAC ADTS elementary stream.
taxonomy:
    category: docs
---

# AAC Decoder (Pull)

This article explains how you can use [Transcoder::pull](https://doc.avblocks.com/core/latest/classprimo_1_1avblocks_1_1_transcoder.html#a8b54e4ba7db4474b0288ff57c12d538e) to decode an AAC ADTS elementary stream.

## Source Audio

For source we use the `Hydrate-Kenny_Beltrey.aac` file from the [AVBlocks Assets](https://github.com/avblocks/avblocks-assets/releases) repository. After downloading and unzipping you will find `Hydrate-Kenny_Beltrey.aac` in the `aud` subdirectory.

## Code

This code takes an AAC ADTS stream and decodes it to uncompressed LPCM samples.

### Windows

#### Initialize AVBlocks

``` cpp

void decode_aac_stream()
{
    Library::initialize();

    decode_aac_stream(L"Hydrate-Kenny_Beltrey.aac");

    Library::shutdown();
}

```

#### Configure Transcoder

``` cpp

void decode_aac_stream(const char_t* inputFile)
{
    // Create an input socket from file
    p::ref<MediaSocket> inSocket(Library::createMediaSocket());
    inSocket->setFile(inputFile);

    // Create an output socket with one LPCM audio pin
    p::ref<AudioStreamInfo> outStreamInfo(Library::createAudioStreamInfo());

    outStreamInfo->setStreamType(StreamType::LPCM);
    outStreamInfo->setSampleRate(44100);
    outStreamInfo->setChannels(2);
    outStreamInfo->setBitsPerSample(16);

    p::ref<MediaPin> outPin(Library::createMediaPin());
    outPin->setStreamInfo(outStreamInfo.get());

    p::ref<MediaSocket> outSocket(Library::createMediaSocket());
    outSocket->setStreamType(StreamType::LPCM);

    outSocket->pins()->add(outPin.get());

    // Create Transcoder
    p::ref<Transcoder> transcoder(Library::createTranscoder());
    transcoder->inputs()->add(inSocket.get());
    transcoder->outputs()->add(outSocket.get());

    if (transcoder->open())
    {
        decode_aac_stream(transcoder.get());

        transcoder->close();
    }
}

```

#### Call Transcoder::pull

``` cpp

void decode_aac_stream(Transcoder* transcoder)
{
    int32_t outputIndex;
    p::ref<MediaSample> audioSample(Library::createMediaSample());

    while (transcoder->pull(outputIndex, audioSample.get()))
    {
        // Each call to Transcoder::pull returns one audio frame. 
        // One audio frame typically contains 512 audio samples.  
        process_audio_frame(audioSample.get());
    }
}

```

#### Complete C++ Code

``` cpp
#include <primo/avblocks/avb.h>
#include <primo/platform/reference++.h>

// link with AVBlocks64.lib
#pragma comment(lib, "./avblocks/lib/x64/AVBlocks64.lib")

namespace p = primo;

using namespace primo::codecs;
using namespace primo::avblocks;

#include <iostream>

static int frame_index = 0;
void process_audio_frame(MediaSample* sample)
{
    // sample->buffer() contains 512 interleaved samples. In this example each sample is 16 bit signed integer. 

    // The samples of multi-channel audio (such as stereo and surround) are stored by 
    // cycling through the samples for each channel before advancing to the next sample time

    std::cout << "Sample Index : " << frame_index
        << " timestamp : " << sample->startTime()
        << " data : " << sample->buffer()->data()
        << " dataSize : " << sample->buffer()->dataSize()
        << std::endl;

    // Do something with the audio buffer, 
    // for example you can save it to a WAV file or send it to a speaker

    frame_index++;
}

void decode_aac_stream(Transcoder* transcoder)
{
    int32_t outputIndex;
    p::ref<MediaSample> audioSample(Library::createMediaSample());

    while (transcoder->pull(outputIndex, audioSample.get()))
    {
        // Each call to Transcoder::pull returns one audio frame. 
        // One audio frame typically contains 512 audio samples.  
        process_audio_frame(audioSample.get());
    }
}

void decode_aac_stream(const char_t* inputFile)
{
    // Create an input socket from file
    p::ref<MediaSocket> inSocket(Library::createMediaSocket());
    inSocket->setFile(inputFile);

    // Create an output socket with one LPCM audio pin
    p::ref<AudioStreamInfo> outStreamInfo(Library::createAudioStreamInfo());

    outStreamInfo->setStreamType(StreamType::LPCM);
    outStreamInfo->setSampleRate(44100);
    outStreamInfo->setChannels(2);
    outStreamInfo->setBitsPerSample(16);

    p::ref<MediaPin> outPin(Library::createMediaPin());
    outPin->setStreamInfo(outStreamInfo.get());

    p::ref<MediaSocket> outSocket(Library::createMediaSocket());
    outSocket->setStreamType(StreamType::LPCM);

    outSocket->pins()->add(outPin.get());

    // Create Transcoder
    p::ref<Transcoder> transcoder(Library::createTranscoder());
    transcoder->inputs()->add(inSocket.get());
    transcoder->outputs()->add(outSocket.get());

    if (transcoder->open())
    {
        decode_aac_stream(transcoder.get());

        transcoder->close();
    }
}

void decode_aac_stream()
{
    Library::initialize();

    decode_aac_stream(L"Hydrate-Kenny_Beltrey.aac");

    Library::shutdown();
}

int main(int argc, const char* argv[]) {
    decode_aac_stream();
    return 0;
}
```

#### How to run

Follow the [steps](../getting-started-windows/create-a-c-plus-console-app-in-visual-studio) to create a C++ console application in Visual Studio, but use the code from this article. 

Copy the `Hydrate-Kenny_Beltrey.aac` file from the assets archive to `x64/Debug` under the project's directory.

Run the application in Visual Studio. 
