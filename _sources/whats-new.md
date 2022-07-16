---
title: What’s New
metadata:
    description: Discover what&#039;s new and improved in the latest AVBlocks version.
taxonomy:
    category: docs
toc:
    baselevel: 1                 # Base level for headings
    headinglevel: 2              # Maximum heading level to show in TOC    
---

# What’s New

## AVBlocks 2.3.1

### Samples

* New `hw_enc_avc_amd_file` sample

---

## AVBlocks 2.3

* Retire AVBlocks for DirectShow 

---

## AVBlocks 2.1

### Samples

* New `capture_ds_video_audio` sample that shows how to build a video recorder with AVBlocks and DirectShow. DirectShow is used for video capture and AVBlocks is used for audio/video encoding. Instead of using a single transcoder, separate transcoders are used for encoding and muxing. Encoded audio is saved to a separate file.
* New `dec_avc_au` sample that shows how to decode a AVC/H.264 stream. The sample uses a sequence of files to simulate a stream of AVC/H.264 Access Units and a Transcoder object to decode the AVC/H.264 Access Units to raw YUV video frames.  
* New `dec_avc_push` sample that shows how to use the Transcoder.Push method to decode AVC/H.264 Access Units (AU) to a YUV uncompressed video file.
* New `dec_avc_pull` sample that shows how to use the Transcoder.Pull method to decode an AVC/H.264 file to YUV uncompressed video file.
* New `demux_mp4_file` sample that shows how to extract the first audio and video elementary stream from an MP4 container and save each of the streams to a separate MP4 file. 
* New `dump_avc_au` sample that shows how to split an AVC/H.264 elementary stream to Access Units (AU). The sample accepts an input AVC/H.264 file and an output folder. The sample reads the input file and writes the H.264 access units to the output folder, each AU is written in a separate file. The sample also displays the NAL units within each access unit. 
* New `enc_mpg_dvd` sample that shows how to convert any supported video input to an MPEG-2 PS suitable for DVD-Video authoring.

---

## AVBlocks 2.0

### API

* The MediaInfo object now implements the Block abstract interface.  

### Samples

* New `overlay_mp4_png_file` sample. This sample shows how to place a watermark on a video file by blending a video file with a PNG image.

---

## AVBlocks 1.26

### API

* New Block abstract interface to serve as a base for future AVBlocks media components.
* The Transcoder object now implements the Block abstract interface. The next step will be to redo the MediaInfo object and implement it as a block / component.  

### Hardware Acceleration

* The CaptureDS sample uses AVC / H.264 hardware acceleration on modern hardware, e.g. Intel HD Graphics / QuickSync GPUs, NVIDIA Kepler GPUs and Maxwell GPUs, and AMD GCN 1, 2, 3 GPUs. 

### Samples
* New `dec_avc_file` sample. This sample shows how to use the Transcoder.Run method to decode an AVC / H.264 file to a YUV file.
* New `dump_avc_au` sample. This sample reads an AVC / H.264 elementary stream from a file and writes extracted AVC / H.264 AUs (Access Units) to a folder, each AU is written in a separate file, one AU per file.
* New `enc_avc_file` sample. This sample shows how to use the Transcoder.Run method to encode a raw YUV video file to a compressed AVC / H.264 video file. 
* New `enc_avc_push` sample. This sample shows how to use the Transcoder.Push method to encode a raw YUV video stream to compressed AVC / H.264 video file.
* New `overlay_yuv_jpegs_push_pull` sample. This sample takes as input a source yuv video and a directory of JPEG images, and produces a YUV video where each JPEG image is overlaid on top of the source video for "image count / duration" seconds.
* C++ sample projects on Windows have been upgraded to Visual Studio 2015 

### Transcoder 

#### Filters

##### Overlay

* The image overlay filter can handle PNG images with an alpha channel.

---

## AVBlocks 1.25

### Hardware Acceleration

* AVC / H.264 hardware accelerated encoding of interlaced content. 
 
---

## AVBlocks 1.24

### Transcoder

#### Containers

##### AVI

The AVI demuxing has been greatly improved. Now AVBlocks can handle almost any combination of audio and video codecs in an AVI container. For example MPEG-4 flavors like DivX and XviD in AVI are supported. MP3 and AAC audio in AVI are also supported.  

---

## AVBlocks 1.23

### Hardware Acceleration

