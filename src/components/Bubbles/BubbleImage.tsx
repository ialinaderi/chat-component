import React, {ReactNode} from "react";
import {Image, Space} from "antd";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import {LinkRenderer} from "./BubbleText";
import {
	DownloadOutlined,
	RotateLeftOutlined,
	RotateRightOutlined,
	SwapOutlined,
	ZoomInOutlined,
	ZoomOutOutlined,
} from "@ant-design/icons";

interface imageModalType {
    isActive: boolean;
    description?: string;
    src?: string;
}

const BubbleImage = (props: {
    id: string | number;
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
    return (
        <div
            className={
                "relative flex max-h-96 min-h-[10rem]  max-w-sm flex-col  overflow-hidden rounded-2xl border-4 border-transparent"
            }
        >
            <Image
                sizes={""}
                className={"h-full cursor-pointer rounded object-cover"}
                // width={props.width}
                // height={props.height}
                src={props.src}
                style={{aspectRatio: props.width / props.height}}
                preview={{
                    toolbarRender: (
                        _,
                        {
                            transform: {scale},
                            actions: {
                                onFlipY,
                                onFlipX,
                                onRotateLeft,
                                onRotateRight,
                                onZoomOut,
                                onZoomIn,
                            },
                        }
                    ) => (
                        <Space
                            size={30}
                            className="rounded-full bg-black/20 px-5 py-2 text-xl"
                        >
                            <DownloadOutlined onClick={onDownload}/>
                            <SwapOutlined rotate={90} onClick={onFlipY}/>
                            <SwapOutlined onClick={onFlipX}/>
                            <RotateLeftOutlined onClick={onRotateLeft}/>
                            <RotateRightOutlined onClick={onRotateRight}/>
                            <ZoomOutOutlined disabled={scale === 1} onClick={onZoomOut}/>
                            <ZoomInOutlined disabled={scale === 50} onClick={onZoomIn}/>
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
                            components={{a: LinkRenderer}}
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
