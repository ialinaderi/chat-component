export interface MessageEntity {
  id: string;
  text?: string;
  seen: boolean;
  deleted: boolean;
  file?: FileEntity;
  edited: boolean;
  type: "MESSAGE" | "EVENT";
  isYou: boolean;
  sender: SenderEntity;
  repliedTo?: ReplayedToEntity;
  /** @format date-time */
  createdAt: string;
  /** @format date-time */
  updatedAt: string;
}

export interface ChatRef {
  scrollToBottom(force?: boolean): void;
}

export interface MessageEntityWithStatus extends MessageEntity {
  status: "SENDING" | "SENT" | "FAILED";
}

export interface FileMeta {
  width: number;
  height: number;
  duration: number;
  size: number;
}

export interface FileEntity {
  id: string;
  name: string;
  path: string;
  meta: FileMeta;
  mimeType: string;
  type: "DOCUMENT" | "AUDIO" | "PHOTO" | "VIDEO" | "VOICE";
}

export interface SenderEntity {
  id: string;
  type: "USER" | "SESSION" | "BOT";
  profilePath?: string;
  firstName: string;
  lastName?: string;
}

export interface ReplayedToEntity {
  id: string;
  text: string;
  file: FileEntity;
  sender: SenderEntity;
}
