export const isMyValidString = (topic: any) =>
    typeof topic === 'string' || topic instanceof String

export const isValidAction = (cb: any) =>
    typeof cb === 'function' || cb instanceof Function
