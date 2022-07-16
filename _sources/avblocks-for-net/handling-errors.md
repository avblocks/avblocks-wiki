---
title: Handling Errors
metadata:
    description: This topic describes how to handle AVBlocks errors.
taxonomy:
    category: docs
---

# Handling Errors

When a class method encounters an error during its execution, the method returns `false`, and an ErrorInfo objects is generated. You can get the ErrorInfo object from the `Error` property of the corresponding class, for example MediaInfo.Error or Transcoder.Error.

The following example shows how you might handle an error if the MediaInfo.Open method did not succeed:

``` csharp
using (MediaInfo info = new MediaInfo())
{
    info.Inputs[0].File = inputFile;

    if (info.Open())
    {
        PrintStreams(info);

        info.Close();
    }
    else
    {
        PrintError(info.Error);
    }
}
```

The ErrorInfo.Facility, ErrorInfo.Code, and the ErrorInfo.Message properties return the component in which the error happened, the error code, and the error message. In addition for most errors the ErrorInfo.Hint property may provide additional useful information.

The following example shows how you can use the ErrorInfo object:

``` csharp
static void PrintError(ErrorInfo e)
{
    if (ErrorFacility.Success == e.Facility)
    {
        Console.WriteLine("Success");
        return;
    }

    Console.WriteLine("{0}, facility:{1} code:{2} hint:{3}", 
                            e.Message ?? "", e.Facility, e.Code, e.Hint ?? "");
}
```

