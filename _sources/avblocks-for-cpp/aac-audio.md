---
title: AAC Audio (MPEG-2 Part 7 / MPEG-4 Part 3)
html_meta:
    description: This section contains topics about AAC (Advanced Audio Coding) ADTS (Audio Data Transport Stream) encoding and decoding.
taxonomy:
    category: docs
---

# AAC Audio (MPEG-2 Part 7 / MPEG-4 Part 3)

## Overview

AAC (Advanced Audio Coding) is a lossy audio compression format that provides better sound quality than MP3 at the same bit rate. It is part of the MPEG-2 and MPEG-4 standards and is widely used in streaming media, digital broadcasting, and mobile devices.

ADTS (Audio Data Transport Stream) is a streaming format for AAC audio that includes headers for each audio frame, making it suitable for streaming applications and easier error recovery. Each ADTS frame is self-contained with synchronization and configuration information.

AVBlocks provides comprehensive support for AAC encoding and decoding, allowing you to:
- Encode uncompressed audio to AAC ADTS format
- Decode AAC ADTS streams to uncompressed audio
- Process audio in both streaming (push/pull) and file-based (run) modes

## AAC Encoding

- [AAC ADTS Encoder (Run)](transcoder-as-encoder/aac-encoder-run) - Encode a WAV file to AAC ADTS using `Transcoder::run`
- [AAC ADTS Encoder (Pull)](transcoder-as-encoder/aac-encoder-pull) - Encode a WAV file to AAC ADTS using `Transcoder::pull`
- [AAC ADTS Encoder (Push)](transcoder-as-encoder/aac-encoder) - Encode raw audio frames to AAC ADTS using `Transcoder::push`

## AAC Decoding

- [AAC ADTS Decoder (Run)](transcoder-as-decoder/aac-decoder-run) - Decode an AAC ADTS file to uncompressed WAV using `Transcoder::run`
- [AAC ADTS Decoder (Pull)](transcoder-as-decoder/aac-decoder) - Decode an AAC ADTS stream to raw audio frames using `Transcoder::pull`
