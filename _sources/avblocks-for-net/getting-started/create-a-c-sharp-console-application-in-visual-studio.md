---
title: Create a C# console application in Visual Studio
metadata:
    description: This article describes the steps needed to configure a C# console application in Visual Studio.
taxonomy:
    category: docs
---

# Create a C# console application in Visual Studio

This topic describes the steps needed to configure a C# console application in Visual Studio.

## Create the Visual Studio project

1. Create a C# console application in Visual Studio 2015.  
2. [Download](https://avblocks.com/download/) the 64 bit version of AVBlocks for .NET. The file you need will have a name similar to `AVBlocks.NET.1.25.0.x64.Demo.zip` - the version number may differ. 
3. Unzip in a location of your choice, then copy the file `AVBlocks.clr4.x64.dll`, `AVBlocks.clr4.x64.xml` and `AVBlocks64.dll` from the `lib` directory to the project's directory. 
	
	> Note: Technically you do not need the `AVBlocks.clr4.x64.xml`. The XML file contains the AVBlocks API documentation which Visual Studio understands and will show to you while you are coding. 
4. Switch to the project in Visual Studio and add a reference to `AVBlocks.clr4.x64.dll`. 
5. Add the `AVBlocks64.dll` to your project simply as a file, open file properties, and set the 'Copy to Output Directory' to 'Copy if newer', so it is copied to the output directory automatically. The `AVBlocks.clr4.x64.dll` needs `AVBlocks64.dll` and will not work without it.
6. In Visual Studio, select 'BUILD | Configuration Manager' from the menu, then add the 'x64' platform to the solution platforms.
7. Replace the contents of Program.cs with this code:

```csharp
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

## Run the application

1. Download the `Wildlife.wmv` HD movie from the [Internet Archive](https://archive.org/download/WildlifeHd/Wildlife.wmv) and save it in `bin\x64\Debug` under the project's directory.
2. Run the application in Visual Studio. Wait a few seconds for the Transcoder to finish. The converted file `Wildlife.mp4` will be in the `bin\x64\Debug` directory.   
	
## Troubleshooting

* You may get a "'DllNotFoundException' exception: Unable to load DLL 'AVBlocks64.dll': The specified module could not be found." To fix that, copy the file 'AVBlocks64.dll' to `bin\x64\Debug` under the project's directory.

* Transcoder.Open may fail if there is already a file `Wildlife.mp4` in the `bin\x64\Debug` directory. Delete `Wildlife.mp4` to solve that.         
