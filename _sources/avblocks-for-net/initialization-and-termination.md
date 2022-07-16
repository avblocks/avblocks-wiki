---
title: Initialization and Termination
metadata:
    description: This topic describes how to initialize and terminate the AVBlocks API.
taxonomy:
    category: docs
---

# Initialization and Termination

You must initialize the AVBlocks API when your application starts and terminate it before your application ends. The AVBlocks license can be set right after the initialization. If you do not set a license, AVBlocks will work in demo mode.


``` csharp
Library.Initialize();
	
// Set license information. To run AVBlocks in demo mode, comment the next line out
Library.SetLicense("license-xml-string");
	
Library.Shutdown();
```

