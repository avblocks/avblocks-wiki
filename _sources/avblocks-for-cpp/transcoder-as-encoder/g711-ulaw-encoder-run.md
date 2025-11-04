---
title: G.711 μ-law Encoder (Run)
html_meta:
    description: This article explains how you can use Transcoder to encode a WAV file to G.711 μ-law compressed audio format.
taxonomy:
    category: docs
---

# G.711 μ-law Encoder (Run)

This article explains how you can use [Transcoder::run](https://doc.avblocks.com/core/latest/classprimo_1_1avblocks_1_1_transcoder.html#a31cbef423193a454b2634083cfb9b5cb) to encode a WAV file to G.711 μ-law compressed audio format.

The code snippets in this article are from the [enc_g711_ulaw_file](https://github.com/avblocks/avblocks-cpp/tree/main/samples/darwin/enc_g711_ulaw_file) macOS sample.

## Source Audio

For source we use the `express-dictate_8000_s16_1ch_pcm.wav` file from the [AVBlocks Assets](https://github.com/avblocks/avblocks-assets/releases) repository. After downloading and unzipping you will find `express-dictate_8000_s16_1ch_pcm.wav` in the `aud` subdirectory.

## Code

This code takes a WAV file and encodes it to compressed G.711 μ-law format.

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

### Configure Output Socket

The output socket defines where and how the encoded audio data will be written. In this case, we're configuring it to output a G.711 μ-law WAV file. The socket represents the output destination, while the pin represents the specific audio stream within that destination. The AudioStreamInfo object specifies the audio format parameters - G.711 μ-law typically uses 8000 Hz sample rate and mono channel, which are set explicitly in this example.

``` cpp
primo::ref<MediaSocket> createOutputSocket(Options& opt)
{
    // create stream info to describe the output audio stream
    auto asi = primo::make_ref(Library::createAudioStreamInfo());
    asi->setStreamType(StreamType::MULAW_PCM);

    // G.711 μ-law typically uses 8000 Hz sample rate and mono channel
    // These will be inherited from input if not explicitly set
    asi->setSampleRate(8000);
    asi->setChannels(1);

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

### Configure Transcoder and Encode

This is the main encoding function that ties everything together. First, we create an input socket that points to the WAV file we want to encode. Then we create the output socket using our helper function. The transcoder is the core component that performs the actual encoding - it takes the uncompressed PCM data from the input and converts it to compressed G.711 μ-law data for the output.

The `setAllowDemoMode(true)` call allows the transcoder to work even without a valid license (useful for testing, but not recommended for production). We then add our input and output sockets to the transcoder, open it to prepare for processing, run the actual transcoding operation, and finally close it to clean up.

``` cpp
bool encode(Options& opt)
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

Here's the complete working example that demonstrates G.711 μ-law encoding using AVBlocks. This code combines all the previous snippets into a functional program that can be compiled and run. The main function handles command-line argument parsing, initializes AVBlocks, performs the encoding operation, and properly shuts down the library before exiting.

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
    asi->setStreamType(StreamType::MULAW_PCM);

    // G.711 μ-law typically uses 8000 Hz sample rate and mono channel
    // These will be inherited from input if not explicitly set
    asi->setSampleRate(8000);
    asi->setChannels(1);

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

bool encode(Options& opt)
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
    
    bool result = encode(opt);
    
    Library::shutdown();
    
    return result ? 0 : 1;
}
```

## How to Run

See the [build instructions](https://github.com/avblocks/avblocks-cpp/blob/main/docs/build-mac.md) for macOS and the [enc_g711_ulaw_file](https://github.com/avblocks/avblocks-cpp/tree/main/samples/darwin/enc_g711_ulaw_file) example for details.

### Command Line

```sh
./enc_g711_ulaw_file --input <wav file> --output <g711 ulaw wav file>
```

### Examples

List options:

```sh
./bin/x64/enc_g711_ulaw_file --help

Usage: enc_g711_ulaw_file --input <wav file> --output <g711 ulaw wav file>
  -h,    --help
  -i,    --input    input WAV file
  -o,    --output   output G.711 μ-law WAV file
```

The following example encodes input file `./assets/aud/express-dictate_8000_s16_1ch_pcm.wav` into output file `express-dictate_g711_ulaw.wav`:

```sh
mkdir -p ./output/enc_g711_ulaw_file

./bin/x64/enc_g711_ulaw_file \
    --input ./assets/aud/express-dictate_8000_s16_1ch_pcm.wav \
    --output ./output/enc_g711_ulaw_file/express-dictate_g711_ulaw.wav
```
