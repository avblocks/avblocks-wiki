---
title: MP3 Encoder (Push)
html_meta:
    description: This article explains how you can use Transcoder to encode an MP3 audio stream from raw audio frames.
taxonomy:
    category: docs
---

# MP3 Encoder (Push)

This article explains how you can use [Transcoder::push](https://doc.avblocks.com/core/latest/classprimo_1_1avblocks_1_1_transcoder.html#abb8fa7942b3e84e0275c793dfbe2c3a0) to encode an MP3 audio stream from raw audio frames.

The code snippets in this article are from the [enc_mp3_push](https://github.com/avblocks/avblocks-cpp/tree/main/samples/darwin/enc_mp3_push) sample.

## Source Audio

As audio input we use the `equinox-48KHz.wav` file from the [AVBlocks Assets](https://github.com/avblocks/avblocks-assets/releases) archive. After downloading and unzipping you will find `equinox-48KHz.wav` in the `aud` subdirectory.

## Code

This code shows how you can encode raw uncompressed audio frames into an MP3 stream. Two Transcoder objects are used, one to read the raw LPCM frames from a file, and another to encode the raw frames to MP3 stream. The encoding is done via the `Transcoder::push` method.

### Initialize AVBlocks

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
    
    bool result = encode(opt);
    
    Library::shutdown();
    
    return result ? 0 : 1;
}
```

### Configure Input Socket

The input socket defines the format of the raw LPCM audio frames that will be fed to the MP3 encoder. This socket describes uncompressed 16-bit stereo audio at 48 kHz sample rate. The socket represents the input source, while the pin represents the specific audio stream within that source. The AudioStreamInfo object specifies the audio format parameters that the encoder expects to receive.

``` cpp
primo::ref<MediaSocket> createInputSocket()
{
    auto socket = primo::make_ref(Library::createMediaSocket());
    socket->setStreamType(StreamType::LPCM);

    auto pin = primo::make_ref(Library::createMediaPin());
    auto asi = primo::make_ref(Library::createAudioStreamInfo());
    asi->setStreamType(StreamType::LPCM);
    asi->setChannels(2);
    asi->setSampleRate(48000);
    asi->setBitsPerSample(16);
    
    pin->setStreamInfo(asi.get());
    socket->pins()->add(pin.get());

    return socket;
}
```

### Configure Output Socket

The output socket defines where and how the encoded MP3 data will be written. This function sets up the MP3 encoding parameters including the output file location, audio format, and encoding options. You can customize the bitrate, sample rate, channels, and stereo mode by uncommenting the relevant lines. The socket represents the output destination, while the pin represents the specific MP3 stream within that destination.

``` cpp
primo::ref<MediaSocket> createOutputSocket(Options& opt)
{
    // create stream info to describe the output audio stream
    auto asi = primo::make_ref(Library::createAudioStreamInfo());
    asi->setStreamType(StreamType::MPEG_Audio);
    asi->setStreamSubType(StreamSubType::MPEG_Audio_Layer3);

    // The default bitrate is 128000. You can set it to 192000, 256000, etc.
    // asi->setBitrate(192000);

    // Optionally set the sampling rate and the number of the channels, e.g. 44.1 Khz, Mono 
    // asi->setSampleRate(44100);
    // asi->setChannels(1);

    // create a pin using the stream info 
    auto pin = primo::make_ref(Library::createMediaPin());
    pin->setStreamInfo(asi.get());

    // the pin allows you to specify additional parameters for the encoder 
    // for example, change the stereo mode, e.g. Joint Stereo
    // pin->params()->addInt(Param::Encoder::Audio::MPEG1::StereoMode, StereoMode::Joint);

    // finally create a socket for the output container format which is MP3 in this case
    auto socket = primo::make_ref(Library::createMediaSocket());
    socket->setStreamType(StreamType::MPEG_Audio);
    socket->setStreamSubType(StreamSubType::MPEG_Audio_Layer3);
    socket->setFile(primo::ustring(opt.outputFile));

    socket->pins()->add(pin.get());

    return socket;
}
```

### Configure WAV Reader

This function creates a transcoder that reads WAV files and outputs raw LPCM audio frames. In a real-world scenario, you might have a different audio source like an audio capture device or streaming input. The WAV reader transcoder converts the compressed or container-wrapped audio in the WAV file into raw PCM samples that can be fed to the MP3 encoder. The `setAllowDemoMode(true)` call allows the transcoder to work without a valid license for testing purposes.

``` cpp
primo::ref<Transcoder> createWavReader(const std::string& inputFile)
{
    auto wavReader = primo::make_ref(Library::createTranscoder());
    wavReader->setAllowDemoMode(true);
    
    auto wavInputSocket = primo::make_ref(Library::createMediaSocket());
    wavInputSocket->setFile(primo::ustring(inputFile));
    wavReader->inputs()->add(wavInputSocket.get());
    
    auto pcmOutputSocket = primo::make_ref(Library::createMediaSocket());
    pcmOutputSocket->setStreamType(StreamType::LPCM);
    auto pcmPin = primo::make_ref(Library::createMediaPin());
    auto pcmAsi = primo::make_ref(Library::createAudioStreamInfo());
    pcmAsi->setStreamType(StreamType::LPCM);
    pcmAsi->setChannels(2);
    pcmAsi->setSampleRate(48000);
    pcmAsi->setBitsPerSample(16);
    pcmPin->setStreamInfo(pcmAsi.get());
    pcmOutputSocket->pins()->add(pcmPin.get());
    wavReader->outputs()->add(pcmOutputSocket.get());
    
    return wavReader;
}
```

### Configure Transcoder and Encode

This is the main encoding function that coordinates the entire MP3 encoding process. It creates both the WAV reader (to provide raw audio frames) and the MP3 encoder (to compress those frames). The function demonstrates the push-based encoding workflow where raw PCM samples are pulled from the WAV reader and pushed to the MP3 encoder. The encoding loop continues until all audio data has been processed, with proper error handling and end-of-stream detection.

``` cpp
bool encode(Options& opt)
{
    // transcoder will fail if output exists (by design)
    deleteFile(primo::ustring(opt.outputFile));

    // Create WAV reader transcoder
    auto wavReader = createWavReader(opt.inputFile);
    if (!wavReader->open())
    {
        printError("WAV Reader open", wavReader->error());
        return false;
    }

    // Create encoder transcoder
    auto encoder = primo::make_ref(Library::createTranscoder());
    encoder->setAllowDemoMode(true);
    encoder->inputs()->add(createInputSocket().get());
    encoder->outputs()->add(createOutputSocket(opt).get());
    
    if (!encoder->open())
    {
        printError("Encoder open", encoder->error());
        wavReader->close();
        return false;
    }

    // Push encoding loop
    int32_t wavOutputIndex = 0;
    auto pcmSample = primo::make_ref(Library::createMediaSample());
    
    bool wavEos = false;
    while (!wavEos)
    {
        // Get PCM sample from WAV reader
        if (wavReader->pull(wavOutputIndex, pcmSample.get()))
        {
            // Push PCM sample to encoder
            if (!encoder->push(0, pcmSample.get()))
            {
                printError("Encoder push", encoder->error());
                wavReader->close();
                encoder->close();
                return false;
            }
        }
        else
        {
            // No more PCM data from WAV reader
            const primo::error::ErrorInfo *error = wavReader->error();
            if (error->facility() == primo::error::ErrorFacility::Codec &&
                error->code() == primo::codecs::CodecError::EOS)
            {
                // Push null to signal EOS to encoder
                encoder->push(0, nullptr);
                wavEos = true;
            }
            else
            {
                printError("WAV Reader pull", error);
                wavReader->close();
                encoder->close();
                return false;
            }
        }
    }

    wavReader->close();
    encoder->close();
    
    return true;
}
```

### Complete C++ Code

Here's the complete working example that demonstrates MP3 encoding using AVBlocks. This code combines all the previous snippets into a functional program that can be compiled and run. The main function handles command-line argument parsing, initializes AVBlocks, performs the encoding operation, and properly shuts down the library before exiting.

``` cpp
#include <primo/avblocks/avb.h>

#include <primo/platform/reference++.h>
#include <primo/platform/error_facility.h>
#include <primo/platform/ustring.h>

#include "util.h"
#include "options.h"

#include <cstdio>
#include <iostream>
#include <iomanip>
#include <fstream>
#include <string>

using namespace primo::codecs;
using namespace primo::avblocks;
using namespace std;

primo::ref<MediaSocket> createInputSocket()
{
    auto socket = primo::make_ref(Library::createMediaSocket());
    socket->setStreamType(StreamType::LPCM);

    auto pin = primo::make_ref(Library::createMediaPin());
    auto asi = primo::make_ref(Library::createAudioStreamInfo());
    asi->setStreamType(StreamType::LPCM);
    asi->setChannels(2);
    asi->setSampleRate(48000);
    asi->setBitsPerSample(16);
    
    pin->setStreamInfo(asi.get());
    socket->pins()->add(pin.get());

    return socket;
}

primo::ref<MediaSocket> createOutputSocket(Options& opt)
{
    // create stream info to describe the output audio stream
    auto asi = primo::make_ref(Library::createAudioStreamInfo());
    asi->setStreamType(StreamType::MPEG_Audio);
    asi->setStreamSubType(StreamSubType::MPEG_Audio_Layer3);

    // The default bitrate is 128000. You can set it to 192000, 256000, etc.
    // asi->setBitrate(192000);

    // Optionally set the sampling rate and the number of the channels, e.g. 44.1 Khz, Mono 
    // asi->setSampleRate(44100);
    // asi->setChannels(1);

    // create a pin using the stream info 
    auto pin = primo::make_ref(Library::createMediaPin());
    pin->setStreamInfo(asi.get());

    // the pin allows you to specify additional parameters for the encoder 
    // for example, change the stereo mode, e.g. Joint Stereo
    // pin->params()->addInt(Param::Encoder::Audio::MPEG1::StereoMode, StereoMode::Joint);

    // finally create a socket for the output container format which is MP3 in this case
    auto socket = primo::make_ref(Library::createMediaSocket());
    socket->setStreamType(StreamType::MPEG_Audio);
    socket->setStreamSubType(StreamSubType::MPEG_Audio_Layer3);
    socket->setFile(primo::ustring(opt.outputFile));

    socket->pins()->add(pin.get());

    return socket;
}

primo::ref<Transcoder> createWavReader(const std::string& inputFile)
{
    auto wavReader = primo::make_ref(Library::createTranscoder());
    wavReader->setAllowDemoMode(true);
    
    auto wavInputSocket = primo::make_ref(Library::createMediaSocket());
    wavInputSocket->setFile(primo::ustring(inputFile));
    wavReader->inputs()->add(wavInputSocket.get());
    
    auto pcmOutputSocket = primo::make_ref(Library::createMediaSocket());
    pcmOutputSocket->setStreamType(StreamType::LPCM);
    auto pcmPin = primo::make_ref(Library::createMediaPin());
    auto pcmAsi = primo::make_ref(Library::createAudioStreamInfo());
    pcmAsi->setStreamType(StreamType::LPCM);
    pcmAsi->setChannels(2);
    pcmAsi->setSampleRate(48000);
    pcmAsi->setBitsPerSample(16);
    pcmPin->setStreamInfo(pcmAsi.get());
    pcmOutputSocket->pins()->add(pcmPin.get());
    wavReader->outputs()->add(pcmOutputSocket.get());
    
    return wavReader;
}

bool encode(Options& opt)
{
    // transcoder will fail if output exists (by design)
    deleteFile(primo::ustring(opt.outputFile));

    // Create WAV reader transcoder
    auto wavReader = createWavReader(opt.inputFile);
    if (!wavReader->open())
    {
        printError("WAV Reader open", wavReader->error());
        return false;
    }

    // Create encoder transcoder
    auto encoder = primo::make_ref(Library::createTranscoder());
    encoder->setAllowDemoMode(true);
    encoder->inputs()->add(createInputSocket().get());
    encoder->outputs()->add(createOutputSocket(opt).get());
    
    if (!encoder->open())
    {
        printError("Encoder open", encoder->error());
        wavReader->close();
        return false;
    }

    // Push encoding loop
    int32_t wavOutputIndex = 0;
    auto pcmSample = primo::make_ref(Library::createMediaSample());
    
    bool wavEos = false;
    while (!wavEos)
    {
        // Get PCM sample from WAV reader
        if (wavReader->pull(wavOutputIndex, pcmSample.get()))
        {
            // Push PCM sample to encoder
            if (!encoder->push(0, pcmSample.get()))
            {
                printError("Encoder push", encoder->error());
                wavReader->close();
                encoder->close();
                return false;
            }
        }
        else
        {
            // No more PCM data from WAV reader
            const primo::error::ErrorInfo *error = wavReader->error();
            if (error->facility() == primo::error::ErrorFacility::Codec &&
                error->code() == primo::codecs::CodecError::EOS)
            {
                // Push null to signal EOS to encoder
                encoder->push(0, nullptr);
                wavEos = true;
            }
            else
            {
                printError("WAV Reader pull", error);
                wavReader->close();
                encoder->close();
                return false;
            }
        }
    }

    wavReader->close();
    encoder->close();
    
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
    
    bool result = encode(opt);
    
    Library::shutdown();
    
    return result ? 0 : 1;
}
```

## How to Run

See the [build instructions](https://github.com/avblocks/avblocks-cpp/blob/main/docs/build-mac.md) for macOS and the [enc_mp3_push](https://github.com/avblocks/avblocks-cpp/tree/main/samples/darwin/enc_mp3_push) example for details.

### Command Line

```sh
./enc_mp3_push --input <wav file> --output <mp3 file>
```

### Examples

List options:

```sh
./bin/x64/enc_mp3_push --help
Usage: enc_mp3_push --input <wav file> --output <mp3 file>
  -h,    --help
  -i,    --input    input WAV file
  -o,    --output   output MP3 file
```

The following example encodes input file `./assets/aud/equinox-48KHz.wav` into output file `equinox-48KHz.mp3`:

```sh
mkdir -p ./output/enc_mp3_push

./bin/x64/enc_mp3_push \
    --input ./assets/aud/equinox-48KHz.wav \
    --output ./output/enc_mp3_push/equinox-48KHz.mp3
```
