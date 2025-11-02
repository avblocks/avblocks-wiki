---
title: G.711 Audio
html_meta:
    description: This section contains topics about G.711 audio encoding and decoding.
taxonomy:
    category: docs
---

# G.711 Audio

## Overview

G.711 is an ITU-T standard for audio compression primarily used in telephony systems. It provides toll-quality voice compression at 64 kbit/s using pulse code modulation (PCM). G.711 is one of the most widely deployed audio codecs due to its simplicity, low computational requirements, and high audio quality for speech.

The standard defines two main companding algorithms:

- **A-law** - Primarily used in European and international telephone networks. It provides a slightly better signal-to-noise ratio for small signal amplitudes.
- **μ-law (mu-law)** - Primarily used in North American and Japanese telephone systems. It provides more uniform quantization error over a wider dynamic range.

Both algorithms compress 16-bit linear PCM samples to 8-bit logarithmic samples, achieving 2:1 compression. The standard sample rate is 8000 Hz with mono channel configuration, making it ideal for voice communications.

AVBlocks provides comprehensive support for G.711 encoding and decoding, allowing you to:
- Encode uncompressed PCM audio to G.711 A-law or μ-law format
- Decode G.711 streams to uncompressed PCM audio
- Work with standard telephony audio formats (8 kHz, mono)

## G.711 Encoding

- [G.711 A-law Encoder (Run)](transcoder-as-encoder/g711-alaw-encoder-run) - Encode a WAV file to G.711 A-law using `Transcoder::run`

## G.711 Decoding

- [G.711 A-law Decoder (Run)](transcoder-as-decoder/g711-alaw-decoder-run) - Decode a G.711 A-law WAV file to uncompressed PCM WAV using `Transcoder::run`
