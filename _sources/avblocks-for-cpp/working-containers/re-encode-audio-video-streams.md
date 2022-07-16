---
title: Re-encode Audio and Video Streams
metadata:
    description: This topic describes how to use the Transcoder class to re-encode audio and video streams.
taxonomy:
    category: docs
---

# Re-encode Audio and Video Streams

This topic describes how to use the Transcoder class to re-encode audio and video streams.

The code snippets in this article are from the [ReEncode](https://github.com/avblocks/avblocks-samples/tree/main/windows/cpp/samples/ReEncode) sample.

## Why Re-encode?

For performance reasons AVBlocks avoids re-encoding when possible, for example when you [scale](../working-video/upscale-video/) a video clip, the audio will be copied to the output unchanged. Another example is when you want to resample the audio part without changing the video.

However there are some cases when you will want to force re-encoding of audio or video streams, for example, to fix errors introduced by a prior encoding.          

## Code

To re-encode audio and video streams, configure the {transcoder-cpp}` ` outputs to be exactly the same as the inputs, and set the `Param::ReEncode` parameter on the output audio and the output video pins to `Use::On`, like this:

``` cpp
auto pin = primo::make_ref(Library::createMediaPin());
pin->params()->addInt(Param::ReEncode, Use::On);
```  

## Complete C++ code

``` cpp
bool reEncode(Options opt)
{
    DeleteFile(opt.outputFile.c_str());

    auto transcoder = primo::make_ref(Library::createTranscoder());

    // In order to use the production release for testing (without a valid license), 
    // the demo mode must be enabled.
    transcoder->setAllowDemoMode(1);

    auto mediaInfo = primo::make_ref(Library::createMediaInfo());

    mediaInfo->setInputFile(opt.inputFile.c_str());
    
    if (!mediaInfo->load())
    {
        printError(L"Load Info", mediaInfo->error());
        return false;
    }

    // Add Inputs
    {
        auto socket = primo::make_ref(Library::createMediaSocket(mediaInfo.get()));
        transcoder->inputs()->add(socket.get());
    }

    // Add Outputs
    {
        // Add output socket
        auto socket = primo::make_ref(Library::createMediaSocket());
        socket->setStreamType(mediaInfo->streamType());
        socket->setFile(opt.outputFile.c_str());

        // Add output pins and set the ReEncode parameter to Use::On
        StreamInfoEnum* pStreams = mediaInfo->streams();
        for (int i = 0; i < pStreams->count(); ++i)
        {
            StreamInfo* psi = pStreams->at(i);

            auto pin = primo::make_ref(Library::createMediaPin());
            pin->setStreamInfo(psi);

            if ((MediaType::Video == psi->mediaType()) && opt.reEncodeVideo)
            {
                pin->params()->addInt(Param::ReEncode, Use::On);
            }

            if ((MediaType::Audio == psi->mediaType()) && opt.reEncodeAudio)
            {
                pin->params()->addInt(Param::ReEncode, Use::On);
            }

            socket->pins()->add(pin.get());
        }

        transcoder->outputs()->add(socket.get());
    }

    bool_t res = transcoder->open();
    printError(L"Open Transcoder", transcoder->error());
    if (!res)
        return false;

    res = transcoder->run();
    if (!res)
        return false;

    printError(L"Run Transcoder", transcoder->error());

    transcoder->close();

    return true;
}
```

