import { MessageEntity, MessageEntityWithStatus } from "../types/Chat";

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

export function formatTimeMs(duration: number) {
  const milliseconds = Math.floor((duration % 1000) / 100); // calculate the number of milliseconds
  const seconds = Math.floor((duration / 1000) % 60); // calculate the number of seconds
  const minutes = Math.floor((duration / (1000 * 60)) % 60); // calculate the number of minutes
  // use string interpolation to format the time string
  return `${minutes.toString().padStart(2, "0")}:${seconds
    .toString()
    .padStart(2, "0")}.${milliseconds.toString().padStart(1, "0")}`;
}

export function groupMessagesByDate(messages: MessageEntityWithStatus[]) {
  const groupedMessages: { [date: string]: MessageEntityWithStatus[] } = {};

  messages.forEach((message) => {
    const date = new Date(message.createdAt || "").toLocaleDateString();
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
  const splintedTime = time.split(":");
  let hours = parseInt(splintedTime[0]);
  const minutes = splintedTime[1];
  const amOrPm = hours >= 12 ? "PM" : "AM";
  hours = hours > 12 ? hours - 12 : hours === 12 ? 12 : hours;
  return `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")} ${amOrPm}`;
}

export function getTextColorFromBackground(rgb: string) {
  const rgbValues = rgb.substring(4, rgb.length - 1).split(",");
  const [r, g, b] = rgbValues.map((value) => parseInt(value.trim()));
  const averageColor = (r + g + b) / 3;
  const threshold = 127;
  if (averageColor < threshold) {
    return "#ffffff";
  } else {
    return "#000000";
  }
}
