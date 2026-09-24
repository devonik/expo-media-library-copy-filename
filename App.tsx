import {
  Album,
  AssetField,
  MediaType,
  Query,
  requestPermissionsAsync,
} from 'expo-media-library';
import { StatusBar } from 'expo-status-bar';
import { useState } from 'react';
import { Button, StyleSheet, Text, View } from 'react-native';

const ALBUM_NAME = 'ExpoCopyFilenameRepro';

export default function App() {
  const [result, setResult] = useState('Tap the button to copy the newest photo into an album.');

  const copyNewestPhoto = async () => {
    try {
      const { granted } = await requestPermissionsAsync();
      if (!granted) {
        setResult('Media library permission denied.');
        return;
      }

      const [original] = await new Query()
        .eq(AssetField.MEDIA_TYPE, MediaType.IMAGE)
        .orderBy({ key: AssetField.CREATION_TIME, ascending: false })
        .limit(1)
        .exe();
      if (!original) {
        setResult('No photo in the media library. Take a photo first.');
        return;
      }

      // moveAssets = false: copy the asset into the album instead of moving it.
      const album = await Album.create(ALBUM_NAME, [original], false);
      const copies = await album.getAssets();
      const copyNames = await Promise.all(copies.map((copy) => copy.getFilename()));

      setResult(
        [
          `Original file name:\n${await original.getFilename()}`,
          `File name(s) in "${ALBUM_NAME}":\n${copyNames.join('\n')}`,
        ].join('\n\n'),
      );
    } catch (error) {
      setResult(`Error: ${error instanceof Error ? error.message : String(error)}`);
    }
  };

  return (
    <View style={styles.container}>
      <Button title="Copy newest photo into album" onPress={copyNewestPhoto} />
      <Text selectable style={styles.result}>
        {result}
      </Text>
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: 24, gap: 24, backgroundColor: '#fff' },
  result: { fontSize: 14, fontFamily: 'monospace' },
});
