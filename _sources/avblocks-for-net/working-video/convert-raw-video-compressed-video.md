---
title: Convert Raw Video To Compressed Video
metadata:
    description: This topic describes how to use the Transcoder class to convert a raw YUV video file into a compressed video file. The format of the output is configured with an AVBlocks preset.
taxonomy:
    category: docs
---

# Convert Raw Video To Compressed Video

How to use the Transcoder class to convert a raw YUV video file into a compressed video file. The format of the output is configured with an AVBlocks preset.

The code snippets in this article are from the [enc_yuv_preset_file](https://github.com/avblocks/avblocks-samples/tree/main/windows/net/samples/enc_yuv_preset_file) sample.

<!-- end of list -->

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

Use the MediaSocket class to configure media sockets and the MediaPin class to configure media pins.

### Configure video input

1. Create and configure a VideoStreamInfo object
2. Create a MediaPin object and set the MediaPin.StreamInfo property.
3. Create a MediaSocket object and add the pin to MediaSocket.Pins.
4. Add the socket to Transcoder.Inputs.

<!-- end of list -->

``` csharp
// Configure input
// The input stream frame rate determines the playback speed
var instream = new VideoStreamInfo {
    StreamType = PrimoSoftware.AVBlocks.StreamType.UncompressedVideo,
    FrameRate = opt.YuvFps, 
    FrameWidth = opt.YuvWidth,
    FrameHeight = opt.YuvHeight,
    ColorFormat = opt.YuvColor.Id,
    ScanType = ScanType.Progressive
};

var inpin = new MediaPin {
    StreamInfo = instream
};

var insocket = new MediaSocket {
    StreamType = PrimoSoftware.AVBlocks.StreamType.UncompressedVideo,
    File = opt.YuvFile
};

insocket.Pins.Add(inpin);

transcoder.Inputs.Add(insocket);
```

### Configure video output

1. Call the MediaSocket.FromPreset static method to create a MediaSocket object for a predefined preset
2. Set the MediaSocket.File property to the output filename.
3. Add the socket to Transcoder.Outputs.

<!-- end of list -->

``` csharp
// Configure output
var outsocket = MediaSocket.FromPreset(opt.OutputPreset.Name);
outsocket.File = opt.OutputFile;

transcoder.Outputs.Add(outsocket);
```

## Run Transcoder

1. Call the Transcoder.Open method.
2. Call the Transcoder.Run method.
3. Call the Transcoder.Close method.

<!-- end of list -->

``` csharp
bool res = transcoder.Open();
PrintError("Open Transcoder", transcoder.Error);
if (!res)
    return false;

res = transcoder.Run();
PrintError("Run Transcoder", transcoder.Error);
if (!res)
    return false;

transcoder.Close();
```

## The complete `Encode` method

``` csharp
static bool Encode(Options opt)
{
    using (var transcoder = new Transcoder())
    {
        // Transcoder demo mode must be enabled, 
        // in order to use the OEM release for testing (without a valid license).
        transcoder.AllowDemoMode = true;

        // Configure input
        // The input stream frame rate determines the playback speed
        var instream = new VideoStreamInfo {
            StreamType = PrimoSoftware.AVBlocks.StreamType.UncompressedVideo,
            FrameRate = opt.YuvFps, 
            FrameWidth = opt.YuvWidth,
            FrameHeight = opt.YuvHeight,
            ColorFormat = opt.YuvColor.Id,
            ScanType = ScanType.Progressive
        };

        var inpin = new MediaPin {
            StreamInfo = instream
        };

        var insocket = new MediaSocket {
            StreamType = PrimoSoftware.AVBlocks.StreamType.UncompressedVideo,
            File = opt.YuvFile
        };

        insocket.Pins.Add(inpin);

        transcoder.Inputs.Add(insocket);

        // Configure output
        var outsocket = MediaSocket.FromPreset(opt.OutputPreset.Name);
        outsocket.File = opt.OutputFile;

        transcoder.Outputs.Add(outsocket);

        bool res = transcoder.Open();
        PrintError("Open Transcoder", transcoder.Error);
        if (!res)
            return false;

        res = transcoder.Run();
        PrintError("Run Transcoder", transcoder.Error);
        if (!res)
            return false;

        transcoder.Close();
    }

    return true;
}
```

