---
title: MP4
metadata:
    description: This topic describes the MP4 MUX parameters. 
taxonomy:
    category: docs
---

# MP4

This topic describes the MP4 Muxer parameters.

## Optimizing for progressive download or streaming 

Every MP4 file contains a **moov** atom that acts as an index of the video data. The index enables a player to play and scrub the file. Unfortunately, in an MPEG-4–compliant container, the **moov** atom is normally stored at the end of the file. To enable progressive download or streaming the **moov** atom has to be moved to the beginning of the file.      

There are three AVBlocks parameters that control the MP4 FastStart muxing. These parameters must be set on the output socket:  

### FastStart

If this parameter is set to **true**, the MP4 muxer will run a second pass to move the **moov** atom to the beginning of the file.

### FastStartUseTempFile

If this parameter is set to **true**, the MP4 muxer will use a temp file for the second pass. 

### FastStartTempFileDirectory

Specifies a directory for the temp file. If not set, the system temp path is used.

### Sample Code

Here is how you can set the MP4 FastStart parameters in C#:

``` csharp
using (var transcoder = new Transcoder())
{
    // Transcoder demo mode must be enabled,
    // in order to use the production release for testing (without a valid license).
    transcoder.AllowDemoMode = true;

	// Configure output socket
	{
		// MP4 container socket 
		var socket = new MediaSocket();
		socket.StreamType = StreamType.Mp4;

		// The MP4 FastStart parameters must be set on the socket
		socket.Params.Add(Param.Muxer.MP4.FastStart, true);
		socket.Params.Add(Param.Muxer.MP4.FastStartUseTempFile, true);
		socket.Params.Add(Param.Muxer.MP4.FastStartTempFileDirectory, @"C:\Temp");

		// H.264 video pin	
		{
			var streamInfo = new VideoStreamInfo();
			streamInfo.StreamType = StreamType.H264;
			streamInfo.StreamSubType = StreamSubType.Avc1;
			
			var pin = new MediaPin();
			pin.StreamInfo = streamInfo;
			socket.Pins.Add(pin);
		}
	
		// AAC audio pin	
		{
			var streamInfo = new AudioStreamInfo();
			streamInfo.StreamType = StreamType.Aac;
			streamInfo.StreamSubType = StreamSubType.AacMp4;
			
			var pin = new MediaPin();
			pin.StreamInfo = streamInfo;
			socket.Pins.Add(pin);
		}
	
		transcoder.Outputs.Add(socket);
	}
}
```

