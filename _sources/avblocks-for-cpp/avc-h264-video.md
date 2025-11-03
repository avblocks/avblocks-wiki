---
title: Advanced Video Coding (H.264 / MPEG-4 AVC / MPEG-4 Part 10)
html_meta:
    description: This section contains topics about AVC / H.264 video encoding, decoding, and parsing.
taxonomy:
    category: docs
---

# Advanced Video Coding (H.264 / MPEG-4 AVC / MPEG-4 Part 10)

AVC (Advanced Video Coding), also known as H.264 or MPEG-4 Part 10, is a widely-used video compression standard. It provides excellent video quality at substantially lower bit rates than previous standards, making it ideal for streaming, broadcasting, and video storage.

Key features of H.264/AVC include:

- **High Compression Efficiency** - Achieves up to 50% better compression than MPEG-2
- **Flexible Design** - Supports a wide range of applications from low-bitrate mobile video to high-definition broadcasting
- **Network Friendly** - Designed with network streaming in mind with built-in error resilience
- **Hardware Acceleration** - Widely supported by hardware encoders and decoders across devices

H.264/AVC is used in many applications including Blu-ray discs, streaming services (YouTube, Netflix), video conferencing, IPTV, and digital broadcasting.

## H.264 Stream Formats

H.264 video can be stored in different formats, with the two most common being:

### AVC1 (AVCC Format)
- **Length-prefixed format** - Each NAL unit is prefixed with its length (typically 4 bytes)
- **Used in containers** - MP4, MOV, MKV, and other container formats
- **Requires extradata** - SPS/PPS (Sequence/Picture Parameter Sets) are stored separately in the container header
- **Not self-contained** - Cannot be decoded without the extradata from the container

### Annex B Format
- **Start code format** - NAL units are separated by start codes (0x000001 or 0x00000001)
- **Used in streams** - Elementary streams, MPEG-TS, broadcasting, and real-time transmission
- **Self-contained** - SPS/PPS are embedded in the stream itself
- **Stream-friendly** - Can be decoded directly without additional metadata

The choice between formats depends on the application: AVC1 for file storage and containers, Annex B for streaming and broadcasting.

## H.264 Encoding

- [AVC / H.264 AVC1 Encoder (Push)](transcoder-as-encoder/avc-h-264-encoder) - Encode raw video frames to H.264 AVC1 elementary stream using `Transcoder::push`

## H.264 Decoding

- [AVC / H.264 Annex B Decoder (Pull)](transcoder-as-decoder/avc-h-264-decoder) - Decode an H.264 AVC1 elementary stream to raw YUV frames using `Transcoder::pull`

## H.264 Parsing

- [AVC / H.264 Annex B Parser](transcoder-as-decoder/avc-h-264-annex-b-parser) - Parse an H.264 Annex B elementary stream and extract NAL units
