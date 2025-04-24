import { Message } from "@/models/Message.model";


export interface RootLayoutProps {
   children: React.ReactNode;
}

export type MessageCardProps = {
   message: Message;
   onMessageDelete: (messageId: string) => void;
};