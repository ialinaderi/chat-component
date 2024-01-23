import { Message } from "../../types/Chat";
import { LoadingOne } from "@icon-park/react";
import InfiniteScroll from "react-infinite-scroll-component";
import { useMemo, useRef } from "react";
import { groupMessagesByDate } from "../../utils";
import Bubble from "../Bubbles/Bubble";
import BubbleTyping from "../Bubbles/BubbleTyping";
import ChatBoxMessagesSkeletonLoading from "./SkeletonLoading";

export interface ChatProps {
  messages: Message[];
  fetchNextPage: () => void;
  hasNextPage: boolean;
  isLoading?: boolean;
  isTyping?: boolean;
  onSeenMessage?: (message: Message) => void;
}

export const Chat = (props: ChatProps) => {
  const {
    messages,
    fetchNextPage,
    isLoading,
    isTyping,
    hasNextPage,
    onSeenMessage,
  } = props;

  const scrollChatRef = useRef<HTMLDivElement>(null);

  const groupedMessages = useMemo(() => {
    return groupMessagesByDate(messages);
  }, [messages]);

  return (
    <div
      data-library={"chat-component"}
      id={"chatScroll"}
      ref={scrollChatRef}
      className={`flex flex-1 flex-col-reverse gap-1 md:overflow-y-scroll ${
        isLoading && "overflow-y-hidden"
      }`}
    >
      <InfiniteScroll
        scrollableTarget="chatScroll"
        dataLength={messages.map((value) => value.text).length || 0}
        next={fetchNextPage}
        hasMore={hasNextPage || false}
        loader={
          <span className={" flex w-full justify-center"}>
            <LoadingOne className={"animate-spin text-primary"} size={30} />
          </span>
        }
        scrollThreshold={500}
        className={
          "flex h-full flex-1 flex-col-reverse gap-3 !overflow-visible p-2"
        }
        style={{ display: "flex", flexDirection: "column-reverse" }}
        inverse={true}
      >
        {isTyping && <BubbleTyping message={"درحال تایپ ..."} />}
        {groupedMessages.map((group, groupIndex) => (
          <div className={"flex flex-col-reverse gap-1"} key={groupIndex}>
            {group.messages.map((element, index) => (
              <Bubble
                key={element.id}
                message={element}
                onSeenMessage={onSeenMessage}
              />
            ))}
            <div className={"sticky top-2 z-10 flex w-full justify-center"}>
              <span
                className={
                  "rounded-full bg-primary/80 px-3 py-1 text-xs font-bold text-white backdrop-blur"
                }
              >
                {new Date(group.date || "")
                  .toLocaleDateString("fa-IR", { dateStyle: "long" })
                  .replace(/\s+\S*$/, "")}
              </span>
            </div>
          </div>
        ))}
      </InfiniteScroll>

      {isLoading && <ChatBoxMessagesSkeletonLoading />}
    </div>
  );
};
