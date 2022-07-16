---
title: Reading stream information
metadata:
    description: This section describes how to use MediaInfo to read audio and video stream information from a file.
taxonomy:
    category: docs
---

# Reading stream information

This section describes how to use MediaInfo to read audio and video stream information from a file.

The code snippets in this section are from the [read_av_info_any_file](https://github.com/avblocks/avblocks-samples/tree/main/windows/net/samples/read_av_info_any_file) AVBlocks sample.

<!-- end of list -->

## Create a MediaInfo object

Use the standard new operator to create AVBlocks objects.

``` csharp

using (MediaInfo info = new MediaInfo())
{
    // Code that uses MediaInfo goes here
}

```
## Load info from file

Set `File` of the default input, then call `Open`.

``` csharp

static bool PrintAVInfo(string inputFile)
{
    using (MediaInfo info = new MediaInfo())
    {
        info.Inputs[0].File = inputFile;

        if (!info.Open())
        {
            PrintError("MediaInfo Open", info.Error);
            return false;
        }

        PrintStreams(info);
    }
    
    return true;
}

```

## Enumerate audio and video streams

1. Use `MediaInfo.Outputs` to get list of output sockets
2. For each socket, go through the `MediaSocket.Pins` collection 
3. For each pin, use `MediaPin.StreamInfo` to get the pin's stream info
3. For each stream, use `StreamInfo.MediaType` to get the stream media type, e.g. audio or video
4. Depending on the media type, cast the generic `StreamInfo` object to `AudioStreamInfo` or `VideoStreamInfo`

<!-- end of list -->

``` csharp

static void PrintStreams(MediaInfo mediaInfo)
{
    foreach (var socket in mediaInfo.Outputs)
    {
        Console.WriteLine("container: {0}", socket.StreamType);
        Console.WriteLine("streams: {0}", socket.Pins.Count);

        for(int streamIndex = 0; streamIndex < socket.Pins.Count; streamIndex++)
        {
            StreamInfo si = socket.Pins[streamIndex].StreamInfo;
            Console.WriteLine();
            Console.WriteLine("stream #{0} {1}", streamIndex, si.MediaType);
            Console.WriteLine("type: {0}", si.StreamType);
            Console.WriteLine("subtype: {0}", si.StreamSubType);
            Console.WriteLine("id: {0}", si.ID);
            Console.WriteLine("duration: {0:f3}", si.Duration);

            if (MediaType.Video == si.MediaType)
            {
                VideoStreamInfo vsi = si as VideoStreamInfo;
                PrintVideo(vsi);
            }
            else if (MediaType.Audio == si.MediaType)
            {
                AudioStreamInfo asi = si as AudioStreamInfo;
                PrintAudio(asi);
            }
            else
            {
                Console.WriteLine();
            }
        }

        Console.WriteLine();
    }
}

```

### Print video stream information

Use the properties of the VideoStreamInfo class to get the properties of a video stream.

``` csharp

static void PrintVideo(VideoStreamInfo vsi)
{
    Console.WriteLine("bitrate: {0} mode: {1}", vsi.Bitrate, vsi.BitrateMode);

    Console.WriteLine("color format: {0}", vsi.ColorFormat);

    Console.WriteLine("display ratio: {0}:{1}", vsi.DisplayRatioWidth, vsi.DisplayRatioHeight);

    Console.WriteLine("frame bottom up: {0}", vsi.FrameBottomUp);
    Console.WriteLine("frame size: {0}x{1}", vsi.FrameWidth, vsi.FrameHeight);
    Console.WriteLine("frame rate: {0:f3}", vsi.FrameRate);

    Console.WriteLine("scan type: {0}", vsi.ScanType);
}
        
```

### Print audio stream information

Use the properties of the AudioStreamInfo class to get the properties of an audio stream.

``` csharp

static void PrintAudio(AudioStreamInfo asi)
{
    Console.WriteLine("bitrate: {0} mode: {1}", asi.Bitrate, asi.BitrateMode);

    Console.WriteLine("bits per sample: {0}", asi.BitsPerSample);
    Console.WriteLine("bytes per frame: {0}", asi.BytesPerFrame);

    Console.WriteLine("channel layout: {0:X}", asi.ChannelLayout);
    Console.WriteLine("channels: {0}", asi.Channels);

    Console.WriteLine("flags: {0:X}", asi.PcmFlags);

    Console.WriteLine("sample rate: {0}", asi.SampleRate);
}

```

