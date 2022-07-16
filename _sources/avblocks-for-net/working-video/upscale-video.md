---
title: Upscale Video
metadata:
    description: This article explains how to scale a video up to Full HD (1080p) with AVBlocks.
taxonomy:
    category: docs
---

# Upscale Video

How to scale up a 480p (854x480) video to Full HD 1080p (1920x1080) video.

## Source Video

For a source video we use the MP4 file from the TED talk video [What's the next window into our universe?](https://archive.org/details/AndrewConnolly_2014) by Andrew Connolly. The original video format is Wide 480p or 16:9, 854 x 480.

## Complete Program

This code takes an MP4 file with H.264 video and AAC audio, and scales the video stream up to Full HD 1920x1080 (1080p) using bicubic method for interpolation. The audio stream is copied from the source as is.    

``` csharp
using PrimoSoftware.AVBlocks;
using System.Collections.Generic;

namespace UpscaleVideo
{
    class Program
    {
        static void Main(string[] args)
        {
            Library.Initialize();

            // start with two identical input and output configuration
            var inputInfo = new MediaInfo() {
                InputFile = "AndrewConnolly_2014.mp4"
            };

            var outputInfo = new MediaInfo() {
                InputFile = "AndrewConnolly_2014.mp4"
            };

            if (inputInfo.Load() && outputInfo.Load()) {
                
                // create input socket
                var inputSocket = MediaSocket.FromMediaInfo(inputInfo);

                // create output socket
                var outputSocket = MediaSocket.FromMediaInfo(outputInfo);
                outputSocket.File = "AndrewConnolly_2014_1080p.mp4";

                // set the new frame width and height to 1920 x 1080
                var outVideoStream = outputSocket.Pins[0].StreamInfo as VideoStreamInfo;
                outVideoStream.FrameWidth = 1920;
                outVideoStream.FrameHeight = 1080;

                // set the resize interpolation method: 
                var outVideoPin = outputSocket.Pins[0];
                outVideoPin.Params = new Dictionary<string, object>() {
                    { Param.Video.Resize.InterpolationMethod, InterpolationMethod.Cubic } 
                };

                // create and run a transcoder
                using (var transcoder = new Transcoder()) {
                    transcoder.Inputs.Add(inputSocket);
                    transcoder.Outputs.Add(outputSocket);

                    // process
                    if (transcoder.Open())
                    {
                        transcoder.Run();
                        transcoder.Close();
                    }
                }
            }

            Library.Shutdown();
        }
    }
}
```
## How to run

Follow the [steps](../getting-started/create-a-c-sharp-console-application-in-visual-studio) to create a C# console application in Visual Studio but in `Program.cs` use the code from this article. 

Download the `AndrewConnolly_2014.mp4` MPEG4 file from the [Internet Archive](https://archive.org/details/AndrewConnolly_2014) and save it in `bin\x64\Debug` under the project's directory.

Run the application in Visual Studio. Wait a few seconds for the Transcoder to finish. The converted file `AndrewConnolly_2014_1080p.mp4` will be in the `bin\x64\Debug` directory.

