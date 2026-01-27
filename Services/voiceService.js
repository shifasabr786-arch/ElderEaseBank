// services/voiceService.js
import { Audio } from "expo-av";
import * as FileSystem from "expo-file-system";
import { Platform } from "react-native";

let recording = null;

export async function startRecording() {
  try {
    // Request permissions are handled by Audio.requestPermissionsAsync in older SDKs.
    await Audio.requestPermissionsAsync?.();
    await Audio.setAudioModeAsync({
      allowsRecordingIOS: true,
      playsInSilentModeIOS: true,
    });

    recording = new Audio.Recording();
    await recording.prepareToRecordAsync(
      Audio.RECORDING_OPTIONS_PRESET_HIGH_QUALITY
    );
    await recording.startAsync();
    return { ok: true };
  } catch (error) {
    console.error("startRecording error", error);
    return { ok: false, error };
  }
}

export async function stopRecording() {
  try {
    if (!recording) return { ok: false, error: "No active recording" };
    await recording.stopAndUnloadAsync();
    const uri = recording.getURI();
    recording = null;

    // On Android sometimes we need to copy to cache to ensure readable file
    if (Platform.OS === "android") {
      const newPath = `${FileSystem.cacheDirectory}recording-${Date.now()}.m4a`;
      await FileSystem.copyAsync({ from: uri, to: newPath });
      return { ok: true, uri: newPath };
    }

    return { ok: true, uri };
  } catch (error) {
    console.error("stopRecording error", error);
    return { ok: false, error };
  }
}
