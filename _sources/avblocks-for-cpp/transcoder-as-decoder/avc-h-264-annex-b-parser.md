---
title: AVC / H.264 Annex B Parser
metadata:
    description: This topic explains how you can use Transcoder to parse an AVC / H.264 Annex B elementary stream.
taxonomy:
    category: docs
---

# AVC / H.264 Annex B Parser

How to use Transcoder to parse an AVC / H.264 Annex B elementary stream.

## Source Video

As video input we use the `foreman_qcif.h264` file from the [AVBlocks Assets](https://github.com/avblocks/avblocks-assets/releases) archive. After downloading and unzipping you will find `foreman_qcif.h264` in the `vid` subdirectory.

## Code

This code takes an H.264 stream encoded according to [ISO/IEC 14496 - 10 Annex B](https://en.wikipedia.org/wiki/Network_Abstraction_Layer#NAL_Units_in_Byte-Stream_Format_Use), and prints the header of each NAL (Network Abstraction Layer) unit.

### Windows

#### Initialize AVBlocks

``` cpp
void parse_h264_stream() {
    Library::initialize();

    parse_h264_stream(L"foreman_qcif.h264");

    Library::shutdown();
}
```

#### Configure Transcoder

``` cpp
void parse_h264_stream(const char_t* inputFile) {
    // Create an input socket from file
    p::ref<MediaSocket> inSocket(Library::createMediaSocket());
    inSocket->setFile(inputFile);

    // Create an output socket with one video pin
    p::ref<VideoStreamInfo> outStreamInfo(Library::createVideoStreamInfo());

    p::ref<MediaPin> outPin(Library::createMediaPin());
    outPin->setStreamInfo(outStreamInfo.get());

    p::ref<MediaSocket> outSocket(Library::createMediaSocket());
    outSocket->pins()->add(outPin.get());

    // Create Transcoder
    p::ref<Transcoder> transcoder(Library::createTranscoder());
    transcoder->inputs()->add(inSocket.get());
    transcoder->outputs()->add(outSocket.get());

    if (transcoder->open()) {
        parse_h264_stream(transcoder.get());

        transcoder->close();
    }
}
```

#### Call Transcoder::pull

``` cpp
void parse_h264_stream(Transcoder* transcoder) {
    int32_t inputIndex = 0;
    p::ref<MediaSample> accessUnit(Library::createMediaSample());

    while (transcoder->pull(inputIndex, accessUnit.get())) {
        // Each call to Transcoder::pull returns one Access Unit. 
        // The Access Unit may contain one or more NAL units.
        parse_access_unit(accessUnit->buffer());
    }
}
```

#### Complete C++ Code

``` cpp
// H264Parser.cpp : Defines the entry point for the console application.
//

#include "stdafx.h"

namespace p = primo;

using namespace primo::codecs;
using namespace primo::avblocks;

// Network Abstraction Layer Unit Definitions
enum class NALUType : uint8_t {
    UNSPEC    = 0,  // Unspecified
    SLICE     = 1,  // Coded slice of a non-IDR picture
    DPA       = 2,  // Coded slice data partition A
    DPB       = 3,  // Coded slice data partition B
    DPC       = 4,  // Coded slice data partition C
    IDR       = 5,  // Coded slice of an IDR picture
    SEI       = 6,  // Supplemental enhancement information
    SPS       = 7,  // Sequence parameter set
    PPS       = 8,  // Picture parameter set
    AUD       = 9,  // Access unit delimiter
    EOSEQ     = 10, // End of sequence                                               
    EOSTREAM  = 11, // End of stream
    FILL      = 12  // Filler data
};

enum class NALUPriority : uint8_t {
    DISPOSABLE  = 0,
    LOW         = 1,
    HIGH        = 2,
    HIGHEST     = 3,
};

#pragma pack(push, NALU, 1)

    // The bit fields follow Little Endian layout
    struct NALUHeader {
        NALUType nal_unit_type : 5;
        NALUPriority nal_unit_ref_idc : 2;
        uint8_t forbidden_bit : 1;
    };

#pragma pack(pop, NALU)

// std::out helper functions
#define MAP_ENUM_VALUE(p) strings[p] = L#p
std::wostream& operator << (std::wostream& wout, const NALUType value) {
    static std::map<NALUType, std::wstring> strings;
    if (0 == strings.size()) {
        MAP_ENUM_VALUE(NALUType::SLICE);
        MAP_ENUM_VALUE(NALUType::DPA);
        MAP_ENUM_VALUE(NALUType::DPB);
        MAP_ENUM_VALUE(NALUType::DPB);
        MAP_ENUM_VALUE(NALUType::DPC);
        MAP_ENUM_VALUE(NALUType::IDR);
        MAP_ENUM_VALUE(NALUType::SEI);
        MAP_ENUM_VALUE(NALUType::SPS);
        MAP_ENUM_VALUE(NALUType::PPS);
        MAP_ENUM_VALUE(NALUType::AUD);
        MAP_ENUM_VALUE(NALUType::EOSEQ);
        MAP_ENUM_VALUE(NALUType::EOSTREAM);
        MAP_ENUM_VALUE(NALUType::FILL);
    }

    return wout << strings[value].c_str();
}

std::wostream& operator << (std::wostream& wout, const NALUPriority value) {
    static std::map<NALUPriority, std::wstring> strings;
    if (0 == strings.size()) {
        MAP_ENUM_VALUE(NALUPriority::DISPOSABLE);
        MAP_ENUM_VALUE(NALUPriority::LOW);
        MAP_ENUM_VALUE(NALUPriority::HIGH);
        MAP_ENUM_VALUE(NALUPriority::HIGHEST);
    }

    return wout << strings[value].c_str();
}

static int nalu_index = 0;
void print_nalu_header(const uint8_t* data) {
    const NALUHeader* header = reinterpret_cast<const NALUHeader*>(data);

    std::wcout << L"NALU Index         : " << nalu_index << std::endl;
    std::wcout << L"NALU Type          : " << header->nal_unit_type << std::endl;
    std::wcout << L"NALU Reference IDC : " << header->nal_unit_ref_idc << std::endl;
    
    std::wcout << std::endl;

    nalu_index++;
}

// 
// The pseudo logic from ISO/IEC 14496 - 10 Annex B:
//
//  byte_stream_nal_unit(NumBytesInNALunit) {
//      while (next_bits(24) != 0x000001 && 
//             next_bits(32) != 0x00000001)
//          leading_zero_8bits /* equal to 0x00 */
//  
//      if (next_bits(24) != 0x000001)
//          zero_byte /* equal to 0x00 */
//  
//      if (more_data_in_byte_stream()) {
//          start_code_prefix_one_3bytes /* equal to 0x000001 */
//          nal_unit(NumBytesInNALunit)
//      }
//  
//      while (more_data_in_byte_stream() && 
//             next_bits(24) != 0x000001 && 
//             next_bits(32) != 0x00000001)
//          trailing_zero_8bits /* equal to 0x00 */
//  }
//
void parse_access_unit(MediaBuffer* buffer) {
    // This parsing code assumes that MediaBuffer contains 
    // a single Access Unit of one or more complete NAL Units
    while (buffer->dataSize() > 1) {
        int dataOffset = buffer->dataOffset();
        int dataSize = buffer->dataSize();
        const uint8_t* data = buffer->data();

        // is this a NALU with a 3 byte start code prefix
        if (dataSize >= 3 &&
            0x00 == data[0] &&
            0x00 == data[1] &&
            0x01 == data[2]) {
            print_nalu_header(data + 3);

            // advance in the buffer
            buffer->setData(dataOffset + 3, dataSize - 3);
        }
        // OR is this a NALU with a 4 byte start code prefix
        else if (dataSize >= 4 &&
                 0x00 == data[0] &&
                 0x00 == data[1] &&
                 0x00 == data[2] &&
                 0x01 == data[3]) {
             print_nalu_header(data + 4);

            // advance in the buffer
            buffer->setData(dataOffset + 4, dataSize - 4);
        } else {
            // advance in the buffer
            buffer->setData(dataOffset + 1, dataSize - 1);
        }

        // NOTE: Some NALUs may have a trailing zero byte. The `while` 
        // condition `buffer->dataSize() > 1` will effectively 
        // skip the trailing zero byte.
    }
}

void parse_h264_stream(Transcoder* transcoder) {
    int32_t inputIndex = 0;
    p::ref<MediaSample> accessUnit(Library::createMediaSample());

    while (transcoder->pull(inputIndex, accessUnit.get())) {
        // Each call to Transcoder::pull returns one Access Unit. 
        // The Access Unit may contain one or more NAL units.
        parse_access_unit(accessUnit->buffer());
    }
}

void parse_h264_stream(const char_t* inputFile) {
    // Create an input socket from file
    p::ref<MediaSocket> inSocket(Library::createMediaSocket());
    inSocket->setFile(inputFile);

    // Create an output socket with one video pin
    p::ref<VideoStreamInfo> outStreamInfo(Library::createVideoStreamInfo());

    p::ref<MediaPin> outPin(Library::createMediaPin());
    outPin->setStreamInfo(outStreamInfo.get());

    p::ref<MediaSocket> outSocket(Library::createMediaSocket());
    outSocket->pins()->add(outPin.get());

    // Create Transcoder
    p::ref<Transcoder> transcoder(Library::createTranscoder());
    transcoder->inputs()->add(inSocket.get());
    transcoder->outputs()->add(outSocket.get());

    if (transcoder->open()) {
        parse_h264_stream(transcoder.get());

        transcoder->close();
    }
}

void parse_h264_stream() {
    Library::initialize();

    parse_h264_stream(L"foreman_qcif.h264");

    Library::shutdown();
}

int _tmain(int argc, _TCHAR* argv[]) {
    parse_h264_stream();
    return 0;
}
```

#### How to run

Follow the [steps](../getting-started/create-a-c-plus-console-application-in-visual-studio) to create a C++ console application in Visual Studio, but use the code from this article. 

Copy the `foreman_qcif.h264` file from the assets archive to `bin\x64\Debug` under the project's directory.

Run the application in Visual Studio. 
