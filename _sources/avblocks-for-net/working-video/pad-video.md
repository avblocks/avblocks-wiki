---
title: Pad Video
metadata:
    description: This article explains how you can fit a 16:9 video into a 4:3 frame by sizing and padding the original picture.
taxonomy:
    category: docs
---

# Pad Video

How to fit a 16:9 video into a 4:3 frame by sizing and padding the original picture.

## Source Video

For a source video we use the MP4 file from the TED talk video [What's the next window into our universe?](https://archive.org/details/AndrewConnolly_2014) by Andrew Connolly. The original video format is Wide 480p or 16:9, 854 x 480.

## Complete Program

This code takes a 16:9 480p (854x480) video, and squeezes it into a 4:3 640x480 frame, while maintaining the original 16:9 picture aspect ratio. The audio stream is copied from the source as is.    

``` csharp
using PrimoSoftware.AVBlocks;
using System.Collections.Generic;

namespace PadVideo
{
    class Program
    {
        static void Main(string[] args)
        {
            Library.Initialize();

            // start with two identical input and output configurations
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
                outputSocket.File = "AndrewConnolly_2014_640x480_Padded.mp4";

                // set the frame width and height, and the display ratio
                var outVideoStream = outputSocket.Pins[0].StreamInfo as VideoStreamInfo;

                // set the new frame width and height to 640 x 480
                outVideoStream.FrameWidth = 640;
                outVideoStream.FrameHeight = 480;

                // set the display ratio to 4:3
                outVideoStream.DisplayRatioWidth = 4;
                outVideoStream.DisplayRatioHeight = 3;

                // set Pad.Top and Pad.Bottom
                var outVideoPin = outputSocket.Pins[0];
                outVideoPin.Params = new Dictionary<string, object>() {
                    // The input video is 16:9, 854 x 480,  
                    // to squeeze it in 640 x 480 and keep the 16:9 display ratio, 
                    // the height has to be: 640 * 9 / 16
                    
                    // Pad by (480 - 640 * 9 / 16) / 2 pixels on each side.
                    { Param.Video.Pad.Top,    (480 - 640 * 9 / 16) / 2 },
                    { Param.Video.Pad.Bottom, (480 - 640 * 9 / 16) / 2 }, 

                    // The padding will trigger downscaling, 
					// so we also set the interpolation method,
                    // for best result when downscaling, use InterpolationMethod.Super
                    { Param.Video.Resize.InterpolationMethod, InterpolationMethod.Super }
                };

                // create a transcoder and run it
                using (var transcoder = new Transcoder()) {
                    // set inputs and outputs
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

Follow the [steps](../getting-started/create-a-c-sharp-console-application-in-visual-studio) to create a C# console application in Visual Studio, but in `Program.cs` use the code from this article. 

Download the `AndrewConnolly_2014.mp4` MPEG4 file from the [Internet Archive](https://archive.org/details/AndrewConnolly_2014) and save it in `bin\x64\Debug` under the project's directory.

Run the application in Visual Studio. Wait a few seconds for the Transcoder to finish. The converted file `AndrewConnolly_2014_640x480_Padded.mp4` will be in the `bin\x64\Debug` directory.

