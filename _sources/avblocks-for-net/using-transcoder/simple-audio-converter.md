---
title: Simple Audio Converter
metadata:
    description: This topic is about building an audio converter in C#.
taxonomy:
    category: docs
---

# Simple Audio Converter

How to build a simple audio converter in C#.

## Audio Input

As audio input we use the `kahvi011_kennybeltrey-hydrate.mp3` file from the [Internet Archive](https://archive.org/details/kahvi011). The original audio format is MPEG Audio Layer 3, 44.1 KHz, Joint Stereo, 136 Kbps, Variable Bit Rate

## Code

The following code snippet will take any audio format supported by AVBlocks and will convert it to AAC audio in an ADTS container (*.AAC).

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
                InputFile = "kahvi011_kennybeltrey-hydrate.mp3"
            };

            if (inputInfo.Load()) {
                var inputSocket = MediaSocket.FromMediaInfo(inputInfo);
                var outputSocket = MediaSocket.FromPreset(Preset.Audio.Generic.AAC);
                outputSocket.File = "kahvi011_kennybeltrey-hydrate.aac";

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

Download the `kahvi011_kennybeltrey-hydrate.mp3` song from the [Internet Archive](https://archive.org/details/kahvi011) and save it in `bin\x64\Debug` under the project's directory.

Run the application in Visual Studio. Wait a few seconds for the Transcoder to finish. The converted file `kahvi011_kennybeltrey-hydrate.aac` will be in the `bin\x64\Debug` directory.


