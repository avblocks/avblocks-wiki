---
title: C++ Utility Classes and Functions
metadata:
    description: This topic lists the utility classes and functions used by the C++ code snippets on this wiki.
taxonomy:
    category: docs
---

# C++ Utility Classes and Functions

This topic lists the utility classes and functions used by the C++ code snippets on this site.

## Classes

### stdout_utf16

``` cpp
class stdout_utf16
{
public:
    stdout_utf16()
    {
        // Change stdout to Unicode. 
        // Cyrillic and Ideographic characters will appear in the console (console is unicode).
        _setmode(_fileno(stdout), _O_U16TEXT);
    }

    ~stdout_utf16()
    {
        // restore ANSI mode
        _setmode(_fileno(stdout), _O_TEXT); 
    }
};
```

## Functions

### getBitrateModeName

``` cpp
const char* getBitrateModeName(primo::codecs::BitrateMode::Enum bitrateMode)
{
    using namespace primo::codecs;

    switch (bitrateMode)
    {
        case BitrateMode::Unknown:  return "Unknown";
        case BitrateMode::ABR:      return "ABR";
        case BitrateMode::CBR:      return "CBR";
        case BitrateMode::VBR:      return "VBR";
    }
    return "???";
}
```

### getColorFormatName

``` cpp
const char* getColorFormatName(primo::codecs::ColorFormat::Enum color)
{
    using namespace primo::codecs;

    switch (color)
    {
        case ColorFormat::GRAY:     return "GRAY";
        case ColorFormat::Unknown:  return "Unknown";
        case ColorFormat::NV12:     return "NV12";
        case ColorFormat::BGR24:    return "BGR24";
        case ColorFormat::BGR32:    return "BGR32";
        case ColorFormat::BGR444:   return "BGR444";
        case ColorFormat::BGR555:   return "BGR555";
        case ColorFormat::BGR565:   return "BGR565";
        case ColorFormat::UYVY:     return "UYVY";
        case ColorFormat::Y411:     return "Y411";
        case ColorFormat::Y41P:     return "Y41P";
        case ColorFormat::YUV411:   return "YUV411";
        case ColorFormat::YUV420:   return "YUV420";
        case ColorFormat::YUV420A:  return "YUV420A";
        case ColorFormat::YUV422:   return "YUV422";
        case ColorFormat::YUV422A:  return "YUV422A";
        case ColorFormat::YUV444:   return "YUV444";
        case ColorFormat::YUV444A:  return "YUV444A";
        case ColorFormat::YUY2:     return "YUY2";
        case ColorFormat::YV12:     return "YV12";
        case ColorFormat::YVU9:     return "YVU9";
    }

    return "???";
}
```

### getScanTypeName

``` cpp
const char* getScanTypeName(primo::codecs::ScanType::Enum scanType)
{
    using namespace primo::codecs;

    switch (scanType)
    {
        case ScanType::Progressive:      return "Progressive";
        case ScanType::BottomFieldFirst: return "BottomFieldFirst";
        case ScanType::TopFieldFirst:    return "TopFieldFirst";
    }

    return "???";
}
```

### getMediaTypeName

``` cpp
const char* getMediaTypeName(primo::codecs::MediaType::Enum mediaType)
{
    using namespace primo::codecs;

    switch (mediaType)
    {
        case MediaType::Unknown:    return "Unknown";
        case MediaType::Audio:      return "Audio";
        case MediaType::Video:      return "Video";
    }

    return "???";
}
```

### getMetaPictureTypeName

