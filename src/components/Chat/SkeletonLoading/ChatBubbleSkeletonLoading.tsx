interface Props {
	messageWidth: number;
	lines?: number;
	isYou: boolean;
}

function ChatBubbleSkeletonLoading(props: Props) {
	const { messageWidth, lines = 1, isYou = false } = props;
	return (
		<div
			className={
				"pul w-fit max-w-[70%] rounded-xl px-5 py-2.5" +
				(isYou
					? " rounded-br-sm bg-primary/40 text-white"
					: " self-end rounded-bl-sm bg-gray-100")
			}
		>
			<p
				className={"text-sm"}
				style={{ width: messageWidth + "rem", height: lines * 20 }}
				dir={"auto"}
			></p>
		</div>
	);
}

export default ChatBubbleSkeletonLoading;
