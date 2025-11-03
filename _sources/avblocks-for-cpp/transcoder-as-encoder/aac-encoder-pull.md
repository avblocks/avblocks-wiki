---
title: AAC ADTS Encoder (Pull)
html_meta:
    description: This article explains how you can use Transcoder to encode a WAV file to AAC (Advanced Audio Coding) ADTS (Audio Data Transport Stream) elementary stream using the pull method.
taxonomy:
    category: docs
---

# AAC ADTS Encoder (Pull)

This article explains how you can use [Transcoder::pull](https://doc.avblocks.com/core/latest/classprimo_1_1avblocks_1_1_transcoder.html#a8e8f8f8f8f8f8f8f8f8f8f8f8f8f8f8f) to encode a WAV file to AAC (Advanced Audio Coding) ADTS (Audio Data Transport Stream) elementary stream.

The code snippets in this article are from the [enc_aac_adts_pull](https://github.com/avblocks/avblocks-cpp/tree/main/samples/darwin/enc_aac_adts_pull) macOS sample.

## Source Audio

For source we use the `equinox-48KHz.wav` file from the [AVBlocks Assets](https://github.com/avblocks/avblocks-assets/releases) repository. After downloading and unzipping you will find `equinox-48KHz.wav` in the `aud` subdirectory.

## Code

This code takes a WAV file and encodes it to compressed AAC ADTS format using the pull method, which allows you to retrieve encoded samples one at a time.

### Initialize AVBlocks

The first step in any AVBlocks application is to initialize the library. This must be done before using any other AVBlocks functionality. The `Library::initialize()` method sets up the internal state and loads necessary codecs. Always remember to call `Library::shutdown()` at the end of your program to properly clean up resources and release any allocated memory.

``` cpp
int main(int argc, char *argv[])
{
    Options opt;

    switch (prepareOptions(opt, argc, argv))
    {
    case Command:
        return 0;
    case Error:
        return 1;
    case Parsed:
        break;
    }

    Library::initialize();

    bool result = encode(opt);

    Library::shutdown();

    return result ? 0 : 1;
}
```

### Configure Output Socket

The output socket defines the format of the encoded audio data. Unlike the run method, when using pull we don't specify an output file in the socket. Instead, we configure only the stream format and parameters. The socket represents the output format configuration, while the pin represents the specific audio stream. The AudioStreamInfo object specifies the audio format parameters - you can customize the number of channels or sampling rate by uncommenting the relevant lines.

``` cpp
primo::ref<MediaSocket> createOutputSocket(Options &opt)
{
    primo::ref<MediaSocket> socket(Library::createMediaSocket());

    socket->setStreamType(StreamType::AAC);
    socket->setStreamSubType(StreamSubType::AAC_ADTS);

    primo::ref<MediaPin> pin(Library::createMediaPin());
    socket->pins()->add(pin.get());

    primo::ref<AudioStreamInfo> asi(Library::createAudioStreamInfo());
    pin->setStreamInfo(asi.get());

    asi->setStreamType(StreamType::AAC);
    asi->setStreamSubType(StreamSubType::AAC_ADTS);

    // You can change the sampling rate and the number of the channels
    // asi->setChannels(1);
    // asi->setSampleRate(44100);

    return socket;
}
```

### Configure Transcoder and Encode with Pull

This is the main encoding function that uses the pull method to retrieve encoded samples. The pull method allows you to control when and how encoded data is retrieved, giving you more flexibility in processing. The transcoder reads from the input WAV file and encodes it to AAC ADTS format, but instead of writing directly to a file, it provides the encoded samples through the `pull()` method.

The `setAllowDemoMode(true)` call allows the transcoder to work even without a valid license (useful for testing, but not recommended for production). After opening the transcoder, we continuously pull encoded samples and write them to the output file. The pull loop continues until the transcoder returns false, which happens when all input has been processed.

The function checks the error code to determine if the encoding completed successfully (EOS - End of Stream) or if an actual error occurred.

``` cpp
bool encode(Options &opt)
{
    // transcoder will fail if output exists (by design)
    deleteFile(primo::ustring(opt.outputFile));

    std::ofstream outfile(opt.outputFile, ios_base::binary);
    if (!outfile.is_open())
    {
        cout << "Could not open file " << opt.outputFile << endl;
        return false;
    }

    // create input socket
    primo::ref<MediaSocket> inSocket(Library::createMediaSocket());
    inSocket->setFile(primo::ustring(opt.inputFile));

    // create output socket
    primo::ref<MediaSocket> outSocket(createOutputSocket(opt));

    // create transcoder
    primo::ref<Transcoder> transcoder(Library::createTranscoder());
    transcoder->setAllowDemoMode(true);
    transcoder->inputs()->add(inSocket.get());
    transcoder->outputs()->add(outSocket.get());

    if (!transcoder->open())
    {
        printError("Transcoder::open", transcoder->error());
        return false;
    }

    // encode by pulling encoded samples
    int32_t outputIndex = 0;
    primo::ref<MediaSample> sample(Library::createMediaSample());
    while (transcoder->pull(outputIndex, sample.get()))
    {
        outfile.write((const char *)sample->buffer()->data(), sample->buffer()->dataSize());
    }

    const primo::error::ErrorInfo *error = transcoder->error();
    printError("Transcoder::pull", error);

    bool success = false;
    if ((error->facility() == primo::error::ErrorFacility::Codec) &&
        (error->code() == primo::codecs::CodecError::EOS))
    {
        // ok
        success = true;
    }

    transcoder->close();

    return success;
}
```

### Complete C++ Code

Here's the complete working example that demonstrates AAC ADTS encoding using the pull method. This code combines all the previous snippets into a functional program that can be compiled and run. The main function handles command-line argument parsing, initializes AVBlocks, performs the encoding operation using pull, and properly shuts down the library before exiting.

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

primo::ref<MediaSocket> createOutputSocket(Options &opt)
{
    primo::ref<MediaSocket> socket(Library::createMediaSocket());

    socket->setStreamType(StreamType::AAC);
    socket->setStreamSubType(StreamSubType::AAC_ADTS);

    primo::ref<MediaPin> pin(Library::createMediaPin());
    socket->pins()->add(pin.get());

    primo::ref<AudioStreamInfo> asi(Library::createAudioStreamInfo());
    pin->setStreamInfo(asi.get());

    asi->setStreamType(StreamType::AAC);
    asi->setStreamSubType(StreamSubType::AAC_ADTS);

    // You can change the sampling rate and the number of the channels
    // asi->setChannels(1);
    // asi->setSampleRate(44100);

    return socket;
}

bool encode(Options &opt)
{
    // transcoder will fail if output exists (by design)
    deleteFile(primo::ustring(opt.outputFile));

    std::ofstream outfile(opt.outputFile, ios_base::binary);
    if (!outfile.is_open())
    {
        cout << "Could not open file " << opt.outputFile << endl;
        return false;
    }

    // create input socket
    primo::ref<MediaSocket> inSocket(Library::createMediaSocket());
    inSocket->setFile(primo::ustring(opt.inputFile));

    // create output socket
    primo::ref<MediaSocket> outSocket(createOutputSocket(opt));

    // create transcoder
    primo::ref<Transcoder> transcoder(Library::createTranscoder());
    transcoder->setAllowDemoMode(true);
    transcoder->inputs()->add(inSocket.get());
    transcoder->outputs()->add(outSocket.get());

    if (!transcoder->open())
    {
        printError("Transcoder::open", transcoder->error());
        return false;
    }

    // encode by pulling encoded samples
    int32_t outputIndex = 0;
    primo::ref<MediaSample> sample(Library::createMediaSample());
    while (transcoder->pull(outputIndex, sample.get()))
    {
        outfile.write((const char *)sample->buffer()->data(), sample->buffer()->dataSize());
    }

    const primo::error::ErrorInfo *error = transcoder->error();
    printError("Transcoder::pull", error);

    bool success = false;
    if ((error->facility() == primo::error::ErrorFacility::Codec) &&
        (error->code() == primo::codecs::CodecError::EOS))
    {
        // ok
        success = true;
    }

    transcoder->close();

    return success;
}

int main(int argc, char *argv[])
{
    Options opt;

    switch (prepareOptions(opt, argc, argv))
    {
    case Command:
        return 0;
    case Error:
        return 1;
    case Parsed:
        break;
    }

    Library::initialize();

    bool result = encode(opt);

    Library::shutdown();

    return result ? 0 : 1;
}
```

## How to Run

See the [build instructions](https://github.com/avblocks/avblocks-cpp/blob/main/docs/build-mac.md) for macOS and the [enc_aac_adts_pull](https://github.com/avblocks/avblocks-cpp/tree/main/samples/darwin/enc_aac_adts_pull) example for details.

### Command Line

```sh
./enc_aac_adts_pull --input <wav file> --output <aac file>
```

### Examples

List options:

```sh
./bin/x64/enc_aac_adts_pull --help

Usage: enc_aac_adts_pull --input <wav file> --output <aac file>
  -h,    --help
  -i,    --input    input WAV file
  -o,    --output   output AAC file
```

The following example encodes input file `./assets/aud/equinox-48KHz.wav` into output file `equinox-48KHz.adts.aac`:

```sh
mkdir -p ./output/enc_aac_adts_pull

./bin/x64/enc_aac_adts_pull \
    --input ./assets/aud/equinox-48KHz.wav \
    --output ./output/enc_aac_adts_pull/equinox-48KHz.adts.aac
```
