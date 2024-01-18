import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
interface Props {
    message: string;
}

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

function BubbleTyping(props: Props) {
    const {message} = props;

    return (
        <div
            className={"w-fit max-w-[70%] self-end rounded-xl rounded-bl-sm border"}
        >
            <div className={"px-3 py-2.5"}>
                <p className={"text-sm text-gray-400"} dir={"auto"}>
                    <p className={"whitespace-pre-line text-sm"} dir={"auto"}>
                        <ReactMarkdown
                            remarkPlugins={[remarkGfm]}
                            components={{a: LinkRenderer}}
                        >
                            {message}
                        </ReactMarkdown>
                    </p>
                </p>
            </div>
        </div>
    );
}

export default BubbleTyping;
