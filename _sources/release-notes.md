---
title: Release Notes
metadata:
    description: This topic describes the changes in each version of AVBlocks.
taxonomy:
    category: docs
toc:
    baselevel: 1                 # Base level for headings
    headinglevel: 2              # Maximum heading level to show in TOC    
---

# Release Notes

## Version 2.3.2

### Bug

* [AVB-1190] - Clicks in the resulting mp3 file when doing 256kbps / CBR encoding
* [AVB-1183] - Windows: AVBlocks has hard dependency on Media Foundation \(mfplat.dll\)
* [AVB-1133] - Transcoder returns "No codec" on AMD GPU R9 200 series GCN 1.0 with VCE 1.0

### Story

* [AVB-1119] - Wiki: New post about audio resampling in C\+\+

---
## Version 2.3.1

### Bug

* [AVB-1170] - Clicks in the resulting mp3 file when doing 320kbps / CBR encoding
* [AVB-1167] - MP4: Invalid stream error when demuxing MP4 file with `pvat` atom in it
* [AVB-1125] - Cannot open certain MP3 file and convert them to PCM

### Story

* [AVB-1159] - Wiki: C\+\+: Update error handling pages for latest AVBlocks version
* [AVB-1158] - Wiki: .Net: Update error handling pages for latest AVBlocks version
* [AVB-1156] - Samples: macOS: Switch projects to Xcode 9
* [AVB-1154] - Wiki: .Net: Update simple converter pages with latest code
* [AVB-1153] - Wiki: C\+\+: Update simple converter pages with latest code
* [AVB-1139] - Wiki: Clarify that the NVIDIA Kepler GK208, Maxwell GM108 and Pascal GP108 chipsets do not have hardware encoder chip
* [AVB-959] - Samples: New `hw_enc_avc_amd_file` sample
* [AVB-682] - Installer: Mac: Distribute AVBlocks as a simple zip file

---
## Version 2.3

### Story

* [AVB-1117] - Retire AVBlocks for DirectShow

---
## Version 2.2

### Bug

* [AVB-1082] - Transcoder: Transcoder returns a BufferFull error even when it consumes the whole input sample
* [PC-254] - Encoder: AAC: the encoded audio is slightly shorter than the input PCM
* [PC-255] - Encoder: MP3: the encoded audio is slightly shorter than the input PCM

### Story

* [AVB-796] - Samples: C#: New `hw_caps` sample
* [AVB-957] - Samples: New `hw_enc_avc_intel_file` sample
* [AVB-977] - Samples: New `demux_mp4_avc_aac_file` sample
* [AVB-980] - Samples: New `mux_mp4_remux_file` sample
* [AVB-984] - Samples: New `mux_mp4_file` sample
* [AVB-1079] - Samples: New `enc_aac_adif_file`
* [AVB-1080] - Samples: New `enc_aac_adts_file`
* [AVB-1083] - Samples: New `enc_aac_au_file`
* [AVB-1084] - Samples: New `enc_aac_adts_pull` sample
* [AVB-1085] - Samples: New `enc_aac_au_pull` sample
* [AVB-1087] - Encoders: AAC: Configure stereo mode via parameter
* [AVB-1088] - Encoders: MP3: Configure stereo mode via parameter.
* [PC-251] - Document stereo modes (`PrimoSoftware.AVBlocks.StereoMode`)

---
## Version 2.1

### Bug

* [AVB-1030] - Mac: Filters: Overlay: Contour between transparent and opaque area
* [AVB-1037] - Mac: Segmentation fault while decoding H.264 stream in MPEG-2 PS container and reporting progress
* [AVB-1053] - Docs: C++: MediaInfo documentation is garbage
* [AVB-1054] - Docs: C#: Deprecated MediaInfo methods and properties are not visible.
* [AVB-1055] - Docs: C#: Main page content is not rendered correctly.
* [AVB-1059] - Codecs: H.264: Intel Quick Sync Video: Encoding fails with unsupported format/operation on Windows 7
* [AVB-1060] - WMV and WMA decoders not flushed properly. Could lose the last decoded frame.
* [AVB-1073] - Encoders: AAC: Cannot encode AAC with Push or Pull in .NET
* [AVB-1081] - Transcoder freezes when an empty sample is pushed

### Story

* [AVB-217] - Samples: C++: `dec_avc_au` should work with pre-processed files that contain one AVC / H.264 AU (Access Unit) per file.
* [AVB-244] - Samples: C#: New `dec_avc_au` sample
* [AVB-809] - Samples: C++: New `dec_avc_push` sample
* [AVB-810] - Samples: C#: New `dec_avc_push` sample
* [AVB-811] - Samples: C++: New `dec_avc_pull` sample
* [AVB-812] - Samples: C#: New `dec_avc_pull` sample
* [AVB-893] - Samples: C#: New `dump_avc_au` sample
* [AVB-954] - Samples: Rename `sample-resources` directory to `assets`
* [AVB-976] - Params: Rename Overlay::BackgroundX and BackgroundY to LocationX and LocationY
* [AVB-983] - Samples: New `demux_mp4_file` sample
* [AVB-1001] - Docs: Document the relation between NumBFrames and NumRefFrames H.264 parameters.
* [AVB-1021] - Samples: New `enc_mpg_dvd` sample
* [AVB-1031] - Samples: C++: New `overlay_yuv_jpegs_push_pull` sample
* [AVB-1056] - Remove API deprecated before 2.0
* [AVB-1061] - Samples: New `capture_ds_video_audio` sample


