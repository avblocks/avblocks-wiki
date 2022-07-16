---
title: Mux Audio and Video Into MP4
metadata:
    description: This topic describes how to use the Transcoder class to mux AAC audio and H.264 video into an MP4 file.
taxonomy:
    category: docs
---

# Mux Audio and Video Into MP4

This topic describes how to use the Transcoder class to mux AAC audio and H.264 video into an MP4 file.

The code snippets in this article are from the [mux_mp4_avc_aac_file](https://github.com/avblocks/avblocks-samples/tree/main/windows/cpp/samples/mux_mp4_avc_aac_file) sample.

## Complete C++ code

``` cpp
bool MP4Mux(const Options& opt)
{
    auto transcoder = primo::make_ref(Library::createTranscoder());

    // Transcoder demo mode must be enabled, 
    // in order to use the production release for testing (without a valid license)
    transcoder->setAllowDemoMode(TRUE);

    bool audioStreamDetected = false;
    bool videoStreamDetected = false;

    for(int i = 0; i < (int)opt.input_files.size(); i++)
    {
        auto mediaInfo = primo::make_ref(Library::createMediaInfo());
        mediaInfo->setInputFile(opt.input_files[i].c_str());

        if (!mediaInfo->load())
        {
            printError(L"mediaInfo.Load", mediaInfo->error());
            return false;
        }

        auto inputSocket = primo::make_ref(Library::createMediaSocket(mediaInfo.get()));

        for(int j = 0; j < inputSocket->pins()->count(); j++)
        {
            MediaPin *pin = inputSocket->pins()->at(j);

            if(pin->streamInfo()->streamType() == StreamType::H264)
            {
                if(videoStreamDetected)
                {
                    pin->setConnection(PinConnection::Disabled);
                }
                else
                {
                    videoStreamDetected = true;
                    wcout << "Muxing video input: " << opt.input_files[i] << std::endl;
                }
            }
            else if(pin->streamInfo()->streamType() == StreamType::AAC)
            {
                if(audioStreamDetected)
                {
                    pin->setConnection(PinConnection::Disabled);
                }
                else
                {
                    audioStreamDetected = true;
                    wcout << "Muxing audio input: " << opt.input_files[i] << std::endl;
                }
            }
            else
            {
                pin->setConnection(PinConnection::Disabled);
            }
        }

        transcoder->inputs()->add(inputSocket.get());
    }

    // Configure output
    {
        auto socket = primo::make_ref(Library::createMediaSocket());
        socket->setFile(opt.output_file.c_str());
        socket->setStreamType(StreamType::MP4);

        if(videoStreamDetected)
        {
            auto streamInfo = primo::make_ref(Library::createVideoStreamInfo());
            streamInfo->setStreamType(StreamType::H264);
            streamInfo->setStreamSubType(StreamSubType::AVC1);

            auto pin = primo::make_ref(Library::createMediaPin());
            pin->setStreamInfo(streamInfo.get());
            socket->pins()->add(pin.get());
        }

        if(audioStreamDetected)
        {
            auto streamInfo = primo::make_ref(Library::createAudioStreamInfo());
            streamInfo->setStreamType(StreamType::AAC);
            streamInfo->setStreamSubType(StreamSubType::AAC_MP4);

            auto pin = primo::make_ref(Library::createMediaPin());
            pin->setStreamInfo(streamInfo.get());
            socket->pins()->add(pin.get());
        }

        if(opt.fast_start)
        {
            socket->params()->addInt(Param::Muxer::MP4::FastStart, 1);
        }

        transcoder->outputs()->add(socket.get());
    }

    bool_t res = transcoder->open();
    printError(L"Open Transcoder", transcoder->error());
    if (!res)
        return false;

    res = transcoder->run();
    printError(L"Run Transcoder", transcoder->error());

    transcoder->close();

    return res ? true : false;
}
```
