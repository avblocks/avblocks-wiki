---
title: AVC / H.264 Annex B Parser
metadata:
    description: This topic explains how you can use Transcoder to parse an AVC / H.264 Annex B elementary stream.
taxonomy:
    category: docs
---

# AVC / H.264 Annex B Parser

How to use Transcoder to parse an AVC / H.264 Annex B elementary stream.

## Video Input

As video input we use the `foreman_qcif.h264` file from the [AVBlocks Assets](https://github.com/avblocks/avblocks-assets/releases) archive. After downloading and unzipping you will find `foreman_qcif.h264` in the `vid` subdirectory.

## Code

This code takes an H.264 stream encoded according to [ISO/IEC 14496 - 10 Annex B](https://en.wikipedia.org/wiki/Network_Abstraction_Layer#NAL_Units_in_Byte-Stream_Format_Use), and prints the header of each NAL (Network Abstraction Layer) unit.

### Initialize AVBlocks

``` csharp
static void ParseH264Stream()
{
    Library.Initialize();

    ParseH264Stream("foreman_qcif.h264");

    Library.Shutdown();
}
```

### Configure Transcoder

``` csharp
static void ParseH264Stream(string inputFile)
{
    // Create an input socket from file
    var inSocket = new MediaSocket() {
        File = inputFile
    };

    // Create an output socket with one video pin
    var outSocket = new MediaSocket();
    outSocket.Pins.Add(new MediaPin() {
        StreamInfo = new VideoStreamInfo()
    });

    // Create Transcoder
    using (var transcoder = new Transcoder())
    {
        transcoder.Inputs.Add(inSocket);
        transcoder.Outputs.Add(outSocket);

        if (transcoder.Open())
        {
            ParseH264Stream(transcoder);

            transcoder.Close();
        }
    }
}
```

### Call Transcoder.Pull

``` csharp
static void ParseH264Stream(Transcoder transcoder)
{
    int fromInput = 0;
    var accessUnit = new MediaSample();

    while (transcoder.Pull(out fromInput, accessUnit))
    {
        // Each call to Transcoder.Pull returns one Access Unit. 
        // The Access Unit may contain one or more NAL units.
        ParseAccessUnit(accessUnit.Buffer);
    }

}
```

## Complete Program

``` csharp
using System;
using System.Linq;

using PrimoSoftware.AVBlocks;

namespace H264Parser
{
    class Program
    {
        // Network Abstraction Layer Unit Definitions
        enum NALUType : byte 
        {
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

        enum NALUPriority : byte
        {
            DISPOSABLE  = 0,
            LOW         = 1,
            HIGH        = 2,
            HIGHEST     = 3,
        };

        struct NALUHeader 
        {
            public byte Data  {
                private get;
                set; 
            }
            
            public byte ForbiddenBit {
                get {
                    // 1 bit: (10000000)b = (80)h
                    return (byte)((Data & 0x80) >> 7);
                }
            }

            public NALUPriority NalUnitRefIDC
            {
                get {
                    // 2 bits: (01100000)b = (60)h
                    return (NALUPriority)((Data & 0x60) >> 5);
                }
            }

            public NALUType NalUnitType
            {
                get {
                    // 5 bits: (00011111)b = (1F)h
                    return (NALUType)(Data & 0x1F);
                }
            }
        };

        static int naluIndex = 0;
        static void PrintNALUHeader(MediaBuffer buffer)
        {
            var header = new NALUHeader() {
                Data = buffer.Bytes[buffer.DataOffset]
            };

            Console.WriteLine("NALU Index         : {0}", naluIndex);
            Console.WriteLine("NALU Type          : {0}", header.NalUnitType);
            Console.WriteLine("NALU Reference IDC : {0}", header.NalUnitRefIDC);
    
            Console.WriteLine();

            naluIndex++;
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
        static void ParseAccessUnit(MediaBuffer buffer)
        {
            // This parsing code assumes that MediaBuffer contains 
            // a single Access Unit of one or more complete NAL Units
            while (buffer.DataSize > 1)
            {
                int dataOffset = buffer.DataOffset;
                int dataSize = buffer.DataSize;
                byte[] data = buffer.Bytes.Skip(dataOffset).Take(4).ToArray();

                // is this a NALU with a 3 byte start code prefix
                if (dataSize >= 3 &&
                    0x00 == data[0] &&
                    0x00 == data[1] &&
                    0x01 == data[2])
                {
                    // advance in the buffer
                    buffer.SetData(dataOffset + 3, dataSize - 3);

                    PrintNALUHeader(buffer);
                }
                // OR is this a NALU with a 4 byte start code prefix
                else if (dataSize >= 4 &&
                         0x00 == data[0] &&
                         0x00 == data[1] &&
                         0x00 == data[2] &&
                         0x01 == data[3])
                {
                    // advance in the buffer
                    buffer.SetData(dataOffset + 4, dataSize - 4);

                    PrintNALUHeader(buffer);
                }
                else
                {
                    // advance in the buffer
                    buffer.SetData(dataOffset + 1, dataSize - 1);
                }

                // NOTE: Some NALUs may have a trailing zero byte. The `while` 
                // condition `buffer.DataSize > 1` will effectively 
                // skip the trailing zero byte.
            }
        }

        static void ParseH264Stream(Transcoder transcoder)
        {
            int fromInput = 0;
            var accessUnit = new MediaSample();

            while (transcoder.Pull(out fromInput, accessUnit))
            {
                // Each call to Transcoder.Pull returns one Access Unit. 
                // The Access Unit may contain one or more NAL units.
                ParseAccessUnit(accessUnit.Buffer);
            }

        }

        static void ParseH264Stream(string inputFile)
        {
            // Create an input socket from file
            var inSocket = new MediaSocket() {
                File = inputFile
            };

            // Create an output socket with one video pin
            var outSocket = new MediaSocket();
            outSocket.Pins.Add(new MediaPin() {
                StreamInfo = new VideoStreamInfo()
            });

            // Create Transcoder
            using (var transcoder = new Transcoder())
            {
                transcoder.Inputs.Add(inSocket);
                transcoder.Outputs.Add(outSocket);

                if (transcoder.Open())
                {
                    ParseH264Stream(transcoder);

                    transcoder.Close();
                }
            }
        }

        static void ParseH264Stream()
        {
            Library.Initialize();

            ParseH264Stream("foreman_qcif.h264");

            Library.Shutdown();
        }

        static void Main(string[] args)
        {
            ParseH264Stream();
        }
    }
}
```

## How to run

Follow the steps to [create a C# console application in Visual Studio](../getting-started/create-a-c-sharp-console-application-in-visual-studio) but in `Program.cs` use the code from this article. 

Copy the `foreman_qcif.h264` file from the assets archive to `bin\x64\Debug` under the project's directory.

Run the application in Visual Studio. 

