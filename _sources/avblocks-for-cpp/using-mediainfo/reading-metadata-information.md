---
title: Reading metadata information
metadata:
    description: This topic describes how to use the MediaInfo class to read metadata information like ID3 tags, and OGG and Windows Media metadata attributes from a file.
taxonomy:
    category: docs
---

# Reading metadata information

This topic describes how to use the MediaInfo class to read metadata like ID3 tags, OGG attributes, and Windows Media attributes from a file.

The code snippets in this article are from the [read_metadata_any_file](https://github.com/avblocks/avblocks-samples/tree/main/windows/cpp/samples/read_metadata_any_file) AVBlocks sample. 

## Create a MediaInfo object

Use the `createXyz` functions from the `primo::avblocks::Library` namespace to create new AVBlocks objects. For example, the `createMediaInfo` function creates a new `MediaInfo` object.

``` cpp

auto info = primo::make_ref(Library::createMediaInfo());

// Code that uses MediaInfo goes here

```

## Load metadata from file

Call `setFile` for the default input socket and then call `open`.

``` cpp

auto info = primo::make_ref(Library::createMediaInfo());

info->inputs()->at(0)->setFile(opt.avfile.c_str());

if(info->open())
{	
    printMetadata(info.get(), opt.avfile.c_str());
    return true;
}
else
{
    printError(info->error());
    return false;
}

```

## List attributes and pictures

Call the `MediaSocket::metadata` method of the default input socket to obtain a `Metadata` object. If there is no metadata, the `MediaSocket::metadata` method will return `NULL`.

``` cpp

void printMetadata(MediaInfo* info, const wchar_t* inputFile)
{
    Metadata* meta = NULL;
    if(info->outputs()->count() > 0)
        meta = info->outputs()->at(0)->metadata();

    if (!meta)
    {
        wcout << L"Could not find any metadata." << endl;
        return;
    }

    printMetaAttributes(meta);
    savePictures(meta, inputFile);
}

```

### Enumerate attributes

1. Call the `Metadata::attributes` method to get a `MetaAttributeList` object.
2. Call the `MetaAttributeList::at` to get a `MetaAttribute` object.
3. Get the name and the value of each attribute with the `MetaAttribute::name` and `MetaAttribute::value` methods.

<!-- end of list -->
 
``` cpp

void printMetaAttributes(Metadata* meta)
{
    stdout_utf16 mode;	

    wcout << L"Metadata\r\n--------" << endl;

    MetaAttributeList* attlist = meta->attributes();
    wcout << attlist->count() << L" attributes:" << endl;

    for (int i=0; i < attlist->count(); ++i)
    {
        MetaAttribute* attrib = attlist->at(i);
        wcout << setw(15) << left << attrib->name() << L": " << attrib->value() << endl;
    }
    wcout << endl;
}

```

### Enumerate pictures

1. Call the `Metadata::pictures` method to get a `MetaPictureList` object.
2. Call the `MetaPictureList::at` to get a `MetaPicture` object for each picture.
3. Call the methods of the `MetaPicture` interface to get the picture properties.

<!-- end of list -->
 
``` cpp

void printMetaAttributes(Metadata* meta)
{
    stdout_utf16 mode;	

    MetaPictureList* piclist = meta->pictures();
    wcout << piclist->count() << L" pictures:" << endl;
    
    for (int i=0; i < piclist->count(); ++i)
    {
        MetaPicture* pic = piclist->at(i);
        wcout << L"#" << (i+1) << L" mime: " << pic->mimeType() << L"; size: " << pic->dataSize();

        wcout << L"; type: " << getMetaPictureTypeName(pic->pictureType()) << endl;
        wcout << L"description: " << pic->description() << endl;
    }
    wcout << endl;
}

```

### Save pictures

To save a picture to a file:

1. Get the image type with the `MetaPicture::mimeType` method.
2. Call the `MetaPicture::data` and `MetaPicture::dataSize` methods to get the image data and size.
3. Write the image data to a file.

<!-- end of list -->

``` cpp

void savePicture(primo::codecs::MetaPicture* pic, const wstring& baseFilename)
{
    wstring filename(baseFilename);

    if (0 == strcmp( pic->mimeType(), primo::codecs::MimeType::Jpeg))
    {
        filename += L".jpg";
    }
    else if (0 == strcmp( pic->mimeType(), primo::codecs::MimeType::Png))
    {
        filename += L".png";
    }
    else if (0 == strcmp( pic->mimeType(), primo::codecs::MimeType::Gif))
    {
        filename += L".gif";
    }
    else if (0 == strcmp( pic->mimeType(), primo::codecs::MimeType::Tiff))
    {
        filename += L".tiff";
    }
    else
    {
        // unexpected picture mime type
        return;
    }

    ofstream out(filename.c_str(), ios::out | ios::binary | ios::trunc);

    if (out)
    {
        out.write((const char*)pic->data(), pic->dataSize());
    }
}
```

