import { useEffect, useState } from "react";
import {
  LineChart, Line, BarChart, Bar,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from "recharts";
import { supabase } from "../supabase/client";

// ── types ──────────────────────────────────────────────────────────────────
interface WeightPoint  { day: string; weight: number }
interface CalPoint     { day: string; calories: number }
interface ProgressData {
  currentWeight:    number;
  weightLastWeek:   number;
  caloriesToday:    number;
  caloriesGoal:     number;
  workoutsThisWeek: number;
  streak:           number;
  weightHistory:    WeightPoint[];
  calHistory:       CalPoint[];
}

// ── helpers ────────────────────────────────────────────────────────────────
const todayISO = () => { const d = new Date(); d.setHours(0,0,0,0); return d.toISOString(); };
const daysAgoISO = (n: number) => { const d = new Date(); d.setDate(d.getDate()-n); d.setHours(0,0,0,0); return d.toISOString(); };
const mondayISO = () => {
  const d = new Date();
  const diff = d.getDay() === 0 ? -6 : 1 - d.getDay();
  d.setDate(d.getDate()+diff); d.setHours(0,0,0,0); return d.toISOString();
};

type Range = "7D" | "30D";

// ── fetcher ────────────────────────────────────────────────────────────────
async function fetchProgress(userId: string, range: Range): Promise<ProgressData> {
  const days   = range === "7D" ? 7 : 30;
  const since  = daysAgoISO(days - 1);

  const [
    weightHistRes, weightNowRes, weightLastWeekRes,
    nutritionRes, workoutsWeekRes, allWorkoutDaysRes,
    calHistRes, profileRes,
  ] = await Promise.all([
    supabase.from("weight_logs")
      .select("weight_kg, logged_at")
      .eq("user_id", userId)
      .gte("logged_at", since)
      .order("logged_at", { ascending: true }),

    supabase.from("weight_logs")
      .select("weight_kg")
      .eq("user_id", userId)
      .order("logged_at", { ascending: false }).limit(1),

    supabase.from("weight_logs")
      .select("weight_kg")
      .eq("user_id", userId)
      .lte("logged_at", daysAgoISO(7))
      .order("logged_at", { ascending: false }).limit(1),

    supabase.from("nutrition_logs")
      .select("calories")
      .eq("user_id", userId)
      .gte("logged_at", todayISO()),

    supabase.from("workout_logs")
      .select("id")
      .eq("user_id", userId)
      .gte("created_at", mondayISO()),

    supabase.from("workout_logs")
      .select("created_at")
      .eq("user_id", userId)
      .order("created_at", { ascending: false }),

    supabase.from("nutrition_logs")
      .select("calories, logged_at")
      .eq("user_id", userId)
      .gte("logged_at", since)
      .order("logged_at", { ascending: true }),

    supabase.from("profiles")
      .select("calories_goal")
      .eq("id", userId).single(),
  ]);

  // weight history — one point per day (last reading that day)
  const weightByDay: Record<string, number> = {};
  weightHistRes.data?.forEach((w) => {
    const d = new Date(w.logged_at).toLocaleDateString("en-US", { month:"short", day:"numeric" });
    weightByDay[d] = w.weight_kg;
  });
  const weightHistory: WeightPoint[] = Object.entries(weightByDay)
    .map(([day, weight]) => ({ day, weight }));

  // calorie history — summed per day
  const calByDay: Record<string, number> = {};
  calHistRes.data?.forEach((n) => {
    const d = new Date(n.logged_at).toLocaleDateString("en-US", { month:"short", day:"numeric" });
    calByDay[d] = (calByDay[d] ?? 0) + (n.calories ?? 0);
  });
  const calHistory: CalPoint[] = Object.entries(calByDay)
    .map(([day, calories]) => ({ day, calories }));

  // streak
  const workoutDays = new Set(
    allWorkoutDaysRes.data?.map((w) => new Date(w.created_at).toDateString()) ?? []
  );
  let streak = 0;
  const cursor = new Date();
  while (workoutDays.has(cursor.toDateString())) {
    streak++; cursor.setDate(cursor.getDate()-1);
  }

  return {
    currentWeight:    weightNowRes.data?.[0]?.weight_kg ?? 0,
    weightLastWeek:   weightLastWeekRes.data?.[0]?.weight_kg ?? 0,
    caloriesToday:    nutritionRes.data?.reduce((s,r) => s+(r.calories??0), 0) ?? 0,
    caloriesGoal:     profileRes.data?.calories_goal ?? 2400,
    workoutsThisWeek: workoutsWeekRes.data?.length ?? 0,
    streak,
    weightHistory,
    calHistory,
  };
}

// ── Skeleton ───────────────────────────────────────────────────────────────
function Skeleton({ w="100%", h=20 }: { w?: string|number; h?: number }) {
  return (
    <div style={{
      width: w, height: h, borderRadius: 8,
      background: "linear-gradient(90deg,var(--surface3) 25%,var(--surface2) 50%,var(--surface3) 75%)",
      backgroundSize: "200% 100%", animation: "shimmer 1.4s infinite",
    }} />
  );
}

// ── custom tooltip ─────────────────────────────────────────────────────────
function ChartTip({ active, payload, label, unit }: any) {
  if (!active || !payload?.length) return null;
  return (
    <div style={{
      background: "var(--surface2)", border: "1px solid var(--border)",
      borderRadius: 10, padding: "10px 14px", fontSize: 12,
    }}>
      <p style={{ margin: "0 0 4px", color: "var(--muted)" }}>{label}</p>
      <p style={{ margin: 0, fontWeight: 700, color: "var(--accent)" }}>
        {payload[0].value} {unit}
      </p>
    </div>
  );
}

// ── main ───────────────────────────────────────────────────────────────────
export default function Progress() {
  const [data,    setData]    = useState<ProgressData | null>(null);
  const [loading, setLoading] = useState(true);
  const [range,   setRange]   = useState<Range>("7D");
  const [userId,  setUserId]  = useState<string | null>(null);

  async function load(uid: string, r: Range) {
    setLoading(true);
    try {
      const res = await fetchProgress(uid, r);
      setData(res);
    } catch (e) { console.error("Progress fetch error:", e); }
    finally { setLoading(false); }
  }

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (user) { setUserId(user.id); load(user.id, range); }
    });
  }, []);

  useEffect(() => {
    if (userId) load(userId, range);
  }, [range]);

  const weightDiff   = data ? +(data.currentWeight - data.weightLastWeek).toFixed(1) : 0;
  const weightDown   = weightDiff <= 0;
  const calPct       = data ? Math.min(100, Math.round((data.caloriesToday / data.caloriesGoal) * 100)) : 0;

  const stats = data
    ? [
        { label: "Current Weight",     value: data.currentWeight ? `${data.currentWeight} kg` : "—",       icon: "⚖️",
          sub: data.weightLastWeek > 0 ? `${weightDown ? "↓" : "↑"} ${Math.abs(weightDiff)} kg vs last week` : "No prior data",
          subColor: weightDown ? "var(--accent)" : "#f87171" },
        { label: "Calories Today",      value: data.caloriesToday ? data.caloriesToday.toLocaleString() : "0",     icon: "🔥",
          sub: `Goal: ${data.caloriesGoal.toLocaleString()} kcal`,
          subColor: "var(--muted)" },
        { label: "Workouts This Week",  value: `${data.workoutsThisWeek}`,                                    icon: "💪",
          sub: data.workoutsThisWeek >= 3 ? "Great week! 🎉" : "Keep pushing!",
          subColor: data.workoutsThisWeek >= 3 ? "var(--accent)" : "var(--muted)" },
        { label: "Current Streak",      value: `${data.streak} days`,                                        icon: "🔥",
          sub: data.streak >= 7 ? "Beast mode! 🔥" : "Build that streak!",
          subColor: data.streak >= 7 ? "#FF6B35" : "var(--muted)" },
      ]
    : [];

  return (
    <>
      <style>{`
        @keyframes shimmer { 0%{background-position:200% 0} 100%{background-position:-200% 0} }
        @keyframes fadeIn  { from{opacity:0;transform:translateY(10px)} to{opacity:1;transform:translateY(0)} }
        .prog-card { background:var(--surface2); border:1px solid var(--border); border-radius:20px; padding:22px; animation:fadeIn .4s ease both; }
        .prog-card:hover { border-color:rgba(255,255,255,0.13); transition:border-color .2s; }
        .stat-label { font-size:11px; color:var(--muted); text-transform:uppercase; letter-spacing:.08em; margin:0 0 4px; }
        .range-btn  { padding:6px 14px; border-radius:100px; font-size:12px; font-weight:600; cursor:pointer; transition:all .15s; border:1px solid var(--border); background:var(--surface3); color:var(--muted); font-family:'DM Sans',sans-serif; }
        .range-btn.active { background:rgba(200,241,53,.12); border-color:rgba(200,241,53,.4); color:var(--accent); }
        .bar-track { height:6px; background:var(--surface3); border-radius:4px; overflow:hidden; }
        .bar-fill  { height:100%; border-radius:4px; transition:width .7s ease; }
      `}</style>

      <div style={{ padding: "28px 24px", maxWidth: 800, margin: "0 auto" }}>

        {/* Header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 26 }}>
          <div>
            <h1 style={{ fontFamily: "'Bebas Neue',sans-serif", fontSize: 36, letterSpacing: "0.04em", margin: "0 0 2px", lineHeight: 1 }}>
              Progress 📈
            </h1>
            <p style={{ margin: 0, fontSize: 13, color: "var(--muted)" }}>Track your fitness journey</p>
          </div>
          <div style={{ display: "flex", gap: 6 }}>
            {(["7D", "30D"] as Range[]).map((r) => (
              <button key={r} className={`range-btn${range===r ? " active" : ""}`} onClick={() => setRange(r)}>
                {r}
              </button>
            ))}
          </div>
        </div>

        {/* Stat cards */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 16 }}>
          {loading
            ? Array(4).fill(0).map((_,i) => (
                <div key={i} className="prog-card" style={{ animationDelay: `${i*.05}s` }}>
                  <Skeleton w={24} h={24} />
                  <div style={{ marginTop: 10 }}><Skeleton w={80} h={26} /></div>
                  <div style={{ marginTop: 6 }}><Skeleton w={120} h={14} /></div>
                </div>
              ))
            : stats.map((s, i) => (
                <div key={s.label} className="prog-card" style={{ animationDelay: `${i*.05}s` }}>
                  <p style={{ margin: "0 0 8px", fontSize: 24 }}>{s.icon}</p>
                  <p style={{ margin: "0 0 2px", fontFamily: "'Bebas Neue',sans-serif", fontSize: 28, letterSpacing: ".03em", lineHeight: 1 }}>
                    {s.value}
                  </p>
                  <p className="stat-label">{s.label}</p>
                  <p style={{ margin: "6px 0 0", fontSize: 12, color: s.subColor }}>{s.sub}</p>
                </div>
              ))
          }
        </div>

        {/* Calorie progress bar */}
        {!loading && data && (
          <div className="prog-card" style={{ marginBottom: 16, animationDelay: ".2s" }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
              <p className="stat-label">Calorie goal today</p>
              <span style={{ fontSize: 12, fontWeight: 600, color: calPct >= 100 ? "#f87171" : "var(--accent)" }}>
                {calPct}%
              </span>
            </div>
            <div className="bar-track">
              <div className="bar-fill" style={{ width: `${calPct}%`, background: calPct >= 100 ? "#f87171" : "#FF6B35" }} />
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", marginTop: 6, fontSize: 11, color: "var(--muted)" }}>
              <span>{data.caloriesToday.toLocaleString()} kcal eaten</span>
              <span>{Math.max(0, data.caloriesGoal - data.caloriesToday).toLocaleString()} kcal remaining</span>
            </div>
          </div>
        )}

        {/* Charts */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>

          {/* Weight chart */}
          <div className="prog-card" style={{ animationDelay: ".25s" }}>
            <p style={{ margin: "0 0 4px", fontFamily: "'Bebas Neue',sans-serif", fontSize: 20, letterSpacing: ".04em" }}>
              Weight
            </p>
            <p className="stat-label" style={{ marginBottom: 14 }}>kg — {range}</p>
            {loading ? <Skeleton h={180} /> : data && data.weightHistory.length > 0 ? (
              <ResponsiveContainer width="100%" height={180}>
                <LineChart data={data.weightHistory}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                  <XAxis dataKey="day" tick={{ fontSize: 10, fill: "var(--muted)" }} interval="preserveStartEnd" />
                  <YAxis domain={["auto","auto"]} tick={{ fontSize: 10, fill: "var(--muted)" }} width={36} />
                  <Tooltip content={<ChartTip unit="kg" />} />
                  <Line type="monotone" dataKey="weight" stroke="var(--accent)" strokeWidth={2}
                    dot={{ fill: "var(--accent)", r: 3 }} activeDot={{ r: 5 }} />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <div style={{ height: 180, display: "flex", alignItems: "center", justifyContent: "center" }}>
                <p style={{ color: "var(--muted)", fontSize: 13 }}>No weight data yet</p>
              </div>
            )}
          </div>

          {/* Calories chart */}
          <div className="prog-card" style={{ animationDelay: ".3s" }}>
            <p style={{ margin: "0 0 4px", fontFamily: "'Bebas Neue',sans-serif", fontSize: 20, letterSpacing: ".04em" }}>
              Calories
            </p>
            <p className="stat-label" style={{ marginBottom: 14 }}>kcal per day — {range}</p>
            {loading ? <Skeleton h={180} /> : data && data.calHistory.length > 0 ? (
              <ResponsiveContainer width="100%" height={180}>
                <BarChart data={data.calHistory}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                  <XAxis dataKey="day" tick={{ fontSize: 10, fill: "var(--muted)" }} interval="preserveStartEnd" />
                  <YAxis tick={{ fontSize: 10, fill: "var(--muted)" }} width={36} />
                  <Tooltip content={<ChartTip unit="kcal" />} />
                  <Bar dataKey="calories" fill="#FF6B35" radius={[4,4,0,0]} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div style={{ height: 180, display: "flex", alignItems: "center", justifyContent: "center" }}>
                <p style={{ color: "var(--muted)", fontSize: 13 }}>No nutrition data yet</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}