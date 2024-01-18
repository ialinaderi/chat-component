import {ReactNode, useEffect, useMemo, useRef, useState} from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import {Slider} from "antd";
import {Pause, PlayOne} from "@icon-park/react";
import {formatTime} from "../../utils";

function LinkRenderer(props: any) {
    return (
        <a
            href={props.href}
            className={"break-words text-primary-3 underline"}
            target="_blank"
            rel="noreferrer"
        >
            {props.children}
        </a>
    );
}

function BubbleVoice(props: {
    message: string;
    voiceSrc: string;
    footer: ReactNode;
}) {
    const audioRef = useRef<HTMLAudioElement>(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);

    const audioFile = "your-audio-file.mp3"; // Replace with your audio file URL

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
    return (
        <div>
            <div className={"px-3 pt-2.5"}>
                <div className={"flex w-52 items-center gap-3"} dir={"ltr"}>
                    <button
                        className={
                            "flex h-10 w-10 items-center justify-center rounded-full bg-white"
                        }
                        onClick={handlePlayPause}
                    >
                        {isPlaying ? (
                            <Pause className={"text-primary"} size={22}/>
                        ) : (
                            <PlayOne className={"text-primary"} size={22}/>
                        )}
                    </button>
                    <div className={"flex h-10 flex-1 flex-col gap-1"}>
                        <Slider
                            min={0}
                            max={duration}
                            value={currentTime}
                            onChange={handleSeek}
                            step={0.0001}
                            range={false}
                            tooltip={{formatter: null}}
                        />
                        {time !== "NaN:aN" && <span className={"text-xs"}>{time}</span>}
                    </div>
                </div>
                {/* eslint-disable-next-line jsx-a11y/media-has-caption */}
                <audio
                    ref={audioRef}
                    src={props.voiceSrc}
                    onTimeUpdate={handleTimeUpdate}
                    onDurationChange={handleDurationChange}
                    // onLoadedMetadata={(event) =>
                    // 	// console.log(event.currentTarget.duration)
                    // }
                    preload="auto"
                />
                <p className={"whitespace-pre-line text-sm"} dir={"auto"}>
                    {props.message && (
                        <ReactMarkdown
                            remarkPlugins={[remarkGfm]}
                            components={{a: LinkRenderer}}
                        >
                            {props.message}
                        </ReactMarkdown>
                    )}
                </p>
            </div>
            <div className={"px-3 py-1 pb-2"}>{props.footer}</div>
        </div>
    );
}

export default BubbleVoice;
