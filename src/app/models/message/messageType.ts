export enum MessageType {
    FILE = "FILE",
    IMAGE = "IMAGE",
    TEXT = "TEXT",
    REPLY = "REPLY",
    FORWARD = "FORWARD"
}


export const MESSAGE_TYPE_MAPPER = {
    [MessageType.FILE]: 'FILE',
    [MessageType.IMAGE]: 'IMAGE',
    [MessageType.TEXT]: 'TEXT',
    [MessageType.REPLY]: 'REPLY',
    [MessageType.FORWARD]: 'FORWARD',
}