---
## Version 2.0

### Bug

* [PC-248] - Codecs: MP3: Incorrect duration when ID3 data is garbage
* [AVB-990] - Codecs: VP8: Tests fail occasionally on Linux
* [AVB-1017] - Transcoder: Muxer error when splitting a M4V to 1MB clips
* [AVB-1024] - Transcoder: Demuxer error when splitting M4V to 1MB clips
* [AVB-1026] - Transcoder: Muxer error when splitting M4V by time

### Story

* [AVB-220] - Samples: C++: New `dump_avc_au` sample
* [AVB-709] - MediaInfo: New MediaInfo block (breaking change)
* [AVB-758] - Blocks: C++: Immutable block inputs and outputs (breaking change)
* [AVB-798] - Samples: C++: New `overlay_mp4_png_file` sample
* [AVB-799] - Samples: C#: New `overlay_mp4_png_file` sample
* [AVB-915] - Samples: Rename `decode_jpeg_push` to `dec_jpeg_push`
* [AVB-918] - Samples: Rename `YuvEncoder` to `enc_yuv_preset_file`
* [AVB-923] - Block: Rename the `Stop` method to `EndOfStream` (breaking change)
* [AVB-931] - Blocks: .NET: Immutable block inputs and outputs (breaking change)
* [AVB-941] - Samples: C#: New `overlay_yuv_jpegs_push_pull` sample

---
## Version 1.26

### Bug

* [AVB-925] - Transcoder: AccessViolationException in `Transcoder.Close` after `Transcoder.Run` when `Run` returns false.
* [AVB-926] - Transcoder: Overlay image not added during MP4 to MP4 conversion
* [AVB-930] - Encoding 32-bit or 8-bit audio to output preset produces only noise
* [AVB-952] - Samples: CaptureDS: Transcoder is not flushed when recording is stopped
* [AVB-991] - Linux: Demo overlay is missing
* [AVB-1014] - Demuxers: MP4: Cannot decode MP3 audio from MP4 files created by some DVR systems.
* [PC-234] - Codecs: H.264: AMD MFT encoder crashes if closed without flush
* [PC-238] - Codecs: H.264: Intel QuickSync Media encoder sporadic failure

### Story
* [AVB-220] - Samples: C++: New `dump_avc_au` sample
* [AVB-617] - Blocks: New Block abstract class
* [AVB-758] - API: C++: Immutable block inputs and outputs
* [AVB-805] - Samples: C# and VB.NET: Isolate and hide command line parsing code
* [AVB-813] - Samples: C++: Rename H264NaluDecoder to `dec_avc_au`
* [AVB-837] - Samples: C++: New `enc_avc_push` sample
* [AVB-838] - Samples: C#: New `enc_avc_push` sample
* [AVB-861] - Blocks: Transcoder Block
* [AVB-869] - Samples: C++: New `dec_avc_file` sample
* [AVB-870] - Samples: C#: New `dec_avc_file` sample
* [AVB-871] - Samples: C++: New `enc_avc_file` sample
* [AVB-872] - Samples: C#: New `enc_avc_file` sample
* [AVB-892] - Samples: C++: Isolate and hide command line parsing code
* [AVB-913] - Samples: Rename `mp4_mix_yuv_pcm` to `enc_mp4_avc_aac_push`
* [AVB-914] - Samples: Rename `MP4Muxer` to `mux_mp4_avc_aac_file`
* [AVB-917] - Samples: Rename `VideoSplitter` to `split_mp4_pull_push`
* [AVB-919] - Samples: Rename `AVInfo` to `read_av_info_any_file`
* [AVB-921] - Samples: Rename `MetaInfo` to `read_metadata_any_file`
* [AVB-924] - Filters: Overlay: Handle images with alpha channel
* [AVB-927] - Samples: CaptureDS: Enable hardware acceleration
* [AVB-936] - Samples: Exit with non-zero code on error
* [AVB-941] - Samples: C#: New `overlay_yuv_jpegs_push_pull` sample
* [AVB-943] - Docs: Clarify that device ID must be used for the HardwareDevice parameter.
* [AVB-955] - API: Return frame size from frame dimensions and color format
* [AVB-1013] - Windows: Upgrade C++ sample projects to Visual Studio 2015


---
## Version 1.25

### Improvement

* [AVB-879] - Docs: StreamSubType: Update the docs for Mpeg1System and Mpeg2System
* [AVB-895] - Improve interlaced encoding in hardware and software encoders

### Bug

