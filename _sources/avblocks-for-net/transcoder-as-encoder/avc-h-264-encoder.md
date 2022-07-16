---
title: AVC / H.264 Encoder
metadata:
    description: This article explains how you can use Transcoder.Push to encode an AVC / H.264 elementary stream from raw video frames.
taxonomy:
    category: docs
---

# AVC / H.264 Encoder

How to use Transcoder.Push to encode an AVC / H.264 elementary stream from raw YUV frames.

## Video Input

As video input we use the `foreman_qcif.yuv` file from the [AVBlocks Assets](https://github.com/avblocks/avblocks-assets/releases) archive. After downloading and unzipping you will find `foreman_qcif.yuv` in the `vid` subdirectory.


## Code

This code shows how you can encode raw uncompressed YUV frames into an H.264 stream. Two Transcoder objects are used, one to read the raw YUV frames from a file, and another to encode the raw frames to AVC / H.264 Annex B stream. The encoding is done via the Transcoder.Push (Transcoder::push) method.   

### Initialize AVBlocks

``` csharp
static void EncodeH264Stream()
{
    Library.Initialize();

    EncodeH264Stream("foreman_qcif.yuv", "foreman_qcif.h264");

    Library.Shutdown();
}
```

### Configure YUV Reader

``` csharp
static Transcoder CreateYUVReader(string inputFile)
{
    // Create VideoStreamInfo, MediaPin, and MediaSocket describing the YUV input

    // MediaPin and VideoStreamInfo
    var yuvInPin = new MediaPin() {
        StreamInfo = new VideoStreamInfo() {
            StreamType = StreamType.UncompressedVideo,
            FrameRate = 30.0,
            FrameWidth = 176,
            FrameHeight = 144,
            ColorFormat = ColorFormat.YUV420,
            ScanType = ScanType.Progressive
        }
    };

    // MediaSocket
    var yuvInSocket = new MediaSocket() {
        StreamType = StreamType.UncompressedVideo,
        File = inputFile
    };

    yuvInSocket.Pins.Add(yuvInPin);

    // Create VideoStreamInfo, MediaPin, and MediaSocket describing the YUV output
    // This is the same as the input, but no output file is set on the MediaSocket, 
    // because we want to pull frames one by one using Transcoder.Pull

    // MediaPin and VideoStreamInfo
    var yuvOutPin = new MediaPin() {
        StreamInfo = new VideoStreamInfo() {
            StreamType = StreamType.UncompressedVideo,
            FrameRate = 30.0,
            FrameWidth = 176,
            FrameHeight = 144,
            ColorFormat = ColorFormat.YUV420,
            ScanType = ScanType.Progressive
        }
    };

    // MediaSocket
    var yuvOutSocket = new MediaSocket() {
        StreamType = StreamType.UncompressedVideo,
    };

    yuvOutSocket.Pins.Add(yuvOutPin);

    // Create Transcoder
    var yuvReader = new Transcoder();
    yuvReader.Inputs.Add(yuvInSocket);
    yuvReader.Outputs.Add(yuvOutSocket);

    return yuvReader;
}
```

### Configure AVC / H.264 Encoder

``` csharp
static Transcoder CreateH264Encoder(string outputFile, HardwareEncoder hardware)
{
    // Create VideoStreamInfo, MediaPin, and MediaSocket describing the YUV input

    // MediaPin and VideoStreamInfo
    var yuvInPin = new MediaPin() {
        StreamInfo = new VideoStreamInfo() {
            StreamType = StreamType.UncompressedVideo,
            FrameRate = 30.0,
            FrameWidth = 176,
            FrameHeight = 144,
            ColorFormat = ColorFormat.YUV420,
            ScanType = ScanType.Progressive
        }
    };

    // MediaSocket
    var yuvInSocket = new MediaSocket() {
        StreamType = StreamType.UncompressedVideo
    };

    yuvInSocket.Pins.Add(yuvInPin);

    // Create VideoStreamInfo, MediaPin, and MediaSocket describing the H.264 output

    // MediaPin and VideoStreamInfo
    var h264OutPin = new MediaPin() {
        StreamInfo = new VideoStreamInfo() {
            StreamType  = StreamType.H264,
            FrameRate = 30.0,
            FrameWidth = 176,
            FrameHeight = 144,
            ColorFormat = ColorFormat.YUV420,
            ScanType = ScanType.Progressive
        }
    };

    // Enable \ disable hardware acceleration
    h264OutPin.Params.Add(Param.HardwareEncoder, hardware);

    // MediaSocket
    var h264OutSocket = new MediaSocket() {
        StreamType = StreamType.H264,
        File = outputFile
    };

    h264OutSocket.Pins.Add(h264OutPin);

    // Transcoder
    var h264Encoder = new Transcoder();
    h264Encoder.Inputs.Add(yuvInSocket);
    h264Encoder.Outputs.Add(h264OutSocket);

    return h264Encoder;
}
```

### Open Transcoders

``` csharp
static void EncodeH264Stream(string inputFile, string outputFile)
{
    // Create a reader to simulate raw video frames. In reality you will likely
    // have a different raw video source, for example some kind of video capture device.
    Transcoder yuvReader = CreateYUVReader(inputFile);

    // Create a H.264 encoder. We will pass the raw video frames to it 
    // to encode them as AVC / H.264
    Transcoder h264Encoder = CreateH264Encoder(outputFile, HardwareEncoder.Auto);

    if (yuvReader.Open())
    {
        if (h264Encoder.Open())
        {
            EncodeH264Stream(yuvReader, h264Encoder);

            h264Encoder.Close();
        }

        yuvReader.Close();
    }
}
```

### Call Transcoder.Pull and Transcoder.Push

``` csharp
static void EncodeH264Stream(Transcoder yuvReader, Transcoder h264Encoder)
{
    int inputIndex = 0;
    MediaSample yuvFrame = new MediaSample();

    while (true)
    {
        // Simulate raw frames
        // Each call to Transcoder.Pull returns one video frame.
        if (!yuvReader.Pull(out inputIndex, yuvFrame))
            break;

        // Pass the raw video frame to Transcoder.Push to encode it as AVC / H.264
        if (!h264Encoder.Push(0, yuvFrame))
            break;
    }

    h264Encoder.Flush();
}
```

## Complete Program

``` csharp
using System;
using System.Linq;

using PrimoSoftware.AVBlocks;

namespace H264Encoder
{
    class Program
    {
        static Transcoder CreateYUVReader(string inputFile)
        {
            // Create VideoStreamInfo, MediaPin, and MediaSocket describing the YUV input

            // MediaPin and VideoStreamInfo
            var yuvInPin = new MediaPin() {
                StreamInfo = new VideoStreamInfo() {
                    StreamType = StreamType.UncompressedVideo,
                    FrameRate = 30.0,
                    FrameWidth = 176,
                    FrameHeight = 144,
                    ColorFormat = ColorFormat.YUV420,
                    ScanType = ScanType.Progressive
                }
            };

            // MediaSocket
            var yuvInSocket = new MediaSocket() {
                StreamType = StreamType.UncompressedVideo,
                File = inputFile
            };

            yuvInSocket.Pins.Add(yuvInPin);

            // Create VideoStreamInfo, MediaPin, and MediaSocket describing the YUV output
            // This is the same as the input, but no output file is set on the MediaSocket, 
            // because we want to pull frames one by one using Transcoder.Pull

            // MediaPin and VideoStreamInfo
            var yuvOutPin = new MediaPin() {
                StreamInfo = new VideoStreamInfo() {
                    StreamType = StreamType.UncompressedVideo,
                    FrameRate = 30.0,
                    FrameWidth = 176,
                    FrameHeight = 144,
                    ColorFormat = ColorFormat.YUV420,
                    ScanType = ScanType.Progressive
                }
            };

            // MediaSocket
            var yuvOutSocket = new MediaSocket() {
                StreamType = StreamType.UncompressedVideo,
            };

            yuvOutSocket.Pins.Add(yuvOutPin);

            // Create Transcoder
            var yuvReader = new Transcoder();
            yuvReader.Inputs.Add(yuvInSocket);
            yuvReader.Outputs.Add(yuvOutSocket);

            return yuvReader;
        }

        static Transcoder CreateH264Encoder(string outputFile, HardwareEncoder hardware)
        {
            // Create VideoStreamInfo, MediaPin, and MediaSocket describing the YUV input

            // MediaPin and VideoStreamInfo
            var yuvInPin = new MediaPin() {
                StreamInfo = new VideoStreamInfo() {
                    StreamType = StreamType.UncompressedVideo,
                    FrameRate = 30.0,
                    FrameWidth = 176,
                    FrameHeight = 144,
                    ColorFormat = ColorFormat.YUV420,
                    ScanType = ScanType.Progressive
                }
            };

            // MediaSocket
            var yuvInSocket = new MediaSocket() {
                StreamType = StreamType.UncompressedVideo
            };

            yuvInSocket.Pins.Add(yuvInPin);

            // Create VideoStreamInfo, MediaPin, and MediaSocket describing the H.264 output
    
            // MediaPin and VideoStreamInfo
            var h264OutPin = new MediaPin() {
                StreamInfo = new VideoStreamInfo() {
                    StreamType  = StreamType.H264,
                    FrameRate = 30.0,
                    FrameWidth = 176,
                    FrameHeight = 144,
                    ColorFormat = ColorFormat.YUV420,
                    ScanType = ScanType.Progressive
                }
            };

            // Enable \ disable hardware acceleration
            h264OutPin.Params.Add(Param.HardwareEncoder, hardware);
    
            // MediaSocket
            var h264OutSocket = new MediaSocket() {
                StreamType = StreamType.H264,
                File = outputFile
            };

            h264OutSocket.Pins.Add(h264OutPin);

            // Transcoder
            var h264Encoder = new Transcoder();
            h264Encoder.Inputs.Add(yuvInSocket);
            h264Encoder.Outputs.Add(h264OutSocket);

            return h264Encoder;
        }

        static void EncodeH264Stream(Transcoder yuvReader, Transcoder h264Encoder)
        {
            int inputIndex = 0;
            MediaSample yuvFrame = new MediaSample();

            while (true)
            {
                // Simulate raw frames
                // Each call to Transcoder.Pull returns one video frame.
                if (!yuvReader.Pull(out inputIndex, yuvFrame))
                    break;

                // Pass the raw video frame to Transcoder.Push to encode it as AVC / H.264
                if (!h264Encoder.Push(0, yuvFrame))
                    break;
            }

            h264Encoder.Flush();
        }

        static void EncodeH264Stream(string inputFile, string outputFile)
        {
            // Create a reader to simulate raw video frames. In reality you will likely
            // have a different raw video source, for example some kind of video capture device.
            Transcoder yuvReader = CreateYUVReader(inputFile);

            // Create a H.264 encoder. We will pass the raw video frames to it 
            // to encode them as AVC / H.264
            Transcoder h264Encoder = CreateH264Encoder(outputFile, HardwareEncoder.Auto);

            if (yuvReader.Open())
            {
                if (h264Encoder.Open())
                {
                    EncodeH264Stream(yuvReader, h264Encoder);

                    h264Encoder.Close();
                }

                yuvReader.Close();
            }
        }

        static void EncodeH264Stream()
        {
            Library.Initialize();

            EncodeH264Stream("foreman_qcif.yuv", "foreman_qcif.h264");

            Library.Shutdown();
        }

        static void Main(string[] args)
        {
            EncodeH264Stream();
        }
    }
}
```

## How to run

Follow the steps to [create a C# console application in Visual Studio](../getting-started/create-a-c-sharp-console-application-in-visual-studio) but in `Program.cs` use the code from this article. 

Copy the `foreman_qcif.yuv` file from the assets archive to `bin\x64\Debug` under the project's directory.

Run the application in Visual Studio.

