---
title: Mux Audio and Video Into MP4
html_meta:
    description: This topic describes how to use the Transcoder class to mux AAC audio and H.264 video into an MP4 file.
taxonomy:
    category: docs
orphan:
---

# Mux Audio and Video Into MP4

This topic describes how to use the Transcoder class to mux AAC audio and H.264 video into an MP4 file.

The code snippets in this article are from the [mux_mp4_avc_aac_file](https://github.com/avblocks/avblocks-samples/tree/main/windows/net/samples/mux_mp4_avc_aac_file) AVBlocks sample.

## Complete .NET code

``` csharp
static bool MP4Mux(Options opt)
{
    bool audioStreamDetected = false;
    bool videoStreamDetected = false;

    using (var transcoder = new Transcoder())
    {
        // Transcoder demo mode must be enabled,
        // in order to use the production release for testing (without a valid license).
        transcoder.AllowDemoMode = true;

        // configure inputs
        foreach (string inputFile in opt.InputFiles)
        {
            using (MediaInfo info = new MediaInfo())
            {
                info.InputFile = inputFile;

                if (!info.Load())
                {
                    PrintError("mediaInfo.Load", info.Error);
                    return false;
                }

                MediaSocket inputSocket = MediaSocket.FromMediaInfo(info);

                for (int i = 0; i < inputSocket.Pins.Count; i++)
                {
                    MediaPin pin = inputSocket.Pins[i];

                    if(pin.StreamInfo.StreamType == StreamType.H264)
                    {
                        if(videoStreamDetected)
                        {
                            pin.Connection = PinConnection.Disabled;
                        }
                        else
                        {
                            videoStreamDetected = true;
                            Console.WriteLine("Muxing video input: {0}", inputFile);
                        }
                    }
                    else if(pin.StreamInfo.StreamType == StreamType.Aac)
                    {
                        if(audioStreamDetected)
                        {
                            pin.Connection = PinConnection.Disabled;
                        }
                        else
                        {
                            audioStreamDetected = true;
                            Console.WriteLine("Muxing audio input: {0}", inputFile);
                        }
                    }
                    else
                    {
                        pin.Connection = PinConnection.Disabled;
                    }
                }

                transcoder.Inputs.Add(inputSocket);
            }
        }

        // Configure output
        {
            MediaSocket socket = new MediaSocket();
            socket.File = opt.OutputFile;
            socket.StreamType = StreamType.Mp4;

            if(videoStreamDetected)
            {
                VideoStreamInfo streamInfo = new VideoStreamInfo();
                streamInfo.StreamType = StreamType.H264;
                streamInfo.StreamSubType = StreamSubType.Avc1;

                MediaPin pin = new MediaPin();
                pin.StreamInfo = streamInfo;
                socket.Pins.Add(pin);
            }

            if (audioStreamDetected)
            {
                AudioStreamInfo streamInfo = new AudioStreamInfo();
                streamInfo.StreamType = StreamType.Aac;
                streamInfo.StreamSubType = StreamSubType.AacMp4;

                MediaPin pin = new MediaPin();
                pin.StreamInfo = streamInfo;
                socket.Pins.Add(pin);
            }

            if(opt.FastStart)
            {
                socket.Params.Add(Param.Muxer.MP4.FastStart, 1);
            }

            transcoder.Outputs.Add(socket);
        }

        bool res = transcoder.Open();
        PrintError("Open Transcoder", transcoder.Error);
        if (!res)
            return false;

        res = transcoder.Run();
        PrintError("Run Transcoder", transcoder.Error);
        if (!res)
            return false;

        transcoder.Close();
    }

    return true;
}
```

