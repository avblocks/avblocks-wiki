---
title: G.711 μ-law Decoder (Run)
html_meta:
    description: This article explains how you can use Transcoder to decode a G.711 μ-law WAV file to uncompressed PCM WAV.
taxonomy:
    category: docs
---

# G.711 μ-law Decoder (Run)

This article explains how you can use [Transcoder::run](https://doc.avblocks.com/core/latest/classprimo_1_1avblocks_1_1_transcoder.html#a31cbef423193a454b2634083cfb9b5cb) to decode a G.711 μ-law WAV file to uncompressed PCM WAV.

The code snippets in this article are from the [dec_g711_ulaw_file](https://github.com/avblocks/avblocks-cpp/tree/main/samples/darwin/dec_g711_ulaw_file) macOS sample.

## Source Audio

For source we use the `express-dictate_8000_s8_1ch_ulaw.wav` file from the [AVBlocks Assets](https://github.com/avblocks/avblocks-assets/releases) repository. After downloading and unzipping you will find `express-dictate_8000_s8_1ch_ulaw.wav` in the `aud` subdirectory.

## Code

This code takes a G.711 μ-law WAV file and decodes it to uncompressed LPCM WAV file.

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
    
    bool result = decode(opt);
    
    Library::shutdown();
    
    return result ? 0 : 1;
}
```

### Configure Output Socket

The output socket defines where and how the decoded audio data will be written. In this case, we're configuring it to output a WAV file with 16-bit LPCM (Linear Pulse Code Modulation) format. The G.711 μ-law decoder outputs audio at the same sample rate as the input (typically 8000 Hz) with mono channel configuration. The AudioStreamInfo object specifies these audio format parameters - converting from 8-bit logarithmic samples to 16-bit linear samples.

``` cpp
primo::ref<MediaSocket> createOutputSocket(Options& opt)
{
    // create stream info to describe the output audio stream
    auto asi = primo::make_ref(Library::createAudioStreamInfo());
    asi->setStreamType(StreamType::LPCM);

    // PCM output with 16-bit samples
    asi->setSampleRate(8000);
    asi->setChannels(1);
    asi->setBitsPerSample(16);

    // create a pin using the stream info 
    auto pin = primo::make_ref(Library::createMediaPin());
    pin->setStreamInfo(asi.get());

    // finally create a socket for the output container format which is WAV in this case
    auto socket = primo::make_ref(Library::createMediaSocket());
    socket->setStreamType(StreamType::WAVE);

    socket->pins()->add(pin.get());

    // output to a file
    auto output_file = primo::ustring(opt.outputFile);
    socket->setFile(output_file);

    return socket;
}
```

### Configure Transcoder and Decode

This is the main decoding function that ties everything together. First, we create an input socket that points to the G.711 μ-law WAV file we want to decode. Then we create the output socket using our helper function. The transcoder is the core component that performs the actual decoding - it takes the compressed G.711 μ-law data from the input and converts it to uncompressed LPCM data for the output.

The `setAllowDemoMode(true)` call allows the transcoder to work even without a valid license (useful for testing, but not recommended for production). We then add our input and output sockets to the transcoder, open it to prepare for processing, run the actual transcoding operation, and finally close it to clean up.

``` cpp
bool decode(Options& opt)
{
    // create input socket
    primo::ref<MediaSocket> inSocket (Library::createMediaSocket());
    inSocket->setFile(primo::ustring(opt.inputFile));
    
    // create output socket
    auto outSocket = createOutputSocket(opt);
    
    // create transcoder
    auto transcoder = primo::make_ref(Library::createTranscoder());
    transcoder->setAllowDemoMode(true);
    transcoder->inputs()->add(inSocket.get());
    transcoder->outputs()->add(outSocket.get());
    
    // transcoder will fail if output exists (by design)
    deleteFile(primo::ustring(opt.outputFile));
    
    if (!transcoder->open())
    {
        printError("Transcoder open", transcoder->error());
        return false;
    }

    if (!transcoder->run())
    {
        printError("Transcoder run", transcoder->error());
        return false;
    }

    transcoder->close();
    
    return true;
}
```

### Complete C++ Code

Here's the complete working example that demonstrates G.711 μ-law decoding using AVBlocks. This code combines all the previous snippets into a functional program that can be compiled and run. The main function handles command-line argument parsing, initializes AVBlocks, performs the decoding operation, and properly shuts down the library before exiting.

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

primo::ref<MediaSocket> createOutputSocket(Options& opt)
{
    // create stream info to describe the output audio stream
    auto asi = primo::make_ref(Library::createAudioStreamInfo());
    asi->setStreamType(StreamType::LPCM);

    // PCM output with 16-bit samples
    asi->setSampleRate(8000);
    asi->setChannels(1);
    asi->setBitsPerSample(16);

    // create a pin using the stream info 
    auto pin = primo::make_ref(Library::createMediaPin());
    pin->setStreamInfo(asi.get());

    // finally create a socket for the output container format which is WAV in this case
    auto socket = primo::make_ref(Library::createMediaSocket());
    socket->setStreamType(StreamType::WAVE);

    socket->pins()->add(pin.get());

    // output to a file
    auto output_file = primo::ustring(opt.outputFile);
    socket->setFile(output_file);

    return socket;
}

bool decode(Options& opt)
{
    // create input socket
    primo::ref<MediaSocket> inSocket (Library::createMediaSocket());
    inSocket->setFile(primo::ustring(opt.inputFile));
    
    // create output socket
    auto outSocket = createOutputSocket(opt);
    
    // create transcoder
    auto transcoder = primo::make_ref(Library::createTranscoder());
    transcoder->setAllowDemoMode(true);
    transcoder->inputs()->add(inSocket.get());
    transcoder->outputs()->add(outSocket.get());
    
    // transcoder will fail if output exists (by design)
    deleteFile(primo::ustring(opt.outputFile));
    
    if (!transcoder->open())
    {
        printError("Transcoder open", transcoder->error());
        return false;
    }

    if (!transcoder->run())
    {
        printError("Transcoder run", transcoder->error());
        return false;
    }

    transcoder->close();
    
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
    
    bool result = decode(opt);
    
    Library::shutdown();
    
    return result ? 0 : 1;
}
```

## How to Run

See the [build instructions](https://github.com/avblocks/avblocks-cpp/blob/main/docs/build-mac.md) for macOS and the [dec_g711_ulaw_file](https://github.com/avblocks/avblocks-cpp/tree/main/samples/darwin/dec_g711_ulaw_file) example for details.

### Command Line

```sh
./dec_g711_ulaw_file --input <g711 ulaw wav file> --output <wav file>
```

### Examples

List options:

```sh
./bin/x64/dec_g711_ulaw_file --help

Usage: dec_g711_ulaw_file --input <g711 ulaw wav file> --output <wav file>
  -h,    --help
  -i,    --input    input G.711 μ-law WAV file
  -o,    --output   output PCM WAV file
```

The following example decodes input file `./assets/aud/express-dictate_8000_s8_1ch_ulaw.wav` into output file `./output/dec_g711_ulaw_file/express-dictate_8000_s16_1ch_pcm.wav`:

```sh
mkdir -p ./output/dec_g711_ulaw_file

./bin/x64/dec_g711_ulaw_file \
    --input ./assets/aud/express-dictate_8000_s8_1ch_ulaw.wav \
    --output ./output/dec_g711_ulaw_file/express-dictate_8000_s16_1ch_pcm.wav
```
