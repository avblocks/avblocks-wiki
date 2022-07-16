---
title: Handling Errors
metadata:
    description: This topic describes how to handle AVBlocks errors.
taxonomy:
    category: docs
---

# Handling Errors

This topic describes how to handle AVBlocks errors.

When a class method encounters an error during its execution, the method returns 0 (FALSE), and an {errorinfo-cpp}` ` objects is generated. You can get the {errorinfo-cpp}` ` object by calling the `error` method of the corresponding class, for example `MediaInfo::error` or `Transcoder::error`.

This example shows how you might handle an error if the `MediaInfo::open` method did not succeed:

``` cpp
auto info = primo::make_ref(Library::createMediaInfo());

info->inputs()->at(0)->setFile(opt.avfile.c_str());

if(info->open())
{
    printStreams(info.get());
    return true;
}
else
{
    printError(info->error());
    return false;
}
```

The `ErrorInfo::facility`, `ErrorInfo::code`, and the `ErrorInfo::message` methods return the component in which the error happened, the error code, and the error message. In addition for most errors the `ErrorInfo::hint` method may provide additional useful information.

The following example shows how you can use the {errorinfo-cpp}` ` object:

``` cpp
void printError(const primo::error::ErrorInfo* e)
{
    if (primo::error::ErrorFacility::Success == e->facility())
    {
        wcout << L"Success";
    }
    else
    {
        wcout << L"facility: " << e->facility() << L", error: " << e->code();

        if (e->message())
        {
            wcout << L", " << e->message();
        }

        if (e->hint())
        {
            wcout << L", " << e->hint();
        }
    }

    wcout << endl;
}
```
