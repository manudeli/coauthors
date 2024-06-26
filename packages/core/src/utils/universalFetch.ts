let fetchFn: typeof fetch | undefined
export async function setupFetch() {
  // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
  if (typeof window !== 'undefined' && window.fetch) {
    return window.fetch
  }

  if (typeof process !== 'undefined' && process.versions.node) {
    const [major] = process.versions.node.split('.').map(Number)

    if (major < 18) {
      const mod = await import('node-fetch')
      return mod.default as unknown as typeof fetch
    }

    return globalThis.fetch
  }

  return undefined
}

async function initialize() {
  fetchFn = await setupFetch()
}
if (!fetchFn) initialize()

export async function universalFetch(input: Parameters<typeof fetch>[0], init?: Parameters<typeof fetch>[1]) {
  if (!fetchFn) {
    await initialize()
  }
  // if fetchFn is still undefined, throw an error
  if (!fetchFn) {
    throw new Error('No fetch implementation found')
  }
  return fetchFn(input, init)
}
