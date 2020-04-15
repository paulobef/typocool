// pun intented
// may use spread operator + Object.freeze in the future to make the code more "standard" but this is convenient for the moment
export function assfreeze(target: object, object: object): object {
    return Object.freeze(Object.assign({}, target, object))
}
