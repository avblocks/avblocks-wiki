---
title: Create Video From JPEG Images
metadata:
    description: This topic describes how to make a video from a sequence of images with AVBlocks. It shows how to use the Transcoder, MediaSocket, and MediaPin classes.
taxonomy:
    category: docs
---

# Create Video From JPEG Images

How to use the Transcoder to make a video from a sequence of JPEG images.

The code snippets in this article are from the [Slideshow](https://github.com/avblocks/avblocks-samples/tree/main/windows/net/samples/Slideshow) sample app. 


## Create a Transcoder object

``` csharp
using (var transcoder = new Transcoder())
{
    // Transcoder demo mode must be enabled, 
    // in order to use the OEM release for testing (without a valid license).
    transcoder.AllowDemoMode = true;

    // Code that uses Transcoder goes here
}
```

## Configure inputs and outputs

Use the MediaSocket and MediaPin classes to configure the Trascoder inputs and outputs.

### Configure inputs

#### Detect the input stream      

If the input is a media file, you can use MediaInfo to read the stream information from the file. For images MediaInfo will return a VideoStreamInfo object readily configured with the image attributes. AVBlocks supports BMP, JPEG, PNG, and TIFF images.

``` csharp
// Configure Input
{
    MediaInfo medInfo = new MediaInfo();
    medInfo.InputFile = GetImagePath(0);
    
    result = medInfo.Load();
}
```

#### Configure the input socket

This requires the following steps:

1. Get a VideoStreamInfo object from MediaInfo
2. Create a MediaPin object and set the MediaPin.StreamInfo property.
3. Create a MediaSocket object and add the pin to MediaSocket.Pins.
4. Add the socket to Transcoder.Inputs.

<!-- end of list -->

``` csharp
// Configure Input
{
    VideoStreamInfo vidInfo = (VideoStreamInfo)medInfo.Streams[0];
    vidInfo.FrameRate = inputFrameRate;

    MediaPin pin = new MediaPin();
    pin.StreamInfo = vidInfo;

    MediaSocket socket = new MediaSocket();
    socket.Pins.Add(pin);

    transcoder.Inputs.Add(socket);
}
```

### Configure outputs

This requires the following steps:

1. Call the MediaSocket.FromPreset static method to create a MediaSocket object from a predefined preset
2. Set the MediaSocket.File property to the output filename.
3. Add the socket to Transcoder.Outputs.

<!-- end of list -->

``` csharp
MediaSocket socket = MediaSocket.FromPreset(opt.Preset);
socket.File = outFilename;

transcoder.Outputs.Add(socket);
```

## Encode images

This requires the following steps:

1. Call Transcoder.Open
2. Call Transcoder.Push for each image
3. Call Transcoder.Flush (always needed after pushing)
4. Call Transcoder.Close

<!-- end of list -->

``` csharp
result = transcoder.Open();
PrintError("Open Transcoder", transcoder.Error);
if (!result)
    return;

// Code that pushes image data goes here ...

transcoder.Close();
```

### Pushing image data

The code that pushes the image data is fairly simple. 

For each image:

1. Create a MediaBuffer object and load it with the image data.
2. Create a MediaSample, set the sample start time, and set the buffer with the image data.
3. Call Transcoder.Push and provide the media sample object.

<!-- end of list -->

``` csharp
for (int i = 0; i < imageCount; i++)
{
    string imagePath = GetImagePath(i);

    MediaBuffer mediaBuffer = new MediaBuffer(File.ReadAllBytes(imagePath));

    MediaSample mediaSample = new MediaSample();
    mediaSample.StartTime = i / inputFrameRate;
    mediaSample.Buffer = mediaBuffer;

    if (!transcoder.Push(0, mediaSample))
    {
        PrintError("Push Transcoder", transcoder.Error);
        return;
    }
}
```

When you are done pushing, call Transcoder.Flush to make sure all buffered data is processed.
  
``` csharp
result = transcoder.Flush();
PrintError("Flush Transcoder", transcoder.Error);
if (!result)
    return;
```

## Complete Program

Here is the complete sample:

``` csharp
Library.Initialize();

// Set license information. To run AVBlocks in demo mode, comment the next line out
// Library.SetLicense("<license-string>");

string outFilename = "cube." + opt.FileExtension;
const int imageCount = 250;
const double inputFrameRate = 25.0;

using (var transcoder = new Transcoder())
{
    // In order to use the OEM release for testing (without a valid license),
    // the transcoder demo mode must be enabled.
    transcoder.AllowDemoMode = true;

    try
    {
        bool result;

        File.Delete(outFilename);

        // Configure Input
        {
            MediaInfo medInfo = new MediaInfo();
            medInfo.InputFile = GetImagePath(0);
            
            result = medInfo.Load();
            PrintError("Load MediaInfo", medInfo.Error);
            if (!result)
                return;

            VideoStreamInfo vidInfo = (VideoStreamInfo)medInfo.Streams[0];
            vidInfo.FrameRate = inputFrameRate;

            MediaPin pin = new MediaPin();
            pin.StreamInfo = vidInfo;

            MediaSocket socket = new MediaSocket();
            socket.Pins.Add(pin);

            transcoder.Inputs.Add(socket);
        }

        // Configure Output
        {
            MediaSocket socket = MediaSocket.FromPreset(opt.Preset);
            socket.File = outFilename;

            transcoder.Outputs.Add(socket);
        }

        // Encode Images
        result = transcoder.Open();
        PrintError("Open Transcoder", transcoder.Error);
        if (!result)
            return;

        for (int i = 0; i < imageCount; i++)
        {
            string imagePath = GetImagePath(i);

            MediaBuffer mediaBuffer = new MediaBuffer(File.ReadAllBytes(imagePath));
        
            MediaSample mediaSample = new MediaSample();
            mediaSample.StartTime = i / inputFrameRate;
            mediaSample.Buffer = mediaBuffer;

            if (!transcoder.Push(0, mediaSample))
            {
                PrintError("Push Transcoder", transcoder.Error);
                return;
            }
        }

        result = transcoder.Flush();
        PrintError("Flush Transcoder", transcoder.Error);
        if (!result)
            return;

        transcoder.Close();
        Console.WriteLine("Output video: \"{0}\"", outFilename);
    }
    catch (Exception ex)
    {
        Console.WriteLine(ex.ToString());
    }
}

Library.Shutdown();
```

