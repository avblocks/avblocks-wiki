---
title: AVC / H.264 Annex B Encoder (Run)
html_meta:
    description: This article explains how you can use Transcoder to encode a raw YUV video file to AVC / H.264 Annex B elementary stream format.
taxonomy:
    category: docs
---

# AVC / H.264 Annex B Encoder (Run)

This article explains how you can use [Transcoder::run](https://doc.avblocks.com/core/latest/classprimo_1_1avblocks_1_1_transcoder.html#a31cbef423193a454b2634083cfb9b5cb) to encode a raw YUV video file to AVC / H.264 Annex B elementary stream format.

The code snippets in this article are from the [enc_avc_file](https://github.com/avblocks/avblocks-cpp/tree/main/samples/darwin/enc_avc_file) macOS sample.

## Source Video

For source we use the `foreman_qcif.yuv` file from the [AVBlocks Assets](https://github.com/avblocks/avblocks-assets/releases) repository. After downloading and unzipping you will find `foreman_qcif.yuv` in the `vid` subdirectory.

## Code

This code takes a raw YUV video file and encodes it to compressed H.264 Annex B format.

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
    
    bool encodeResult = encode(opt);
    
    Library::shutdown();
    
    return encodeResult ? 0 : 1;
}
```

### Configure Input Socket

The input socket defines the source raw YUV video data. We need to specify the video parameters including frame dimensions, frame rate, color format, and scan type. These parameters must match the actual properties of the input YUV file. In this example, we're reading QCIF resolution (176x144) YUV 4:2:0 progressive video at 30 frames per second.

``` cpp
primo::ref<MediaSocket> createInputSocket(Options& opt)
{
    auto socket = primo::make_ref(Library::createMediaSocket());
    socket->setStreamType(StreamType::UncompressedVideo);
    socket->setFile(primo::ustring(opt.yuv_file));
    
    auto pin = primo::make_ref(Library::createMediaPin());
    socket->pins()->add(pin.get());
    
    auto vsi = primo::make_ref(Library::createVideoStreamInfo());
    pin->setStreamInfo(vsi.get());
    
    vsi->setStreamType(StreamType::UncompressedVideo);
    vsi->setFrameWidth(opt.frame_size.width_);
    vsi->setFrameHeight(opt.frame_size.height_);
    vsi->setColorFormat(opt.yuv_color.Id);
    vsi->setFrameRate(opt.fps);
    vsi->setScanType(ScanType::Progressive);
    
    return socket;
}
```

### Configure Output Socket

The output socket defines where and how the encoded H.264 video data will be written. We configure it to output an H.264 Annex B elementary stream file. The socket represents the output destination, while the pin represents the specific video stream within that destination. By setting `StreamSubType::AVC_Annex_B`, we ensure the output uses the Annex B format with start codes, which is suitable for elementary streams and broadcasting applications.

``` cpp
primo::ref<MediaSocket> createOutputSocket(Options& opt)
{
    auto socket = primo::make_ref(Library::createMediaSocket());
    socket->setFile(primo::ustring(opt.h264_file));
    socket->setStreamType(StreamType::H264);
    
    auto pin = primo::make_ref(Library::createMediaPin());
    socket->pins()->add(pin.get());
    
    auto vsi = primo::make_ref(Library::createVideoStreamInfo());
    pin->setStreamInfo(vsi.get());
    
    vsi->setStreamType(StreamType::H264);
    vsi->setStreamSubType(StreamSubType::AVC_Annex_B);
    
    return socket;
}
```

### Configure Transcoder and Encode

This is the main encoding function that ties everything together. First, we create an input socket that points to the YUV file we want to encode. Then we create the output socket using our helper function. The transcoder is the core component that performs the actual encoding - it takes the uncompressed YUV data from the input and converts it to compressed H.264 data for the output.

The `setAllowDemoMode(true)` call allows the transcoder to work even without a valid license (useful for testing, but not recommended for production). We then add our input and output sockets to the transcoder, open it to prepare for processing, run the actual transcoding operation, and finally close it to clean up.

``` cpp
bool encode(Options& opt)
{
    // create input socket
    auto inSocket = createInputSocket(opt);
    
    // create output socket
    auto outSocket = createOutputSocket(opt);
    
    // create transcoder
    auto transcoder = primo::make_ref(Library::createTranscoder());
    transcoder->setAllowDemoMode(true);
    transcoder->inputs()->add(inSocket.get());
    transcoder->outputs()->add(outSocket.get());
    
    // transcoder will fail if output exists (by design)
    deleteFile(primo::ustring(opt.h264_file));
    
    cout << "Transcoder open: ";
    if(transcoder->open())
    {
        printStatus(transcoder->error());
        if(!transcoder->run())
            return false;
        
        cout << "Transcoder run: ";
        printStatus(transcoder->error());
        
        transcoder->close();
        cout << "Transcoder close: ";
        printStatus(transcoder->error());
    }
    else
    {
        printStatus(transcoder->error());
        return false;
    }
    
    return true;
}
```

### Complete C++ Code

Here's the complete working example that demonstrates H.264 encoding using AVBlocks. This code combines all the previous snippets into a functional program that can be compiled and run. The main function handles command-line argument parsing, initializes AVBlocks, performs the encoding operation, and properly shuts down the library before exiting.

``` cpp
#include <unistd.h>

#include <iostream>
#include <string>
#include <filesystem>

#include <primo/platform/reference++.h>
#include <primo/platform/error_facility.h>
#include <primo/platform/ustring.h>

#include <primo/avblocks/avb.h>

#include "options.h"
#include "util.h"

using namespace std;
using namespace primo::avblocks;
using namespace primo::codecs;

namespace fs = std::filesystem;
namespace av = primo::avblocks;
namespace pc = primo::codecs;

void printStatus(const primo::error::ErrorInfo* e)
{
    if (primo::error::ErrorFacility::Success == e->facility())
    {
        cout << "Success";
        
    }
    else
    {
        if (e->message())
        {
            cout << primo::ustring(e->message()) << " ";
        }
        
        cout << "(facility:" << e->facility() << " error:" << e->code() << ")" << endl;
    }
    
    cout << endl;
}

primo::ref<MediaSocket> createInputSocket(Options& opt)
{
    auto socket = primo::make_ref(Library::createMediaSocket());
    socket->setStreamType(StreamType::UncompressedVideo);
    socket->setFile(primo::ustring(opt.yuv_file));
    
    auto pin = primo::make_ref(Library::createMediaPin());
    socket->pins()->add(pin.get());
    
    auto vsi = primo::make_ref(Library::createVideoStreamInfo());
    pin->setStreamInfo(vsi.get());
    
    vsi->setStreamType(StreamType::UncompressedVideo);
    vsi->setFrameWidth(opt.frame_size.width_);
    vsi->setFrameHeight(opt.frame_size.height_);
    vsi->setColorFormat(opt.yuv_color.Id);
    vsi->setFrameRate(opt.fps);
    vsi->setScanType(ScanType::Progressive);
    
    return socket;
}

primo::ref<MediaSocket> createOutputSocket(Options& opt)
{
    auto socket = primo::make_ref(Library::createMediaSocket());
    socket->setFile(primo::ustring(opt.h264_file));
    socket->setStreamType(StreamType::H264);
    
    auto pin = primo::make_ref(Library::createMediaPin());
    socket->pins()->add(pin.get());
    
    auto vsi = primo::make_ref(Library::createVideoStreamInfo());
    pin->setStreamInfo(vsi.get());
    
    vsi->setStreamType(StreamType::H264);
    vsi->setStreamSubType(StreamSubType::AVC_Annex_B);
    
    return socket;
}

bool encode(Options& opt)
{
    // create input socket
    auto inSocket = createInputSocket(opt);
    
    // create output socket
    auto outSocket = createOutputSocket(opt);
    
    // create transcoder
    auto transcoder = primo::make_ref(Library::createTranscoder());
    transcoder->setAllowDemoMode(true);
    transcoder->inputs()->add(inSocket.get());
    transcoder->outputs()->add(outSocket.get());
    
    // transcoder will fail if output exists (by design)
    deleteFile(primo::ustring(opt.h264_file));
    
    cout << "Transcoder open: ";
    if(transcoder->open())
    {
        printStatus(transcoder->error());
        if(!transcoder->run())
            return false;
        
        cout << "Transcoder run: ";
        printStatus(transcoder->error());
        
        transcoder->close();
        cout << "Transcoder close: ";
        printStatus(transcoder->error());
    }
    else
    {
        printStatus(transcoder->error());
        return false;
    }
    
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
    
    bool encodeResult = encode(opt);
    
    Library::shutdown();
    
    return encodeResult ? 0 : 1;
}
```

## How to Run

See the [build instructions](https://github.com/avblocks/avblocks-cpp/blob/main/docs/build-mac.md) for macOS and the [enc_avc_file](https://github.com/avblocks/avblocks-cpp/tree/main/samples/darwin/enc_avc_file) example for details.

### Command Line

```sh
./enc_avc_file --frame <width>x<height> --rate <fps> --color <COLOR> --input <file.yuv> --output <file.h264> [--colors] [--help]
```

### Examples

List options:

```sh
./bin/x64/enc_avc_file --help

enc_avc_file --frame <width>x<height> --rate <fps> --color <COLOR> --input <file.yuv> --output <file.h264> [--colors]
  -h,    --help
  -i,    --input    input YUV file
  -o,    --output   output H264 file
  -r,    --rate     input frame rate
  -f,    --frame    input frame sizes <width>x<height>
  -c,    --color    input color format. Use --colors to list all supported color
                    formats
         --colors   list COLOR constants
```

The following example encodes input file `./assets/vid/foreman_qcif.yuv` into output file `foreman_qcif.h264`:

```sh
mkdir -p ./output/enc_avc_file

./bin/x64/enc_avc_file \
  --input ./assets/vid/foreman_qcif.yuv \
  --output ./output/enc_avc_file/foreman_qcif.h264 \
  --frame 176x144 \
  --rate 30 \
  --color yuv420
```
