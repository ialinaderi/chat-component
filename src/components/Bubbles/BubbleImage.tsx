import React, { ReactNode, useMemo } from "react";
import { Image, Space, Skeleton } from "antd";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { LinkRenderer } from "./BubbleText";
import {
  DownloadOutlined,
  RotateLeftOutlined,
  RotateRightOutlined,
  SwapOutlined,
  ZoomInOutlined,
  ZoomOutOutlined,
} from "@ant-design/icons";
import { LoadingOne } from "@icon-park/react";

interface imageModalType {
  isActive: boolean;
  description?: string;
  src?: string;
}

const BubbleImage = (props: {
  src: string;
  message?: string;
  width: number;
  height: number;
  footer: ReactNode;
}) => {
  const onDownload = () => {
    fetch(props.src)
      .then((response) => response.blob())
      .then((blob) => {
        const url = URL.createObjectURL(new Blob([blob]));
        const link = document.createElement("a");
        link.href = url;
        link.download = "image.png";
        document.body.appendChild(link);
        link.click();
        URL.revokeObjectURL(url);
        link.remove();
      });
  };

  const imageSize = useMemo(() => {
    const maxHorizontal = 380;
    const minHorizontal = 200;
    const maxVertical = 380;
    const minVertical = 200;
    const x = props.width;
    const y = props.height;

    if (x > y) {
      const height = y * (maxVertical / x);
      return {
        width: maxVertical,
        height: height < minHorizontal ? minHorizontal : height,
      };
    } else {
      const width = x * (maxHorizontal / y);
      return {
        width: width < minVertical ? minVertical : width,
        height: maxHorizontal,
      };
    }
  }, [props.height, props.width]);
  return (
    <div
      className={
        "relative flex min-h-[10rem]  max-w-sm flex-col  overflow-hidden rounded-2xl border-4 border-transparent"
      }
    >
      <Image
        className={"h-full cursor-pointer rounded object-cover"}
        width={imageSize.width}
        height={imageSize.height}
        placeholder={
          <Skeleton.Image
            className={
              "w-full h-full flex items-center justify-center bg-gray-200"
            }
            active={true}
          />
        }
        src={props.src}
        preview={{
          toolbarRender: (
            _,
            {
              transform: { scale },
              actions: {
                onFlipY,
                onFlipX,
                onRotateLeft,
                onRotateRight,
                onZoomOut,
                onZoomIn,
              },
            },
          ) => (
            <Space
              size={30}
              className="rounded-full bg-black/20 px-5 py-2 text-xl"
            >
              <DownloadOutlined onClick={onDownload} />
              <SwapOutlined rotate={90} onClick={onFlipY} />
              <SwapOutlined onClick={onFlipX} />
              <RotateLeftOutlined onClick={onRotateLeft} />
              <RotateRightOutlined onClick={onRotateRight} />
              <ZoomOutOutlined disabled={scale === 1} onClick={onZoomOut} />
              <ZoomInOutlined disabled={scale === 50} onClick={onZoomIn} />
            </Space>
          ),
        }}
      />
      {!props.message && (
        <div
          className={
            "pointer-events-none absolute bottom-0 right-0 m-1 rounded-full bg-black/20 p-1 px-2 font-bold"
          }
        >
          {props.footer}
        </div>
      )}
      {props.message && (
        <div>
          <p className={"whitespace-pre-line p-1 pt-2 text-sm"} dir={"auto"}>
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              components={{ a: LinkRenderer }}
            >
              {props.message}
            </ReactMarkdown>
          </p>
          <div className={"p-0.5 pt-0"}>{props.footer}</div>
        </div>
      )}
    </div>
  );
};

export default BubbleImage;
