import { Message } from "../message/message";
import { User } from "../user";
import { ChatStatus } from "./chatstatus";

export interface Chat {
    id: number;
    users: User[];
    lastMessage:Message;
    chatStatus: ChatStatus;
}