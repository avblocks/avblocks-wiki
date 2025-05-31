---
title: Setting License Info
html_meta:
    description: This topic describes how to use an AVBlocks license file.
taxonomy:
    category: docs
---

# Setting License Info

## AVBlocks License File

The AVBlocks license file is sent to you via email when you purchase a license. The license file is an XML document that looks similar to this one: 

``` xml
<!-- 
This file contains PrimoSoftware license(s). 
Line breaks and indentation between elements can be edited, 
but any other reformatting may invalidate the license(s). 
-->
<primoSoftware>
  <license version='1.0'>
    <token>abcdefghijklmnlo</token>
    <revision>1</revision>
    <issueDate>2013-05-29</issueDate>
    <expireDate>2015-05-30</expireDate>
    <updateTime>2014-11-02 22:59:08</updateTime>
    <item id='avb-win'>
      <product>avb</product>
    </item>
    <item id='avb-mac'>
      <product>avb</product>
    </item>
    <item id='avb-linux'>
      <product>avb</product>
    </item>
    <item id='avb-linux-debian'>
      <product>avb</product>
    </item>
    <signature>very_very_long_signature_string_here</signature>
  </license>
</primoSoftware>
```

In C++, you have to pass the XML as a string to Library::setLicense. You can use a C++11 [string literal](http://en.cppreference.com/w/cpp/language/string_literal), e.g. `R"xml( xml goes here )xml"`.

## Windows

This code requires Visual Studio 2013 or later.

``` cpp
// SetLicense.cpp : Defines the entry point for the console application.
//

#include "stdafx.h"

// Primo Software License in XML format. 
// You will have this after obtaining a commercial license 
static const char* licenseXml = R"xml(
    <!-- 
    This file contains PrimoSoftware license(s). 
    Line breaks and indentation between elements can be edited, 
    but any other reformatting may invalidate the license(s). 
    -->
    <primoSoftware>
        <license version='1.0'>
        <token>abcdefghijklmnlo</token>
        <revision>1</revision>
        <issueDate>2013-05-29</issueDate>
        <expireDate>2015-05-30</expireDate>
        <updateTime>2014-11-02 22:59:08</updateTime>
        <item id='avb-win'>
            <product>avb</product>
        </item>
        <item id='avb-mac'>
            <product>avb</product>
        </item>
        <item id='avb-linux'>
            <product>avb</product>
        </item>
        <item id='avb-linux-debian'>
            <product>avb</product>
        </item>
        <signature>very_very_long_signature_string_here</signature>
        </license>
    </primoSoftware>
)xml";

int _tmain(int argc, _TCHAR* argv[])
{
    using namespace primo::license;
    using namespace primo::avblocks;

    Library::initialize();

    // Optionally enable TLS for license verification. 
    // This must be done before calling Library::setLicense
    Library::setLicenseTls(1);

    // Pass the license XML to Library::setLicense
    // NOTE: If the license expireDate is in the past, 
    // this will trigger a license verification call 
    // to Primo Software over the Internet. 
    Library::setLicense(licenseXml);

    {
        primo::ref<LicenseInfo> licenseInfo(Library::createLicenseInfo());
        assert(LicenseStatusFlags::Ready == licenseInfo->licenseStatus());
    }

    Library::shutdown();

    return 0;
}
```
