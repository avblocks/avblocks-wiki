---
title: AVC / H.264
metadata:
    description: This topic describes the AVC / H.264 codec parameters.
taxonomy:
    category: docs
---

# AVC / H.264

This topic describes the AVC / H.264 codec parameters.

## Controlling Output Quality

There are two parameters that affect the H.264 output quality. The two parameters control different stages of the encoding process and therefore can be combined if needed.

### QualitySpeed 

The QualitySpeed parameter affects how the frame macroblocks are analyzed, so it affects the output quality, but does not affect the output bitrate. The value range is from 0 to 4, where 0 means faster processing, but lower quality, and 4 means slower processing, but better quality. 

### RateControlMethod

The RateControlMethod parameter works together with the the RateControlQuantI, RateControlQuantP and RateControlQuantB parameters. If the RateControlMethod is set to H264RateControlMethod.ConstantQuant - Constant Quantization (3) - the output bitrate and quality depend on the I, P, and B frame quantizers. 

The quantizers for I, P and B frames are set with the RateControlQuantI, RateControlQuantP and RateControlQuantB parameters and all have a range from 0 to 51. Higher quantizer values reduce the output size and bitrate, but produce lower quality. Lower quantizer values lead to better quality, but increase the output size and bitrate.

Therefore setting the RateControlMethod to Constant Quantization (3) overrides the explicitly specified output bitrate.

### Sample Code

Here is how you can set the encoding parameters in C#:

``` csharp
// Assuming vpin is the video pin (MediaPin) on the output socket (MediaSocket)

// Set QualitySpeed, range: 0 - 4 
// Higher value means better output quality, but leads to slower encoding 
vpin.Params.Add(Param.Encoder.Video.H264.QualitySpeed, 4);
 
// Use constant quantization
vpin.Params.Add(Param.Encoder.Video.H264.RateControlMethod, H264RateControlMethod.ConstantQuant);

// Set I, P, B quantizers, range: 0 - 51
// Higher value reduces output bitrate and size, but leads to lower output quality 
vpin.Params.Add(Param.Encoder.Video.H264.RateControlQuantI, 23); 
vpin.Params.Add(Param.Encoder.Video.H264.RateControlQuantP, 25);
vpin.Params.Add(Param.Encoder.Video.H264.RateControlQuantB, 25);
```

