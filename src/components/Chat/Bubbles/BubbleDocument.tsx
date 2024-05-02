import { ReactNode } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { DownloadTwo } from "@icon-park/react";
import { formatBytes } from "../../../utils";

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

function BubbleDocument(props: {
  src: string;
  name?: string;
  size?: number;
  message?: string;
  footer: ReactNode;
}) {
  const onDownload = () => {
    fetch(props.src)
      .then((response) => response.blob())
      .then((blob) => {
        const url = URL.createObjectURL(new Blob([blob]));
        const link = document.createElement("a");
        link.href = url;
        link.download = props.name + ".pdf";
        document.body.appendChild(link);
        link.click();
        URL.revokeObjectURL(url);
        link.remove();
      });
  };
  return (
    <div>
      <div className={"px-3 pt-2.5"}>
        <div className={"flex w-52 items-start gap-3"} dir={"ltr"}>
          <button
            className={
              "flex h-10 w-10 items-center justify-center rounded-full bg-white"
            }
            onClick={onDownload}
          >
            <DownloadTwo className={"text-primary"} size={18} />
          </button>
          <div className={"flex flex-1 flex-col gap-1 overflow-clip font-bold"}>
            <p className={"flex flex-1 text-sm"} title={props.name + ".pdf"}>
              {props.name}.pdf
            </p>
            <span className={"flex gap-1 space-x-0 text-xs"}>
              <span className={"text-xs -tracking-wider"}>
                {formatBytes(props.size || 0)}
              </span>
              <span className={"opacity-60"}>PDF</span>
            </span>
          </div>
        </div>
        <p className={"whitespace-pre-line text-sm"} dir={"auto"}>
          {props.message && (
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              components={{ a: LinkRenderer }}
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

export default BubbleDocument;
