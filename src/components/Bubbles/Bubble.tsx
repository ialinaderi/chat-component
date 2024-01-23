import React, {
  ForwardedRef,
  forwardRef,
  useEffect,
  useMemo,
  useState,
} from "react";
import BubbleText from "./BubbleText";
import { CheckSmall, DoneAll } from "@icon-park/react";
import { Message } from "../../types/Chat";
import { useInView } from "react-intersection-observer";
import { timeConvert24to12 } from "../../utils";
import BubbleVoice from "./BubbleVoice";
import BubbleImage from "./BubbleImage";
import BubbleDocument from "./BubbleDocument";
import { motion } from "framer-motion";

const Bubble = forwardRef(
  (
    {
      message,
      onSeenMessage,
    }: { message: Message; onSeenMessage?: (message: Message) => void },
    ref: ForwardedRef<HTMLDivElement>,
  ) => {
    const { id, sent_at, is_seen, text, uploaded_file, user_name, is_you } =
      message;
    const { ref: viewRef, inView } = useInView();
    const [callInView, setCallInView] = useState(false);

    useEffect(() => {
      if (callInView || is_seen || is_you) return;
      if (inView) {
        onSeenMessage?.(message);
        setCallInView(true);
      }
    }, [inView]);
    const d = new Date(sent_at || "");
    const time = timeConvert24to12(
      `${d.getHours().toString().padStart(2, "0")}:${d
        .getMinutes()
        .toString()
        .padStart(2, "0")}`,
    );
    const footer = useMemo(() => {
      return (
        <div
          className={`flex items-center gap-1 ${
            is_you ? "opacity-70" : "opacity-40"
          }`}
        >
          {is_you && is_seen && <DoneAll className={"text-white -my-1"} />}
          {is_you && !is_seen && <CheckSmall className={"text-white -my-1"} />}
          <span dir={"auto"} className={"-mb-0.5 text-[12px] leading-[1]"}>
            {time}
          </span>
        </div>
      );
    }, [is_seen]);

    const messageContent = useMemo(() => {
      const mimeType = uploaded_file?.mime_type?.split("/")[0];
      switch (mimeType) {
        case undefined:
          return <BubbleText message={text || ""} footer={footer} />;
        case "audio":
          return (
            <BubbleVoice
              voiceSrc={uploaded_file?.file || ""}
              footer={footer}
              message={text || ""}
            />
          );
        case "image":
          return (
            <BubbleImage
              src={uploaded_file?.file || ""}
              height={uploaded_file?.dimensions?.h || 0}
              width={uploaded_file?.dimensions?.w || 0}
              footer={footer}
              message={text || ""}
            />
          );
        case "application":
          return (
            <BubbleDocument
              src={uploaded_file?.file || ""}
              size={uploaded_file?.memory_size}
              name={uploaded_file?.file_name}
              footer={footer}
              message={text || ""}
            />
          );
        default:
          return <div>ERROR!</div>;
      }
    }, [message]);

    return (
      <motion.div
        initial={{
          scale: 0,
        }}
        animate={{
          scale: 1,
        }}
        transition={{ duration: 0.1 }}
        className={`flex w-fit max-w-[90%] items-center gap-3 ${is_you ? "origin-bottom-right" : "flex-row-reverse self-end origin-bottom-left"}`}
        ref={viewRef}
      >
        <div
          className={
            "w-full rounded-2xl " +
            (is_you
              ? " rounded-br-md bg-primary text-white"
              : " self-end rounded-bl-md bg-gray-100")
          }
          ref={ref}
        >
          {messageContent}
        </div>
      </motion.div>
    );
  },
);

export default Bubble;
