---
title: Re-encode Audio and Video Streams
metadata:
    description: This topic describes how to use the Transcoder class to re-encode audio and video streams.
taxonomy:
    category: docs
---

# Re-encode Audio and Video Streams

This topic describes how to use the Transcoder class to re-encode audio and video streams.

The code snippets in this article are from the [ReEncode](https://github.com/avblocks/avblocks-samples/tree/main/windows/net/samples/ReEncode) AVBlocks sample.

## Why Re-encode?

For performance reasons AVBlocks avoids re-encoding when possible, for example when you [scale](../working-video/upscale-video) a video clip, the audio will be copied to the output unchanged. Another example is when you want to resample the audio part without changing the video.

However there are some cases when you will want to force re-encoding of audio or video streams, for example, to fix errors introduced by a prior encoding.          

To re-encode audio and video streams, configure the Transcoder outputs to be exactly the same as the inputs, and set the Param.ReEncode parameter on the output audio and the output video pins to Use.On, like this:

``` csharp
var pin = new MediaPin();
pin.Params.Add(Param.ReEncode, Use.On);
```  

## Complete .NET code

``` csharp
static void ReEncode(Options opt)
{
    if (File.Exists(opt.OutputFile))
        File.Delete(opt.OutputFile);

    using (var transcoder = new Transcoder())
    {
        // In order to use the production release for testing (without a valid license),
        // the transcoder demo mode must be enabled.
        transcoder.AllowDemoMode = true;

        using (var mediaInfo = new MediaInfo())
        {
            mediaInfo.InputFile = opt.InputFile;

            if (!mediaInfo.Load())
            {
                PrintError("Load MediaInfo", mediaInfo.Error);
                return;
            }

            // Add Inputs
            {
                var socket = MediaSocket.FromMediaInfo(mediaInfo);
                transcoder.Inputs.Add(socket);
            }

            // Add Outputs
            {
                // Create output socket
                var socket = new MediaSocket();
                socket.StreamType = mediaInfo.StreamType;
                socket.File = opt.OutputFile;

                // Add pins with ReEncode parameter set to Use.On
                foreach (var si in mediaInfo.Streams)
                {
                    var pin = new MediaPin();
                    pin.StreamInfo = si;

                    if ((MediaType.Video == si.MediaType) && opt.ReEncodeVideo)
                    {
                        pin.Params.Add(Param.ReEncode, Use.On);
                    }

                    if ((MediaType.Audio == si.MediaType) && opt.ReEncodeAudio)
                    {
                        pin.Params.Add(Param.ReEncode, Use.On);
                    }

                    socket.Pins.Add(pin);
                }

                transcoder.Outputs.Add(socket);
            }
        }

        bool result = transcoder.Open();
        PrintError("Open Transcoder", transcoder.Error);
        if (!result)
            return;

        result = transcoder.Run();
        PrintError("Run Transcoder", transcoder.Error);
        if (!result)
            return;

        transcoder.Close();
    }
}
```

