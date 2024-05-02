import React, { ReactElement, ReactNode } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

export function LinkRenderer(props: any) {
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

function BubbleText(props: {
  message: string;
  footer: ReactElement;
  header: ReactElement;
}) {
  return (
    <div>
      <div className={"px-3 pt-0.5"}>{props.header}</div>
      <div className={"px-3 pt-0.5"}>
        <p className={"whitespace-pre-line text-sm"} dir={"auto"}>
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            components={{ a: LinkRenderer }}
          >
            {props.message}
          </ReactMarkdown>
        </p>
      </div>
      <div className={"px-3 py-1 pb-2"}>{props.footer}</div>
    </div>
  );
}

export default BubbleText;
