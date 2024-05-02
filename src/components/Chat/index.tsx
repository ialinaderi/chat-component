import {
  ChatRef,
  MessageEntity,
  MessageEntityWithStatus,
} from "../../types/Chat";
import { LoadingOne } from "@icon-park/react";
import InfiniteScroll from "react-infinite-scroll-component";
import {
  createContext,
  forwardRef,
  Ref,
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
} from "react";
import { groupMessagesByDate } from "../../utils";
import Bubble from "./Bubbles/Bubble";
import BubbleTyping from "./Bubbles/BubbleTyping";
import ChatBoxMessagesSkeletonLoading from "./SkeletonLoading";

export interface ChatProps {
  messages: MessageEntityWithStatus[];
  fetchNextPage: () => void;
  hasNextPage: boolean;
  isLoading?: boolean;
  typing?: {
    profilePath?: string;
    name?: string;
  };
  buttons?: string[];
  onClickButton?: (button: string) => void;
  onSeenMessage?: (message: MessageEntity) => void;
  fileBaseURL?: string;
  showIsYouProfile?: boolean;
  theme?: {
    themeColor?: string;
    messageColor?: string;
  };
  hideScrollbar?: boolean;
}

export const AppContext = createContext<{
  fileBaseURL?: string;
  theme?: {
    themeColor?: string;
    messageColor?: string;
  };
}>({});

// export const Chat = (props: ChatProps) => {
//   const {
//     messages,
//     fetchNextPage,
//     isLoading,
//     typing,
//     hasNextPage,
//     onSeenMessage,
//     showIsYouProfile = true,
//     hideScrollbar = true,
//     buttons = [],
//     onClickButton,
//     sendingMessages,
//   } = props;

export const Chat = forwardRef((props: ChatProps, ref: Ref<ChatRef>) => {
  const {
    messages,
    fetchNextPage,
    isLoading,
    typing,
    hasNextPage,
    onSeenMessage,
    showIsYouProfile = true,
    hideScrollbar = true,
    buttons = [],
    onClickButton,
  } = props;

  const chatScrollRef = useRef<HTMLDivElement>(null);
  const groupedMessages = useMemo(() => {
    return groupMessagesByDate(messages);
  }, [messages]);

  function scrollToBottom(force = false) {
    const scroll = document.querySelector("#chatScroll");
    if (!scroll) return;
    if (force) {
      scroll.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    } else if (scroll.scrollTop >= -100) {
      scroll.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    }
  }

  useImperativeHandle(ref, () => ({
    scrollToBottom,
  }));

  const LoadingComponent = useMemo(() => {
    return <ChatBoxMessagesSkeletonLoading />;
  }, []);

  return (
    <AppContext.Provider
      value={{ fileBaseURL: props.fileBaseURL, theme: props.theme }}
    >
      <div
        data-library={"chat-component"}
        id={"chatScroll"}
        ref={chatScrollRef}
        className={`flex flex-1 flex-col-reverse gap-1 md:overflow-y-scroll${
          isLoading && " overflow-y-hidden"
        }${hideScrollbar ? " hide-scrollbar" : ""}`}
      >
        {!isLoading && (
          <InfiniteScroll
            scrollableTarget="chatScroll"
            dataLength={messages.map((value) => value.text).length || 0}
            next={fetchNextPage}
            hasMore={hasNextPage || false}
            loader={
              <span className={"flex w-full justify-center"}>
                <LoadingOne className={"animate-spin text-primary"} size={30} />
              </span>
            }
            scrollThreshold={500}
            className={
              "flex !h-full flex-1 flex-col-reverse gap-3 !overflow-visible p-2"
            }
            style={{ display: "flex", flexDirection: "column-reverse" }}
            inverse={true}
          >
            {typing && (
              <BubbleTyping
                name={typing.name || ""}
                profilePath={
                  typing.profilePath
                    ? props.fileBaseURL + typing.profilePath
                    : undefined
                }
                message={"درحال تایپ ..."}
              />
            )}
            {!!buttons.length && (
              <div className={"flex flex-wrap gap-2"}>
                {buttons.map((value) => (
                  <button
                    onClick={() => onClickButton?.(value)}
                    className={
                      "px-3 py-2 bg-gray-50 rounded-lg text-sm border border-gray-200"
                    }
                  >
                    {value}
                  </button>
                ))}
              </div>
            )}
            {groupedMessages.map((group, groupIndex) => (
              <div className={"flex flex-col-reverse gap-1"} key={groupIndex}>
                {group.messages.map((element, index) => (
                  <Bubble
                    key={element.id}
                    message={element}
                    onSeenMessage={onSeenMessage}
                    showIsYouProfile={showIsYouProfile}
                  />
                ))}
                <div className={"sticky top-2 z-10 flex w-full justify-center"}>
                  <span
                    className={
                      "rounded-full bg-primary/80 px-3 py-1 text-xs font-bold text-white backdrop-blur border border-sky-300/60"
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
        )}

        {isLoading && LoadingComponent}
      </div>
    </AppContext.Provider>
  );
});
