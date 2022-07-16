---
title: MP4
metadata:
    description: This topic describes the MP4 muxer parameters. 
taxonomy:
    category: docs
---

# MP4

This topic describes the MP4 muxer parameters.

## Optimizing for progressive download or streaming 

Every MP4 file contains a **moov** atom that acts as an index of the video data. The index enables a player to play and scrub the file. Unfortunately, in an MPEG-4–compliant container, the **moov** atom is normally stored at the end of the file. To enable progressive download or streaming the **moov** atom has to be moved to the beginning of the file.      

There are three AVBlocks parameters that control the MP4 FastStart muxing. These parameters must be set on the output socket:  

### FastStart

If this parameter is set to **1**, the MP4 muxer will run a second pass to move the **moov** atom to the beginning of the file.

### FastStartUseTempFile

If this parameter is set to **1**, the MP4 muxer will use a temp file for the second pass. 

### FastStartTempFileDirectory

Specifies a directory for the temp file. If not set, the system temp path is used.

### Sample Code

Here is how you can set the MP4 FastStart parameters in C++:

``` cpp
auto transcoder = primo::make_ref(Library::createTranscoder());

// Transcoder demo mode must be enabled, 
// in order to use the production release for testing (without a valid license)
transcoder->setAllowDemoMode(1);

// Configure output socket
{
    // MP4 container socket 
    auto socket = primo::make_ref(Library::createMediaSocket());
    socket->setStreamType(StreamType::MP4);

    // The MP4 FastStart parameters must be set on the socket
    socket->params()->addInt(Param::Muxer::MP4::FastStart, 1);
    socket->params()->addInt(Param::Muxer::MP4::FastStartUseTempFile, 1);
    socket->params()->addString(Param::Muxer::MP4::FastStartTempFileDirectory, L"C:\\Temp");

    // H.264 video pin	
    {
        auto streamInfo = primo::make_ref(Library::createVideoStreamInfo());
        streamInfo->setStreamType(StreamType::H264);
        streamInfo->setStreamSubType(StreamSubType::AVC1);

        auto pin = primo::make_ref(Library::createMediaPin());
        pin->setStreamInfo(streamInfo.get());
        socket->pins()->add(pin.get());
    }

    // AAC audio pin	
    {
        auto streamInfo = primo::make_ref(Library::createAudioStreamInfo());
        streamInfo->setStreamType(StreamType::AAC);
        streamInfo->setStreamSubType(StreamSubType::AAC_MP4);

        auto pin = primo::make_ref(Library::createMediaPin());
        pin->setStreamInfo(streamInfo.get());
        socket->pins()->add(pin.get());
    }

    transcoder->outputs()->add(socket.get());
}
```
