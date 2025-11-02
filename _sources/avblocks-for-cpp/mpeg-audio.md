---
title: MPEG-1 Audio and MPEG-2 Audio (Layer 1, 2 and 3)
html_meta:
    description: This section contains topics about MPEG-1 and MPEG-2 Audio (Layer 1, 2, and 3) encoding and decoding.
taxonomy:
    category: docs
---

# MPEG-1 Audio and MPEG-2 Audio (Layer 1, 2 and 3)

MPEG Audio is a family of lossy audio compression formats defined by the MPEG standards. It includes three layers of increasing complexity and compression efficiency:

- **Layer 1** - The simplest compression method with lower compression ratios
- **Layer 2** - Improved compression and widely used in broadcasting
- **Layer 3 (MP3)** - The most complex and efficient, providing the best compression ratio and audio quality

MPEG-1 Audio supports sampling rates of 32, 44.1, and 48 kHz, while MPEG-2 Audio extends support to lower sampling rates (16, 22.05, and 24 kHz) for applications requiring lower bandwidth. MP3 has become the most popular format for music distribution and streaming due to its excellent balance between file size and audio quality.

## MP3 Encoding

- [MP3 Encoder (Run)](transcoder-as-encoder/mp3-encoder-run) - Encode a WAV file to MP3 using `Transcoder::run`
- [MP3 Encoder (Push)](transcoder-as-encoder/mp3-encoder) - Encode raw audio frames to MP3 using `Transcoder::push`

## MP3 Decoding

- [MP3 Decoder (Run)](transcoder-as-decoder/mp3-decoder-run) - Decode an MP3 file to uncompressed WAV using `Transcoder::run`
