---
title: Crop Video
metadata:
    description: This article explains how you can crop video with AVBlocks.
taxonomy:
    category: docs
---

# Crop Video

How to crop a 16:9 video to a 4:3 video.

## Source Video

For a source video we use the MP4 file from the TED talk video [What's the next window into our universe?](https://archive.org/details/AndrewConnolly_2014) by Andrew Connolly. The original video format is Wide 480p or 16:9, 854 x 480.

## Complete Program

This code takes an MP4 file with 16:9 480p (854x480) video and AAC audio, and crops the video to 4:3 640x480. The audio stream is copied from the source as is.    

``` csharp
using PrimoSoftware.AVBlocks;
using System.Collections.Generic;

namespace CropVideo
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
                outputSocket.File = "AndrewConnolly_2014_640x480.mp4";

                // set the new frame width and height to 640 x 480
                var outVideoStream = outputSocket.Pins[0].StreamInfo as VideoStreamInfo;
                outVideoStream.FrameWidth = 640;
                outVideoStream.FrameHeight = 480;

                // set the display ratio to 4:3
                outVideoStream.DisplayRatioWidth = 4;
                outVideoStream.DisplayRatioHeight = 3;

                // set Crop.Left and Crop.Right 
                var outVideoPin = outputSocket.Pins[0];
                outVideoPin.Params = new Dictionary<string, object>() {
                    // The input video is 854x480. 
                    // To make it 640x480 we have to cut (854 - 640) / 2 pixels from each side.
                    { Param.Video.Crop.Left, (854 - 640) / 2 },
                    { Param.Video.Crop.Right, (854 - 640) / 2 } 
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

Run the application in Visual Studio. Wait a few seconds for the Transcoder to finish. The converted file `AndrewConnolly_2014_640x480.mp4` will be in the `bin\x64\Debug` directory.
	
