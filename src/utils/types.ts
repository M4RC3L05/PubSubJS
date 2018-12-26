export type Action<T> = (a?: T) => void
export interface ISubscription {
    id: string
    action: Action<any>
}
