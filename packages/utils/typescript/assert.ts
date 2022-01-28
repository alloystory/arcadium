class AssertionError extends Error {}

function assert(condition: any, msg?: string): asserts condition {
  if (!condition) {
    throw new AssertionError(msg)
  }
}

export default assert
