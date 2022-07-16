---
title: Reading metadata information
metadata:
    description: This topic describes how to use the MediaInfo class to read metadata information like ID3 tags, and OGG and Windows Media metadata attributes from a file.
taxonomy:
    category: docs
---

# Reading metadata information

This topic describes how to use the MediaInfo class to read metadata like ID3 tags, OGG attributes, and Windows Media attributes from a file.

The code snippets in this article are from the [read_metadata_any_file](https://github.com/avblocks/avblocks-samples/tree/main/windows/net/samples/read_metadata_any_file) AVBlocks sample.

## Create a MediaInfo object

Use the standard new operator to create AVBlocks objects.

``` csharp

using (MediaInfo info = new MediaInfo())
{
    // Code that uses MediaInfo goes here
}

```
## Load info from file

Set `File` of the default input, then call `Open`.

``` csharp

using (MediaInfo info = new MediaInfo())
{
    info.Inputs[0].File = inputFile;

    if (!info.Open())
    {
        PrintError("MediaInfo Open", info.Error);
        return false;
    }
}

```

## List attributes and pictures

Use the `MediaInfo.Metadata` property to obtain a Metadata object. If there is no metadata, the MediaInfo.Metadata property will be null.

``` csharp

using (MediaInfo info = new MediaInfo())
{
    Metadata meta = null;

    if (info.Outputs.Count > 0)
        meta = info.Outputs[0].Metadata;

    if (meta == null)
    {
        Console.WriteLine("Could not find any metadata.");
        return true;
    }

    PrintMetaAttributes(meta);

    SavePictures(meta, info.Inputs[0].File);
}

return true;

```

### Enumerate attributes

1. Use the `Metadata.Attributes` property to get a list of `MetaAttribute` objects.
2. Use `MetaAttribute.Name` and `MetaAttribute.Value` properties to get the name and the value of each attribute.

<!-- end of list -->
 
``` csharp

static void PrintMetaAttributes(Metadata meta)
{
    Console.WriteLine("Metadata\r\n--------");

    Console.WriteLine("{0} attributes:", meta.Attributes.Count);

    foreach (var attrib in meta.Attributes)
    {
        Console.WriteLine("{0,-15}: {1}", attrib.Name, attrib.Value);
    }
    Console.WriteLine();

}
        
```

### Enumerate pictures

1. Use the `Metadata.Pictures` property to get a list of `MetaPicture` objects.
2. Use the properties of the `MetaPicture` class to get the picture properties.

<!-- end of list -->
 
``` csharp

static void PrintMetaAttributes(Metadata meta)
{
    Console.WriteLine("{0} pictures:", meta.Pictures.Count);

    int i = 1;
    foreach (var pic in meta.Pictures)
    {
        Console.WriteLine("#{0} {1}, {2} bytes, {3}, {4}",
                            i++, pic.MimeType, pic.Bytes.Length, pic.PictureType, pic.Description);
    }

    Console.WriteLine();
}

```

### Save pictures

``` csharp

static void SavePictures(Metadata meta, string inputFile)
{
    if (meta == null || meta.Pictures.Count == 0)
        return;

    int i = 1;
    foreach (var pic in meta.Pictures)
    {
        string picName = inputFile + ".pic" + i;
        ++i;
        SavePicture(pic, picName);
    }
}

```

To save a picture to a file:

1. Get the image type with the `MetaPicture.MimeType` property.
2. Get the the image data with the `MetaPicture.Bytes` property.
3. Write the image data to a file.

<!-- end of list -->

``` csharp

static void SavePicture(MetaPicture pic, string baseFilename)
{
    string filename;

    if (pic.MimeType == MimeType.Jpeg)
    {
        filename = baseFilename + ".jpg";
    }
    else if (pic.MimeType == MimeType.Png)
    {
        filename = baseFilename + ".png";
    }
    else if (pic.MimeType == MimeType.Gif)
    {
        filename = baseFilename + ".gif";
    }
    else if (pic.MimeType == MimeType.Tiff)
    {
        filename = baseFilename + ".tiff";
    }
    else
    {
        // unexpected picture mime type
        return;
    }

    System.IO.File.WriteAllBytes(filename, pic.Bytes);
}

```

