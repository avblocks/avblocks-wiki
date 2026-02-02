---
title: Opus Audio
html_meta:
    description: This section contains topics about Opus audio encoding and decoding.
taxonomy:
    category: docs
---

# Opus Audio

## Overview

Opus is a totally open, royalty-free, highly versatile audio codec standardized by the IETF as [RFC 6716](https://tools.ietf.org/html/rfc6716). It was designed to handle a wide range of audio applications, from low-bitrate speech to high-fidelity music, making it one of the most flexible audio codecs available today.

Opus uses a hybrid design that combines two underlying codecs:

- **SILK** (from Skype) - Optimized for speech compression, providing excellent quality at low bitrates for voice communications
- **CELT** (from Xiph.Org) - Optimized for music and general audio, delivering high-fidelity sound reproduction

The codec can seamlessly switch between these modes or blend them together depending on the audio content, ensuring optimal quality regardless of the source material.

### Key Characteristics

| Feature | Specification |
|:--------|:--------------|
| Bitrate range | 6 kbps to 510 kbps |
| Sample rates | 8 kHz, 12 kHz, 16 kHz, 24 kHz, 48 kHz |
| Frame sizes | 2.5 ms, 5 ms, 10 ms, 20 ms, 40 ms, 60 ms |
| Channels | Mono, stereo, and up to 255 channels |
| Latency | As low as 5 ms (algorithmic delay) |

### Main Use Cases

- **Voice over IP (VoIP)** - WebRTC uses Opus as its mandatory audio codec
- **Video conferencing** - Low latency and excellent speech quality
- **Streaming audio** - Adaptive bitrate for varying network conditions
- **Storage** - Typically stored in Ogg container as `.opus` files

### Advantages

- **Very low latency** - Suitable for real-time communications
- **Excellent quality at low bitrates** - Outperforms most codecs below 64 kbps
- **Dynamic adaptation** - Seamlessly switches between speech and music modes
- **Royalty-free and open source** - No licensing fees required
- **Superior compression** - Better quality than MP3, AAC, and Vorbis at most bitrates

Opus was designed to replace both Speex (speech) and Vorbis (music) with a single codec that handles both equally well.

AVBlocks provides comprehensive support for Opus encoding and decoding, allowing you to:
- Encode uncompressed PCM audio to Opus format
- Decode Opus streams to uncompressed PCM audio
- Work with various sample rates and channel configurations

## Opus Encoding

- [Opus Encoder (Run)](transcoder-as-encoder/opus-encoder-run) - Encode a WAV file to Opus using `Transcoder::run`

## Opus Decoding

- [Opus Decoder (Run)](transcoder-as-decoder/opus-decoder-run) - Decode an Opus file to uncompressed PCM WAV using `Transcoder::run`
