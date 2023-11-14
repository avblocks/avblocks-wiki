---
title: Mux Audio and Video Into MP4
metadata:
    description: This topic describes how to use the Transcoder class to mux AAC audio and H.264 video into an MP4 file.
taxonomy:
    category: docs
---

# Mux Audio and Video Into MP4

This topic describes how to use the Transcoder class to mux AAC audio and H.264 video into an MP4 file.

The code snippets in this article are from the [mux_mp4_file](https://github.com/avblocks/avblocks-cpp/tree/main/samples/windows/mux_mp4_file) sample.

## Complete C++ code

``` cpp
bool MP4Mux(const Options& opt)
{
    deleteFile(opt.output_file.c_str());

    primo::ref<Transcoder> transcoder (Library::createTranscoder());

    // Transcoder demo mode must be enabled, 
    // in order to use the production release for testing (without a valid license)
    transcoder->setAllowDemoMode(TRUE);

    primo::ref<MediaSocket> outputSocket(Library::createMediaSocket());
    outputSocket->setFile(opt.output_file.c_str());
    outputSocket->setStreamType(StreamType::MP4);

    // audio
    for(int i = 0; i < (int)opt.input_audio.size(); i++)
    {
        primo::ref<MediaPin> outputPin(Library::createMediaPin());
        primo::ref<AudioStreamInfo> asi(Library::createAudioStreamInfo());
        asi->setStreamType(StreamType::AAC);
        outputPin->setStreamInfo(asi.get());

        outputSocket->pins()->add(outputPin.get());

        primo::ref<MediaSocket> inputSocket(Library::createMediaSocket());
        inputSocket->setFile(opt.input_audio[i].c_str());
        inputSocket->setStreamType(StreamType::MP4);
        transcoder->inputs()->add(inputSocket.get());

        wcout << "Muxing audio input: " << opt.input_audio[i] << endl;
    }

    // video
    for (int i = 0; i < (int)opt.input_video.size(); i++)
    {
        primo::ref<MediaPin> outputPin(Library::createMediaPin());
        primo::ref<VideoStreamInfo> vsi(Library::createVideoStreamInfo());
        vsi->setStreamType(StreamType::H264);
        outputPin->setStreamInfo(vsi.get());

        outputSocket->pins()->add(outputPin.get());

        primo::ref<MediaSocket> inputSocket(Library::createMediaSocket());
        inputSocket->setFile(opt.input_video[i].c_str());
        inputSocket->setStreamType(StreamType::MP4);
        transcoder->inputs()->add(inputSocket.get());

        wcout << "Muxing video input: " << opt.input_video[i] << endl;
    }

    transcoder->outputs()->add(outputSocket.get());

    if (!transcoder->open())
    {
        printError(L"Open Transcoder", transcoder->error());
        return false;
    }
    
    if (!transcoder->run())
    {
        printError(L"Run Transcoder", transcoder->error());
        return false;
    }

    transcoder->close();

    wcout << "Output file: " << opt.output_file << endl;
        
    return true;
}
```
