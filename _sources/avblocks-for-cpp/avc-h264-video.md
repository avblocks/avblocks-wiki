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

## H.264 Encoding

- [AVC / H.264 Encoder (Push)](transcoder-as-encoder/avc-h-264-encoder) - Encode raw video frames to H.264 using `Transcoder::push`

## H.264 Decoding

- [AVC / H.264 Decoder (Pull)](transcoder-as-decoder/avc-h-264-decoder) - Decode an H.264 elementary stream to raw YUV frames using `Transcoder::pull`

## H.264 Parsing

- [AVC / H.264 Annex B Parser](transcoder-as-decoder/avc-h-264-annex-b-parser) - Parse an H.264 Annex B elementary stream and extract NAL units