* [AVB-335] - Some WMA presets produce output files with varying duration / size.
* [AVB-885] - Intel QSV: Some of the existing H.264 tests fail when hardware encoding is used
* [AVB-887] - AMD VCE MFT: Some of the existing H.264 tests fail when hardware encoding is used
* [AVB-894] - Intel QSV: The H.264 encoding may fail if a monitor is not connected to the Intel GPU device.
* [AVB-896] - Cannot decode MP4 (H.264) video files created by some DVR systems.

---

## Version 1.24

### Improvement

* [AVB-736] - Samples: Rename `AVMixer` to `mp4_mix_yuv_pcm`
* [AVB-815] - Samples: C++: Set working directory to be  ..\..\lib\ for easier debugging
* [AVB-882] - Transcoder: Tests: Add more unit tests for AVI to MP4 transcoding 

### Bug

* [AVB-337] - The test rgb24_to_mpeg2ps_write produces an output file with varying duration/size.
* [AVB-340] - MediaInfo: ScanType is not detected correctly for interlaced video in Debug/x64
* [PC-136] - Decoders: AVC / H.264 SW: Frames are reordered when decoding 4K video input

---

## Version 1.23

### New Feature

* [AVB-828] - Enable / disable hardware platforms at a Library level
* [PC-183] - Codecs: H.264: AMD/WMF: Real-time 4K encoding on AMD Radeon R9 285 / R9 380 (Tonga Pro, GCN 1.2, VCE 3.0) 

### Improvement

* [PC-102] - Use vector extensions on AMD CPUs

### Bug

* [AVB-841] - Encoders: H.264: AMD/WMF: NumRefFrames parameter is ignored


---
## Version 1.22

### New Feature

* [AVB-787] - API: Allow to set image overlay through VideoStreamInfo parameter

### Improvement

* [AVB-738] - Transcoder: AMD VCE hardware acceleration for H.264 encoding (via MFT)
* [AVB-761] - Docs: Transcoder: Document the MediaSample format for each stream supported by `Transcoder.Push`
* [AVB-768] - Samples: .NET:  Deprecate the .NET CLR 2 projects
* [AVB-802] - Transcoder: Return `Library not initialized` if Library.Initialize has not been called.

### Bug

* [AVB-717] - Audio and video out of sync when H.264 uses B-frames in MP4 container
* [AVB-807] - Muxers: MP4: Transcoding with NVIDIA NVENC and Intel QuickSync encoders fails for certain H.264 settings.
* [AVB-829] - Hardware: Windows: GPU reset during hardware enumeration on Windows Server 2012 R2+ with XFX AMD R7 260X (Core Edition) GPU, Driver 14.12
* [PC-115] - Crash in AAC encoder with some combinations of sample rate and bitrate
* [PC-161] - Encoders: AVC / H.264 SW: Multiple encodings with B-frames do not produce exactly the same output.
* [PC-171] - Encoders: H.264: AMD/WMF: Hang on Window Server 2012 R2+ with XFX AMD R7 260X GPU (Double Dissipation Edition), Driver 14.12


---
## Version 1.21

### New Feature

* [AVB-234] - Presets: MP3 presets
* [AVB-235] - Presets: WMA Presets
* [AVB-236] - Presets: AAC Presets
* [AVB-705] - Transcoder: NVIDIA hardware acceleration for H.264 encoding
* [AVB-706] - Transcoder: NVIDIA hardware acceleration for H.265 encoding
* [AVB-710] - Presets: WebM / VP8 encoding presets
* [AVB-718] - Hardware: New API for encoding hardware enumeration. 
* [PC-106] - MediaBuffer: Add Clone method.
* [PC-107] - MediaSample: Add Clone method.
* [PC-108] - Muxers: MP4: Support H.265 elementary stream
* [PC-157] - MediaPin: Add Clone method
* [PC-158] - MediaSocket: Add Clone method

### Improvement

* [AVB-161] - Presets: H.264 and AAC encoder default parameters should match the Web preset
* [AVB-321] - Presets: Remove the sampling rate from the MP4_H264 preset
* [AVB-720] - Docs: MediaSocket: Improve TimePosition member docs
* [AVB-730] - Codecs: H.264: The TreatBFramesAsReference param should be `false` by default.
* [AVB-733] - Presets: Move all preset definitions under nested namespaces / classes.
* [AVB-756] - Docs: MediaSocket: .NET: Clarify the time unit for MediaSocket.TimePosition property.
* [AVB-759] - MediaBuffer: .NET: DataOffset property should be read-only
* [AVB-760] - MediaBuffer: .NET: DataSize property should be read-only
* [AVB-794] - Apple Live Streaming Presets: Change the audio sampling rate from 44100Hz to 48000Hz
* [PC-125] - Codecs: H.264: Intel QSV: Parameter default values should match the software H.264 encoder
* [PC-126] - Codecs: H.264: AMD VCE: Parameter default values should match the software H.264 encoder
* [PC-127] - Codecs: H.264: NVIDIA NVENC: Parameter default values should match the software H.264 encoder
* [PC-138] - StreamSubType: Add `AVCC` enum value and `AVC1` alias.
* [PC-139] - StreamSubType: Add `None` enum value
* [PC-140] - StreamSubType: Add `AVC_Annex_B` enum value
* [PC-153] - Muxers: MP4: Update AVCDecoderConfigurationRecord from the H.264 bitstream data
* [PC-160] - Docs: Document that Media Foundation feature must be installed on Windows Server to be able to use Windows Media codecs

