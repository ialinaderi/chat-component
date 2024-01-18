import {Message} from "../types/Chat";

export function formatTime(time: number) {
    return [
        Math.floor((time % 3600) / 60), // minutes
        ("00" + Math.floor(time % 60)).slice(-2), // seconds
    ].join(":");
}

export function formatBytes(bytes: number, decimals = 0): string {
    if (bytes === 0) return "0 B";

    const k = 1024;
    const sizes = ["B", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"];

    const i = Math.floor(Math.log(bytes) / Math.log(k));
    const convertedBytes = parseFloat((bytes / Math.pow(k, i)).toFixed(decimals));

    return `${convertedBytes} ${sizes[i]}`;
}


export function groupMessagesByDate(messages: Message[]) {
    const groupedMessages: { [date: string]: Message[] } = {};

    messages.forEach((message) => {
        const date = new Date(message.sent_at || "").toLocaleDateString();
        if (!groupedMessages[date]) {
            groupedMessages[date] = [];
        }
        groupedMessages[date].push(message);
    });

    return Object.entries(groupedMessages).map(([date, messages]) => ({
        date,
        messages,
    }));
}


export function timeConvert24to12(time: string) {
    // Check correct time format and split into components
    const splintedTime = time.split(":");
    const hours =
        parseInt(splintedTime[0]) >= 12
            ? parseInt(splintedTime[0]) - 12
            : parseInt(splintedTime[0]);
    const minutes = splintedTime[1];
    const amOrPm = parseInt(splintedTime[0]) >= 12 ? "PM" : "AM";
    return `${hours.toString().padStart(2, "0")}:${minutes
        .toString()
        .padStart(2, "0")} ${amOrPm}`; // return adjusted time or original string
}