``` cpp
const char* getMetaPictureTypeName(primo::codecs::MetaPictureType::Enum pictype)
{
    using namespace primo::codecs;

    switch (pictype)
    {
        case MetaPictureType::Other:                return "Other";
        case MetaPictureType::FileIcon:             return "FileIcon";
        case MetaPictureType::OtherFileIcon:        return "OtherFileIcon";
        case MetaPictureType::FrontCover:           return "FrontCover";
        case MetaPictureType::BackCover:            return "BackCover";
        case MetaPictureType::LeafletPage:          return "LeafletPage";
        case MetaPictureType::Media:                return "Media";
        case MetaPictureType::LeadArtist:           return "LeadArtist";
        case MetaPictureType::Artist:               return "Artist";
        case MetaPictureType::Conductor:            return "Conductor";
        case MetaPictureType::Band:                 return "Band";
        case MetaPictureType::Composer:             return "Composer";
        case MetaPictureType::TextWriter:           return "TextWriter";
        case MetaPictureType::RecordingLocation:    return "RecordingLocation";
        case MetaPictureType::DuringRecording:      return "DuringRecording";
        case MetaPictureType::DuringPerformance:    return "DuringPerformance";
        case MetaPictureType::VideoCapture:         return "VideoCapture";
        case MetaPictureType::BrightColoredFish:    return "BrightColoredFish";
        case MetaPictureType::Illustration:         return "Illustration";
        case MetaPictureType::ArtistLogotype:       return "ArtistLogotype";
        case MetaPictureType::PublisherLogotype:    return "PublisherLogotype";
    
        default: return "???";
    }
}
```

### getStreamSubTypeName

``` cpp
const char* getStreamSubTypeName(primo::codecs::StreamSubType::Enum streamSubType)
{
    using namespace primo::codecs;

    switch (streamSubType)
    {
        case StreamSubType::Unknown:            return "Unknown";
        case StreamSubType::AVC1:               return "AVC1";
        case StreamSubType::AAC_ADTS:           return "AAC_ADTS";
        case StreamSubType::AAC_ADIF:           return "AAC_ADIF";
        case StreamSubType::AAC_MP4:            return "AAC_MP4";
        case StreamSubType::MPEG_TS_BDAV :      return "MPEG_TS_BDAV";
        case StreamSubType::MPEG_Audio_Layer1:  return "MPEG_Audio_Layer1";
        case StreamSubType::MPEG_Audio_Layer2:  return "MPEG_Audio_Layer2";
        case StreamSubType::MPEG_Audio_Layer3:  return "MPEG_Audio_Layer3";
    }

    return "???";
}
```

### getStreamTypeName

``` cpp
const char* getStreamTypeName(primo::codecs::StreamType::Enum streamType )
{
    using namespace primo::codecs;

    switch (streamType)
    {
        // video codecs
        case StreamType::H261:              return "H261";
        case StreamType::H263:              return "H263";
        case StreamType::H264:              return "H264";
        case StreamType::MJPEG:             return "MJPEG";
        case StreamType::MPEG1_Video:       return "MPEG1_Video";
        case StreamType::MPEG2_Video:       return "MPEG2_Video";
        case StreamType::MPEG4_Video:       return "MPEG4_Video";
        case StreamType::UncompressedVideo: return "UncompressedVideo";
        case StreamType::Unknown:           return "Unknown";
        case StreamType::VC1:               return "VC1";
        case StreamType::WMV:               return "WMV";
        case StreamType::AVS:               return "AVS";
        case StreamType::VP8:               return "VP8";

        // audio codecs
        case StreamType::LPCM:              return "LPCM";
        case StreamType::ALAW_PCM:          return "ALAW_PCM";
        case StreamType::MULAW_PCM:         return "MULAW_PCM";
        case StreamType::G726_ADPCM:        return "G726_ADPCM";
        case StreamType::VIDEO_DVD_PCM:     return "VIDEO_DVD_PCM";
        case StreamType::AC3:               return "AC3";
        case StreamType::DTS:               return "DTS";
        case StreamType::MPEG_Audio:        return "MPEG_Audio";
        case StreamType::Vorbis:            return "Vorbis";
        case StreamType::AAC:               return "AAC";
        case StreamType::AMRNB:             return "AMRNB";
        case StreamType::AMRWB:             return "AMRWB";
        case StreamType::WMA:               return "WMA";

        // containers
        case StreamType::AVI:               return "AVI";
        case StreamType::MP4:               return "MP4";
        case StreamType::ASF:               return "ASF";
        case StreamType::MPEG_PS:           return "MPEG_PS";
        case StreamType::MPEG_TS:           return "MPEG_TS";
        case StreamType::MPEG_PES:          return "MPEG_PES";
        case StreamType::WAVE:              return "WAVE";
        case StreamType::FLV:               return "FLV";
        case StreamType::WebM:              return "WebM";
        case StreamType::OGG:               return "Ogg";
    }
    
    return "???";
}
```    