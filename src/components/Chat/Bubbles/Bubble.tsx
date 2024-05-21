import React, {
  ForwardedRef,
  forwardRef,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import BubbleText from "./BubbleText";
import { CheckSmall, DoneAll, Time } from "@icon-park/react";
import { MessageEntity, MessageEntityWithStatus } from "../../../types/Chat";
import { useInView } from "react-intersection-observer";
import { timeConvert24to12 } from "../../../utils";
import BubbleVoice from "./BubbleVoice";
import { motion } from "framer-motion";
import RobotAvatar from "../../../assets/images/robot-avatar.png";
import ProfileAvatar from "../../../assets/images/profile.png";
import { AppContext } from "../index";
import BubbleImage from "./BubbleImage";
import BubbleDocument from "./BubbleDocument";

const Bubble = forwardRef(
  (
    {
      message,
      onSeenMessage,
      showIsYouProfile,
    }: {
      message: MessageEntityWithStatus;
      onSeenMessage?: (message: MessageEntity) => void;
      showIsYouProfile?: boolean;
    },
    ref: ForwardedRef<HTMLDivElement>,
  ) => {
    const {
      isYou,
      createdAt,
      text,
      sender,
      file,
      id,
      edited,
      seen,
      updatedAt,
      type,
      deleted,
      repliedTo,
    } = message;
    const { ref: viewRef, inView } = useInView();
    const [callInView, setCallInView] = useState(false);
    const { fileBaseURL = "", theme = { messageColor: "rgb(14, 165, 233)" } } =
      useContext(AppContext);

    useEffect(() => {
      if (callInView || seen || isYou) return;
      if (inView) {
        onSeenMessage?.(message);
        setCallInView(true);
      }
    }, [inView]);

    const time = useMemo(() => {
      const d = new Date(createdAt || "");
      return timeConvert24to12(
        `${d.getHours().toString().padStart(2, "0")}:${d
          .getMinutes()
          .toString()
          .padStart(2, "0")}`,
      );
    }, [createdAt]);
    const footer = useMemo(() => {
      return (
        <div
          className={`flex items-center gap-1 ${
            isYou ? "opacity-70" : "opacity-40"
          }`}
        >
          {message.status === "SENDING" && (
            <Time size={12} className={"text-white -my-0.5"} />
          )}
          {message.status === "SENT" && isYou && seen && (
            <DoneAll className={"text-white -my-1"} />
          )}
          {message.status === "SENT" && isYou && !seen && (
            <CheckSmall className={"text-white -my-1"} />
          )}
          <span dir={"auto"} className={"-mb-0.5 text-[12px] leading-[1]"}>
            {time}
          </span>
        </div>
      );
    }, [seen, message.status, time, isYou]);

    const header = useMemo(() => {
      if (!isYou || (isYou && showIsYouProfile))
        return (
          <span
            className={`text-xs font-bold ${
              isYou ? "opacity-70" : "opacity-40"
            }`}
          >
            {sender.firstName} {sender.lastName || ""}
          </span>
        );
      return <div className={"mb-1"}></div>;
    }, [sender.lastName]);

    const messageContent = useMemo(() => {
      if (!file)
        return (
          <BubbleText message={text || ""} footer={footer} header={header} />
        );
      switch (file.type) {
        case "VOICE":
          return (
            <BubbleVoice
              voiceSrc={fileBaseURL + file.path}
              footer={footer}
              message={text}
            />
          );
        case "AUDIO":
          return (
            <BubbleVoice
              voiceSrc={fileBaseURL + file.path}
              footer={footer}
              message={text}
            />
          );
        case "PHOTO":
          return (
            <BubbleImage
              src={fileBaseURL + file.path}
              height={file.meta.height || 0}
              width={file.meta.width || 0}
              footer={footer}
              message={text}
            />
          );
        case "DOCUMENT":
          return (
            <BubbleDocument
              src={fileBaseURL + file.path}
              size={file.meta.size || 0}
              name={file.name || "Unknown"}
              footer={footer}
              message={text}
            />
          );
        default:
          return <div>ERROR!</div>;
      }
    }, [message]);

    if (type === "EVENT") {
      return (
        <div className={"w-full p-1 flex justify-center"}>
          <span
            className={
              "bg-primary/20 border rounded-full py-1 px-3 text-[11px]"
            }
            dir={"auto"}
          >
            {message.text}
          </span>
        </div>
      );
    }

    return (
      <motion.div
        // initial={{
        //   scale: 0,
        // }}
        // animate={{
        //   scale: 1,
        // }}
        // transition={{ duration: 0.1 }}
        className={`flex w-fit max-w-[90%] items-end gap-1.5 ${isYou ? "origin-bottom-right" : "flex-row-reverse self-end origin-bottom-left"}`}
        ref={viewRef}
      >
        {(!isYou || (isYou && showIsYouProfile)) && (
          <img
            className={"aspect-square rounded-full h-8 w-8"}
            src={
              sender.profilePath
                ? fileBaseURL + sender.profilePath
                : sender.type === "BOT"
                  ? RobotAvatar
                  : sender.type === "SESSION"
                    ? ProfileAvatar
                    : ProfileAvatar
            }
          />
        )}
        <div
          className={
            "w-full rounded-2xl " +
            (isYou ? " rounded-br-md" : " self-end rounded-bl-md")
          }
          style={{
            backgroundColor: isYou ? theme.messageColor : "rgb(243, 244, 246)",
            color: isYou ? "white" : "black",
          }}
          data-is-you={isYou}
          ref={ref}
        >
          {messageContent}
        </div>
      </motion.div>
    );
  },
);

export default Bubble;
