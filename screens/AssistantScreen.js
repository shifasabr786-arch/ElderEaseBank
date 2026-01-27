import React, { useState } from 'react';
import { View, Button, Text } from 'react-native';
import { Audio } from 'expo-audio';
import { FileSystem } from 'expo-file-system/legacy'; // use legacy FS for now until you fully migrate

export default function Recorder() {
  const [recording, setRecording] = useState(null);
  const [uri, setUri] = useState(null);
  const [isRecording, setIsRecording] = useState(false);

  async function startRecording() {
    try {
      console.log('Requesting permissions...');
      const permission = await Audio.requestRecordingPermissionsAsync();
      if (permission.status !== 'granted') {
        alert('Permission to access microphone is required!');
        return;
      }

      console.log('Starting recording...');
      const { recording } = await Audio.Recording.createAsync(
        Audio.RecordingOptionsPresets.HIGH_QUALITY
      );

      setRecording(recording);
      setIsRecording(true);
      console.log('Recording started');
    } catch (err) {
      console.error('Failed to start recording:', err);
    }
  }

  async function stopRecording() {
    console.log('Stopping recording...');
    try {
      if (!recording) return;

      await recording.stopAndUnloadAsync();
      const uri = recording.getURI();
      setUri(uri);
      setRecording(null);
      setIsRecording(false);

      console.log('Recording stopped and stored at:', uri);
    } catch (err) {
      console.error('Failed to stop recording:', err);
    }
  }

  return (
    <View style={{ padding: 20 }}>
      <Button
        title={isRecording ? 'Stop Recording' : 'Start Recording'}
        onPress={isRecording ? stopRecording : startRecording}
      />
      {uri && <Text>Saved at: {uri}</Text>}
    </View>
  );
}