* You can now enable or disable the use of specific hardware engines like AMD Video Codec Engine, NVIDIA NVENC, and Intel Quick Sync. For details, see the HwConfig* (C++) and Library.Config.Hardware (.NET) docs.  
* Real-time 4K AVC / H.264 encoding is now supported on AMD Radeon R9 285 / R9 380 (Tonga Pro, GCN 1.2, VCE 3.0)
* Vector extension optimization is enabled on AMD CPUs that support AVX. 

---

## AVBlocks 1.22

### Hardware Acceleration

* AMD Video Codec Engine 2 (VCE 2.0) and Video Codec Engine 3 (VCE 3.0) support via Media Foundation API. Thanks to VCE 2.0, it is now possible to use B-frames for AVC / H.264 encoding, and with VCE 3.0 it is possible to encode 4K AVC / H.264 30 FPS video in real-time. 

### Transcoder

* It is now possible to add watermark or channel logo to video by overlaying an image on top of video. The image position, transparency, and alpha compositing mode is controlled with the new [Param.Video.Overlay](http://doc.avblocks.com/net/1.22/class_primo_software_1_1_a_v_blocks_1_1_param_1_1_video_1_1_overlay.html) parameter set.

### Samples

* The .NET CLR 2 sample projects have been deprecated and removed from the AVBlocks package.
 
---

## AVBlocks 1.21

### Hardware Acceleration

* The new Hardware class allows enumeration of available hardware encoders at runtime. 

### Presets

* Added new MP3 encoding presets.
* Added new Windows Media Audio / WMA encoding presets.
* Added new AAC encoding presets.
* Added WebM / VP8 encoding presets.

### Transcoder

* HEVC / H.265 hardware acceleration using the NVENC chip on NVIDIA GPUs. This is available on NVIDIA GPUs based on Maxwell Gen. 2 architecture. 
* AVC / H.264 hardware acceleration using the NVENC chip on NVIDIA GPUs. This is available on NVIDIA GPUs based on Kepler and Maxwell architectures.

See [hardware acceleration](http://wiki.avblocks.com/wiki/about-avblocks/about-hardware-acceleration/) for more information. 

#### Codecs

##### HEVC / H.265

* NVIDIA NVENC hardware acceleration for HEVC / H.265  encoding

##### AVC / H.264

* NVIDIA NVENC hardware acceleration for AVC / H.264 encoding


#### Containers

##### MP4 (MPEG-4)

* AVBlocks can multiplex HEVC / H.265 elementary streams read and write MP4 files bigger than 4GB.

---

## AVBlocks 1.20

### Platforms
#### Windows 10

AVBlocks 1.20 has been fully tested on **Windows 10 Insider Preview**.

### Presets

Stream and parameter settings have been documented for all presets.

#### HTTP Live Streaming

* Added new [Apple HTTP Live Streaming](http://doc.avblocks.com/net/1.20/class_primo_software_1_1_a_v_blocks_1_1_preset_1_1_video_1_1_apple_live_streaming.html) presets.

### Transcoder

AVBlocks supports now AVC / H.264 hardware accelerated encoding. At the moment Intel Quick Sync Video and AMD Video Coding Engine architectures are supported. NVIDIA NVENC will be supported in August 2015. See the [hardware acceleration](http://wiki.avblocks.com/wiki/about-avblocks/about-hardware-acceleration/) wiki article for more information. 

#### Codecs

##### AVC / H.264

* Intel Quick Sync Video hardware acceleration for AVC / H.264 encoding
* AMD Video Coding Engine hardware acceleration for AVC / H.264 encoding

#### Containers

##### MP4

* AVBlocks can read and write MP4 files bigger than 4GB.


---

## AVBlocks 1.19

### Presets

#### HDV

* Added HDV 720P and HDV 1080i encoding [presets](http://doc.avblocks.com/cpp/1.19/namespaceprimo_1_1avblocks_1_1_preset_1_1_video_1_1_h_d_v.html). HDV is a format for recording of high-definition video on DV cassette tape. The HDV format was originally developed by JVC and supported by Sony, Canon, and Sharp.

#### MP4

* Added the [Generic](http://doc.avblocks.com/cpp/1.19/namespaceprimo_1_1avblocks_1_1_preset_1_1_video_1_1_generic_1_1_m_p4.html) and [Web](http://doc.avblocks.com/cpp/1.19/namespaceprimo_1_1avblocks_1_1_preset_1_1_video_1_1_web.html) MP4 presets.
 
### Transcoder

#### Containers

##### MPEG-2 TS (Transport Stream)

* The Transcoder can now be configured to deliver raw MPEG-2 TS packets and decoded audio and video elementary streams simultaneously to separate outputs. For example, this is useful when you have to analyze the raw MEPG-2 TS packets and at the same time decode the audio and video of a given MPEG-2 program.   

---

## AVBlocks 1.18

### Transcoder

#### Containers

##### MPEG-2 TS (Transport Stream)

* Transcoder can be configured to output MPEG-2 TS packets. 
* MPEG-2 TS packet filtering by Program Number or by Packet ID - by setting the Demuxer.Mpeg.ProgramNumber and Demuxer.Mpeg.PacketID parameters on an output MediaSocket. 
* Multiplexing of LPCM up to 96Khz, 1-7 channel into MPEG-2 transport stream is now supported.
 
---

## AVBlocks 1.17

### MediaInfo 

* The MediaInfo block has been extended to detect and report the stream subtype

### Samples

#### CaptureDS

* The CaptureDS sample has been extended to set the capture format directly from code without using the DirectShow built-in property pages.

#### ImageGrabber

* The new [ImageGrabber](https://bitbucket.org/primosoftware/avblocks-samples/src/default/windows/net/samples/ImageGrabber/) C# sample shows how to capture a 3D WPF animation to a MP4 / AVC / H.264 video.

#### MP4Muxer

* The new [MP4Muxer](https://bitbucket.org/primosoftware/avblocks-samples/src/default/windows/net/samples/MP4Muxer) sample shows how to multiplex AAC audio and AVC / H.264 video into a MP4 container. 

### Transcoder

#### Codecs

##### AAC

* The AAC encoder can now convert a bitstream from ADIF to ADTS to avoid re-encoding.    

#### Containers

##### MPEG-2 TS (Transport Stream)

* The Transcoder.Push method can now take raw MPEG-2 Transport Stream packets. That allows you to process MPEG-2 TS network streams in real time, e.g. MPEG-2 TS broadcast over UDP.
* The Transcoder block can be configured to output a separate data stream for MPEG-2 TS Program Specific Information (PSI) tables

---

## AVBlocks 1.16

### Samples

#### VideoSplitter

There is a new [VideoSplitter](https://bitbucket.org/primosoftware/avblocks-samples/src/default/windows/net/samples/VideoSplitter) sample that shows how you can cut a large video file to 10 second clips. 

The VideoSplitter sample is available in C# and C++ for Windows, and in C++ for Mac, Debian, and Ubuntu. 
 
---

## AVBlocks 1.15

### .NET

* The .NET API has been optimized to avoid memory copy between managed and native code.

### MediaBuffer

* The MediaBuffer interface has been enhanced significantly with abilities to use externally allocated buffers, buffer normalization and other useful improvements

### MediaInfo

* Added a new Push method and IsReady property to the MediaInfo class. That allows you to use MediaInfo to parse network streams

### MediaSocket

* Added StreamSubType property to the MediaSocket class

### Transcoder

#### Containers

##### MPEG-2 TS (Transport Stream) 

* Transcoder can now detect Teletext streams in MPEG-2 TS container
* Added a new ProgramID property to the StreamInfo class for easier handling of multi-program MPEG-2 transport streams (MPEG-2 TS)

##### MP4 (MPEG-4)

* The MP4 demuxer supports PCM audio tracks ('sowt' and 'twos' codecs) 
* The MP4 demuxer understands now version 1 of the `ctts` atom
 
---

## AVBlocks 1.14

### C++

* Working with ParamList in C++ is now a lot easier, because of the new `add` convenience methods, e.g. `ParamList::addInt(const char_t* name, int64_t value)`   

### Docs

* Added class diagrams to the online documentation

### Error Handling

* Correct error messages are returned for known COM errors on Windows.

###  MediaSample

* Added a picture type property to MediaSample. It is now possible to detect various frame types like I-frame, P-frame, B-frame, and D-frame. 

### Transcoder

#### Codecs

##### AVC / H.264

* The AVC / H.264 encoder now supports interlaced video output

##### MPEG-2 Video

* Performance and quality has been improved for MPEG-2 encoder when working in restricted Variable Bit Rate mode (VBR).

#### Containers

* Added support for *.MOD, *.TOD, and *.M2T file formats.

---

## AVBlocks 1.13

### C++

* Added enums and named constants for allowed parameter values. This makes using parameter a lot easier. Also a lot of parameter values are now better documented.  

### Docs

* On Windows, the .NET assembly XML documentation is now available together with the binaries. If you use Visual Studio, you should be able to see the AVBlocks documentation right in your code.
* On Mac, we now distribute an Apple doc set, so the AVBlocks documentation can be viewed right within Xcode.  

### Installers

* The Windows binaries are now packaged in a simple zip archive - no more self-extracting RAR executables. 

### Samples

#### ReEncode

* The new ReEncode sample for C++ and C# (.NET). The ReEncode sample takes an MP4 input and re-encodes the audio and video streams back into MP4 output again. 

### Transcoder

#### Codecs

##### AVC / H.264

* The AVC / H.264 encoder has been optimized and now uses all CPU cores to the fullest. The new parallel implementation is based on the [Windows Concurrency Runtime](http://msdn.microsoft.com/en-us/library/ee207192.aspx) on Windows, the [Grand Central Dispatch](https://developer.apple.com/library/mac/documentation/Performance/Reference/GCD_libdispatch_Ref) on Mac OS, and the [Intel Threading Building Blocks](https://www.threadingbuildingblocks.org/) on Linux.

#### Containers

##### MP4 (MPEG-4)

* The MP4 multiplexer allows remuxing of AVC / H.264 streams without transcoding.  

#### Parameters

* Added a new parameter that allows you to force stream re-encoding. This parameter can be set on individual pins to re-encode just the audio, the video or both streams. See [Param::ReEncode](http://doc.avblocks.com/cpp/1.13/namespaceprimo_1_1avblocks_1_1_param.html#a52e93dabac1da346b0b8a463a424ff59) (C++) and [Param.ReEncode](http://doc.avblocks.com/net/1.13/class_primo_software_1_1_a_v_blocks_1_1_param.html#af72c25fcde3cfe147247c847e6512ca2) (C#) for more details.

#### Presets

##### Fast AVC / H.264

* Added a new preset for fast AVC / H.264 encoding. This is useful for video capture applications that need to encode AVC / H.264 video in real-time.

##### Blu-ray

* The BDAV preset encodes AVC / H.264 video with 4 slices per picture when AVC / H.264 level is set to 4.1, as required by the BDAV specification.
 
---

## AVBlocks 1.12

### Samples 

#### AVMixer

* The new AVMixer sample shows how to compress and multiplex YUV video and LPCM audio into AVC / H.264 / AAC / MP4 file.

#### CaptureDS

* The CaptureDS .NET sample has been ported from C# to VB.NET.

### Transcoder

#### Codecs

##### AVC / H.264

* The AVC / H.264 Decoder has been optimized for 4K / 2160p video playback

##### MPEG-2 Video

* New encoding parameters to control the I/P/B picture distance and the Video Buffer Verifier buffer size. See MPEG2.IPDistance and MPEG2.VBVBufferSize for more details.
 
---

## AVBlocks 1.11

### Samples

#### PlayerGL

* The new PlayerGL sample shows how one can use AVBlocks and OpenGL to build a video player application. The PlayerGL sample is currently available in C++ and in C#.

### Transcoder

#### Presets

##### Blu-ray

* We added new encoding presets for Blu-ray Video. The new presets produce MPEG-2 Transport Streams compatible with the BDAV and the BDMV Blu-ray Disc specifications.       

---

## AVBlocks 1.10

### C++ 

* New macros and methods are now available to get the AVBlocks version at compile time and run time.

### MediaInfo

* Stream detection has been improved and is now more robust
    
### MediaSocket

* The MediaSocket factory functions have been moved to the Library namespace (C++ only)

### Samples 

* New CaptureDS sample demonstrates how to record video and audio from video camera to file. The code uses DirectShow for audio/video capture and AVBlocks for audio/video encoding. The CaptureDS sample is available both in C++ and in .NET (C#).
* The .NET ImageSequence sample is now available in VB.NET and C#.  

### Transcoder

#### Codecs

##### AVC / H.264

* AVC / H.264 encoder parameters are now better documented.
* New `AccessUnitDelimiters` parameter instructs the AVC / H.264 encoder to insert Access Unit Delimiters before each NALU  (Network Abstraction Layer Unit). Access Unit Delimiters are required by Apple Live HTTP Streaming tools like Apple's Media Stream Segmenter tool. For more information see the [AccessUnitDelimiters](http://doc.avblocks.com/cpp/1.10/namespaceprimo_1_1avblocks_1_1_param_1_1_encoder_1_1_video_1_1_h264.html#a54343bff676c170f67c2ad19ed0923b6) API documentation.

#### Containers

##### MP4 (MPEG-4)

* Transcoder will write the aspect ratio in a MP4 container when a AVC / H.264stream has non-square pixels.  

#### Presets

* Presets have been redefined as nested namespaces / classes and are much cleaner now. Going forward this will allow adding a great number of presets with less API clutter.
 
---

## AVBlocks 1.9

### Transcoder

#### Codecs

##### AAC

* Passthrough mode for AAC streams. AAC audio streams will be passed as is without re-encoding, when the audio output is the same as the input. This is especially useful for processing video part of a movie to different size or frame rate without touching the audio part.

#### Containers

##### MP4 (MPEG-4)

* MPEG-2 Video can now be used in a MP4 container (ISO/IEC 14496-14:2003)

#### Filters

##### Video Frame Rate Converter (VFRC)

* The video frame rate converter has been improved to reduce jitter. The jitter is now kept under +125 ms / -45 ms.

#### Parameters

##### ConcealDefects

The new `ConcealDefects` parameter instructs the decoders to conceal bitstream defects and errors. The `ConcealDefects` parameter is currently supported by the AVC / H.264 decoder and the MPEG-4 Visual decoder. For more information see the [ConcealDefects](http://doc.avblocks.com/cpp/1.9/namespaceprimo_1_1avblocks_1_1_param_1_1_decoder_1_1_video.html#a10c4d86e9335b1e293dc3b29bb688fa4) API documentation.
 
---

## AVBlocks 1.8

### Transcoder

#### Parameters

##### MaxDecFrameBuffering

The new `MaxDecFrameBuffering` parameter allows one to override the `max_dec_frame_buffering` field in the Video Usability Information (VUI) of a AVC / H.264 stream. For more information see the [MaxDecFrameBuffering](http://doc.avblocks.com/cpp/1.8/namespaceprimo_1_1avblocks_1_1_param_1_1_decoder_1_1_video_1_1_h264_1_1_v_u_i.html#details) API documentation.

---

## AVBlocks 1.7

### C++

#### Breaking Changes

* The `InterlaceType` enumeration has been renamed to ScanType*. 
* The `VideoStreamInfo::scanType` property default is `ScanType::Unknown` instead of `ScanType::Progressive`. If you rely on the previous behavior now you have to set `VideoStreamInfo::scanType` to `Progressive` explicitly. 

### Platforms

#### Debian (Squeeze and Wheezy)

The AVBlocks SDK is now available for Debian. Both Squeeze and Wheezy are fully supported and will be supported in future releases.

#### Microsoft DirectShow

Due to popular demand, we have started AVBlocks for DirectShow. We are starting with these filters for now: 

* MPEG-2 Video Encoder 
* MPEG Audio Encoder 
* MPEG Muxer

However, the plan going forward is, to expose most of the AVBlocks functionality through DirectShow components. If you need a particular DirectShow codec or effect, please drop us a word in the [AVBlocks Support Group]( http://groups.google.com/group/avblocks-support). 

### Transcoder

#### Codecs

##### MPEG-4 Video

* Push / pull support for `MPEG-4 Visual` elementary streams

#### Parameters

* Video parameters have been segmented by function for easier use.
* New video parameters for cropping, padding, resizing and deinterlacing: 
	* Crop (Left, Right, Top, Bottom)
	* Pad (Left, Right, Top, Bottom)
	* Resize Interpolation Method (Nearest Neighbor, Linear, Cubic, Super Sampling, Lanczos)
	* Deinterlacing Method (No Deinterlacing, Duplicate, Blend, Median, Edge Detect, Median Threshold, Content Adaptive Vertical Temporal Filtering)	

---

## AVBlocks 1.6

### Transcoder

#### Codecs

##### G.711

* G.711 A-Law and μ-Law audio codec. The new stream types are `ALAW_PCM` and `MULAW_PCM`. The supported container is WAVE.
* G.711 elementary streams are supported in `Transcoder::push`

##### G.726

* G.726 ADPCM audio codec. The new stream type is `G726_ADPCM`. The supported containers are WAVE and RTP. 
* G.726 elementary streams are supported in `Transcoder::push`
* New G.726 ADPCM stream subtypes:
	* `G726_PACKED_RFC3551`: G.726 stream packed according to RFC 3551. This type of packetization is used in RTP streams.
	* `G726_PACKED_AAL2`: G.726 stream packed according to ITU-T I.366.2 (AAL type 2). This type of packing is used in Wave files.

See StreamType* and StreamSubType* for details.
