---
title: AAC ADTS Encoder (Run)
html_meta:
    description: This article explains how you can use Transcoder to encode a WAV file to AAC (Advanced Audio Coding) ADTS (Audio Data Transport Stream) elementary stream.
taxonomy:
    category: docs
---

# AAC ADTS Encoder (Run)

This article explains how you can use [Transcoder::run](https://doc.avblocks.com/core/latest/classprimo_1_1avblocks_1_1_transcoder.html#a31cbef423193a454b2634083cfb9b5cb) to encode a WAV file to AAC (Advanced Audio Coding) ADTS (Audio Data Transport Stream) elementary stream.

The code snippets in this article are from the [enc_aac_adts_file](https://github.com/avblocks/avblocks-cpp/tree/main/samples/darwin/enc_aac_adts_file) macOS sample.

## Source Audio

For source we use the `equinox-48KHz.wav` file from the [AVBlocks Assets](https://github.com/avblocks/avblocks-assets/releases) repository. After downloading and unzipping you will find `equinox-48KHz.wav` in the `aud` subdirectory.

## Code

This code takes a WAV file and encodes it to compressed AAC ADTS format.

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

The output socket defines where and how the encoded audio data will be written. In this case, we're configuring it to output an AAC file with ADTS (Audio Data Transport Stream) format. The socket represents the output destination, while the pin represents the specific audio stream within that destination. The AudioStreamInfo object specifies the audio format parameters - you can customize the number of channels or sampling rate by uncommenting the relevant lines.

``` cpp
primo::ref<MediaSocket> createOutputSocket(Options& opt)
{
    // create stream info to describe the output audio stream
    auto asi = primo::make_ref(Library::createAudioStreamInfo());
    asi->setStreamType(StreamType::AAC);
    asi->setStreamSubType(StreamSubType::AAC_ADTS);

    // You can change the sampling rate and the number of the channels
    // asi->setSampleRate(44100);
    // asi->setChannels(1);

    // create a pin using the stream info 
    auto pin = primo::make_ref(Library::createMediaPin());
    pin->setStreamInfo(asi.get());

    // finally create a socket for the output container format 
    // which in this cases is is AAC packaged as Audio Data Transport Stream (ATDS)
    auto socket = primo::make_ref(Library::createMediaSocket());
    socket->setStreamType(StreamType::AAC);
    socket->setStreamSubType(StreamSubType::AAC_ADTS);

    socket->pins()->add(pin.get());

    // output to a file
    auto output_file = primo::ustring(opt.outputFile);
    socket->setFile(output_file);
    
    return socket;
}
```

### Configure Transcoder and Encode

This is the main encoding function that ties everything together. First, we create an input socket that points to the WAV file we want to encode. Then we create the output socket using our helper function. The transcoder is the core component that performs the actual encoding - it takes the uncompressed LPCM data from the input and converts it to compressed AAC data for the output.

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

Here's the complete working example that demonstrates AAC ADTS encoding using AVBlocks. This code combines all the previous snippets into a functional program that can be compiled and run. The main function handles command-line argument parsing, initializes AVBlocks, performs the encoding operation, and properly shuts down the library before exiting.

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
    asi->setStreamType(StreamType::AAC);
    asi->setStreamSubType(StreamSubType::AAC_ADTS);

    // You can change the sampling rate and the number of the channels
    // asi->setSampleRate(44100);
    // asi->setChannels(1);

    // create a pin using the stream info 
    auto pin = primo::make_ref(Library::createMediaPin());
    pin->setStreamInfo(asi.get());

    // finally create a socket for the output container format 
    // which in this cases is is AAC packaged as Audio Data Transport Stream (ATDS)
    auto socket = primo::make_ref(Library::createMediaSocket());
    socket->setStreamType(StreamType::AAC);
    socket->setStreamSubType(StreamSubType::AAC_ADTS);

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

See the [build instructions](https://github.com/avblocks/avblocks-cpp/blob/main/docs/build-mac.md) for macOS and the [enc_aac_adts_file](https://github.com/avblocks/avblocks-cpp/tree/main/samples/darwin/enc_aac_adts_file) example for details.

### Command Line

```sh
./enc_aac_adts_file --input <wav file> --output <aac file>
```

### Examples

List options:

```sh
./bin/x64/enc_aac_adts_file --help

Usage: enc_aac_adts_file --input <wav file> --output <aac file>
  -h,    --help
  -i,    --input    input WAV file
  -o,    --output   output AAC file
```

The following example encodes input file `./assets/aud/equinox-48KHz.wav` into output file `equinox-48KHz.adts.aac`:

```sh
mkdir -p ./output/enc_aac_adts_file

./bin/x64/enc_aac_adts_file \
    --input ./assets/aud/equinox-48KHz.wav \
    --output ./output/enc_aac_adts_file/equinox-48KHz.adts.aac
```
