"use client";

import {
  MusicNotes,
  Pause,
  Play,
  SpeakerHigh,
} from "@phosphor-icons/react";
import { useEffect, useRef, useState } from "react";

const TRACK_LENGTH = 16;

function createAmbientWave() {
  const sampleRate = 16000;
  const sampleCount = sampleRate * TRACK_LENGTH;
  const buffer = new ArrayBuffer(44 + sampleCount * 2);
  const view = new DataView(buffer);
  const writeText = (offset: number, value: string) => {
    for (let index = 0; index < value.length; index += 1) {
      view.setUint8(offset + index, value.charCodeAt(index));
    }
  };

  writeText(0, "RIFF");
  view.setUint32(4, 36 + sampleCount * 2, true);
  writeText(8, "WAVE");
  writeText(12, "fmt ");
  view.setUint32(16, 16, true);
  view.setUint16(20, 1, true);
  view.setUint16(22, 1, true);
  view.setUint32(24, sampleRate, true);
  view.setUint32(28, sampleRate * 2, true);
  view.setUint16(32, 2, true);
  view.setUint16(34, 16, true);
  writeText(36, "data");
  view.setUint32(40, sampleCount * 2, true);

  const chords = [
    [261.63, 329.63, 392],
    [220, 277.18, 329.63],
    [174.61, 220, 261.63],
    [196, 246.94, 293.66],
  ];

  for (let index = 0; index < sampleCount; index += 1) {
    const time = index / sampleRate;
    const localTime = time % 4;
    const chord = chords[Math.floor(time / 4) % chords.length];
    const attack = Math.min(1, localTime / 0.55);
    const release = Math.min(1, (4 - localTime) / 1.15);
    const envelope = Math.max(0, attack * release);
    const shimmer = Math.sin(Math.PI * 2 * 0.1 * time) * 0.08 + 0.92;
    let sample = 0;

    for (const frequency of chord) {
      sample += Math.sin(Math.PI * 2 * frequency * time) * 0.075;
      sample += Math.sin(Math.PI * 2 * frequency * 2 * time) * 0.014;
    }

    const pulse = Math.exp(-Math.pow((localTime % 1) * 5, 2));
    sample += Math.sin(Math.PI * 2 * chord[1] * 2 * time) * pulse * 0.025;
    const output = Math.max(-1, Math.min(1, sample * envelope * shimmer));
    view.setInt16(44 + index * 2, output * 32767, true);
  }

  return new Blob([buffer], { type: "audio/wav" });
}

export function MusicPlayer() {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [playing, setPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [volume, setVolume] = useState(0.38);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    const url = URL.createObjectURL(createAmbientWave());
    audio.src = url;
    audio.volume = 0.38;
    audio.load();
    return () => {
      audio.pause();
      audio.removeAttribute("src");
      URL.revokeObjectURL(url);
    };
  }, []);

  const togglePlayback = async () => {
    const audio = audioRef.current;
    if (!audio || !audio.src) return;
    if (audio.paused) {
      await audio.play();
    } else {
      audio.pause();
    }
  };

  return (
    <div className="music-player">
      <audio
        ref={audioRef}
        loop
        preload="auto"
        onPlay={() => setPlaying(true)}
        onPause={() => setPlaying(false)}
        onTimeUpdate={(event) => setCurrentTime(event.currentTarget.currentTime)}
      />

      <div className="music-player-art" aria-hidden="true">
        <MusicNotes weight="fill" />
      </div>
      <div className="music-player-copy">
        <span>NOW PLAYING</span>
        <strong>萝卜狗的午后</strong>
        <small>RADDIE AMBIENT LOOP</small>
      </div>
      <button
        type="button"
        className="music-player-toggle"
        onClick={togglePlayback}
        aria-label={playing ? "暂停音乐" : "播放音乐"}
      >
        {playing ? <Pause weight="fill" /> : <Play weight="fill" />}
      </button>

      <input
        className="music-player-progress"
        type="range"
        min="0"
        max={TRACK_LENGTH}
        step="0.1"
        value={Math.min(currentTime, TRACK_LENGTH)}
        onChange={(event) => {
          const nextTime = Number(event.target.value);
          setCurrentTime(nextTime);
          if (audioRef.current) audioRef.current.currentTime = nextTime;
        }}
        aria-label="音乐播放进度"
      />
      <label className="music-player-volume">
        <SpeakerHigh weight="fill" />
        <span className="sr-only">音乐音量</span>
        <input
          type="range"
          min="0"
          max="1"
          step="0.05"
          value={volume}
          onChange={(event) => {
            const nextVolume = Number(event.target.value);
            setVolume(nextVolume);
            if (audioRef.current) audioRef.current.volume = nextVolume;
          }}
        />
      </label>
    </div>
  );
}
