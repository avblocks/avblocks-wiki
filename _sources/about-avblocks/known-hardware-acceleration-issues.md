---
title: Known Hardware Acceleration Issues
html_meta:
    description: This topic discusses known hardware acceleration issues with some GPUs.
taxonomy:
    category: docs
---

# Known Hardware Acceleration Issues

This topic discusses known hardware acceleration issues that exist with some GPUs.

## Intel QuickSync Video

### No Known Issues

We have tested with 4th, 5th, and 6th generation Core i5 and i7 CPUs with Integrated Graphics. There are no known issues with Intel's hardware.         

---

## NVIDIA NVENC

### Known Issues 

#### Kepler (GK208)

Cards based on the Kepler GK208 chipset do not have hardware encoding capability:

* GeForce GT 720M / 730M / 735M / 740M
* GeForce GT 910M / 920M

#### Maxwell 1st Gen. (GM108)

Cards based on the Maxwell GM108 chipset do not have hardware encoding capability:

* GeForce 830M / 840M 
* GeForce 920MX / 930M / 930MX / 940M / 940MX / 945M 
* GeForce GT 945A

#### Pascal 1st Gen. (GP108)

Cards based on the Pascal GP108 chipset do not have hardware encoding capability:

* GeForce GT 1030
* GeForce MX150

---

## AMD Video Coding Engine

We have tested with Radeon R7 2xx, R7 3xx and R9 3xx GPUs. There are no known issues with Radeon R9 series, but you may experience driver crashes, driver restarts, or system instability with AMD Radeon R7 2xx and 3xx GPUs.

More specifically on R7 2XX and R7 3XX discrete GPUs there seems to compatibility issues between the AMD GPU driver and the Video BIOS (VBIOS) used in some models which makes using Video Codec Engine (VCE) hardware impossible. 

For some of those cards the issue can be fixed by updating the Video BIOS. 

### Known Issues  

#### XFX AMD Radeon R7 260X, Core Edition (R7-260X-CNVF)

##### Model, BIOS, Driver

| Name                         | Model            | Video BIOS Version | AMD Catalyst Driver Versions |
|:-----------------------------|:-----------------|:-------------------|:-----------------------------|
| Radeon R7 260X, Core Edition | [R7-260X-CNVF][] | 015.048.000.011    | 14.12, 15.7, 15.7.1          | 

##### Issue

Attempting to create an H.264 hardware encoder instance via the Media Foundation API results in a [TDR Error][] and GPU reset. This is due to a Video BIOS (VBIOS) bug.

##### Resolution

> Update VBIOS to 015.048.000.013.

This card comes originally with VBIOS version 015.048.000.011. XFX does not offer a VBIOS upgrade, but there is a newer VBIOS version 015.048.000.013 that is compatible on [TechPowerUp.com][]. 

To update the VBIOS, download `XFX.R7260X.2048.141013.rom` from [TechPowerUp.com][] and use it to reprogram your AMD GPU. You can do that with the [ATIWinFlash][] utility. 

IMPORTANT: Make sure you backup your current VBIOS, before replacing it. That way, if something goes wrong you will be able to restore your GPU to the old state. You can use the [ATIWinFlash][] to save your current VBIOS to your hard disc.

#### Gygabyte AMD Radeon R7 360, OC (GV-R7360C-2GD)

##### Model, BIOS, Driver

| Name                   | Model             | Video BIOS Version  | AMD Catalyst Driver Versions |
|:-----------------------|:------------------|:--------------------|:-----------------------------|
| Radeon R7 360, Rev 1.0 | [GV-R7360C-2GD][] | 015.049.000.000     | 15.7, 15.7.1                 |
| Radeon R7 360, Rev 1.0 | [GV-R7360C-2GD][] | 015.049.000.007     | 15.7, 15.7.1                 |
 
##### Issue

Attempting to create an H.264 hardware encoder instance via the Media Foundation API results in a [TDR Error][] and GPU reset. This is likely due to a Video BIOS (VBIOS) bug.

##### Resolution

> Solution for this card _does not_ exist presently. Updating the Video BIOS to the latest version available from Gygabyte _does not_ fix this issue.

This card comes originally with VBIOS version 015.049.000.000 / F2 or 015.049.000.000 / F20 . 

Gygabyte offers an updated BIOS version 015.049.000.007 / F3 or 015.049.000.007 / F21 . 

To update the VBIOS, download the F3 or the F21 flavor from [Gygabyte](http://www.gigabyte.us/products/product-page.aspx?pid=5467&dl=1&RWD=0#bios) and use it to reprogram your AMD GPU. You can do that with the [ATIWinFlash][] utility. 

IMPORTANT: Make sure you backup your current VBIOS, before replacing it. That way, if something goes wrong you will be able to restore your GPU to the old state. You can use the [ATIWinFlash][] to save your current VBIOS to your hard disc.

[ATIWinFlash]: https://www.techpowerup.com/downloads/2311/ati-winflash-2-6-7/ 
[TDR Error]: https://msdn.microsoft.com/en-us/library/windows/hardware/ff569917(v=vs.85).aspx 
[TechPowerUp.com]: https://www.techpowerup.com/vgabios/173485/xfx-r7260x-2048-141013.html

[R7-260X-CNVF]: http://xfxforce.com/en-us/products/amd-radeon-r7-200-series/amd-radeon-r7-260x-core-edition-r7-260x-cnfv
[GV-R7360C-2GD]: http://www.gigabyte.us/products/product-page.aspx?pid=5467#kf

  