export enum MessageStatus {
    RECEIVED = 'RECEIVED',
    DELIVERED = 'DELIVERED',
    DELETED = 'DELETED'
}

export const MESSAGE_STATUS_MAPPER = {
    [MessageStatus.DELETED]: 'DELETED',
    [MessageStatus.RECEIVED]: 'RECEIVED'
}