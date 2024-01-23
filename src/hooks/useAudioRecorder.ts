import { useCallback, useEffect, useRef, useState } from "react";
import useTimer from "./useTimer";

type AudioRecorderHookReturnType = {
  audioVolume: number;
  audioURL: string | null;
  audioBlob: Blob | null;
  isRecording: boolean;
  startRecording: () => void;
  stopRecording: () => void;
  elapsedTime: number;
};
type AudioRecorderHookInputType = {
  onRecordingCompleted: (blob: Blob) => void;
};

let audioContext: AudioContext;
let gainNode: GainNode;
let analyser: AnalyserNode;
let microphone: MediaStreamAudioSourceNode;
const useAudioRecorder = (
  props: AudioRecorderHookInputType,
): AudioRecorderHookReturnType => {
  const [audioVolume, setAudioVolume] = useState<number>(0);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [audioURL, setAudioURL] = useState<string | null>(null);
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const { handleStart, handleReset, elapsedTime } = useTimer();

  const audioChunksRef = useRef<Blob[]>([]);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);

  useEffect(() => {
    if (!isRecording) {
      audioChunksRef.current = [];
      mediaRecorderRef.current == null;
      setAudioURL(null);
      setAudioBlob(null);
    }
    if (isRecording) {
      navigator.mediaDevices
        .getUserMedia({ audio: true, video: false }) // Mute the audio
        .then((stream) => {
          const mediaRecorderInstance = new MediaRecorder(stream);
          mediaRecorderRef.current = mediaRecorderInstance;

          const audioTracks = stream.getAudioTracks();
          audioTracks.forEach((track) => {
            track.onmute = null;
          });

          mediaRecorderInstance.ondataavailable = (e) => {
            if (e.data.size > 0) {
              audioChunksRef.current.push(e.data);
            }
          };

          mediaRecorderInstance.onstop = async () => {
            const audioBlob = new Blob(audioChunksRef.current, {
              type: "audio/m4a",
            });
            props.onRecordingCompleted(audioBlob);
            setAudioBlob(audioBlob);
            setAudioURL(URL.createObjectURL(audioBlob));
            stream.getTracks().forEach((track) => track.stop());
          };

          mediaRecorderInstance.start();

          audioContext = new AudioContext();
          gainNode = audioContext.createGain();
          analyser = audioContext.createAnalyser();
          microphone = audioContext.createMediaStreamSource(stream);
          microphone.connect(analyser);
          analyser.connect(gainNode);
          gainNode.connect(audioContext.destination);
          gainNode.gain.value = 0;
          analyser.fftSize = 256;
          const bufferLength = analyser.frequencyBinCount;
          const dataArray = new Uint8Array(bufferLength);

          const updateVolume = () => {
            analyser?.getByteFrequencyData(dataArray);
            const volume =
              dataArray.reduce((acc, value) => acc + value, 0) /
              bufferLength /
              256;
            setAudioVolume(volume);
          };

          const volumeUpdateInterval = setInterval(updateVolume, 100);
          return () => {
            clearInterval(volumeUpdateInterval);
            mediaRecorderInstance.stop();
            audioContext?.close();
            analyser?.disconnect();
            gainNode?.disconnect();
            microphone?.disconnect();
          };
        })
        .catch((error) => {
          console.error("Error accessing microphone:", error);
        });
    }
  }, [isRecording, audioChunksRef.current]);

  const startRecording = useCallback(() => {
    setIsRecording(true);
    handleStart();
  }, []);
  const stopRecording = useCallback(() => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
    }
    setIsRecording(false);
    handleReset();
  }, []);

  return {
    audioVolume,
    audioBlob,
    audioURL,
    isRecording,
    startRecording,
    stopRecording,
    elapsedTime,
  };
};

export default useAudioRecorder;
