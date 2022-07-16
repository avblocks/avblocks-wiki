---
title: Overlay Image On Video
metadata:
    description: This article explains how you can overlay PNG image on top of MP4 video.
taxonomy:
    category: docs
---

# Overlay Image On Video

How to overlay PNG image on top of MP4 video.

## Source Video

For a source video we use the MP4 file from the TED talk video [What's the next window into our universe?](https://archive.org/details/AndrewConnolly_2014) by Andrew Connolly. The original video format is Wide 480p or 16:9, 854 x 480.

## Overlay Image

For overlay image we use [iFunnyIcon](https://ia801302.us.archive.org/12/items/iFunnyIcon/Icon.png), but you can use any other image instead. Just make sure the image width and height are of even size, i.e. a multiple of 2. That is a requirement of the AVBlocks overlay filter.  

## Complete Program

This code overlays a PNG image on top of a MP4 video.    

``` csharp
using PrimoSoftware.AVBlocks;
using System.Collections.Generic;

namespace OverlayImage
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

            var imageInfo = new MediaInfo() {
                InputFile = "Icon.png"
            };

            if (inputInfo.Load() && outputInfo.Load() && imageInfo.Load()) {
                
                // create input socket
                var inputSocket = MediaSocket.FromMediaInfo(inputInfo);

                // create output socket
                var outputSocket = MediaSocket.FromMediaInfo(outputInfo);
                outputSocket.File = "AndrewConnolly_2014_With_Overlay.mp4";

                // read overlay image
                var imageData = System.IO.File.ReadAllBytes(imageInfo.InputFile);
                var imageBuffer = new MediaBuffer(imageData);
                var imageFormat = imageInfo.Streams[0] as VideoStreamInfo;

                // set overlay parameters
                var outVideoPin = outputSocket.Pins[0];
                outVideoPin.Params = new Dictionary<string, object>() {
                    // overlay parameters

                    // Compositing mode and alpha
                    // see https://en.wikipedia.org/wiki/Alpha_compositing
                    { Param.Video.Overlay.Mode, AlphaCompositingMode.Over },
                    { Param.Video.Overlay.BackgroundAlpha, 1.0 },
                    { Param.Video.Overlay.ForegroundAlpha, 0.2 },

                    // position at the top left corner
                    { Param.Video.Overlay.BackgroundX, 0 },
                    { Param.Video.Overlay.BackgroundY, 0 },

                    // provide the actual image data
                    { Param.Video.Overlay.ForegroundBuffer, imageBuffer },
                    { Param.Video.Overlay.ForegroundBufferFormat, imageFormat},

                    // force video decoding and encoding. Otherwise 
                    // video is transferred as is, and the overlay 
                    // filter is not applied.
                    { Param.ReEncode, Use.On },

                    // enable hardware accelerated encoding (optional)
                    { Param.HardwareEncoder, HardwareEncoder.Auto }
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

Follow the steps to [create a C# console application in Visual Studio](../getting-started/create-a-c-sharp-console-application-in-visual-studio) but in `Program.cs` use the code from this article. 

Download the `AndrewConnolly_2014.mp4` MPEG4 file from the [Internet Archive](https://archive.org/details/AndrewConnolly_2014) and save it in `bin\x64\Debug` under the project's directory.

Download the `Icon.png` image file from the [Internet Archive](https://ia801302.us.archive.org/12/items/iFunnyIcon/Icon.png) and save it in `bin\x64\Debug` under the project's directory.  


Run the application in Visual Studio. Wait a few seconds for the Transcoder to finish. The converted file `AndrewConnolly_2014_With_Overlay.mp4` will be in the `bin\x64\Debug` directory.