### Bug

* [AVB-65] - Regression: Transcoding a wmv input (with non-explicit/missing fps) to mp4 output fails with a muxer error
* [AVB-755] - StreamInfo.Bitrate setting is doubled by the H.264 software encoder
* [AVB-765] - Samples: H264NaluDecoder C++ does not work
* [AVB-770] - Codecs: NVIDIA NVENC H.264: The NVENC H.264 encoder does not use ProfileIdc param,  output bitstream profile is always set to High.
* [AVB-783] - Process stops abruptly when Hardware::refresh() is called on a system with new AMD drivers (15.7.1)

***

## Version 1.20

This release has been tested on **Windows 10 Insider Preview**.

### New Feature

* [AVB-233] - Presets: Additional Apple HTTP Live Streaming presets
* [AVB-698] - Transcoder: Intel QuickSync hardware acceleration for H.264 encoding
* [AVB-707] - Transcoder: AMD Video Coding Engine hardware acceleration for H.264 encoding

### Improvement

* [AVB-510] - Docs: Presets: Document stream and parameter settings used in presets.
* [AVB-684] - MediaSocket: MediaSocket.FromMediaInfo should call MediaInfo.Load
* [AVB-693] - Change the demo watermark text
* [AVB-708] - Transcoder: Return more specific error code and message when frame has uneven dimensions
* [PC-36] - Muxers: MP4: Support writing MP4 files bigger than 4GB
* [PC-101] - Demuxers: MP4: Support reading MP4 files bigger than 4GB

### Bug

* [AVB-688] - Transcoder: Video is truncated when MPEG-2 TS is transcoded to DVD_NTSC_PCM preset
* [AVB-689] - Transcoder: Some MPEG-2 TS streams cannot be transcoded in push mode


***

## Version 1.19

### New Feature

* [AVB-147] - Presets: HDV 720P / HDV 1080i encoding presets
* [AVB-232] - Presets: Additional MP4 presets
* [AVB-570] - Transcoder: Deliver MPEG-2 TS packets and decoded elementary streams to different outputs of the same transcoder

### Bug

* [AVB-65] - Transcoding a wmv input (with non-explicit/missing fps) to mp4 output fails with a muxer error
* [AVB-357] - The test "mpg_convert_vsize_convert_abitrate" fails on OS X
* [AVB-676] - Demuxers: The MPEG-TS demuxer cannot process more than 20 streams
* [AVB-683] - Audio decoder (Mpeg Audio, AAC) flush does not work. Some audio samples are lost.
* [AVB-686] - Docs: C++: Nested namespaces under primo::avblocks::Preset are not visible
* [AVB-687] - The test "mpegts_h264_aac_to_mp4_remux" produces an output with damaged audio.
	
***

## Version 1.18

### New Feature

* [AVB-569] - Transcoder: Support MPEG-2 TS packets as output. 
* [AVB-572] - Transcoder: Filter MPEG-2 TS packet by program number or packet ID
* [AVB-653] - Transcoder: Mux up to 96Khz, 1-7 channel, 16 bit LPCM in MPEG-2 transport stream

### Improvement

* [AVB-201] - Samples: Windows: C++: Add precompiled header for MetaInfo sample
* [AVB-202] - Samples: Windows: C++: Add precompiled header for AVInfo sample
* [AVB-207] - Samples: YUVEncoder: C++ and .NET: Use default options when started without command line parameters
* [AVB-208] - Samples: StreamDecoder: C++ and .NET: Use default options when started without command line parameters
* [AVB-209] - Samples: StreamEncoder: C++ and .NET: Use default options when started without command line parameters
* [AVB-215] - Samples: AVInfo: C++ and .NET: Use a default media file when started without parameters
* [AVB-216] - Samples: MetaInfo: C++ and .NET: Use a default media file when started without parameters
* [AVB-411] - Samples: Slideshow: Use ipad.mp4.h264.720p preset as default when preset not set via command line
* [AVB-412] - Samples: Slideshow: Present the same choice of presets in .NET and C++ on all platforms
* [AVB-478] - Samples: AVInfo and MetaInfo: C++: Update to use `primo::ref` and `auto`
* [AVB-528] - Params: C++: Add the missing ParamList::addByteArray method
* [AVB-673] - StreamInfo: Rename `StreamInfo.ProgramID` to `StreamInfo.ProgramNumber`

### Bug

* [AVB-610] - Muxer: Setting Param.Muxer.MP4.FastStartUseTempFile to true produces black video with no audio
* [AVB-651] - Visual artifacts when encoding from YUV to H.264

***

## Version 1.17

### New Feature

