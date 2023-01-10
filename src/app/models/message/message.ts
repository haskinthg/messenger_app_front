import { User } from "../user";
import { MessageStatus } from "./messageStatus";
import { MessageType } from "./messageType";

export class Message {
    id: number;
    messageType: MessageType;
    value: string;
    status: MessageStatus;
    dateTime: string;
    childMessage: Message;
    usernameFrom: string;
    user: User;
    usernameTo: string;
    chat_id: number;
}
