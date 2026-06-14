export function AuthShell({ title, children }) {
  return (
    <main className="grid min-h-screen place-items-center bg-stone-100 px-4 dark:bg-stone-900">
      <section className="panel w-full max-w-md rounded-lg p-6">
        <div className="mb-6 flex items-center gap-3">
          <div className="grid h-11 w-11 place-items-center rounded-md bg-mint text-xl font-black text-white">N</div>
          <div>
            <h1 className="text-xl font-semibold">NxtBiz</h1>
            <p className="text-sm text-stone-500">{title}</p>
          </div>
        </div>
        {children}
      </section>
    </main>
  );
}
