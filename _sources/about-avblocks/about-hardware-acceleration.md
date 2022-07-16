---
title: About Hardware Acceleration
metadata:
    description: This topic discusses the platforms and the codecs for which hardware acceleration is supported.
taxonomy:
    category: docs
---

# About Hardware Acceleration

This topic discusses the platforms and the codecs for which hardware acceleration is supported.


## How To Enable Hardware Acceleration

See [Hardware Acceleration](../avblocks-for-net/using-transcoder/hardware-acceleration/) for an example on how to enable the hardware accelerated codecs in your code.

## Supported Codecs

### HEVC / H.265 Encoding

Hardware acceleration for HEVC H.265 video encoding is currently supported only on [NVIDIA 2nd generation Maxwell](#nvenc-iii-maxwell-2nd-gen) GPUs. 

### AVC / H.264 Encoding

Hardware acceleration for AVC / H.264 video encoding is supported on Intel CPUs with Intel® Iris and Intel® HD Graphics technology, NVIDIA GPUs, and AMD GPUs and APUs. 

## Hardware Platforms

Hardware acceleration is supported on following platforms:

* Intel® Quick Sync Video (QSV) on Windows
* NVIDIA NVENC fixed-hardware encoder on Windows
* AMD Video Coding Engine (VCE) on Windows

## Intel® Quick Sync Video

Intel® QSV is available on select Intel processors with integrated Intel® Iris and Intel® HD Graphics technology. To use Intel® QSV, you must install the correct [Intel® HD Graphics Driver for Windows](https://downloadcenter.intel.com/search?keyword=Intel+HD+Graphics). 

If you are uncertain which Intel® Processor is in your computer, we recommend using the [Intel® Processor Identification Utility](https://downloadcenter.intel.com/download/7838) or [Intel® Driver Update Utility](https://downloadcenter.intel.com/download/24345/Intel-Driver-Update-Utility) to identify your Intel Processor.

Available on: 

* Intel® Core 3rd, 4th, 5th, and 6th generation processors
* Intel® Core M processors
* Intel® Celeron processors with Intel® QuickSync Video
* Intel® Pentium processors with Intel® QuickSync Video 
* Intel® Atom processors with Intel® QuickSync Video


## NVIDIA NVENC

NVIDIA NVENC is available on Kepler and Maxwell class NVIDIA GPUs. NVIDIA Maxwell 2nd generation GPUs also support HEVC / H.265.

### NVENC I (Kepler)

Supports:

* HD 1080p, H.264 / AVC high-profile (YUV420, I/P/B frames, CAVLC/CABAC)
* 8x H.264 encode throughput 1080p @ 240fps (1x = 1080p @ 30 fps)
* H.264 / SVC (temporal)
* Display Encode Mode (DEM)
  
Available on Kepler GPUs (GK104, GK106, GK107, GK110, GK110B, GK210, but not GK208):

* GRID K1 / K2 / K340 / K520
* Tesla K10 /K20 / K20X / K40 / K80
* Quadro 410 / K420 / K600 / K2000 / K2000D / K4000 / K4200 / K5000 / K5200	/ K6000
* Quadro K500M / K510M / K610M / K1000M / K1100M / K2000M / K2100M / K3000M / K3100M / K4000M / K4100M / K5000M / K5100M
* Quadro NVS 510
* GeForce GT 710 / 720 / 730 / 740
* GeForce GT 640M / 645M / 650M / 660M / 745M / 750M / 755M / 760M / 765M / 770M / 780M / 825M
* GeForce GTX 645 / 650 / 650 Ti / 650 Ti Boost / 660 / 660 Ti / 670 / 680 / 690 / 760 / 760 Ti / 770 / 780 / 780 Ti
* GeForce GTX 670MX	/ 675MX / 680M / 680MX / 860M / 870M / 880M 
* GeForce GTX Titan / Titan Black / Titan Z
* GeForce GT and GTX GPUs are limited to 2 encode sessions per system

### NVENC II (Maxwell 1st Gen.)

Supports:

* All NVENC I features
* HiP444 profile (YUV444, Predictive Coding, I / P frames)
* 16x H.264 encode throughput 1080p @ 480fps (1x = 1080p @ 30 fps)

Available on Maxwell 1st Gen. GPUs (GM107, but not GM108):
 
* Quadro K620 / K1200 / K2200
* Quadro M600M / M1000M / M2000M 
* Quadro NVS 810
* GeForce GTX 745 / 750 / 750 Ti
* GeForce GTX 850M / 860M / 950M / 960M / 965M / 970M / 980M
* GeForce GTX GPUs are limited to 2 encode sessions per system
	
### NVENC III (Maxwell 2nd Gen.)

Supports:

* All NVENC II features
* HEVC / H.265 encoding
* 4K UHD 2160p @ 60 fps H.264 encoding (2160p60) 

Available on Maxwell 2nd Gen. GPUs (GM200, GM204, GM206, but not GM208):

* Tesla M6 / M60
* Quadro M4000 / M5000 / M6000
* Quadro M3000M / M4000M / M5000M
* GeForce GTX 950 / 960 / 970 / 980 / 980 Ti
* GeForce GTX 965M / 970M / 980M
* GeForce GTX Titan X
* GeForce GTX GPUs are limited to 2 encode sessions per system

### NVENC IV (Pascal) 

Supports: 

* All NVENC III features
* HEVC / H.265 Main10 10-bit encoding
* 4K UHD HEVC / H.265 encoding
* 8K HEVC / H.265 encoding

Available on Pascal 1st Gen. GPUs (GP100, GP102, GP104, GP106, GP107, but not GP108):

* Quadro P400 / P600 / P1000 / P2000 / P4000 / P5000 / P6000 / GP100
* Tesla P4 / P40 / P100
* GeForce GTX 1050 / 1050 Ti / 1060 / 1070 / 1070 Ti / 1080 / 1080 Ti
* TITAN X / Xp

## AMD Video Coding Engine

AMD VCE is available on a wide set of discrete GPUs as well as APUs, ranging from high-end servers all the way down to low-end chips. To use AMD VCE you must install the correct AMD driver. The easiest way to do that is via the [AMD Driver Autodetect Tool](http://support.amd.com/en-us/download/auto-detect-tool). 

### VCE 1.0

#### Capabilities 

* HD 1080p H.264 / AVC (YUV420 I/P frames) encoding

#### Availability

Available on GCN 1.0 (Graphics Core Next 1.0 / GCN 1.0 / GCN 1st Gen):

##### Cape Verde, Curacao, Trinidad, Tahiti and Oland GPUs

* Radeon HD 7900 / 7800 / 7700 GPU series	
* Radeon R5 240 GPU
* Radeon R5 330 / 340 GPU
* Radeon R7 240 / 250 / 250X / 265 GPU
* Radeon R7 340 / 350 / 370 GPU
* Radeon R9 270 / 270X / 280 / 280X GPU

##### Trinity and Richland APUs

* A10 58XX / 68XX APU

### VCE 2.0

#### Capabilities 

* All VCE 1.0 features 
* H.264 / SVC (temporal)
* H.264 YUV420 (Intra and Predictive, I / P / B frames) 
* H.264 YUV444 (Intra Only, I frames only)

#### Availability

Available on GCN 1.1 (Graphics Core Next 1.1 / GCN 1.1 / GCN 2nd Gen):

##### Bonaire and Hawaii GPUs

* Radeon R7 260 / 260X GPU
* Radeon R9 290 / 290X / 295X2 GPU	
* Radeon R7 360 GPU
* Radeon R9 360 / 390 / 390X GPU

##### Kaveri, Kabini, Temash, Beema, Mullins, Carrizo-L APUs

* A10 7850K APU
* A8 7410 APU
* A6 1450 / 7310 APU
* A4 1200 / 3850 / 5350 / 7210 APU
* E2 7110 APU
* E1 2650 / 7010 APU 

### VCE 3.0

#### Capabilities

* All VCE 2.0 features 
* 4K UHD 2160p @ 30 fps H.264 encoding (2160p30)
* High quality video scaling

#### Availability

Available on GCN 1.2 (Graphics Core Next 1.2 / GCN 1.2 / GCN 3rd Gen):

##### Tonga and Fiji GPUs

* Radeon R9 285 GPU
* Radeon R9 380 GPU	
* Radeon R9 Nano / Fury / Fury X / Fury X2 GPU

##### Carizo APUs

* A10 8700P APU
* A8 8600P APU
* FX 8800P APU

