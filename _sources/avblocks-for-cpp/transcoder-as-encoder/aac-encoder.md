---
title: AAC Encoder
html_meta:
    description: This article explains how you can use Transcoder to encode an AAC ADTS audio stream from raw audio frames.
taxonomy:
    category: docs
---

# AAC Encoder

This article explains how you can use [Transcoder::push](https://doc.avblocks.com/core/latest/classprimo_1_1avblocks_1_1_transcoder.html#abb8fa7942b3e84e0275c793dfbe2c3a0) to encode an AAC ADTS audio stream from raw audio frames.

## Source Audio

As audio input we use the `equinox-48KHz.wav` file from the [AVBlocks Assets](https://github.com/avblocks/avblocks-assets/releases) archive. After downloading and unzipping you will find `equinox-48KHz.wav` in the `aud` subdirectory.


## Code

This code shows how you can encode raw uncompressed audio frames into an AAC ADTS stream. Two Transcoder objects are used, one to read the raw LPCM frames from a file, and another to encode the raw frames to AAC ADTS stream. The encoding is done via the `Transcoder::push` method.   

### Windows

#### Initialize AVBlocks

``` cpp
void encode_aac_adts_stream()
{
    Library::initialize();

    auto inputFile = primo::ustring("equinox-48KHz.wav");
    auto outputFile = primo::ustring("equinox-48KHz.aac");

    encode_aac_adts_stream(inputFile, outputFile);

    Library::shutdown();
}
```

#### Configure Audio Reader Transcoder

``` cpp
p::ref<Transcoder> create_lpcm_source(const char_t* inputFile)
{
    // Create MediaSocket describing the WAV input using MediaInfo
    p::ref<MediaInfo> mediaInfo(Library::createMediaInfo());
    mediaInfo->inputs()->at(0)->setFile(inputFile);

    if (!mediaInfo->open())
        throw std::runtime_error(std::string("Could not parse {}.") + primo::ustring(inputFile).str());

    p::ref<MediaSocket> inputSocket(Library::createMediaSocket(mediaInfo.get()));

    mediaInfo->close();

    // Create AudioStreamInfo, MediaPin, and MediaSocket describing the LPCM output
    // This is the same as the input, but no output file is set on the MediaSocket, 
    // because we want to pull frames one by one using Transcoder::pull

    // AudioStreamInfo
    p::ref<AudioStreamInfo> pcmAudio(Library::createAudioStreamInfo());
    pcmAudio->setStreamType(StreamType::LPCM);
    pcmAudio->setChannels(2);
    pcmAudio->setSampleRate(48000);
    pcmAudio->setBitsPerSample(16);

    // MediaPin
    p::ref<MediaPin> outputPin(Library::createMediaPin());
    outputPin->setStreamInfo(pcmAudio.get());

    // MediaSocket
    p::ref<MediaSocket> outputSocket(Library::createMediaSocket());
    outputSocket->setStreamType(StreamType::LPCM);
    outputSocket->pins()->add(outputPin.get());

    // Create Transcoder
    p::ref<Transcoder> wavReader(Library::createTranscoder());
    wavReader->inputs()->add(inputSocket.get());
    wavReader->outputs()->add(outputSocket.get());

    return wavReader;
}
```

#### Configure AAC Encoder Transcoder

``` cpp
p::ref<Transcoder> create_aac_encoder(const char_t* outputFile)
{
    // Create AudioStreamInfo, MediaPin, and MediaSocket describing the LPCM input

    // AudioStreamInfo
    p::ref<AudioStreamInfo> pcmAudio(Library::createAudioStreamInfo());
    pcmAudio->setStreamType(StreamType::LPCM);
    pcmAudio->setSampleRate(48000);
    pcmAudio->setChannels(2);
    pcmAudio->setBitsPerSample(16);
    pcmAudio->setBytesPerFrame((pcmAudio->bitsPerSample() / 8) * pcmAudio->channels());

    // MediaPin
    p::ref<MediaPin> inputPin(Library::createMediaPin());
    inputPin->setStreamInfo(pcmAudio.get());

    // MediaSocket
    p::ref<MediaSocket> inputSocket(Library::createMediaSocket());
    inputSocket->setStreamType(StreamType::LPCM);
    inputSocket->pins()->add(inputPin.get());

    // Create AudioStreamInfo, MediaPin, and MediaSocket describing the AAC / M4A output

    // AudioStreamInfo
    p::ref<AudioStreamInfo> aacAdtsAudio(Library::createAudioStreamInfo());
    aacAdtsAudio->setStreamType(StreamType::AAC);
    aacAdtsAudio->setStreamSubType(StreamSubType::AAC_ADTS);
    aacAdtsAudio->setChannels(2);
    aacAdtsAudio->setSampleRate(48000);
    aacAdtsAudio->setBitsPerSample(16);

    // MediaPin
    p::ref<MediaPin> outputPin(Library::createMediaPin());
    outputPin->setStreamInfo(aacAdtsAudio.get());

    // MediaSocket
    p::ref<MediaSocket> outputSocket(Library::createMediaSocket());
    outputSocket->setStreamType(StreamType::AAC);
    outputSocket->setStreamSubType(StreamSubType::AAC_ADTS);
    outputSocket->setFile(outputFile);

    outputSocket->pins()->add(outputPin.get());

    // Transcoder
    p::ref<Transcoder> aacEncoder(Library::createTranscoder());
    aacEncoder->inputs()->add(inputSocket.get());
    aacEncoder->outputs()->add(outputSocket.get());

    return aacEncoder;
}
```

#### Open Transcoders

``` cpp
void encode_aac_adts_stream(const char_t* inputFile, const char_t* outputFile)
{
    // Create a reader to simulate raw audio frames. In reality you will likely
    // have a different raw audio source like for example some kind of audio capture device.
    p::ref<Transcoder> lpcmReader = create_lpcm_source(inputFile);

    // Create an AAC encoder. We will pass the raw audio frames to it to encode them as AAC / ADTS stream
    p::ref<Transcoder> aacEncoder = create_aac_encoder(outputFile);
    if (lpcmReader->open())
    {
        if (aacEncoder->open())
        {
            encode_aac_adts_stream(lpcmReader.get(), aacEncoder.get());

            aacEncoder->close();
        }

        lpcmReader->close();
    }
}
```

#### Call Transcoder::pull and Transcoder::push

``` cpp
void encode_aac_adts_stream(Transcoder* lpcmReader, Transcoder* aacEncoder)
{
    int32_t inputIndex = 0;
    p::ref<MediaSample> audioFrame(Library::createMediaSample());

    while (true)
    {
        // Simulate a raw frame
        // Each call to Transcoder::pull returns one audio frame.
        if (!lpcmReader->pull(inputIndex, audioFrame.get()))
            break;

        // Pass the raw audio frame to Transcoder::push to encode it as AAC / ADTS
        if (!aacEncoder->push(0, audioFrame.get()))
            break;
    }

    aacEncoder->flush();
}
```

#### Complete C++ Code

``` cpp
#include <primo/avblocks/avb.h>
#include <primo/platform/reference++.h>
#include <primo/platform/ustring.h>

// link with AVBlocks64.lib
#pragma comment(lib, "./avblocks/lib/x64/AVBlocks64.lib")

#include <stdexcept>
#include <string>
#include <iostream>

namespace p = primo;

using namespace p::codecs;
using namespace p::avblocks;

p::ref<Transcoder> create_lpcm_source(const char_t* inputFile)
{
    // Create MediaSocket describing the WAV input using MediaInfo
    p::ref<MediaInfo> mediaInfo(Library::createMediaInfo());
    mediaInfo->inputs()->at(0)->setFile(inputFile);

    if (!mediaInfo->open())
        throw std::runtime_error(std::string("Could not parse {}.") + primo::ustring(inputFile).str());

    p::ref<MediaSocket> inputSocket(Library::createMediaSocket(mediaInfo.get()));

    mediaInfo->close();

    // Create AudioStreamInfo, MediaPin, and MediaSocket describing the LPCM output
    // This is the same as the input, but no output file is set on the MediaSocket, 
    // because we want to pull frames one by one using Transcoder::pull

    // AudioStreamInfo
    p::ref<AudioStreamInfo> pcmAudio(Library::createAudioStreamInfo());
    pcmAudio->setStreamType(StreamType::LPCM);
    pcmAudio->setChannels(2);
    pcmAudio->setSampleRate(48000);
    pcmAudio->setBitsPerSample(16);

    // MediaPin
    p::ref<MediaPin> outputPin(Library::createMediaPin());
    outputPin->setStreamInfo(pcmAudio.get());

    // MediaSocket
    p::ref<MediaSocket> outputSocket(Library::createMediaSocket());
    outputSocket->setStreamType(StreamType::LPCM);
    outputSocket->pins()->add(outputPin.get());

    // Create Transcoder
    p::ref<Transcoder> wavReader(Library::createTranscoder());
    wavReader->inputs()->add(inputSocket.get());
    wavReader->outputs()->add(outputSocket.get());

    return wavReader;
}

p::ref<Transcoder> create_aac_encoder(const char_t* outputFile)
{
    // Create AudioStreamInfo, MediaPin, and MediaSocket describing the LPCM input

    // AudioStreamInfo
    p::ref<AudioStreamInfo> pcmAudio(Library::createAudioStreamInfo());
    pcmAudio->setStreamType(StreamType::LPCM);
    pcmAudio->setSampleRate(48000);
    pcmAudio->setChannels(2);
    pcmAudio->setBitsPerSample(16);
    pcmAudio->setBytesPerFrame((pcmAudio->bitsPerSample() / 8) * pcmAudio->channels());

    // MediaPin
    p::ref<MediaPin> inputPin(Library::createMediaPin());
    inputPin->setStreamInfo(pcmAudio.get());

    // MediaSocket
    p::ref<MediaSocket> inputSocket(Library::createMediaSocket());
    inputSocket->setStreamType(StreamType::LPCM);
    inputSocket->pins()->add(inputPin.get());

    // Create AudioStreamInfo, MediaPin, and MediaSocket describing the AAC / M4A output

    // AudioStreamInfo
    p::ref<AudioStreamInfo> aacAdtsAudio(Library::createAudioStreamInfo());
    aacAdtsAudio->setStreamType(StreamType::AAC);
    aacAdtsAudio->setStreamSubType(StreamSubType::AAC_ADTS);
    aacAdtsAudio->setChannels(2);
    aacAdtsAudio->setSampleRate(48000);
    aacAdtsAudio->setBitsPerSample(16);

    // MediaPin
    p::ref<MediaPin> outputPin(Library::createMediaPin());
    outputPin->setStreamInfo(aacAdtsAudio.get());

    // MediaSocket
    p::ref<MediaSocket> outputSocket(Library::createMediaSocket());
    outputSocket->setStreamType(StreamType::AAC);
    outputSocket->setStreamSubType(StreamSubType::AAC_ADTS);
    outputSocket->setFile(outputFile);

    outputSocket->pins()->add(outputPin.get());

    // Transcoder
    p::ref<Transcoder> aacEncoder(Library::createTranscoder());
    aacEncoder->inputs()->add(inputSocket.get());
    aacEncoder->outputs()->add(outputSocket.get());

    return aacEncoder;
}

void encode_aac_adts_stream(Transcoder* lpcmReader, Transcoder* aacEncoder)
{
    int32_t inputIndex = 0;
    p::ref<MediaSample> audioFrame(Library::createMediaSample());

    while (true)
    {
        // Simulate a raw frame
        // Each call to Transcoder::pull returns one audio frame.
        if (!lpcmReader->pull(inputIndex, audioFrame.get()))
            break;

        // Pass the raw audio frame to Transcoder::push to encode it as AAC / ADTS
        if (!aacEncoder->push(0, audioFrame.get()))
            break;
    }

    aacEncoder->flush();
}

void encode_aac_adts_stream(const char_t* inputFile, const char_t* outputFile)
{
    // Create a reader to simulate raw audio frames. In reality you will likely
    // have a different raw audio source like for example some kind of audio capture device.
    p::ref<Transcoder> lpcmReader = create_lpcm_source(inputFile);

    // Create an AAC encoder. We will pass the raw audio frames to it to encode them as AAC / ADTS stream
    p::ref<Transcoder> aacEncoder = create_aac_encoder(outputFile);
    if (lpcmReader->open())
    {
        if (aacEncoder->open())
        {
            encode_aac_adts_stream(lpcmReader.get(), aacEncoder.get());

            aacEncoder->close();
        }

        lpcmReader->close();
    }
}

void encode_aac_adts_stream()
{
    Library::initialize();

    auto inputFile = primo::ustring("equinox-48KHz.wav");
    auto outputFile = primo::ustring("equinox-48KHz.aac");

    encode_aac_adts_stream(inputFile, outputFile);

    Library::shutdown();
}

int main(int argc, const char* argv[]) {
    encode_aac_adts_stream();
    return 0;
}
```

#### How to run

[Create a C++ console application ](../getting-started-windows/create-a-c-plus-console-app-in-visual-studio) in Visual Studio and use the code from this article. 

Copy the `equinox-48KHz.wav` file from the assets archive to project directory.

Run the application in Visual Studio. 
