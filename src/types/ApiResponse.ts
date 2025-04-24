import { Message } from "@/models/Message.model";

export interface ApiResponse {
   success: boolean;
   message: string;
   status?: number;
   isAcceptingMessages?: boolean;
   messages?: Message[];
   errors?: Record<string, unknown>;
}