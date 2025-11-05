---
title: AVC / H.264 Annex B Decoder (Run)
html_meta:
    description: This article explains how you can use Transcoder to decode an AVC / H.264 Annex B elementary stream to a raw YUV video file.
taxonomy:
    category: docs
---

# AVC / H.264 Annex B Decoder (Run)

This article explains how you can use [Transcoder::run](https://doc.avblocks.com/core/latest/classprimo_1_1avblocks_1_1_transcoder.html#a31cbef423193a454b2634083cfb9b5cb) to decode an AVC / H.264 Annex B elementary stream to a raw YUV video file.

The code snippets in this article are from the [dec_avc_file](https://github.com/avblocks/avblocks-cpp/tree/main/samples/darwin/dec_avc_file) macOS sample.

## Source Video

For source we use the `foreman_qcif.h264` file from the [AVBlocks Assets](https://github.com/avblocks/avblocks-assets/releases) repository. After downloading and unzipping you will find `foreman_qcif.h264` in the `vid` subdirectory.

## Code

This code takes a compressed H.264 Annex B elementary stream file and decodes it to raw YUV video format.

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
    
    bool decodeResult = decodeAvcFile(opt);
    
    Library::shutdown();
    
    return decodeResult ? 0 : 1;
}
```

### Configure Input Socket

The input socket defines the source H.264 Annex B elementary stream. We use `MediaInfo` to automatically detect the video parameters from the input file. This is more convenient than manually specifying parameters, as `MediaInfo` reads the stream headers and extracts all necessary information about the encoded video, including resolution, frame rate, and codec settings.

``` cpp
bool decodeAvcFile(Options& opt)
{
    // transcoder will fail if output exists (by design)
    deleteFile(primo::ustring(opt.outputFile));
    
    auto mediaInfo = primo::make_ref(Library::createMediaInfo());
    mediaInfo->inputs()->at(0)->setFile(primo::ustring(opt.inputFile));
    
    if(!mediaInfo->open())
    {
        printError("MediaInfo open:", mediaInfo->error());
        return false;
    }
    
    // create input socket
    auto inputSocket = primo::make_ref(Library::createMediaSocket(mediaInfo.get()));
    
    // ...existing code...
}
```

### Configure Output Socket

The output socket defines where and how the decoded raw YUV video data will be written. We configure it to output an uncompressed YUV 4:2:0 video file. The socket represents the output destination, while the pin represents the specific video stream within that destination. By setting `ColorFormat::YUV420`, we ensure the output uses the standard YUV 4:2:0 planar format, which is the most common format for raw video and provides a good balance between quality and file size.

``` cpp
primo::ref<MediaSocket> createOutputSocket(Options& opt)
{
    auto socket = primo::make_ref(Library::createMediaSocket());
    socket->setFile(primo::ustring(opt.outputFile));
    socket->setStreamType(StreamType::UncompressedVideo);
    
    auto pin = primo::make_ref(Library::createMediaPin());
    socket->pins()->add(pin.get());
    
    auto vsi = primo::make_ref(Library::createVideoStreamInfo());
    pin->setStreamInfo(vsi.get());
    
    vsi->setStreamType(StreamType::UncompressedVideo);
    vsi->setColorFormat(ColorFormat::YUV420);
    
    return socket;
}
```

### Configure Transcoder and Decode

This is the main decoding function that ties everything together. After setting up the input socket with `MediaInfo`, we create the output socket using our helper function. The transcoder is the core component that performs the actual decoding - it takes the compressed H.264 data from the input and converts it to uncompressed YUV data for the output.

The `setAllowDemoMode(true)` call allows the transcoder to work even without a valid license (useful for testing, but not recommended for production). We then add our input and output sockets to the transcoder, open it to prepare for processing, run the actual transcoding operation, and finally close it to clean up. If any step fails, we print the error and return false.

``` cpp
bool decodeAvcFile(Options& opt)
{
    // transcoder will fail if output exists (by design)
    deleteFile(primo::ustring(opt.outputFile));
    
    auto mediaInfo = primo::make_ref(Library::createMediaInfo());
    mediaInfo->inputs()->at(0)->setFile(primo::ustring(opt.inputFile));
    
    if(!mediaInfo->open())
    {
        printError("MediaInfo open:", mediaInfo->error());
        return false;
    }
    
    // create input socket
    auto inputSocket = primo::make_ref(Library::createMediaSocket(mediaInfo.get()));
    
    // create output socket
    auto outputSocket = createOutputSocket(opt);
    
    // create transcoder
    auto transcoder = primo::make_ref(Library::createTranscoder());
    transcoder->setAllowDemoMode(true);
    transcoder->inputs()->add(inputSocket.get());
    transcoder->outputs()->add(outputSocket.get());
    
    if(!transcoder->open())
    {
        printError("Transcoder open", transcoder->error());
        return false;
    }
    
    if(!transcoder->run())
    {
        printError("Transcoder run", transcoder->error());
        return false;
    }
    
    transcoder->close();
    
    cout << "Output: " << opt.outputFile << endl;
    
    return true;
}
```

### Complete C++ Code

Here's the complete working example that demonstrates H.264 decoding using AVBlocks. This code combines all the previous snippets into a functional program that can be compiled and run. The main function handles command-line argument parsing, initializes AVBlocks, performs the decoding operation, and properly shuts down the library before exiting.

``` cpp
#include <cstdio>
#include <memory.h>

#include <iostream>
#include <iomanip>
#include <fstream>
#include <string>

#include <primo/avblocks/avb.h>

#include <primo/platform/reference++.h>
#include <primo/platform/error_facility.h>
#include <primo/platform/ustring.h>

#include "util.h"
#include "options.h"

using namespace primo::codecs;
using namespace primo::avblocks;
using namespace std;

primo::ref<MediaSocket> createOutputSocket(Options& opt)
{
    auto socket = primo::make_ref(Library::createMediaSocket());
    socket->setFile(primo::ustring(opt.outputFile));
    socket->setStreamType(StreamType::UncompressedVideo);
    
    auto pin = primo::make_ref(Library::createMediaPin());
    socket->pins()->add(pin.get());
    
    auto vsi = primo::make_ref(Library::createVideoStreamInfo());
    pin->setStreamInfo(vsi.get());
    
    vsi->setStreamType(StreamType::UncompressedVideo);
    vsi->setColorFormat(ColorFormat::YUV420);
    
    return socket;
}

bool decodeAvcFile(Options& opt)
{
    // transcoder will fail if output exists (by design)
    deleteFile(primo::ustring(opt.outputFile));
    
    auto mediaInfo = primo::make_ref(Library::createMediaInfo());
    mediaInfo->inputs()->at(0)->setFile(primo::ustring(opt.inputFile));
    
    if(!mediaInfo->open())
    {
        printError("MediaInfo open:", mediaInfo->error());
        return false;
    }
    
    // create input socket
    auto inputSocket = primo::make_ref(Library::createMediaSocket(mediaInfo.get()));
    
    // create output socket
    auto outputSocket = createOutputSocket(opt);
    
    // create transcoder
    auto transcoder = primo::make_ref(Library::createTranscoder());
    transcoder->setAllowDemoMode(true);
    transcoder->inputs()->add(inputSocket.get());
    transcoder->outputs()->add(outputSocket.get());
    
    if(!transcoder->open())
    {
        printError("Transcoder open", transcoder->error());
        return false;
    }
    
    if(!transcoder->run())
    {
        printError("Transcoder run", transcoder->error());
        return false;
    }
    
    transcoder->close();
    
    cout << "Output: " << opt.outputFile << endl;
    
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
    
    bool decodeResult = decodeAvcFile(opt);
    
    Library::shutdown();
    
    return decodeResult ? 0 : 1;
}
```

## How to Run

See the [build instructions](https://github.com/avblocks/avblocks-cpp/blob/main/docs/build-mac.md) for macOS and the [dec_avc_file](https://github.com/avblocks/avblocks-cpp/tree/main/samples/darwin/dec_avc_file) example for details.

### Command Line

```sh
./dec_avc_file --input <file.h264> --output <file.yuv>
```

### Examples

List options:

```sh
./bin/x64/dec_avc_file --help

Usage: dec_avc_file -i <h264 file> -o <yuv file>
  -h,    --help
         --input    H264 input file.
         --output   YUV output file.
```

The following example decodes input file `./assets/vid/foreman_qcif.h264` into output file `foreman_qcif.yuv`:

```sh
mkdir -p ./output/dec_avc_file

./bin/x64/dec_avc_file \
  --input ./assets/vid/foreman_qcif.h264 \
  --output ./output/dec_avc_file/foreman_qcif.yuv
```