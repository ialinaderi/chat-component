import React from "react";
import ChatBubbleSkeletonLoading from "./ChatBubbleSkeletonLoading";

function randomLines(): number {
	return Math.round((Math.random() * 11) / 4) || 1;
}

function randomWidth(): number {
	return Math.round(Math.floor(Math.random() * 16) + 5);
}

function randomBool(): boolean {
	return Math.random() < 0.5;
}

const ChatBoxMessagesSkeletonLoading = () => {
	return (
		<div
			className={
				"flex flex-1 animate-pulse flex-col justify-end gap-1 overflow-hidden"
			}
		>
			<ChatBubbleSkeletonLoading
				messageWidth={randomWidth()}
				lines={randomLines()}
				isYou={randomBool()}
			/>
			<ChatBubbleSkeletonLoading
				messageWidth={randomWidth()}
				lines={randomLines()}
				isYou={randomBool()}
			/>
			<ChatBubbleSkeletonLoading
				messageWidth={randomWidth()}
				lines={randomLines()}
				isYou={randomBool()}
			/>
			<ChatBubbleSkeletonLoading
				messageWidth={randomWidth()}
				lines={randomLines()}
				isYou={randomBool()}
			/>
			<ChatBubbleSkeletonLoading
				messageWidth={randomWidth()}
				lines={randomLines()}
				isYou={randomBool()}
			/>
			<ChatBubbleSkeletonLoading
				messageWidth={randomWidth()}
				lines={randomLines()}
				isYou={randomBool()}
			/>
			<ChatBubbleSkeletonLoading
				messageWidth={randomWidth()}
				lines={randomLines()}
				isYou={randomBool()}
			/>
			<ChatBubbleSkeletonLoading
				messageWidth={randomWidth()}
				lines={randomLines()}
				isYou={randomBool()}
			/>
			<ChatBubbleSkeletonLoading
				messageWidth={randomWidth()}
				lines={randomLines()}
				isYou={randomBool()}
			/>
			<ChatBubbleSkeletonLoading
				messageWidth={randomWidth()}
				lines={randomLines()}
				isYou={randomBool()}
			/>
		</div>
	);
};

export default ChatBoxMessagesSkeletonLoading;
