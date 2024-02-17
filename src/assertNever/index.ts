export function assertNever(never: never) {
    throw new Error(`assertNever is called with ${JSON.stringify(never)}`, { cause: never })
}