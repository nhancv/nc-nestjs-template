export interface BaseResponse<T> {
    data?: T | null,
    error?: {
        code: number,
        message: string
    } | null
}
