export enum RegisterStatus {
    REG = 'REG',
    CONTAIN = 'CONTAIN',
    ERROR = 'ERROR'
}

export const REG_MAPPER = {
    [RegisterStatus.REG]: 'REG',
    [RegisterStatus.ERROR]: 'ERROR',
    [RegisterStatus.CONTAIN]: 'CONTAIN'
} 