* [AVB-183] - Samples: New MP4Muxer sample
* [AVB-527] - Transcoder: Support MPEG-2 TS in Transcoder.Push
* [AVB-559] - Samples: .NET: New ImageGrabber WPF sample

### Improvement

* [AVB-320] - Codecs: AAC: Convert bitstream from ADIF to ADTS to avoid re-encoding.
* [AVB-529] - Samples: CaptureDS: Set capture format without using the built-in property page
* [AVB-534] - Docs: Improve the MediaPin.Connection docs
* [AVB-536] - Demuxers: MPEG2-TS: Generate a separate data stream for Program Specific Information (PSI) tables 
* [AVB-554] - MediaInfo: Extend to report system subtype

### Bug

* [AVB-560] - Cannot parse a wav file containing a muLaw audio stream
* [AVB-573] - Transcoder.Pull returns multiple PCM audio samples with the same startTime
* [AVB-578] - Cannot read an MPEG-2 Program Stream encoded with PrimoMpeg
* [AVB-601] - Crash in Transcoder.Open when the input is a raw G.711 or G.726 file (no container)
* [AVB-609] - Muxer: Output artefacts when using Param.Muxer.MP4.FastStart with some clips

***

## Version 1.16

### New Feature
* [AVB-557] - Samples: New VideoSplitter sample that shows how to split a file to short clips

### Bug
* [AVB-565] - Cannot transcode mulaw (wav) to mp3
* [AVB-577] - Race condition when using Transcoder.Open from multiple threads.

***

## Version 1.15

### New Feature
* [PC-72]   - Detect Teletext stream in TS
* [AVB-333] - Demuxers:  MP4: Support PCM audio tracks ('sowt' and 'twos' codecs) 
* [AVB-525] - StreamInfo: ProgramID and StreamID properties for multi-program transport streams (mpeg2-ts)
* [AVB-538] - MediaInfo: Allow data stream processing via a Push method

### Improvement
* [AVB-173] - MediaBuffer: Improve MediaBuffer interface and Buffer helper class
* [AVB-437] - .NET: Avoid memory copy between managed and unmanaged code
* [AVB-546] - Demuxers: MP4: Support ctts atom version 1
* [AVB-552] - Fix VCD related presets to produce MPEG1-PS
* [AVB-553] - .NET: Add MediaSocket.StreamSubType to the .NET API

### Bug
* [AVB-425] - Samples: CaptureDS: Recording stops with an error after only a few seconds
* [AVB-535] - Demuxers: MPEG-TS: PAT has to be the first packet in a captured TS file in order to detect available programs and streams
* [AVB-543] - AAC stream not recognized in a MOV container
* [AVB-551] - Crash when using MPEG_PES stream type for output.

***

## Version 1.14

### New Feature

* [AVB-500] - Transcoder: Support H.264 interlaced video output
* [AVB-503] - Support *.MOD and *.TOD file formats
* [AVB-504] - Add picture type to MediaSample
* [AVB-517] - Support *.M2T file format
	
### Improvement

* [AVB-475] - MPEG-2 Encoder: Improve performance and quality in restricted VBR mode
* [AVB-506] - Params: MediaSocket and MediaPin.Params collections should be readily available.
* [AVB-509] - MediaInfo: Windows: Return the correct error message for known COM errors.
* [AVB-512] - Params: C++: Add convenience "add" methods to ParamList, e.g. ParamList::addInt(const char_t* name, int64_t value)
* [AVB-520] - Docs: Add class diagrams

### Bug

* [AVB-507] - MediaSocket: Calling FromMediaInfo multiple times creates media sockets linked to the same StreamInfo instance
    
***

## Version 1.13.1

### Bug

* [AVB-513] - Cannot play H.264 MP4 video on Windows 7 SP1

## Version 1.13

### New Feature

* [AVB-319] - Add a parameter to force/request re-encoding in case the input and output formats are equivalent
* [AVB-486] - Presets: Add a preset for fast H.264 encoding
* [AVB-487] - Samples: C++: New ReEncode sample
* [AVB-488] - Samples: .NET: New ReEncode sample

### Improvement

* [AVB-63] - H.264 Encoder: Improve performance by using all CPU cores.
* [AVB-310] - MP4: Remux H.264 without transcoding
* [AVB-403] - Installer: Windows: Replace the current self-extracting RAR packages with zip archives
* [AVB-450] - API: Add enums or named constants for allowed and documented parameter values
* [AVB-489] - Docs: Windows: .Net: Include XML documentation for Visual Studio
* [AVB-490] - Docs: Mac: Include  a docset for XCode
* [AVB-499] - Presets: BDAV: Encode H.264 video with 4 slices per picture if level is 4.1

***

## Version 1.12

### New Feature

* [AVB-406] - Transcoder: H.264 Decoder: Optimize for 4K / 2160p / 30fps playback
* [AVB-462] - Add more MPEG-1/2 encoding parameters (I/P/B pics, VBV buffer size)
* [AVB-470] - Samples: CaptureDS sample in VB.NET
	
### Improvement

