---
title: String Encoding
metadata:
    description: This topic describes the string encoding used by the AVBlocks C and C++ APIs.
taxonomy:
    category: docs
---

# String Encoding

This topic describes the string encoding used by the AVBlocks C++ API.

## Unicode Strings

The AVBlocks API uses UTF-16 unicode encoding.

The AVBlocks API character type is `char_t`, where `char_t` represents a UTF-16 character and is defined as a 16 bit unsigned integer on all platforms (Windows, Mac and Linux).

Note: A Unicode character can be expressed by 1 or 2 UTF-16 code units, i.e. by 2 or 4 bytes.

### Windows

On Windows the `char_t` type is the same as the `wchar_t` type. Your Windows application must be compiled for Unicode.

### Mac

#### CoreFoundation

`CFStringRef` is UTF-16, so the encoding matches the `char_t` encoding. In your code, you can use the `CFStringGetCharactersPtr` function:

``` cpp
// Get a UniChar* pointer from CFStringRef and pass it to AVBlocks

NSString theString;
const UniChar* theStringPtr = CFStringGetCharactersPtr((__bridge CFStringRef) theString);

primo::codecs::MetaAttribute* metaAttribute = primo::avblocks::Library::createMetaAttribute();
    metaAttribute->setName(primo::codecs::Meta::Album);
    metaAttribute->setValue(theStringPtr); 
metaAttribute->release();
```

#### Foundation

NSString is UTF-16. The UTF-16 encoding matches the AVBlocks API. You can use the `CFStringGetCharactersPtr` function:

``` cpp
// Get a UniChar* pointer from NSString and pass it to AVBlocks

NSString theString;
const UniChar* theStringPtr = CFStringGetCharactersPtr((__bridge CFStringRef) theString);

primo::codecs::MetaAttribute* metaAttribute = primo::avblocks::Library::createMetaAttribute();
    metaAttribute->setName(primo::codecs::Meta::Album);
    metaAttribute->setValue(theStringPtr); 
metaAttribute->release();
```

#### Command Line

On Mac / Unix, `wchar_t` is defined as a 32-bit unsigned integer by default. Conversion is required between your code (if using UTF-8 or UTF-32 encoding)  and `char_t` (UTF-16 encoding). 

AVBlocks comes with the `primo::ustring` helper class (defined in `include/PrimoUString.h`) which can be used for string conversion. The `MetaInfo` sample demonstrates the use of the `primo::ustring` class:

``` cpp
void printMetadata(Metadata* meta)
{
    MetaAttributeList* attlist = meta->attributes();

    for (int i=0; i < attlist->count(); ++i)
    {
        MetaAttribute* attrib = attlist->at(i);
        
        cout << setw(15) << left 
             << attrib->name() << ": " 
             << primo::ustring(attrib->value()) << endl;
    }
}
```

### Linux

#### Command Line

On Linux, `wchar_t` is defined as a 32-bit unsigned integer by default. Conversion is required between your code (if using UTF-8 or UTF-32 encoding) and `char_t` (UTF-16 encoding). 

AVBlocks comes with the `primo::ustring` helper class (defined in `include/PrimoUString.h`) which can be used for string conversion. The `MetaInfo` sample demonstrates the use of the `primo::ustring` class:

``` cpp
void printMetadata(Metadata* meta)
{
    MetaAttributeList* attlist = meta->attributes();

    for (int i=0; i < attlist->count(); ++i)
    {
        MetaAttribute* attrib = attlist->at(i);
        
        cout << setw(15) << left 
             << attrib->name() << ": " 
             << primo::ustring(attrib->value()) << endl;
    }
}
```

## ANSI Strings

The text constants which are part of the AVBlocks API itself are plain 8-bit ANSI `char` for convenience. For example, the `primo::codecs::Meta` namespace contains metadata attribute names defined as ANSI strings:    

``` cpp
/**
    Metadata attribute names
*/
namespace Meta
{
    /** Album */
    static const char Album[]				= "Album";

    /** Composer */
    static const char Composer[]			= "Composer";

    /** Genre */
    static const char Genre[]				= "Genre";

    /** Copyright */
    static const char Copyright[]			= "Copyright";
}
```
