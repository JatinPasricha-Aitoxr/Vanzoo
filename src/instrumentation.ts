/** Runs once when the server starts: load the CMS-edited contact details before the first page renders. */
export async function register() {
  if (process.env.NEXT_RUNTIME === 'nodejs') {
    const { registerNode } = await import('./instrumentation-node');
    await registerNode();
  }
}
