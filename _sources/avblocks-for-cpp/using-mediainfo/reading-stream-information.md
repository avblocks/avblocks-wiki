---
title: Reading stream information
metadata:
    description: This topic describes how to use MediaInfo to read audio and video stream information from a file.
taxonomy:
    category: docs
---

# Reading stream information

This topic describes how to use MediaInfo to read audio and video stream information from a file.

The code snippets in this article are from the [read_av_info_any_file](https://github.com/avblocks/avblocks-samples/tree/main/windows/cpp/samples/read_av_info_any_file) AVBlocks sample.


## Create a MediaInfo object

Use the `createXyz` functions from the `primo::avblocks::Library` namespace to create new AVBlocks objects. For example, the `createMediaInfo` function creates a new `MediaInfo` object.

``` cpp

auto info = primo::make_ref(Library::createMediaInfo());

// Code that uses MediaInfo goes here


```

## Load info from file

Call `setFile` for the default input socket and then call `open`.

``` cpp

auto info = primo::make_ref(Library::createMediaInfo());

info->inputs()->at(0)->setFile(opt.avfile.c_str());

if(info->open())
{
    printStreams(info.get());
    return true;
}
else
{
    printError(info->error());
    return false;
}

```

## Enumerate audio and video streams

1. Call `MediaInfo::outputs` to get list of output sockets
2. For each socket, call `MediaSocket::pins` to get the media pins 
3. For each pin, call `MediaPin::streamInfo` to get the pin's stream info
3. For each stream, call `StreamInfo::mediaType` to get the stream media type, e.g. audio or video
4. Depending on the media type, cast the generic `StreamInfo` object to `AudioStreamInfo` or `VideoStreamInfo`

<!-- end of list -->

``` cpp

void printStreams(MediaInfo* info)
{
    stdout_utf16 mode;

    wcout << L"file: " <<  info->inputs()->at(0)->file() << endl;

    for (int outSocketIndex = 0; outSocketIndex < info->outputs()->count(); outSocketIndex++)
    {
        MediaSocket * socket = info->outputs()->at(outSocketIndex);

        StreamType::Enum containerType = socket->streamType();
        wcout << L"container: " << getStreamTypeName(containerType) << endl;

        MediaPinList* pins = socket->pins();
        int32_t streamsCount = pins->count();
        wcout << L"streams: " << streamsCount << endl;
        wcout << endl;

        for (int i = 0; i < streamsCount; ++i)
        {
            StreamInfo* psi = pins->at(i)->streamInfo();

            MediaType::Enum mediaType = psi->mediaType();
            wcout << L"stream #" << i << " " << getMediaTypeName(mediaType) << endl;

            StreamType::Enum streamType = psi->streamType();
            wcout << L"type: " << getStreamTypeName(streamType);
            StreamSubType::Enum streamSubType = psi->streamSubType();
            wcout << L", subtype: " << getStreamSubTypeName(streamSubType) << endl;

            int32_t id = psi->ID();
            wcout << L"id: " << id << endl;

            double duration = psi->duration();
            wcout << L"duration: " << duration << endl;

            if (MediaType::Video == mediaType)
            {
                VideoStreamInfo* vsi = static_cast<VideoStreamInfo*>(psi);
                printVideo(vsi);
            }
            else if (MediaType::Audio == mediaType)
            {
                AudioStreamInfo* asi = static_cast<AudioStreamInfo*>(psi);
                printAudio(asi);
            }
            else
            {
                wcout << endl;
            }

            wcout << std::endl;
        }
    }
}

```

### Print video stream information

Call the methods of the {videostreaminfo-cpp}` ` class to get the properties of a video stream.

``` cpp

void printVideo(VideoStreamInfo* vsi)
{
    int32_t bitrate = vsi->bitrate();

    BitrateMode::Enum bitrateMode = (BitrateMode::Enum)vsi->bitrateMode();
    
    primo::codecs::ColorFormat::Enum color = vsi->colorFormat();
    
    int32_t dar_width  = vsi->displayRatioWidth();
    int32_t dar_height = vsi->displayRatioHeight();
    
    bool frameBottomUp = vsi->frameBottomUp() == TRUE;
    int32_t height = vsi->frameHeight();
    int32_t width = vsi->frameWidth();
    double rate = vsi->frameRate();
    
    ScanType::Enum scanType = vsi->scanType();

    wcout << L"bitrate: " << bitrate << L", mode: " << getBitrateModeName(bitrateMode) << endl;

    wcout << L"color format: " << getColorFormatName(color) << endl;

    wcout << L"display ratio: " <<  dar_width << L":" << dar_height << endl;

    wcout << L"frame bottom up: " << frameBottomUp << endl;
    wcout << L"frame size: " << width << L"x" << height << endl;
    wcout << L"frame rate: " << rate << endl;

    wcout << L"scan type: " << getScanTypeName(scanType) << endl;
}

```

### Print audio stream information

Call the methods of the AudioStreamInfo* class to get the properties of an audio stream.

``` cpp

void printAudio(AudioStreamInfo* asi)
{
    uint32_t bitrate = asi->bitrate();
    BitrateMode::Enum bitrateMode = (BitrateMode::Enum)asi->bitrateMode();

    uint32_t bitsPerSample = asi->bitsPerSample();
    uint32_t bytesPerFrame = asi->bytesPerFrame();
    
    uint32_t channelLayout = asi->channelLayout();
    uint32_t channels = asi->channels();
    
    uint32_t flags = asi->pcmFlags();
    
    uint32_t rate = asi->sampleRate();

    wcout << L"bitrate: " << bitrate << L", mode: " << getBitrateModeName(bitrateMode) << endl;

    wcout << L"bits per sample: " << bitsPerSample << endl;
    wcout << L"bytes per frame: " << bytesPerFrame << endl;
    
    wcout << L"channel layout: " << channelLayout << endl;
    wcout << L"channels: " << channels << endl;

    wcout << L"flags: " << flags << endl;
    
    wcout << L"sample rate: " << rate << endl;
}
```
