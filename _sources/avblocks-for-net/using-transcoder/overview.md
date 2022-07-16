---
title: Overview
metadata:
    description: A quick look at the elements of a transcoding workflow.
taxonomy:
    category: docs
summary:
  enabled: true
  format: short      
---

# Overview

A quick look at the elements of a transcoding workflow.

## Inputs and Outputs

Before using a Transcoder object you have to configure its inputs and outputs. The Transcoder inputs and outputs are collections of media sockets, and each media socket may have one or more media pins.

Media sockets are roughly equivalent to containers like MP4 and OGG (i.e. file formats), and media pins represent individual data streams within the containers like video, audio and subtitle streams.

## Presets

You can configure a MediaSocket manually with StreamInfo and MediaPin objects. You can also configure a MediaSocket automatically from a predefined preset. AVBlocks offers presets for most modern audio and video formats.

```{tip}
MediaSocket configuration from presets is especially useful when configuring outputs. A common way of configuring outputs is to start with a MediaSocket generated from the preset that is closest to your custom output format and then tweak and fine-tune the MediaSocket according to your needs.
```

## Transcoding

Once you have inputs and output configured, the actual transcoding is a simple three-step process:
 
* Open the Transcoder to connect the input and output sockets and pins. 
* Run the Transcoder to encode the inputs into the outputs. 
* Close the Transcoder to flush its buffers and to free the allocated resources.
