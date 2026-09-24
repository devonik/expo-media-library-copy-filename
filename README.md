# expo-media-library: copied assets get their full source path as file name

Minimal reproduction for an Android bug in `expo-media-library` 57.0.5.

When `Album.create(name, assets, false)` copies an asset into an album, the
copy is named after the full `file://` path of the original instead of its
file name:

| | File name |
| --- | --- |
| Original | `IMG_20260923_095617.jpg` |
| Copy in the album | `file____storage_emulated_0_DCIM_Camera_IMG_20260923_095617.jpg` |

## Reproduce

Requirements: an Android device or emulator running Android 11 or later, with
at least one photo in its media library.

1. Install the dependencies and run a development build:

   ```sh
   pnpm install
   pnpm expo run:android
   ```

2. Grant access to photos and videos.
3. Tap **Copy newest photo into album**.

The app copies the newest photo into the album `ExpoCopyFilenameRepro` and
shows both file names. Expected: the copy has the same file name as the
original. Actual: the copy's file name is the original's full path with `/`
and `:` replaced by `_`.

## Cause

`AssetModernDelegate.copyInternal` uses `getUri().toString()` as the display
name of the new MediaStore entry; `getUri()` returns the `file://` path of the
original. `getFilename()` returns the intended name.
