---
title: MP3 Decoder (Run)
html_meta:
    description: This article explains how you can use Transcoder to decode an MP3 elementary stream.
taxonomy:
    category: docs
---

# MP3 Decoder (Run)

This article explains how you can use [Transcoder::run](https://doc.avblocks.com/core/latest/classprimo_1_1avblocks_1_1_transcoder.html#a31cbef423193a454b2634083cfb9b5cb) to decode an MP3 elementary stream.

The code snippets in this article are from the [dec_mp3_file](https://github.com/avblocks/avblocks-cpp/tree/main/samples/darwin/dec_mp3_file) macOS sample.

## Source Audio

For source we use the `Hydrate-Kenny_Beltrey.mp3` file from the [AVBlocks Assets](https://github.com/avblocks/avblocks-assets/releases) repository. After downloading and unzipping you will find `Hydrate-Kenny_Beltrey.mp3` in the `aud` subdirectory.

## Code

This code takes an MP3 file and decodes it to uncompressed LPCM WAV file.

### Initialize AVBlocks

The first step in any AVBlocks application is to initialize the library. This must be done before using any other AVBlocks functionality. The `Library::initialize()` method sets up the internal state and loads necessary codecs. Always remember to call `Library::shutdown()` at the end of your program to properly clean up resources and release any allocated memory.

``` cpp
int main(int argc, char* argv[])
{
    Library::initialize();

    bool result = decode(opt);

    Library::shutdown();

    return result ? 0 : 1;
}
```

### Configure Output Socket

The output socket defines where and how the decoded audio data will be written. In this case, we're configuring it to output a WAV file with LPCM (Linear Pulse Code Modulation) format. The socket represents the output destination, while the pin represents the specific audio stream within that destination. The AudioStreamInfo object specifies the audio format parameters - you can customize the number of channels or sampling rate by uncommenting the relevant lines.

``` cpp
primo::ref<MediaSocket> createOutputSocket(Options& opt)
{
    auto socket = primo::make_ref(Library::createMediaSocket());
    socket->setFile(primo::ustring(opt.outputFile));
    socket->setStreamType(StreamType::WAVE);

    auto pin = primo::make_ref(Library::createMediaPin());
    socket->pins()->add(pin.get());

    auto asi = primo::make_ref(Library::createAudioStreamInfo());
    pin->setStreamInfo(asi.get());

    asi->setStreamType(StreamType::LPCM);

    // You can change the number of the channels
    //asi->setChannels(1);
    
    // or the sampling rate and
    //asi->setSampleRate(44100);

    return socket;
}
```

### Configure Transcoder and Decode

This is the main decoding function that ties everything together. First, we create an input socket that points to the MP3 file we want to decode. Then we create the output socket using our helper function. The transcoder is the core component that performs the actual decoding - it takes the compressed MP3 data from the input and converts it to uncompressed LPCM data for the output. 

The `setAllowDemoMode(TRUE)` call allows the transcoder to work even without a valid license (useful for testing, but not recommended for production). We then add our input and output sockets to the transcoder, open it to prepare for processing, run the actual transcoding operation, and finally close it to clean up.

``` cpp
bool decode(Options& opt)
{
    primo::ref<MediaSocket> inSocket(Library::createMediaSocket());
    inSocket->setFile(primo::ustring(opt.inputFile));

    // create output socket
    auto outSocket = createOutputSocket(opt);

    // create transcoder
    auto transcoder = primo::make_ref(Library::createTranscoder());
    
    // Continue to work even when license is invalid 
    // This is not recommended in production
    transcoder->setAllowDemoMode(TRUE);
    
    transcoder->inputs()->add(inSocket.get());
    transcoder->outputs()->add(outSocket.get());

    // transcoder will fail if output exists (by design)
    deleteFile(opt.outputFile.c_str());

    if (!transcoder->open())
    {
        printError("Transcoder open", transcoder->error());
        return false;
    }

    if (!transcoder->run())
    {
        printError("Transcoder run", transcoder->error());

        transcoder->close();
        return false;
    }

    transcoder->close();
    return true;
}
```

### Complete C++ Code

Here's the complete working example that demonstrates MP3 decoding using AVBlocks. This code combines all the previous snippets into a functional program that can be compiled and run. The main function handles command-line argument parsing, initializes AVBlocks, performs the decoding operation, and properly shuts down the library before exiting.

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

#include <memory.h>

using namespace primo::codecs;
using namespace primo::avblocks;
using namespace std;

primo::ref<MediaSocket> createOutputSocket(Options& opt)
{
    auto socket = primo::make_ref(Library::createMediaSocket());
    socket->setFile(primo::ustring(opt.outputFile));
    socket->setStreamType(StreamType::WAVE);

    auto pin = primo::make_ref(Library::createMediaPin());
    socket->pins()->add(pin.get());

    auto asi = primo::make_ref(Library::createAudioStreamInfo());
    pin->setStreamInfo(asi.get());

    asi->setStreamType(StreamType::LPCM);

    // You can change the number of the channels
    //asi->setChannels(1);
    
    // or the sampling rate and
    //asi->setSampleRate(44100);

    return socket;
}

bool decode(Options& opt)
{
    primo::ref<MediaSocket> inSocket(Library::createMediaSocket());
    inSocket->setFile(primo::ustring(opt.inputFile));

    // create output socket
    auto outSocket = createOutputSocket(opt);

    // create transcoder
    auto transcoder = primo::make_ref(Library::createTranscoder());
    
    // Continue to work even when license is invalid 
    // This is not recommended in production
    transcoder->setAllowDemoMode(TRUE);
    
    transcoder->inputs()->add(inSocket.get());
    transcoder->outputs()->add(outSocket.get());

    // transcoder will fail if output exists (by design)
    deleteFile(opt.outputFile.c_str());

    if (!transcoder->open())
    {
        printError("Transcoder open", transcoder->error());
        return false;
    }

    if (!transcoder->run())
    {
        printError("Transcoder run", transcoder->error());

        transcoder->close();
        return false;
    }

    transcoder->close();
    return true;
}

int main(int argc, char* argv[])
{
    Options opt;

    switch(prepareOptions( opt, argc, argv))
    {
        case Command: return 0;
        case Error: return 1;
        case Parsed: break;
    }

    Library::initialize();

    bool result = decode(opt);

    Library::shutdown();

    return result ? 0 : 1;
}
```