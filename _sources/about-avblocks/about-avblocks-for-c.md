---
title: About AVBlocks for C++
metadata:
    description: This topic describes the C++ development requirements for Windows, Mac and Linux.
taxonomy:
    category: docs
---

# About AVBlocks for C++

This section describes the minimum requirements for C++ development on Windows, Mac and Linux.

## Operating Systems

* Mac OS X 10.7
* Ubuntu 14.04 LTS 
* Debian 7.5   
* Windows 7 SP1

## Threading 

Parts of AVBlocks use advanced algorithms for parallel processing, implemented using:

* [Windows Concurrency Runtime](http://msdn.microsoft.com/en-us/library/ee207192.aspx) on Windows
* [Grand Central Dispatch](https://developer.apple.com/library/mac/documentation/Performance/Reference/GCD_libdispatch_Ref) on Mac OS X
* [Intel Threading Building Blocks](https://www.threadingbuildingblocks.org/) on Linux.

## Dependencies

### Linux (Ubuntu, Debian)

These libraries are loaded dynamically by AVBlocks to handle the corresponding image format (jpeg / tiff / png):

* libjpeg.so.8  - JPEG Library	
* libtiff.so.5  - TIFF Library and Utilities
* libpng12.so.0 - PNG Reference Library   

These libraries are needed by AVBlocks, i.e. `libAVBlocks.so` will not load without these libraries:

* libtbb.so.2   - Intel Threading Building Blocks.

To install all dependencies you can run this command in Terminal:

```bash
sudo apt-get install libjpeg8 libtiff5 libpng12-0 libtbb2
```

### Windows

These libraries are loaded dynamically by AVBlocks to do Windows Media (ASF) muxing and demuxing.

* wmvcore.dll 
	
	> Note: This library is not present by default on Windows "N" versions, or on Windows versions without Windows Media Player:

These libraries are loaded dynamically by AVBlocks when Windows Media (WMA / WMV) codecs are used:

* msdmo.dll

## Samples

The samples provided with AVBlocks may need additional tools / libraries to be built:

### Mac OS X

The AudioConverter and VideoConverter GUI samples use the Cocoa AppKit Framework.

### Linux

The AudioConverter and VideoConverter GUI samples are NetBeans "C/C++ Qt Application" projects.
To use these projects you need NetBeans IDE with C/C++ add-on. The Netbeans IDE is available through Synaptic Package Manager or directly from [netbeans.org](http://netbeans.org/downloads).

The `libqt4-dev` package is required. It is available in the Synaptic Package Manager and can be installed from terminal by running: 

```bash
sudo apt-get install libqt4-dev
```

The latest Qt framework can be downloaded from [qt-project.org](http://qt-project.org/downloads).

To run the 32 bit samples on 64 bit distribution, you need the `ia32-lib` package. The `ia32-lib` package is available in the Synaptic Package Manager and can be installed from terminal by running: 

```bash
sudo apt-get install ia32-libs
```

### Windows

The AVBlocks samples can be compiled in Visual Studio 2010 and above. The AudioConverter and VideoConverter GUI samples use MFC (Microsoft Foundation Classes).
