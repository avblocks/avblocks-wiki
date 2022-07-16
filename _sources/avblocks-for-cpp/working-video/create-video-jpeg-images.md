---
title: Create Video From JPEG Images
metadata:
    description: This topic describes how to make a video from a sequence of images with AVBlocks. It shows how to use the Transcoder, MediaSocket, and MediaPin classes.
taxonomy:
    category: docs
---

# Create Video From JPEG Images

This topic describes how to use the {transcoder-cpp}` ` class to make a video from a sequence of images.

The code snippets in this article are from the [Slideshow](https://github.com/avblocks/avblocks-samples/tree/main/windows/cpp/samples/Slideshow) sample.

## Create a Transcoder object

Use the `createTranscoder` function from the `primo::avblocks::Library` namespace to create a new {transcoder-cpp}` ` object.

``` cpp
auto transcoder = primo::make_ref(Library::createTranscoder());

// Transcoder demo mode must be enabled, 
// in order to use the production release for testing (without a valid license)
transcoder->setAllowDemoMode(TRUE);
```

### Configure inputs

#### Detect the input stream      

If the input is a media file, you can use {mediainfo-cpp}` ` to read the stream information from the file. For images {mediainfo-cpp}` ` will return a {videostreaminfo-cpp}` ` object readily configured with the image attributes. AVBlocks supports BMP, JPEG, PNG, and TIFF images.

``` cpp
// Load image info
auto info = primo::make_ref(Library::createMediaInfo());
{
    wstring firstImage(imgdir);
    firstImage.append(L"\\cube0000.jpeg");

    info->setInputFile(firstImage.c_str());

    res = info->load();
    printError(L"Load Info", info->error());
    if (!res)
        return 1;
}
```

#### Configure the input socket

This requires the following steps:

1. Get a {videostreaminfo-cpp}` ` object from {mediainfo-cpp}` `
2. Create a {mediapin-cpp}` ` object and call the `MediaPin::setStreamInfo` method.
3. Create a {mediasocket-cpp}` ` object and add the pin to `MediaSocket::pins`.
4. Add the socket to `Transcoder::inputs`.

<!-- end of list -->

``` cpp
// Configure input
{
    VideoStreamInfo *vinfo = (VideoStreamInfo*) info->streams()->at(0);
    vinfo->setFrameRate(inputFramerate);

    auto pin = primo::make_ref(Library::createMediaPin());
    pin->setStreamInfo(vinfo);

    auto socket = primo::make_ref(Library::createMediaSocket());
    socket->pins()->add(pin.get());

    transcoder->inputs()->add(socket.get());
}
```

### Configure outputs

This requires the following steps:

1. Call the `Library::createMediaSocket` static method to create a {mediasocket-cpp}` ` object from a predefined preset
2. Call the `MediaSocket::setFile` method with the output filename
3. Add the socket to `Transcoder::outputs`

<!-- end of list -->

``` cpp
// Configure output
{
    auto socket = primo::make_ref(Library::createMediaSocket(opt.preset.c_str()));
    socket->setFile(outFilename.c_str());

    transcoder->outputs()->add(socket.get());
}
```

## Encode images

This requires the following steps:

1. Call `Transcoder::open`
2. Call `Transcoder::push` for each image
3. Call `Transcoder::flush` (always needed after pushing)
4. Call `Transcoder::close`

<!-- end of list -->

``` cpp
res = transcoder->open();
printError(L"Open Transcoder", transcoder->error());
if (!res)
    return 1;

// Code that pushes image data goes here ...

res = transcoder->flush();
printError(L"Flush Transcoder", transcoder->error());

transcoder->close();
wcout << L"Output video: \"" << outFilename << L"\"" << endl;
```

### Push image data

The code that pushes the image data is fairly simple. 

For each image:

1. Create a {mediasample-cpp}` ` object
2. Create a {mediabuffer-cpp}` ` object and load it with the image data
3. Set the sample start time, and set the sample buffer with the image data
4. Call `Transcoder::push` and with the media sample object

<!-- end of list -->

``` cpp
// Encode images
auto mediaSample = primo::make_ref(Library::createMediaSample());

for(int i = 0; i < imageCount; i++)
{
    WCHAR imgfile[MAX_PATH];
    wsprintf(imgfile, L"%s\\cube%04d.jpeg", imgdir.c_str(), i);
    
    auto buffer = primo::make_ref(createMediaBufferForFile(imgfile));

    mediaSample->setBuffer(buffer.get());
    
    // the correct start time is required by the transcoder
    mediaSample->setStartTime(i / inputFramerate);

    res = transcoder->push(0, mediaSample.get());
    if (!res)
    {
        printError(L"Push Transcoder", transcoder->error());
        return 1;
    }
}
```

``` cpp
MediaBuffer* createMediaBufferForFile(const wchar_t* filename)
{
    HANDLE h = CreateFile(filename, GENERIC_READ, FILE_SHARE_READ, NULL, OPEN_EXISTING, 0, NULL);
    if (INVALID_HANDLE_VALUE == h)
        return NULL;

    int32_t imgsize = GetFileSize(h, NULL);

    MediaBuffer* mediaBuffer = Library::createMediaBuffer(imgsize);
    
    DWORD bytesRead;
    ReadFile(h, mediaBuffer->start(), imgsize, &bytesRead, NULL);
    
    mediaBuffer->setData(0, imgsize);
    
    CloseHandle(h);
    
    return mediaBuffer;
}
```

When you are done pushing, call `Transcoder::flush` to make sure all buffered data is processed.
  
``` cpp
res = transcoder->flush();
printError(L"Flush Transcoder", transcoder->error());
```

## Complete C++ code

Here is the complete sample:

``` cpp
int _tmain(int argc, wchar_t* argv[])
{
    Options opt =  parseCommandLineOptions(argc, argv);
    
    if (opt.error || opt.help)
    {
        help();
        return 1;
    }
    
    if (opt.preset.empty())
    {
        wcout << "No preset!" << endl;
        help();
        return 1;
    }

    primo::avblocks::Library::initialize();

    const double inputFramerate = 25.0;
    const int imageCount = 250;
    bool_t res;
    
    wstring imgdir( getExeDir() );
    imgdir.append(L"\\..\\sample-resources\\img");

    wstring outFilename (getExeDir());
    outFilename.append(L"\\cube.");
    outFilename.append(opt.fileExtension);
    DeleteFile(outFilename.c_str());

    auto transcoder = primo::make_ref(Library::createTranscoder());

    // Transcoder demo mode must be enabled, 
    // in order to use the production release for testing (without a valid license)
    transcoder->setAllowDemoMode(TRUE);

    // Load image info
    auto info = primo::make_ref(Library::createMediaInfo());
    {
        wstring firstImage(imgdir);
        firstImage.append(L"\\cube0000.jpeg");

        info->setInputFile(firstImage.c_str());

        res = info->load();
        printError(L"Load Info", info->error());
        if (!res)
            return 1;
    }

    // Configure input
    {
        VideoStreamInfo *vinfo = (VideoStreamInfo*) info->streams()->at(0);
        vinfo->setFrameRate(inputFramerate);

        auto pin = primo::make_ref(Library::createMediaPin());
        pin->setStreamInfo(vinfo);

        auto socket = primo::make_ref(Library::createMediaSocket());
        socket->pins()->add(pin.get());

        transcoder->inputs()->add(socket.get());
    }
    

    // Configure output
    {
        auto socket = primo::make_ref(Library::createMediaSocket(opt.preset.c_str()));
        socket->setFile(outFilename.c_str());

        transcoder->outputs()->add(socket.get());
    }

    res = transcoder->open();
    printError(L"Open Transcoder", transcoder->error());
    if (!res)
        return 1;

    // Encode images
    auto mediaSample = primo::make_ref(Library::createMediaSample());

    for(int i = 0; i < imageCount; i++)
    {
        WCHAR imgfile[MAX_PATH];
        wsprintf(imgfile, L"%s\\cube%04d.jpeg", imgdir.c_str(), i);
        
        auto buffer = primo::make_ref(createMediaBufferForFile(imgfile));

        mediaSample->setBuffer(buffer.get());
        
        // the correct start time is required by the transcoder
        mediaSample->setStartTime(i / inputFramerate);

        res = transcoder->push(0, mediaSample.get());
        if (!res)
        {
            printError(L"Push Transcoder", transcoder->error());
            return 1;
        }
    }

    res = transcoder->flush();
    printError(L"Flush Transcoder", transcoder->error());

    transcoder->close();
    wcout << L"Output video: \"" << outFilename << L"\"" << endl;

    primo::avblocks::Library::shutdown();

    return 0;
}
```

``` cpp
MediaBuffer* createMediaBufferForFile(const wchar_t* filename)
{
    HANDLE h = CreateFile(filename, GENERIC_READ, FILE_SHARE_READ, NULL, OPEN_EXISTING, 0, NULL);
    if (INVALID_HANDLE_VALUE == h)
        return NULL;

    int32_t imgsize = GetFileSize(h, NULL);

    MediaBuffer* mediaBuffer = Library::createMediaBuffer(imgsize);
    
    DWORD bytesRead;
    ReadFile(h, mediaBuffer->start(), imgsize, &bytesRead, NULL);
    
    mediaBuffer->setData(0, imgsize);
    
    CloseHandle(h);
    
    return mediaBuffer;
}
```

