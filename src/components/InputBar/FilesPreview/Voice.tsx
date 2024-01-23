import React, { useEffect, useMemo, useRef, useState } from "react";
import { Avatar, Button, List, Slider, Tooltip } from "antd";
import { FileRemovalOne, Pause, PlayOne } from "@icon-park/react";
import { formatTime } from "../../../utils";

const VoiceItem = ({
  file,
  removeFile,
}: {
  file: File;
  removeFile: (file: File) => void;
}) => {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  const handlePlayPause = () => {
    if (isPlaying) {
      audioRef.current?.pause();
    } else {
      audioRef.current?.play();
    }
    setIsPlaying(!isPlaying);
  };

  const handleTimeUpdate = () => {
    if (!audioRef.current) return;
    setCurrentTime(audioRef.current.currentTime);
  };

  useEffect(() => {
    if (audioRef.current?.currentTime === duration) setIsPlaying(false);
  }, [audioRef.current?.currentTime]);

  const handleDurationChange = () => {
    if (!audioRef.current) return;
    setDuration(audioRef.current.duration);
  };

  const handleSeek = (value: number) => {
    if (!audioRef.current) return;
    audioRef.current.currentTime = value;
    setCurrentTime(value);
  };
  const time = useMemo(() => {
    if (currentTime) {
      return formatTime(currentTime);
    } else {
      return formatTime(duration);
    }
  }, [duration, currentTime]);

  const fileUrl = useMemo(() => {
    return URL.createObjectURL(file);
  }, [file]);

  return (
    <List.Item>
      <List.Item.Meta
        avatar={
          <Avatar
            shape={"square"}
            onClick={handlePlayPause}
            className={
              "flex items-center justify-center bg-gray-100 text-gray-700"
            }
          >
            {isPlaying ? <Pause size={22} /> : <PlayOne size={22} />}
          </Avatar>
        }
        title={"Recorded Voice"}
        description={
          <div className={"flex w-52 items-center gap-3"} dir={"ltr"}>
            <div className={"flex h-10 flex-1 flex-col gap-1"}>
              <Slider
                min={0}
                max={duration}
                value={currentTime}
                onChange={handleSeek}
                step={0.0001}
                range={false}
                tooltip={{ formatter: null }}
              />
              {time !== "NaN:aN" && <span className={"text-xs"}>{time}</span>}
            </div>
            <audio
              ref={audioRef}
              src={fileUrl}
              onTimeUpdate={handleTimeUpdate}
              onDurationChange={handleDurationChange}
              // onLoadedMetadata={(event) =>
              // 	// console.log(event.currentTarget.duration)
              // }
              preload="auto"
            />
          </div>
        }
      />
      <button
        className={"text-red-600"}
        onClick={() => {
          removeFile(file);
        }}
      >
        <Tooltip title={"حذف"}>
          <FileRemovalOne />
        </Tooltip>
      </button>
    </List.Item>
  );
};

export default VoiceItem;