* [AVB-419] - BDAV: Pad last LPCM frame to 5ms at end of stream
* [AVB-430] - VideoOverlay filter should work in place to avoid needless memory copy
* [AVB-431] - Apply ColorSpaceConverter and Resize filter in order that guarantees an intermediate frame with the smallest size. 
* [AVB-432] - Transcoder: Pull: MediaBuffer should stay valid until parent MediaSample is released. 
* [AVB-433] - Samples: New AVMixer sample shows how to compress and multiplex YUV video and LPCM audio into H.264, AAC, MP4
* [AVB-458] - CaptureDS sample: add custom output sockets and recording without audio input

### Bug

* [AVB-424] - Samples: CaptureDS crashes when recording to webm.vp8.vorbis preset
* [AVB-435] - H264 Encoder: Mac: Visual defects in the video produced by the AVMixer sample
* [AVB-439] - Samples: Segmentation fault in console samples when output preset is not specified
* [AVB-446] - Transcoder: .NET: Input configured with MediaSocket.File does not work
* [AVB-459] - MPEG 1/2 Video encoder: TV system/standard is always PAL
* [AVB-472] - TIFF images cannot be opened/parsed on a clean Ubuntu 14.04
* [AVB-473] - Crash when encoding mpeg-1 video on 8 core system

***

## Version 1.11

### New Feature

* [AVB-154] - Blu-ray Encoding Presets (.m2ts)
* [AVB-354] - Samples: C++: PlayerGL sample for Windows
* [AVB-355] - Samples: .NET: PlayerGL sample for Windows
* [AVB-377] - Support LPCM in a BDAV format (M2TS)
* [AVB-379] - Support AVC/H.264 in a BDAV format (M2TS)

### Improvement

* [AVB-210] - Samples: Rename PullPushDecoder sample to H264NaluDecoder
* [AVB-211] - Samples: AudioConverter: Handle .dat, .mpe, .mpeg, .mpeg4, .ogm in File Open dialog
* [AVB-212] - Samples: VideoConverter: Handle .dat, .mpe, .mpeg, .mpeg4, .ogm in File Open dialog
* [AVB-222] - Samples: Add reference counting to the sample FileStream implementation.
* [AVB-383] - Samples: Rename the `ImageSequence` sample to `Slideshow`
* [AVB-400] - AVBlocks-Samples: Wiki: Simplify end-user instructions
* [AVB-402] - Samples: Rename DirectShowInput sample to InputDS
	
### Bug

* [AVB-218] - Samples: H264NaluDecoder ignores the --frame and ---rate command line options. 
* [AVB-392] - H.264 decoder high CPU usage
* [AVB-393] - Demo logo is upside down when transcoder output is set to BGR24 BottomUp

***

## Version 1.10

### Story

* [AVB-365] - Samples: C++: CaptureDS sample for Windows
* [AVB-366] - Samples: .NET: CaptureDS sample

### New Feature

* [AVB-328] - API: Add functions to get library version and description
* [AVB-359] - New AccessUnitDelimiters H.264 encoder parameter

### Improvement

* [AVB-237] - Redefine presets as nested namespaces / classes.
* [AVB-299] - Better documentation of H.264 encoder parameters.
* [AVB-348] - Make stream detection more robust
* [AVB-364] - Samples: ImageSequence in VB.NET
* [AVB-374] - Write aspect ratio in the MP4 container when an  H.264/AVC stream has non-square pixels
* [AVB-376] - C++ API: Replace MediaSocket static creating functions with Library equivalents

### Bug

* [AVB-259] - The video frame rate filter is not used when it is set explicitly
* [AVB-367] - Missing sample-resources subfolders in windows packages.
* [AVB-368] - Progress report causes out of range exception in sample app.
* [AVB-373] - Aspect ratio not detected for an H.264/AVC stream in MP4 container
* [AVB-375] - Cannot transcode from WMA Lossless to WMA Pro

***

## Version 1.9

### Story

* [PC-54] - Enable placing of MPEG-2 video in a MPEG-4 container (mp4)

### New Feature

* [AVB-322] - Pass AAC streams from the MP4 demuxer to the MP4 muxer without re-encoding

### Improvement

* [AVB-302] - Reduce the jitter in the video frame rate converter to less than +125 ms / -45 ms.
* [AVB-338] - Change ErrorInfo::message() to return an empty string instead of NULL.
* [AVB-346] - Linux: Include the missing library name as a hint in case of MissingDependency error

### Task

* [AVB-329] - API Docs: Clarify MediaBuffer usage in Transcoder::push()
* [AVB-349] - API Docs: Update the description of StreamType::H264 and StreamSubType::AVC1
* [AVB-351] - API Docs: Document the `ConcealDefects` parameter

### Bug

