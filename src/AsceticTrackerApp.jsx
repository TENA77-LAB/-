import React, { useEffect, useMemo, useState } from "react";

const STORAGE_KEY = "ascetic-tracker-practices";

const Icon = ({ children, className = "" }) => (
  <span className={`inline-flex h-5 w-5 items-center justify-center ${className}`} aria-hidden="true">
    {children}
  </span>
);

const todayKey = (date = new Date()) => date.toISOString().slice(0, 10);

const makeId = () => {
  if (typeof crypto !== "undefined" && crypto.randomUUID) return crypto.randomUUID();
  return `id-${Date.now()}-${Math.random().toString(16).slice(2)}`;
};

const makeSeedPractices = () => [
  {
    id: makeId(),
    title: "Без сахара",
    description: "Держать чистое питание и не есть сладкое.",
    targetDays: 21,
    color: "from-orange-100 to-amber-100",
    completed: {},
    createdAt: todayKey(),
  },
  {
    id: makeId(),
    title: "Утренняя медитация",
    description: "10 минут тишины после пробуждения.",
    targetDays: 30,
    color: "from-violet-100 to-fuchsia-100",
    completed: {},
    createdAt: todayKey(),
  },
];

export function getLastNDays(n = 7, baseDate = new Date()) {
  return Array.from({ length: n }).map((_, index) => {
    const date = new Date(baseDate);
    date.setDate(date.getDate() - (n - 1 - index));
    const key = todayKey(date);

    return {
      key,
      label: date.toLocaleDateString("ru-RU", { weekday: "short" }),
      day: date.getDate(),
    };
  });
}

export function calculateStreak(completed, baseDate = new Date()) {
  let streak = 0;
  const date = new Date(baseDate);

  while (true) {
    const key = todayKey(date);
    if (!completed[key]) break;
    streak += 1;
    date.setDate(date.getDate() - 1);
  }

  return streak;
}

export function calculateProgress(completedCount, targetDays) {
  const safeTarget = Math.max(1, Number(targetDays) || 1);
  return Math.min(100, Math.round((completedCount / safeTarget) * 100));
}

function runRuntimeTests() {
  const base = new Date("2026-05-12T12:00:00.000Z");
  const completed = {
    "2026-05-12": true,
    "2026-05-11": true,
    "2026-05-10": true,
    "2026-05-08": true,
  };

  console.assert(calculateStreak(completed, base) === 3, "calculateStreak counts consecutive days ending today");
  console.assert(calculateStreak({}, base) === 0, "calculateStreak returns 0 without completed days");
  console.assert(calculateProgress(5, 10) === 50, "calculateProgress returns percentage");
  console.assert(calculateProgress(15, 10) === 100, "calculateProgress caps progress at 100");
  console.assert(getLastNDays(7, base).length === 7, "getLastNDays returns requested number of days");
}

runRuntimeTests();

function StatCard({ value, label }) {
  return (
    <div className="rounded-2xl bg-white/10 p-4 text-center">
      <div className="text-2xl font-bold">{value}</div>
      <div className="text-xs text-stone-300">{label}</div>
    </div>
  );
}

function Panel({ children, className = "" }) {
  return <div className={`rounded-[2rem] bg-white shadow-sm ${className}`}>{children}</div>;
}

