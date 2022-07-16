---
title: Change Video Frame Rate
metadata:
    description: This article shows how to change the frame rate of a video from 24 fps to 30 fps.
taxonomy:
    category: docs
---

# Change Video Frame Rate

How to change the frame rate of a video from 24 fps to 30 fps.

## Source Video

For a source video we use the MP4 file from the TED talk video [What's the next window into our universe?](https://archive.org/details/AndrewConnolly_2014) by Andrew Connolly. The original video format is Wide 480p or 16:9, 854 x 480.

## Complete Program

This code takes an MP4 file encoded at 24 fps, and increases the video framerate to 30 fps. The audio stream is copied from the source as is.    

``` csharp
using PrimoSoftware.AVBlocks;
using System.Collections.Generic;

namespace ChangeVideoFrameRate
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
                outputSocket.File = "AndrewConnolly_2014_30fps.mp4";

                // change the frame rate from 24 fps to 30 fps
                var outVideoStream = outputSocket.Pins[0].StreamInfo as VideoStreamInfo;
                outVideoStream.FrameRate = 30.0;

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

Run the application in Visual Studio. Wait a few seconds for the Transcoder to finish. The converted file `AndrewConnolly_2014_30fps.mp4` will be in the `bin\x64\Debug` directory.
	