* [AVB-136] - Demo version fails when video output is set to NV12 YUV
* [AVB-219] - Transcoder returns `Operation not implemented` (facility:5 code:5) when output color format is set to `Gray` 
* [AVB-301] - Converting H.264 4K (mp4) to a AVBlocks preset produces a small file with no video stream
* [AVB-325] - Transcoder stops with an error when decoding specific MPEG-4 Visual streams
* [AVB-330] - Crash when an H.264 stream is decoded repeatedly many times
* [AVB-331] - Incorrect ID3v2 header size written when using MP3 presets
* [AVB-334] - WebM splitter does not report normalized DAR (e.g.1280/720 instead of 16/9)
* [AVB-336] - MPEG Audio splitter does not fill the StreamSubtype info
* [AVB-341] - Demuxer / Splitter names reported as NULL for certain splitters
* [AVB-342] - Images cannot be opened/parsed on clean Ubuntu 12.04
* [AVB-343] - Linux: UnsupportedFormat (instead of MissingDependency) error when loading images on fresh Ubuntu 12.04
* [AVB-347] - MPEG4-Visual decoder does not ignore stuffing bytes
* [AVB-352] - Some streams may cause access violation in the MPEG-4 Visual decoder
* [PC-43] - Heap corruption in MP4 muxer when a stream is configured with framerate=0

***

## Version 1.8.1

### Bug

* [AVB-309] - License not accepted on Linux distributions other than Debian and Ubuntu
* [AVB-313] - Mac: ImageSequence C++ sample does not compile.
* [AVB-318] - Crash while decoding MP4 with AAC audio at 44.1 KHz

***

## Version 1.8

### Epic

* [AVB-298] - H.264 Decoder: Provide a way to override Video Usability Information / VUI (spans multiple releases)
	* Sub-task 
		* [AVB-307] - Add Param::Decoder::Video::H264::VUI::MaxDecFrameBuffering

### Bug

* [AVB-297] - Transcoding WMV to MPEG2 produces output shorter than the input

***
 
## Version 1.7

### Story

*   [AVB-155] - Transcoder: Push / pull support for MPEG-4 Visual elementary stream
*   [AVB-193] - DirectShow Filters: MPEG-2 Video, MPEG Audio and MPEG Muxer
*   [AVB-195] - Enable the use of Crop/Pad parameters
*   [AVB-196] - By default make sure that the video is not distorted if the input/output aspect ratios differ
*   [AVB-252] - Production version should return error if it finds that a license has expired.
*   [AVB-261] - Add IntParameter to supported parameter types in AVBlocks
*   [AVB-283] - AVBlocks on Debian

### Improvement

*   [AVB-225] - Use explicit values for public enumerations and document the actual values
*   [AVB-266] - Segment Param::Video parameters by function
*   [AVB-267] - Parameter refactoring
*   [AVB-274] - When printing errors sample apps must check for a null error message
*   [AVB-288] - API Docs: Update Transcoder::flush() documentation
*   [AVB-292] - Keep the input interlaced type if the output is not set explicitly
*   [AVB-293] - Rename primo::codecs::InterlaceType to primo::codecs::ScanType (Breaking change)
*   [AVB-295] - Change VideoStreamInfo::ScanType default value from ScanType::Progressive to ScanType::Unknown (Breaking change)

### Bug

*   [AVB-224] - Fix the ErrorFacility constants in .NET to be the same as the C++ constants
*   [AVB-263] - API Docs: Typo in MediaBuffer::data description
*   [AVB-273] - Null message for the new UnlicensedFeature error
*   [AVB-275] - Samples: Fix wrong calls to WriteFile (Windows)
*   [AVB-290] - Push decoding broken for H.264 interlaced streams in some specific cases

***

## Version 1.6.1

### Bug

*   [AVB-189] - iPad / H.264 / AAC and iPad / H.264 HD / AAC presets produce choppy audio.
*   [AVB-199] - .NET: ImageSequence sample could not find input images
*   [AVB-221] - Samples: StreamEncoder crashes on error.
*   [AVB-226] - Mac and Ubuntu: MetaInfo sample does not handle unicode metadata values.
*   [AVB-227] - Mac and Ubuntu: StreamEncoder and YuvEncoder samples: Duplicate extension of output filename, e.g. `.mp4.mp4` instead of just `.mp4`.
*   [AVB-228] - Samples: StreamDecoder crashes on error.
*   [AVB-229] - Build scripts may include sample code from the wrong branch
*   [AVB-245] - Windows: .NET: StreamEncoder and YuvEncoder samples: Duplicate extension of output filename, e.g. `.mp4.mp4` instead of just `.mp4`.

***

## Version 1.6

### Story

*   [AVB-141] - Push / Pull for MPEG4 video elementary streams
*   [AVB-166] - G.711 and G.726 codecs

### Improvement

*   [AVB-96] - Clean .Net API documentation
*   [AVB-97] - Clean C++ API documentation
*   [AVB-158] - Allow to set the output VideoStreamInfo stride
*   [AVB-164] - Return Sync and NoOutput errors instead of UnsupportedFormat
*   [AVB-165] - Load Wmvcore.dll dynamically. The dll is not present on all Windows systems.
*   [AVB-167] - Rename ColorFormat::RGBXyz to ColorFormat::BGRXyz
*   AVB-179] - Handle .dat, .mpe, .mpeg, .mpeg4, and .ogm file extensions
*   [AVB-180] - Docs: C++: Update Transcoder::run API documentation
*   [AVB-187] - Load msdmo.dll dynamically when needed for WM codecs

