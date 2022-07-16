---
title: Simple Video Converter
metadata:
    description: This topic is about building a video converter in C#, C++, and Visual Studio.
taxonomy:
    category: docs
---

# Simple Video Converter

How to build a simple video converter in C#.

## Video Input

As video input we use the `Wildlife.wmv` HD movie from the [Internet Archive](https://archive.org/download/WildlifeHd/Wildlife.wmv). The original video format is WMV 720p, 16:9, 1280 x 720.

## Code

In just under 50 lines of code this snippet is a fully functional video converter. It will take any input supported by AVBlocks and will convert it to an iPad HD 720p H.264 video in MP4 container.

``` csharp
using PrimoSoftware.AVBlocks;

namespace SimpleConverter
{
    class Program
    {
        static void Main(string[] args)
        {
            Library.Initialize();

            var inputInfo = new MediaInfo() {
                InputFile = "Wildlife.wmv"
            };

            if (inputInfo.Load()) {
                var inputSocket = MediaSocket.FromMediaInfo(inputInfo);
                var outputSocket = MediaSocket.FromPreset(Preset.iPad_H264_720p);
                outputSocket.File = "Wildlife.mp4";

                using (var transcoder = new Transcoder()) {
                    transcoder.Inputs.Add(inputSocket);
                    transcoder.Outputs.Add(outputSocket);

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

Follow the steps to [create a C# console application in Visual Studio](../getting-started/create-a-c-sharp-console-application-in-visual-studio) but in `Program.cs` use the code from this article. 

Download the `Wildlife.wmv` HD movie from the [Internet Archive](https://archive.org/download/WildlifeHd/Wildlife.wmv) and save it in `bin\x64\Debug` under the project's directory.

Run the application in Visual Studio. Wait a few seconds for the Transcoder to finish. The converted file `Wildlife.mp4` will be in the `bin\x64\Debug` directory.

