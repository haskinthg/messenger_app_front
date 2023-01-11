import { Message } from "../message/message";
import { User } from "../user";
import { ChatStatus } from "./chatstatus";

export class Chat {
    id: number;
    users: User[];
    lastMessage:Message;
    chatStatus: ChatStatus;
}
