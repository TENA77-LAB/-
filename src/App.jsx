import AsceticTrackerApp from "./AsceticTrackerApp.jsx";

export default function App() {
  return (
    <div className="bg-stone-950 text-white">
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.16),_transparent_45%)]" />
        <div className="relative mx-auto flex min-h-[85vh] w-full max-w-6xl flex-col justify-center px-4 py-16 md:px-8">
          <span className="mb-4 inline-flex w-fit items-center rounded-full border border-white/20 px-4 py-1 text-sm text-stone-200">
            Трекер аскез
          </span>
          <h1 className="max-w-3xl text-4xl font-bold tracking-tight md:text-6xl">
            Дисциплина становится привычкой, а не борьбой.
          </h1>
          <p className="mt-6 max-w-2xl text-base text-stone-300 md:text-lg">
            Веди личные практики, отмечай каждый день и держи серию. Приложение работает прямо в браузере и
            сохраняет прогресс локально.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <a
              href="#app"
              className="rounded-2xl bg-white px-6 py-3 font-semibold text-stone-950 transition hover:bg-stone-200"
            >
              Открыть приложение
            </a>
            <a
              href="#features"
              className="rounded-2xl border border-white/30 px-6 py-3 font-semibold text-white transition hover:bg-white/10"
            >
              Посмотреть возможности
            </a>
          </div>
        </div>
      </section>

      <section id="features" className="mx-auto w-full max-w-6xl px-4 py-12 md:px-8">
        <div className="grid gap-4 md:grid-cols-3">
          <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
            <h2 className="text-xl font-semibold">Ежедневный контроль</h2>
            <p className="mt-2 text-sm text-stone-300">Отмечай выполнение за последние 7 дней в один клик.</p>
          </div>
          <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
            <h2 className="text-xl font-semibold">Серия и прогресс</h2>
            <p className="mt-2 text-sm text-stone-300">Видно текущую серию и прогресс по каждой аскезе.</p>
          </div>
          <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
            <h2 className="text-xl font-semibold">Без регистрации</h2>
            <p className="mt-2 text-sm text-stone-300">Данные остаются на твоем устройстве через localStorage.</p>
          </div>
        </div>
      </section>

      <section id="app" className="bg-stone-100">
        <AsceticTrackerApp />
      </section>
    </div>
  );
}