***

### Bug

*   [AVB-115] - Ogg demuxer returns -1 for seek position
*   [AVB-145] - MediaInfo returns InvalidOperation error when the input stream is invalid.
*   [AVB-163] - MPEG-4 Visual: MP4 demuxer will not group the headers and data for "I" frames (in some border cases).
*   [AVB-170] - Transcoder fails to decode a video frame in pull mode

## Version 1.5

### Epic

*   [AVB-124] - MP4 muxing for video streaming / progressive download / fast start.

### Bug

*   [AVB-128] - VideoStreamInfo.FrameBottomUp set to true is not processed correctly in Transcoder
*   [AVB-162] - Stuffing bytes not discarded when decoding MPEG-4 Visual elementary stream

***

## Version 1.4

### New Feature

*   [AVB-117] - StreamEncoder sample
*   [AVB-118] - DirectShowInput C# sample.
*   [AVB-119] - StreamDecoder sample
*   [AVB-120] - Transcoder.Push for compressed raw video streams
*   [AVB-121] - PullPushDecoder sample
*   [AVB-131] - DirectShowInput C++ sample

### Bug

*   [AVB-107] - Linux: Video encoding produces wrong results
*   [AVB-126] - .NET: LicenseStatusFlags.DemoBuild is not defined.
*   [AVB-137] - Docs: C++: No documentation for primo::license::LicenseInfo

***

## Version 1.3

### New Feature

*   [AVB-98] - New ImageSequence sample
*   [AVB-100] - New YuvEncoder sample

### Improvement

*   [AVB-99] - Windows: Package AVBlocks SDK as a self extracting archive.
*   [AVB-106] - Split MediaInfo sample to AVInfo and MetaInfo samples.

### Bug

*   [AVB-108] - JPEG image decoder on Linux generates corrupted output
*   [AVB-109] - avb_create_license_info not exported on Mac and Linux
*   [AVB-122] - Assert in Transcoder::open with video input that has no stream or file set.

***

## Version 1.2.1

### Bug

*   [AVB-92] - Last 2 frames in MPEG2 Video encoded stream are not the same as in the input.
*   [AVB-101] - MPEG2 video encoder does not generate sequence_end code

***

## Version 1.2

### Improvement

*   [AVB-83] - Update avblocks::ParamType documentation.
*   [AVB-88] - Rename Transcoder::write and Transcoder::read to Transcoder::push and Transcoder::pull
*   [AVB-93] - Strong-named .NET assemblies

### Bug

*   [AVB-89] - Transcoder ignores frame rate for YUV input

***

## Version 1.1

### New Feature

*   [AVB-31] - New API to read and write metadata - ID3 / ASF / OGG.
*   [AVB-32] - Encode images to video
*   [AVB-33] - Read transcoder output in discrete steps (pull API, Transcoder::read)
*   [AVB-68] - Transcoder seek support for WebM ( socket-&gt;setTimePosition() ).
*   [AVB-20] - Ability to split a long video to 2 or more pieces (DVDBuilder needs this to create multi-disc DVD output)

### Improvement

*   [AVB-5] - API: Inconsistent collections
*   [AVB-6] - API: setStream doesn’t go well with setStreamType
*   [AVB-7] - API: Expose an interface (not a class) for setting parameters
*   [AVB-8] - The MediaSample::endTime property is used for two different purposes
*   [AVB-9] - Extend the transcoder, so that it is possible to set only the input and output file names.
*   [AVB-53] - Sample Improvements
*   [AVB-62] - Transcoder seek ( socket-&gt;setTimePosition() ) is not precise
*   [AVB-71] - Unify helper string classes used in samples
*   [AVB-82] - Restructure License info API
*   [AVB-13] - Allow AVB to be loaded and used more than once in a single process

### Bug

*   [AVB-4] - Mp3 length is reported as zero
*   [AVB-14] - Wav file duration is reported in milliseconds while it should be in seconds
*   [AVB-16] - The transcoded file is shorter than the source file
*   [AVB-17] - The transcoder does not seek in the input wave file.
*   [AVB-21] - A/V sync issues in MPEG-PS
*   [AVB-22] - Make sure that the frame rate filter can be explicitly set in order to compensate for missing video frames.
*   [AVB-30] - MPEG2 Muxer generates corrupt output
*   [AVB-35] - MPEG2 muxer output does not contain DTS in the PES packet header.
*   [AVB-40] - Transcoder crashes on OSX with specific files
*   [AVB-56] - Muxer Error when converting from ogg to wma
*   [AVB-60] - Transcoder.Open() fails if then input is MPEG PS and socket.setTimePosition() is called.
*   [AVB-64] - The audio sample time is reset
*   [AVB-66] - The WMA decoder does not keep the sample time
*   [AVB-70] - WebM muxer output does not strictly follow the "WebM Container Guidelines"

***

## Version 1.0

First version. Everything works.

