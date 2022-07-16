---
title: Convert Raw Video To Compressed Video
metadata:
    description: This topic describes how to use the Transcoder class to convert a raw YUV video file into a compressed video file. The format of the output is configured with an AVBlocks preset.
taxonomy:
    category: docs
---

# Convert Raw Video To Compressed Video

This topic describes how to use the Transcoder class to convert a raw YUV video file into a compressed video file. The format of the output is configured with an AVBlocks preset.

The code snippets in this article are from the [enc_yuv_preset_file](https://github.com/avblocks/avblocks-samples/tree/main/windows/cpp/samples/enc_yuv_preset_file) sample. 

## Create a Transcoder object

Use the `createTranscoder` function from the `primo::avblocks::Library` namespace to create a new {transcoder-cpp}` ` object. 

``` cpp
auto transcoder = primo::make_ref(Library::createTranscoder());

// Transcoder demo mode must be enabled, 
// in order to use the production release for testing (without a valid license)
transcoder->setAllowDemoMode(TRUE);
```

## Configure inputs and outputs

Use the {mediasocket-cpp}` ` C++ interface to configure media sockets and the {mediapin-cpp}` ` C++ interface to configure media pins.

### Configure video input

1. Create and configure a {videostreaminfo-cpp}` ` object
2. Create a {mediapin-cpp}` ` object and set its stream info with `MediaPin::setStreamInfo`.
3. Create a {mediasocket-cpp}` ` object and add the pin to `MediaSocket::pins`.
4. Add the socket to `Transcoder::inputs`.

<!-- end of list -->

``` cpp
// Configure input
// The input stream frame rate determines the playback speed
{
    auto instream = primo::make_ref(Library::createVideoStreamInfo());
    instream->setStreamType(StreamType::UncompressedVideo);
    instream->setFrameRate(opt.yuv_fps);
    instream->setFrameWidth(opt.yuv_width);
    instream->setFrameHeight(opt.yuv_height);
    instream->setColorFormat(opt.yuv_color.Id);
    instream->setScanType(ScanType::Progressive);

    auto inpin = primo::make_ref(Library::createMediaPin());
    inpin->setStreamInfo(instream.get());

    auto insocket = primo::make_ref(Library::createMediaSocket());
    insocket->setStreamType(StreamType::UncompressedVideo);
    insocket->setFile(opt.yuv_file.c_str());
    insocket->pins()->add(inpin.get());

    transcoder->inputs()->add(insocket.get());
}
```
    
### Configure video output

1. Call the `Library::createMediaSocket` static method to create a {mediasocket-cpp}` ` object for a predefined {preset-cpp}` `
2. Call the `MediaSocket::setFile` method to set the output filename
3. Add the socket to `Transcoder::outputs`

<!-- end of list -->

``` cpp
// Configure output
{
    auto outsocket = primo::make_ref(Library::createMediaSocket(opt.preset.name));
    outsocket->setFile(opt.output_file.c_str());

    transcoder->outputs()->add(outsocket.get());
}
```

## Transcode

1. Call the `Transcoder::open` method.
2. Call the `Transcoder::run` method.
3. Call the `Transcoder::close` method.

<!-- end of list -->

``` cpp
bool_t res = transcoder->open();
printError(L"Open Transcoder", transcoder->error());
if (!res)
    return false;

res = transcoder->run();
printError(L"Run Transcoder", transcoder->error());
if (!res)
    return false;

transcoder->close();
```

## Complete C++ code

``` cpp
bool encode(const Options& opt)
{
    auto transcoder = primo::make_ref(Library::createTranscoder());
    
    // Transcoder demo mode must be enabled, 
    // in order to use the production release for testing (without a valid license)
    transcoder->setAllowDemoMode(TRUE);

    // Configure input
    // The input stream frame rate determines the playback speed
    {
        auto instream = primo::make_ref(Library::createVideoStreamInfo());
        instream->setStreamType(StreamType::UncompressedVideo);
        instream->setFrameRate(opt.yuv_fps);
        instream->setFrameWidth(opt.yuv_width);
        instream->setFrameHeight(opt.yuv_height);
        instream->setColorFormat(opt.yuv_color.Id);
        instream->setScanType(ScanType::Progressive);

        auto inpin = primo::make_ref(Library::createMediaPin());
        inpin->setStreamInfo(instream.get());

        auto insocket = primo::make_ref(Library::createMediaSocket());
        insocket->setStreamType(StreamType::UncompressedVideo);
        insocket->setFile(opt.yuv_file.c_str());
        insocket->pins()->add(inpin.get());

        transcoder->inputs()->add(insocket.get());
    }

    // Configure output
    {
        auto outsocket = primo::make_ref(Library::createMediaSocket(opt.preset.name));
        outsocket->setFile(opt.output_file.c_str());

        transcoder->outputs()->add(outsocket.get());
    }

    bool_t res = transcoder->open();
    printError(L"Open Transcoder", transcoder->error());
    if (!res)
        return false;

    res = transcoder->run();
    printError(L"Run Transcoder", transcoder->error());
    if (!res)
    {
        transcoder->close();
        return false;
    }

    transcoder->close();
    
    return true;
}
```

