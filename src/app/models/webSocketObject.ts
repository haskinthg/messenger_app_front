import { WebSocketType } from "./WebSocketType";

export class WebSocketObject<T> {
    type: WebSocketType;
    content: T;
}