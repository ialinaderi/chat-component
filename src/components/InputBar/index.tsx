import { ConfigProvider, Input } from "antd";
import React, {
  forwardRef,
  Ref,
  useCallback,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from "react";
import {
  Paperclip,
  SendOne,
  SlightlySmilingFace,
  ViewGridCard,
  Voice,
} from "@icon-park/react";
import { AnimatePresence, motion } from "framer-motion";
import CustomEmojiPicker from "./EmojiPicker";
import "../../index.css";
import useAudioRecorder from "../../hooks/useAudioRecorder";
import { formatTimeMs } from "../../utils";
import FilesPreview from "./FilesPreview";

interface InputBarProps extends React.HTMLAttributes<HTMLDivElement> {
  onSendMessage?: (message?: string) => void;
  onUploadFile?: (file: File) => void;
  value?: string;
  files?: File[];
  onChangeInput?: (text: string) => void;
  onChangeFiles?: (files: File[]) => void;
  emojisPlacement?: "top" | "bottom";
  inputWrapperClassName?: string;
  buttons?: string[];
  onClickOpenButtons?: () => void;
  onClickOpenEmojis?: () => void;
  onClickButton?: (button: string) => void;
  disableIcons?: {
    send?: boolean;
    voice?: boolean;
    files?: boolean;
    emojis?: boolean;
  };
  scrollToBottomFn?: () => void;
}

export interface InputBarRef {
  setOpenEmojis(open: boolean): void;

  setOpenButtons(open: boolean): void;
}

let lastVoiceBlob: Blob | undefined = undefined;
let wantSendVoice = false;
let wantSelect: number | undefined;

export interface TextAreaRef extends HTMLTextAreaElement {
  resizableTextArea: any;
}

export const InputBar = forwardRef(
  (props: InputBarProps, ref: Ref<InputBarRef>) => {
    const {
      onSendMessage,
      onUploadFile,
      value,
      onChangeInput,
      onChangeFiles,
      emojisPlacement = "bottom",
      inputWrapperClassName,
      files,
      buttons,
      onClickOpenButtons,
      onClickButton,
      onClickOpenEmojis,
      disableIcons = {
        send: false,
        voice: false,
        files: false,
        emojis: false,
      },
      scrollToBottomFn,
      ...otherProps
    } = props;

    const uploadInputRef = useRef<HTMLInputElement>(null);
    const inputRef = useRef<TextAreaRef>(null);
    const [isOpenButtons, setIsOpenButtons] = useState(false);
    const [isOpenEmojis, setIsOpenEmojis] = useState(false);

    const {
      startRecording,
      stopRecording,
      audioVolume,
      isRecording,
      elapsedTime,
    } = useAudioRecorder({
      onRecordingCompleted: (blob) => {
        // console.log("no", blob);
        lastVoiceBlob = blob;
      },
    });

    useImperativeHandle(ref, () => ({
      setOpenEmojis,
      setOpenButtons,
    }));

    function setOpenEmojis(open: boolean) {
      setIsOpenEmojis(open);
      if (isOpenButtons) setIsOpenButtons(false);
    }

    function setOpenButtons(open: boolean) {
      setIsOpenButtons(open);
      if (isOpenEmojis) setIsOpenEmojis(false);
    }

    const handleSendMessage = useCallback(
      (value?: string) => {
        onSendMessage && onSendMessage(value);
      },
      [onSendMessage],
    );

    const handleOnChange = useCallback(
      (text: string, select?: number) => {
        onChangeInput && onChangeInput(text);
        wantSelect = select;
      },
      [inputRef.current?.resizableTextArea.textArea, onChangeInput],
    );

    function handleOnClickUploadFile(event: React.MouseEvent<HTMLElement>) {
      event.preventDefault();
      if (uploadInputRef.current) {
        uploadInputRef.current.value = "";
        uploadInputRef.current.click();
      }
    }

    useEffect(() => {
      if (wantSelect === undefined) return;
      const ta = inputRef.current?.resizableTextArea.textArea;
      if (ta) {
        console.log(wantSelect);
        ta.selectionEnd = wantSelect;
      }
    }, [value]);

    const handleOnChangeUploadFile = useCallback(
      (insideFiles: File[] | []) => {
        onChangeFiles && onChangeFiles(insideFiles);
      },
      [files],
    );

    const insertEmojiIntoInput = useCallback(
      (emoji: string) => {
        const ta = inputRef.current?.resizableTextArea.textArea;
        // insert emoji into inputRef from seleted cursor
        if (ta) {
          inputRef.current.focus();
          const start = ta.selectionStart;
          const end = ta.selectionEnd;
          const text = ta.value;
          console.log({ start, end, text });
          handleOnChange(
            text.substring(0, start) + emoji + text.substring(end),
            start + emoji.length,
          );
        }
      },
      [inputRef.current],
    );

    function handleSendRecordVoiceButton() {
      wantSendVoice = true;
      stopRecording();
    }

    useEffect(() => {
      if (lastVoiceBlob && wantSendVoice) {
        const voiceFile = new File([lastVoiceBlob], "voice.wav", {
          type: "audio/wav",
        });
        handleOnChangeUploadFile(
          files?.length ? [...files, voiceFile] : [voiceFile],
        );
      }
    }, [lastVoiceBlob]);

    return (
      <ConfigProvider
        componentSize={"large"}
        theme={{ token: { colorPrimary: "#0BA5E9", fontFamily: "IRANSansX" } }}
      >
        <div
          data-library={"chat-component"}
          className={"w-full"}
          {...otherProps}
        >
          <AnimatePresence>
            {!!files?.length && (
              <motion.div
                dir={"ltr"}
                initial={{ opacity: 0, height: 0, marginBottom: 0 }}
                animate={{
                  opacity: 1,
                  maxHeight: "10rem",
                  height: "auto",
                  marginBottom: "0.5rem",
                }}
                className={"overflow-y-auto"}
                exit={{ opacity: 0, height: 0, marginBottom: 0 }}
                onMouseDown={(e) => e.preventDefault()}
                onClick={(e) => e.stopPropagation()}
              >
                <FilesPreview
                  files={files}
                  removeFile={(e) => {
                    const newFiles = files?.filter((file) => file !== e);
                    handleOnChangeUploadFile(newFiles);
                  }}
                />
              </motion.div>
            )}
          </AnimatePresence>
          {emojisPlacement === "top" && (
            <AnimatePresence>
              {isOpenEmojis && (
                <motion.div
                  initial={{ opacity: 0, height: 0, marginBottom: 0 }}
                  animate={{
                    opacity: 1,
                    height: "16rem",
                    marginBottom: "0.5rem",
                  }}
                  exit={{ opacity: 0, height: 0, marginBottom: 0 }}
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={(e) => e.stopPropagation()}
                >
                  <CustomEmojiPicker
                    lazyLoadEmojis
                    style={{ backgroundColor: "rgba(249,250,251)" }}
                    onEmojiClick={(emoji) => insertEmojiIntoInput(emoji.emoji)}
                  />
                </motion.div>
              )}
            </AnimatePresence>
          )}
          <div
            className={`relative flex flex-1 gap-3 text-center p-3 ${inputWrapperClassName}`}
          >
            {isRecording && (
              <div
                className={`absolute top-0 right-0 left-0 bottom-0 z-10 h-full w-full flex justify-between items-center p-3 ${inputWrapperClassName}`}
              >
                <div className={"flex items-center gap-2"}>
                  <span className={"font-mono"}>
                    {formatTimeMs(elapsedTime)}
                  </span>
                  <span
                    className={"h-2 w-2 rounded-full bg-red-600 animate-pulse"}
                  ></span>
                </div>
                <button onClick={() => stopRecording()}>انصراف</button>
                <motion.button
                  initial={{ scale: 1, rotate: 225 }}
                  animate={{
                    scale: 1.5,
                    outlineWidth: `${Math.min(audioVolume * 100, 15)}px`,
                    outlineStyle: "solid",
                    outlineColor: "rgba(11,165,233,0.8)",
                  }}
                  type="button"
                  style={{ transform: "rotate(225deg)" }}
                  className={"-m-3 bg-sky-500 rounded-full p-3"}
                  onClick={handleSendRecordVoiceButton}
                >
                  <SendOne size={16} className={"text-white"} />
                </motion.button>
              </div>
            )}
            <div className={"flex items-center"}>
              <button
                onClick={() => setOpenEmojis(!isOpenEmojis)}
                onMouseDown={(e) => e.preventDefault()}
              >
                <SlightlySmilingFace size={22} className={"text-gray-600"} />
              </button>
            </div>
            <div className={"flex-1"}>
              <Input.TextArea
                value={value}
                ref={inputRef}
                className={"rounded-none p-0 !transition-none"}
                autoComplete="off"
                bordered={false}
                onKeyPress={(e) => {
                  if (e.which === 13 && !e.shiftKey) {
                    e.preventDefault();
                    handleSendMessage();
                  }
                }}
                onChange={(e) => handleOnChange(e.target.value)}
                autoSize={{ minRows: 1, maxRows: 5 }}
                autoCorrect={"off"}
                dir={value ? "auto" : "rtl"}
                placeholder={"پیام شما ..."}
                name="text"
              />
            </div>

            <AnimatePresence initial={false}>
              {value || !!files?.length ? (
                <div key={"send"} className={"flex items-center"}>
                  <button
                    type="button"
                    style={{ transform: "rotate(225deg)" }}
                    className={"px-1"}
                    onClick={() => handleSendMessage()}
                  >
                    <SendOne size={24} className={"text-primary"} />
                  </button>
                </div>
              ) : (
                <motion.div
                  key={"upload"}
                  className={"flex items-center gap-3 overflow-hidden"}
                  initial={{ width: 0, opacity: 0 }}
                  animate={{ width: "auto", opacity: 1 }}
                  exit={{ width: 0, opacity: 0 }}
                  transition={{
                    duration: 0.1,
                  }}
                >
                  <input
                    ref={uploadInputRef}
                    onChange={(e) => {
                      const newFiles = Array.prototype.slice.call(
                        e.target.files,
                      );
                      handleOnChangeUploadFile(
                        files?.length ? [...files, ...newFiles] : newFiles,
                      );
                    }}
                    type="file"
                    multiple
                    id="myFile"
                    accept={"image/jpeg, image/png, application/pdf"}
                    name="filename"
                    hidden
                  />
                  {!!buttons?.length && (
                    <button onClick={() => setOpenButtons(!isOpenButtons)}>
                      <ViewGridCard size={22} className={"text-gray-600"} />
                    </button>
                  )}
                  <button onClick={handleOnClickUploadFile}>
                    <Paperclip size={22} className={"text-gray-600"} />
                  </button>
                  <button onClick={() => startRecording()}>
                    <Voice size={22} className={"text-gray-600"} />
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          {emojisPlacement === "bottom" && (
            <AnimatePresence>
              {isOpenEmojis && (
                <motion.div
                  transition={{
                    duration: 0.1,
                  }}
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "16rem" }}
                  exit={{ opacity: 0, height: 0 }}
                  className={"border-t"}
                  onClick={(e) => e.stopPropagation()}
                >
                  <CustomEmojiPicker
                    lazyLoadEmojis
                    style={{
                      border: "none",
                      borderRadius: "0px",
                      backgroundColor: "rgba(249,250,251)",
                    }}
                    onEmojiClick={(emoji) => insertEmojiIntoInput(emoji.emoji)}
                  />
                </motion.div>
              )}
            </AnimatePresence>
          )}

          <AnimatePresence>
            {!!buttons?.length && isOpenButtons && (
              <motion.div
                transition={{
                  duration: 0.1,
                }}
                initial={{ height: 0 }}
                onAnimationComplete={scrollToBottomFn}
                animate={{
                  height: "auto",
                }}
                exit={{ height: 0 }}
                className={"bg-gray-50 max-h-60 overflow-y-auto border-t"}
              >
                {!!buttons?.length && (
                  <div className={`m-4 flex flex-col gap-2`}>
                    {buttons?.map((button) => (
                      <button
                        key={button}
                        dir={"auto"}
                        onClick={() => {
                          onClickButton && onClickButton(button);
                        }}
                        className={
                          "flex w-full items-center justify-center rounded-md bg-gray-200/80 p-3"
                        }
                      >
                        <span className={"w-full flex-1 truncate"}>
                          {button}
                        </span>
                      </button>
                    ))}
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </ConfigProvider>
    );
  },
);
