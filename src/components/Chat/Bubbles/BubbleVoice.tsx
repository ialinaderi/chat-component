import { ReactNode, useEffect, useMemo, useRef, useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Slider } from "antd";
import { Pause, PlayOne } from "@icon-park/react";
import { formatTime } from "../../../utils";
import { components } from "./config";

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
  message?: string;
  voiceSrc: string;
  footer: ReactNode;
}) {
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
              <Pause className={"text-primary"} size={22} />
            ) : (
              <PlayOne className={"text-primary"} size={22} />
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
              tooltip={{ formatter: null }}
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
        <p className={"whitespace-pre-line break-words text-sm"} dir={"auto"}>
          {props.message && (
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              components={{ ...components, a: LinkRenderer }}
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
const text =
  'بله، البته. در ادامه یک مثال از استفاده از دستورات `join` و `split` در پایتون را برای شما آورده‌ام:\n\n### مثال استفاده از `join`:\n```python\n# تعریف یک لیست از رشته‌ها\nwords = ["Hello", "World", "CS50"]\n\n# ادغام اعضای لیست با استفاده از فاصله به عنوان جداکننده\nsentence = " ".join(words)\n\n# چاپ کردن جمله ادغام شده\nprint(sentence)\n```\n\nدر این مثال، ابتدا یک لیست از رشته‌ها تعریف شده است. سپس با استفاده از دستور `join`، این رشته‌ها با استفاده از فاصله به عنوان جداکننده، به یک رشته واحد ادغام می‌شوند و در متغیر `sentence` ذخیره می‌شوند.\n\n### مثال استفاده از `split`:\n```python\n# تعریف یک رشته\nsentence = "Hello, World, CS50"\n\n# تقسیم رشته بر اساس ویرگول و فاصله\nwords = sentence.split(", ")\n\n# چاپ کردن لیست کلمات حاصل از تقسیم رشته\nprint(words)\n```\n\nدر این مثال، یک رشته تعریف شده است و سپس با استفاده از دستور `split`، رشته بر اساس ویرگول و فاصله تقسیم شده و نتیجه در یک لیست از کلمات ذخیره می‌شود.\n\nبا اجرای این دو مثال، می‌توانید عملکرد دقیق این دستورات را در پایتون مشاهده کنید.';
export default BubbleVoice;
