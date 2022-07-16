---
title: Hardware Acceleration
metadata:
    description: This topic explains how to enable Intel Graphics, AMD, or NVIDIA hardware acceleration.
taxonomy:
    category: docs
---

# Hardware Acceleration

How to enable Intel Graphics, AMD, or NVIDIA hardware acceleration.

For detailed information about the supported hardware platforms, see [About Hardware Acceleration](../../about-avblocks/about-hardware-acceleration).

To enable hardware encoding, on the output MediaPin, set the `HardwareEncoder` parameter to `HardwareEncoder.Auto`. This must be done before calling `Transcoder.Open`:

## Example

``` csharp
// create output socket
var outputSocket = MediaSocket.FromPreset(Preset.Video.iPad.H264_720p);

// enable hardware acceleration
var outVideoPin = outputSocket.Pins[0];
outVideoPin.Params.Add(Param.HardwareEncoder, HardwareEncoder.Auto);

```

## Complete Program

``` csharp

using PrimoSoftware.AVBlocks;

namespace HardwareEncoding
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

                // create input socket
                var inputSocket = MediaSocket.FromMediaInfo(inputInfo);

                // create output socket
                var outputSocket = MediaSocket.FromPreset(Preset.Video.iPad.H264_720p);

                // enable hardware acceleration
                var outVideoPin = outputSocket.Pins[0];
                outVideoPin.Params.Add(Param.HardwareEncoder, HardwareEncoder.Auto);

                outputSocket.File = "Wildlife.mp4";

                // configure Transcoder and run 
                using (var transcoder = new Transcoder())
                {
                    transcoder.AllowDemoMode = true;

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