export default function AsceticTrackerApp() {
  const [practices, setPractices] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? JSON.parse(saved) : makeSeedPractices();
    } catch {
      return makeSeedPractices();
    }
  });

  const [form, setForm] = useState({
    title: "",
    description: "",
    targetDays: 21,
  });

  const days = useMemo(() => getLastNDays(7), []);
  const today = todayKey();

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(practices));
    } catch {
      // Local storage can be unavailable in some sandboxed previews.
    }
  }, [practices]);

  const addPractice = () => {
    if (!form.title.trim()) return;

    const gradients = [
      "from-orange-100 to-amber-100",
      "from-emerald-100 to-teal-100",
      "from-blue-100 to-cyan-100",
      "from-violet-100 to-fuchsia-100",
      "from-rose-100 to-pink-100",
    ];

    setPractices((current) => [
      {
        id: makeId(),
        title: form.title.trim(),
        description: form.description.trim() || "Личная практика дисциплины.",
        targetDays: Math.max(1, Number(form.targetDays) || 21),
        color: gradients[current.length % gradients.length],
        completed: {},
        createdAt: today,
      },
      ...current,
    ]);

    setForm({ title: "", description: "", targetDays: 21 });
  };

  const toggleDay = (practiceId, dateKey) => {
    setPractices((current) =>
      current.map((practice) => {
        if (practice.id !== practiceId) return practice;

        const completed = { ...practice.completed };
        if (completed[dateKey]) {
          delete completed[dateKey];
        } else {
          completed[dateKey] = true;
        }

        return { ...practice, completed };
      })
    );
  };

  const deletePractice = (practiceId) => {
    setPractices((current) => current.filter((practice) => practice.id !== practiceId));
  };

  const totalCompletedToday = practices.filter((practice) => practice.completed?.[today]).length;
  const completionRate = practices.length ? Math.round((totalCompletedToday / practices.length) * 100) : 0;

  return (
    <main className="min-h-screen bg-stone-50 p-4 text-stone-950 md:p-8">
      <div className="mx-auto max-w-6xl space-y-6">
        <header className="overflow-hidden rounded-[2rem] bg-stone-950 p-6 text-white shadow-xl md:p-8">
          <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
            <div>
              <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-sm text-stone-200">
                <Icon>✦</Icon> Трекер аскез
              </div>
              <h1 className="text-3xl font-bold tracking-tight md:text-5xl">Дисциплина без драмы.</h1>
              <p className="mt-3 max-w-2xl text-stone-300">
                Добавляй аскезы, отмечай выполнение и держи серию. Данные сохраняются локально в браузере.
              </p>
            </div>

            <div className="grid grid-cols-3 gap-3">
              <StatCard value={practices.length} label="аскез" />
              <StatCard value={totalCompletedToday} label="сегодня" />
              <StatCard value={`${completionRate}%`} label="фокус" />
            </div>
          </div>
        </header>

        <section className="grid gap-6 lg:grid-cols-[360px_1fr]">
          <Panel>
            <div className="space-y-4 p-5">
              <div>
                <h2 className="text-xl font-semibold">Новая аскеза</h2>
                <p className="text-sm text-stone-500">Задай практику и срок, который хочешь выдержать.</p>
              </div>

              <label className="block space-y-2 text-sm font-medium">
                <span>Название</span>
                <input
                  value={form.title}
                  onChange={(event) => setForm({ ...form, title: event.target.value })}
                  placeholder="Например: без кофе"
                  className="w-full rounded-2xl border border-stone-200 bg-white px-4 py-3 outline-none transition focus:border-stone-900"
                />
              </label>

              <label className="block space-y-2 text-sm font-medium">
                <span>Описание</span>
                <textarea
                  value={form.description}
                  onChange={(event) => setForm({ ...form, description: event.target.value })}
                  placeholder="Что именно считаем выполнением?"
                  className="min-h-24 w-full resize-none rounded-2xl border border-stone-200 bg-white px-4 py-3 outline-none transition focus:border-stone-900"
                />
              </label>

              <label className="block space-y-2 text-sm font-medium">
                <span>Цель в днях</span>
                <input
                  type="number"
                  min="1"
                  value={form.targetDays}
                  onChange={(event) => setForm({ ...form, targetDays: event.target.value })}
                  className="w-full rounded-2xl border border-stone-200 bg-white px-4 py-3 outline-none transition focus:border-stone-900"
                />
              </label>

              <button
                onClick={addPractice}
                className="flex h-12 w-full items-center justify-center gap-2 rounded-2xl bg-stone-950 px-4 font-medium text-white transition hover:bg-stone-800"
              >
                <Icon>＋</Icon> Добавить аскезу
              </button>
            </div>
          </Panel>

          <div className="space-y-4">
            <div className="flex items-center justify-between px-1">
              <div>
                <h2 className="text-xl font-semibold">Мои практики</h2>
                <p className="text-sm text-stone-500">Последние 7 дней и текущая серия.</p>
              </div>
              <div className="hidden items-center gap-2 rounded-full bg-white px-4 py-2 text-sm shadow-sm md:flex">
                <Icon>📅</Icon> Сегодня: {new Date().toLocaleDateString("ru-RU")}
              </div>
            </div>

            {practices.length === 0 ? (
              <div className="rounded-[2rem] border border-dashed border-stone-300 bg-white p-10 text-center text-stone-500">
                Пока нет аскез. Добавь первую слева.
              </div>
            ) : (
              practices.map((practice) => {
                const completed = practice.completed || {};
                const completedCount = Object.keys(completed).length;
                const progress = calculateProgress(completedCount, practice.targetDays);
                const streak = calculateStreak(completed);

                return (
                  <div key={practice.id} className={`rounded-[2rem] bg-gradient-to-br ${practice.color} p-1 shadow-sm`}>
                    <div className="rounded-[1.75rem] bg-white/75 p-5 backdrop-blur">
                      <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                        <div className="min-w-0">
                          <div className="flex items-center gap-2">
                            <h3 className="truncate text-xl font-semibold">{practice.title}</h3>
                            {completed[today] && <Icon className="text-green-700">✓</Icon>}
                          </div>
                          <p className="mt-1 text-sm text-stone-600">{practice.description}</p>
                        </div>

                        <button
                          onClick={() => deletePractice(practice.id)}
                          className="self-start rounded-full p-2 text-stone-400 transition hover:bg-white hover:text-red-500"
                          aria-label="Удалить аскезу"
                        >
                          <Icon>×</Icon>
                        </button>
                      </div>

                      <div className="mt-5 grid gap-3 md:grid-cols-[1fr_180px] md:items-center">
                        <div className="grid grid-cols-7 gap-2">
                          {days.map((day) => {
                            const done = completed[day.key];
                            return (
                              <button
                                key={day.key}
                                onClick={() => toggleDay(practice.id, day.key)}
                                className={`rounded-2xl p-3 text-center transition ${
                                  done ? "bg-stone-950 text-white" : "bg-white/70 text-stone-500 hover:bg-white"
                                }`}
                              >
                                <div className="text-xs capitalize">{day.label}</div>
                                <div className="mt-1 text-lg font-bold">{day.day}</div>
                                <div className="mt-1 flex justify-center">{done ? "✓" : "○"}</div>
                              </button>
                            );
                          })}
                        </div>

                        <div className="rounded-3xl bg-white/80 p-4">
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-stone-500">Прогресс</span>
                            <span className="font-semibold">
                              {completedCount}/{practice.targetDays}
                            </span>
                          </div>
                          <div className="mt-3 h-3 overflow-hidden rounded-full bg-stone-200">
                            <div className="h-full rounded-full bg-stone-950 transition-all" style={{ width: `${progress}%` }} />
                          </div>
                          <div className="mt-4 flex items-center gap-2 text-sm font-medium">
                            <Icon>🔥</Icon> Серия: {streak} дн.
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </section>
      </div>
    </main>
  );
}
