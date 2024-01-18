export interface Message {
    id: number | string;
    text?: string;
    sent_at?: string;
    is_you?: boolean;
    is_seen?: boolean;
    user_name?: string;
    uploaded_file: {
        conversation_id: number;
        duration: null | number | string;
        file: string;
        file_name: string;
        id: number;
        memory_size: number;
        mime_type: string;
        dimensions: null | {
            w: number;
            h: number;
        };
    } | null;
}