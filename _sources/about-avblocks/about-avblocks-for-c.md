---
title: About AVBlocks for C++
html_meta:
    description: This topic describes the C++ development requirements for Windows, Mac and Linux.
taxonomy:
    category: docs
---

# About AVBlocks for C++

This section describes the minimum requirements for C++ development on Windows, Mac and Linux.

## Operating Systems

* macOS 11 (Big Sur / Darwin 20)
* Ubuntu 22.04 LTS (Jammy Jellyfish) 
* Windows 10 21H2 ~ Windows 11 21H2 
* Windows Server 2019 ~ Windows Server 2022

## Threading 

Parts of AVBlocks use advanced algorithms for parallel processing, implemented using:

* [Windows Concurrency Runtime](http://msdn.microsoft.com/en-us/library/ee207192.aspx) on Windows
* [Grand Central Dispatch](https://developer.apple.com/library/mac/documentation/Performance/Reference/GCD_libdispatch_Ref) on macOS
* [Intel Threading Building Blocks](https://www.threadingbuildingblocks.org/) on Linux

## Dependencies

### Linux

#### Ubuntu

These libraries are loaded dynamically by AVBlocks to handle the corresponding image format (jpeg / tiff / png):

* libjpeg.so.8  - JPEG Library	
* libtiff.so.5  - TIFF Library and Utilities
* libpng16.so.16 - PNG Reference Library   

To install all dependencies you can run this command in Terminal:

```bash
sudo apt-get install libjpeg8 libtiff5 libpng16-16
```

### Windows

These libraries are loaded dynamically by AVBlocks to do Windows Media (ASF) muxing and demuxing.

* wmvcore.dll 
	
	> Note: This library is not present by default on Windows "N" versions, or on Windows versions without Windows Media Player:

These libraries are loaded dynamically by AVBlocks when Windows Media (WMA / WMV) codecs are used:

* msdmo.dll
