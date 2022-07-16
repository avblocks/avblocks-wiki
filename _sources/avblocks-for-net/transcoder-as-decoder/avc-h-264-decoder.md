---
title: AVC / H.264 Decoder
metadata:
    description: This article explains how you can use Transcoder to decode an AVC / H.264 elementary stream.
taxonomy:
    category: docs
---

# AVC / H.264 Decoder

How to use Transcoder to decode an AVC / H.264 elementary stream.


## Video Input

As video input we use the `foreman_qcif.h264` file from the [AVBlocks Assets](https://github.com/avblocks/avblocks-assets/releases) archive. After downloading and unzipping you will find `foreman_qcif.h264` in the `vid` subdirectory.

## Code

This code takes an H.264 stream, and decodes it to raw uncompressed YUV frames.

### Initialize AVBlocks

``` csharp
static void DecodeH264Stream()
{
    Library.Initialize();

    DecodeH264Stream("foreman_qcif.h264");

    Library.Shutdown();
}
```

### Configure Transcoder

``` csharp
static void DecodeH264Stream(string inputFile)
{
    // Create an input socket from file
    var inSocket = new MediaSocket() {
        File = inputFile
    };

    // Create an output socket with one YUV 4:2:0 video pin
    var outSocket = new MediaSocket() {
        StreamType = StreamType.UncompressedVideo
    };

    outSocket.Pins.Add(new MediaPin() {
        StreamInfo = new VideoStreamInfo() {
            StreamType = StreamType.UncompressedVideo,
            ColorFormat = ColorFormat.YUV420,
            ScanType = ScanType.Progressive
        }
    });

    // Create Transcoder
    using (var transcoder = new Transcoder())
    {
        transcoder.Inputs.Add(inSocket);
        transcoder.Outputs.Add(outSocket);

        if (transcoder.Open())
        {
            DecodeH264Stream(transcoder);

            transcoder.Close();
        }
    }
}
```

### Call Transcoder.Pull

``` csharp
static void DecodeH264Stream(Transcoder transcoder)
{
    int inputIndex = 0;
    var yuvFrame = new MediaSample();

    while (transcoder.Pull(out inputIndex, yuvFrame))
    {
        // Each call to Transcoder::pull returns a raw YUV 4:2:0 frame. 
        ProcessYUVFrame(yuvFrame.Buffer);
    }

}
```

## Complete Program

``` csharp
using System;
using System.Linq;

using PrimoSoftware.AVBlocks;

namespace H264Decoder
{
    class Program
    {
        static int frameIndex = 0;
        static void ProcessYUVFrame(MediaBuffer buffer)
        {
            // Do something with the YUV frame, 
            // for example you can save it to a file or render the frame on the screen

            Console.WriteLine("Frame Index : {0}", frameIndex);
            frameIndex++;
        }

        static void DecodeH264Stream(Transcoder transcoder)
        {
            int inputIndex = 0;
            var yuvFrame = new MediaSample();

            while (transcoder.Pull(out inputIndex, yuvFrame))
            {
                // Each call to Transcoder::pull returns a raw YUV 4:2:0 frame. 
                ProcessYUVFrame(yuvFrame.Buffer);
            }
        }

        static void DecodeH264Stream(string inputFile)
        {
            // Create an input socket from file
            var inSocket = new MediaSocket() {
                File = inputFile
            };

            // Create an output socket with one YUV 4:2:0 video pin
            var outSocket = new MediaSocket() {
                StreamType = StreamType.UncompressedVideo
            };

            outSocket.Pins.Add(new MediaPin() {
                StreamInfo = new VideoStreamInfo() {
                    StreamType = StreamType.UncompressedVideo,
                    ColorFormat = ColorFormat.YUV420,
                    ScanType = ScanType.Progressive
                }
            });

            // Create Transcoder
            using (var transcoder = new Transcoder())
            {
                transcoder.Inputs.Add(inSocket);
                transcoder.Outputs.Add(outSocket);

                if (transcoder.Open())
                {
                    DecodeH264Stream(transcoder);

                    transcoder.Close();
                }
            }
        }

        static void DecodeH264Stream()
        {
            Library.Initialize();

            DecodeH264Stream("foreman_qcif.h264");

            Library.Shutdown();
        }

        static void Main(string[] args)
        {
            DecodeH264Stream();
        }
    }
}
```

## How to run

Follow the steps to [create a C# console application in Visual Studio](../getting-started/create-a-c-sharp-console-application-in-visual-studio) but in `Program.cs` use the code from this article. 

Copy the `foreman_qcif.h264` file from the assets archive to `bin\x64\Debug` under the project's directory.

Run the application in Visual Studio.

