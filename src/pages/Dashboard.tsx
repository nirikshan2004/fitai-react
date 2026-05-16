import { useEffect, useState } from "react";
import { supabase } from "../supabase/client";

// ── types ──────────────────────────────────────────────────────────────────
interface WorkoutLog {
  id: string;
  name: string;
  duration: number;
  calories: number;
  created_at: string;
}

interface DayEntry {
  day: string;
  done: boolean;
  calories: number;
}

interface DashboardData {
  streak: number;
  caloriesToday: number;
  caloriesGoal: number;
  waterGlasses: number;
  waterGoal: number;
  stepsToday: number;
  stepsGoal: number;
  activeMinutes: number;
  activeMinutesYesterday: number;
  weight: number;
  weightLastWeek: number;
  weeklyData: DayEntry[];
  recentWorkouts: WorkoutLog[];
  userName: string;
}

// ── date helpers ───────────────────────────────────────────────────────────
function todayISO() {
  const d = new Date(); d.setHours(0,0,0,0); return d.toISOString();
}
function mondayISO() {
  const d = new Date();
  const diff = d.getDay() === 0 ? -6 : 1 - d.getDay();
  d.setDate(d.getDate() + diff); d.setHours(0,0,0,0); return d.toISOString();
}
function yesterdayISO() {
  const d = new Date(); d.setDate(d.getDate()-1); d.setHours(0,0,0,0); return d.toISOString();
}
function daysAgoISO(n: number) {
  const d = new Date(); d.setDate(d.getDate()-n); d.setHours(0,0,0,0); return d.toISOString();
}

// ── main fetcher — all queries run in parallel ─────────────────────────────
async function fetchDashboard(userId: string): Promise<DashboardData> {
  const [
    profileRes, workoutsWeekRes, workoutsRecentRes,
    nutritionRes, waterRes, activityTodayRes, activityYestRes,
    weightNowRes, weightLastWeekRes, allWorkoutDaysRes,
  ] = await Promise.all([
    supabase.from("profiles")
      .select("full_name, calories_goal, water_goal, steps_goal")
      .eq("id", userId).single(),

    supabase.from("workout_logs")
      .select("calories, created_at")
      .eq("user_id", userId).gte("created_at", mondayISO()),

    supabase.from("workout_logs")
      .select("id, name, duration, calories, created_at")
      .eq("user_id", userId)
      .order("created_at", { ascending: false }).limit(3),

    supabase.from("nutrition_logs")
      .select("calories")
      .eq("user_id", userId).gte("logged_at", todayISO()),

    supabase.from("water_logs")
      .select("glasses")
      .eq("user_id", userId).gte("logged_at", todayISO()),

    supabase.from("activity_logs")
      .select("steps, active_minutes")
      .eq("user_id", userId).gte("logged_at", todayISO()),

    supabase.from("activity_logs")
      .select("active_minutes")
      .eq("user_id", userId)
      .gte("logged_at", yesterdayISO()).lt("logged_at", todayISO()),

    supabase.from("weight_logs")
      .select("weight_kg")
      .eq("user_id", userId)
      .order("logged_at", { ascending: false }).limit(1),

    supabase.from("weight_logs")
      .select("weight_kg")
      .eq("user_id", userId)
      .lte("logged_at", daysAgoISO(7))
      .order("logged_at", { ascending: false }).limit(1),

    supabase.from("workout_logs")
      .select("created_at")
      .eq("user_id", userId)
      .order("created_at", { ascending: false }),
  ]);

  // build Mon–Sun weekly entries
  const DAYS = ["Mon","Tue","Wed","Thu","Fri","Sat","Sun"];
  const calsByDay: Record<string, number> = {};
  workoutsWeekRes.data?.forEach((w) => {
    const label = new Date(w.created_at)
      .toLocaleDateString("en-US", { weekday: "short" }).slice(0,3);
    calsByDay[label] = (calsByDay[label] ?? 0) + (w.calories ?? 0);
  });
  const monday = new Date(mondayISO());
  const weeklyData: DayEntry[] = DAYS.map((_, i) => {
    const d = new Date(monday); d.setDate(d.getDate() + i);
    const label = d.toLocaleDateString("en-US", { weekday: "short" }).slice(0,3);
    const cals = calsByDay[label] ?? 0;
    return { day: label, done: cals > 0, calories: cals };
  });

  // streak: consecutive days with at least one workout
  const workoutDays = new Set(
    allWorkoutDaysRes.data?.map((w) => new Date(w.created_at).toDateString()) ?? []
  );
  let streak = 0;
  const cursor = new Date();
  while (workoutDays.has(cursor.toDateString())) {
    streak++; cursor.setDate(cursor.getDate()-1);
  }

  const goals = profileRes.data;
  return {
    userName:               goals?.full_name?.split(" ")[0] ?? "there",
    streak,
    caloriesToday:          nutritionRes.data?.reduce((s,r) => s+(r.calories??0), 0) ?? 0,
    caloriesGoal:           goals?.calories_goal ?? 2400,
    waterGlasses:           waterRes.data?.reduce((s,r) => s+(r.glasses??0), 0) ?? 0,
    waterGoal:              goals?.water_goal ?? 8,
    stepsToday:             activityTodayRes.data?.reduce((s,r) => s+(r.steps??0), 0) ?? 0,
    stepsGoal:              goals?.steps_goal ?? 10000,
    activeMinutes:          activityTodayRes.data?.reduce((s,r) => s+(r.active_minutes??0), 0) ?? 0,
    activeMinutesYesterday: activityYestRes.data?.reduce((s,r) => s+(r.active_minutes??0), 0) ?? 0,
    weight:                 weightNowRes.data?.[0]?.weight_kg ?? 0,
    weightLastWeek:         weightLastWeekRes.data?.[0]?.weight_kg ?? 0,
    weeklyData,
    recentWorkouts:         workoutsRecentRes.data ?? [],
  };
}

// ── Ring SVG ───────────────────────────────────────────────────────────────
function Ring({ percent, size=120, stroke=10, color="#C8F135",
  bg="rgba(255,255,255,0.06)", children }: {
  percent:number; size?:number; stroke?:number;
  color?:string; bg?:string; children?:React.ReactNode;
}) {
  const r = (size-stroke)/2;
  const circ = 2*Math.PI*r;
  const dash = Math.min(percent/100,1)*circ;
  return (
    <div style={{ position:"relative", width:size, height:size, flexShrink:0 }}>
      <svg width={size} height={size} style={{ transform:"rotate(-90deg)" }}>
        <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={bg} strokeWidth={stroke}/>
        <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={color}
          strokeWidth={stroke} strokeDasharray={`${dash} ${circ}`} strokeLinecap="round"
          style={{ transition:"stroke-dasharray 0.7s cubic-bezier(.4,0,.2,1)" }}/>
      </svg>
      <div style={{ position:"absolute", inset:0, display:"flex",
        flexDirection:"column", alignItems:"center", justifyContent:"center" }}>
        {children}
      </div>
    </div>
  );
}

// ── Skeleton ───────────────────────────────────────────────────────────────
function Skeleton({ w="100%", h=20 }: { w?:string|number; h?:number }) {
  return <div style={{ width:w, height:h, borderRadius:8,
    background:"linear-gradient(90deg,var(--surface3) 25%,var(--surface2) 50%,var(--surface3) 75%)",
    backgroundSize:"200% 100%", animation:"shimmer 1.4s infinite" }}/>;
}

// ── Quick-log modal ────────────────────────────────────────────────────────
const QUICK_WORKOUTS = ["Upper Body","Lower Body","Cardio","HIIT","Yoga","Core","Full Body","Run"];

function QuickLogModal({ userId, onClose, onLogged }:{
  userId:string; onClose:()=>void; onLogged:()=>void;
}) {
  const [selected, setSelected] = useState("");
  const [duration, setDuration] = useState(30);
  const [loading, setLoading]   = useState(false);
  const [done,    setDone]      = useState(false);

  async function handleLog() {
    if (!selected || loading) return;
    setLoading(true);
    const estimatedCalories = Math.round(duration * 6.5);
    const { error } = await supabase.from("workout_logs").insert({
      user_id: userId, name: selected, duration, calories: estimatedCalories,
    });
    if (!error) { setDone(true); setTimeout(() => { onLogged(); onClose(); }, 1200); }
    setLoading(false);
  }

  return (
    <div onClick={onClose} style={{ position:"fixed", inset:0,
      background:"rgba(0,0,0,0.7)", display:"flex", alignItems:"center",
      justifyContent:"center", zIndex:50, padding:20, backdropFilter:"blur(4px)" }}>
      <div onClick={e => e.stopPropagation()} style={{ background:"var(--surface2)",
        border:"1px solid var(--border)", borderRadius:20, padding:28,
        width:"100%", maxWidth:420, animation:"slideUp 0.25s ease" }}>

        {done ? (
          <div style={{ textAlign:"center", padding:"24px 0" }}>
            <div style={{ fontSize:48, marginBottom:12 }}>✓</div>
            <p style={{ fontFamily:"'Bebas Neue',sans-serif", fontSize:28,
              color:"var(--accent)", letterSpacing:"0.04em", margin:0 }}>Workout Logged!</p>
          </div>
        ) : (
          <>
            <div style={{ display:"flex", justifyContent:"space-between",
              alignItems:"center", marginBottom:22 }}>
              <h2 style={{ fontFamily:"'Bebas Neue',sans-serif", fontSize:28,
                letterSpacing:"0.04em", margin:0 }}>Quick Log</h2>
              <button onClick={onClose} style={{ background:"none", border:"none",
                color:"var(--muted)", fontSize:22, cursor:"pointer" }}>✕</button>
            </div>

            <p style={{ color:"var(--muted)", fontSize:13, margin:"0 0 12px" }}>Select workout type</p>
            <div style={{ display:"flex", flexWrap:"wrap", gap:8, marginBottom:22 }}>
              {QUICK_WORKOUTS.map(w => (
                <button key={w} onClick={() => setSelected(w)} style={{
                  padding:"8px 16px", borderRadius:100, fontSize:13, cursor:"pointer",
                  border: selected===w ? "1.5px solid var(--accent)" : "1px solid var(--border)",
                  background: selected===w ? "rgba(200,241,53,0.12)" : "var(--surface3)",
                  color: selected===w ? "var(--accent)" : "var(--text)",
                  fontWeight: selected===w ? 600 : 400, transition:"all 0.15s",
                }}>{w}</button>
              ))}
            </div>

            <p style={{ color:"var(--muted)", fontSize:13, margin:"0 0 8px" }}>
              Duration: <strong style={{ color:"var(--accent)" }}>{duration} min</strong>
              <span style={{ color:"var(--muted)", marginLeft:8 }}>
                (~{Math.round(duration*6.5)} kcal)
              </span>
            </p>
            <input type="range" min={5} max={120} step={5} value={duration}
              onChange={e => setDuration(Number(e.target.value))}
              style={{ width:"100%", accentColor:"var(--accent)", marginBottom:22 }}/>

            <button onClick={handleLog} disabled={!selected||loading} style={{
              width:"100%", padding:14, borderRadius:12, border:"none",
              background: selected ? "var(--accent)" : "var(--surface3)",
              color: selected ? "#111" : "var(--muted)",
              fontWeight:700, fontSize:15, cursor: selected ? "pointer" : "not-allowed",
              fontFamily:"'DM Sans',sans-serif", transition:"all 0.2s",
            }}>{loading ? "Saving…" : "Log Workout"}</button>
          </>
        )}
      </div>
    </div>
  );
}

// ── Dashboard ──────────────────────────────────────────────────────────────
export default function Dashboard() {
  const [data,     setData]     = useState<DashboardData|null>(null);
  const [loading,  setLoading]  = useState(true);
  const [modal,    setModal]    = useState(false);
  const [userId,   setUserId]   = useState<string|null>(null);

  async function load(uid: string) {
    setLoading(true);
    try { setData(await fetchDashboard(uid)); }
    catch (e) { console.error("Dashboard fetch error:", e); }
    finally { setLoading(false); }
  }

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (user) { setUserId(user.id); load(user.id); }
    });
  }, []);

  // derived values
  const calPct    = data ? Math.round((data.caloriesToday / data.caloriesGoal)   * 100) : 0;
  const waterPct  = data ? Math.round((data.waterGlasses  / data.waterGoal)      * 100) : 0;
  const stepsPct  = data ? Math.round((data.stepsToday    / data.stepsGoal)      * 100) : 0;
  const weeklyPct = data ? Math.round((data.weeklyData.filter(d=>d.done).length  /  7)  * 100) : 0;
  const daysCompleted = data?.weeklyData.filter(d=>d.done).length ?? 0;
  const weightDiff    = data ? +(data.weight - data.weightLastWeek).toFixed(1) : 0;
  const minDiff       = data ? data.activeMinutes - data.activeMinutesYesterday  : 0;

  const greeting = () => {
    const h = new Date().getHours();
    return h < 12 ? "Good Morning" : h < 17 ? "Good Afternoon" : "Good Evening";
  };

  const todayLabel = new Date().toLocaleDateString("en-US",
    { weekday:"long", month:"long", day:"numeric" });

  return (
    <>
      <style>{`
        @keyframes slideUp { from{opacity:0;transform:translateY(24px)} to{opacity:1;transform:translateY(0)} }
        @keyframes fadeIn  { from{opacity:0;transform:translateY(10px)} to{opacity:1;transform:translateY(0)} }
        @keyframes shimmer { 0%{background-position:200% 0} 100%{background-position:-200% 0} }
        .dash-card{background:var(--surface2);border:1px solid var(--border);border-radius:20px;padding:22px;animation:fadeIn .4s ease both}
        .dash-card:hover{border-color:rgba(255,255,255,0.13);transition:border-color .2s}
        .stat-label{font-size:11px;color:var(--muted);text-transform:uppercase;letter-spacing:.08em;margin:0 0 6px}
        .stat-val{font-family:'Bebas Neue',sans-serif;letter-spacing:.04em;margin:0;line-height:1}
        .day-dot{display:flex;flex-direction:column;align-items:center;gap:5px}
        .day-circle{width:30px;height:30px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:10px;font-weight:700;transition:transform .15s}
        .day-circle:hover{transform:scale(1.1)}
        .bar-track{height:4px;background:var(--surface3);border-radius:4px;overflow:hidden}
        .bar-fill{height:100%;border-radius:4px;transition:width .7s ease}
        .activity-row{display:flex;align-items:center;gap:12px;padding:12px 0;border-bottom:1px solid var(--border)}
        .activity-row:last-child{border-bottom:none;padding-bottom:0}
        .act-icon{width:40px;height:40px;border-radius:12px;background:var(--surface3);display:flex;align-items:center;justify-content:center;font-size:17px;flex-shrink:0}
        .quick-btn{display:flex;align-items:center;justify-content:center;gap:10px;width:100%;padding:14px;background:var(--accent);color:#111;border:none;border-radius:14px;font-family:'DM Sans',sans-serif;font-size:15px;font-weight:700;cursor:pointer;transition:all .2s}
        .quick-btn:hover{background:var(--accent-dim);transform:translateY(-1px);box-shadow:0 8px 24px rgba(200,241,53,.18)}
      `}</style>

      <div style={{ padding:"28px 24px", maxWidth:960, margin:"0 auto" }}>

        {/* Header */}
        <div style={{ display:"flex", justifyContent:"space-between",
          alignItems:"flex-start", marginBottom:26 }}>
          <div>
            <p style={{ color:"var(--muted)", fontSize:12, margin:"0 0 4px" }}>{todayLabel}</p>
            <h1 style={{ fontFamily:"'Bebas Neue',sans-serif", fontSize:36,
              letterSpacing:"0.04em", margin:0, lineHeight:1 }}>
              {loading ? "Loading…" : `${greeting()}, ${data?.userName} 👋`}
            </h1>
          </div>
          <div style={{ display:"flex", alignItems:"center", gap:10,
            background:"rgba(200,241,53,0.1)", border:"1px solid rgba(200,241,53,0.25)",
            borderRadius:100, padding:"10px 16px" }}>
            <span style={{ fontSize:20 }}>🔥</span>
            <div>
              {loading ? <Skeleton w={32} h={22}/> : (
                <>
                  <p style={{ margin:0, fontFamily:"'Bebas Neue',sans-serif",
                    fontSize:24, color:"var(--accent)", lineHeight:1 }}>{data?.streak ?? 0}</p>
                  <p style={{ margin:0, fontSize:10, color:"var(--muted)", lineHeight:1 }}>Day streak</p>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Top row */}
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:14, marginBottom:14 }}>

          {/* Weekly ring */}
          <div className="dash-card" style={{ animationDelay:".05s",
            display:"flex", flexDirection:"column", alignItems:"center", gap:14 }}>
            <p className="stat-label" style={{ alignSelf:"flex-start" }}>Weekly Progress</p>
            <Ring percent={weeklyPct} size={124} stroke={11}>
              <p className="stat-val" style={{ fontSize:28, color:"var(--accent)" }}>{daysCompleted}</p>
              <p style={{ margin:0, fontSize:11, color:"var(--muted)" }}>/ 7 days</p>
            </Ring>
            <div style={{ display:"flex", gap:5 }}>
              {(data?.weeklyData ?? Array(7).fill({ day:"?", done:false })).map((d,i) => (
                <div key={i} className="day-dot">
                  <div className="day-circle" style={{
                    background: d.done ? "var(--accent)" : "var(--surface3)",
                    color:      d.done ? "#111"          : "var(--muted)",
                  }}>{d.done ? "✓" : ""}</div>
                  <span style={{ fontSize:9, color:"var(--muted)" }}>{d.day?.[0]}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Calories ring */}
          <div className="dash-card" style={{ animationDelay:".1s",
            display:"flex", flexDirection:"column", alignItems:"center", gap:14 }}>
            <p className="stat-label" style={{ alignSelf:"flex-start" }}>Calories Today</p>
            <Ring percent={calPct} size={124} stroke={11}
              color="#FF6B35" bg="rgba(255,107,53,0.1)">
              <p className="stat-val" style={{ fontSize:22, color:"#FF6B35" }}>
                {data?.caloriesToday.toLocaleString() ?? "—"}
              </p>
              <p style={{ margin:0, fontSize:11, color:"var(--muted)" }}>kcal</p>
            </Ring>
            <div style={{ width:"100%" }}>
              <div style={{ display:"flex", justifyContent:"space-between", fontSize:11, marginBottom:5 }}>
                <span style={{ color:"var(--muted)" }}>Goal</span>
                <span style={{ fontWeight:600 }}>{data?.caloriesGoal.toLocaleString()} kcal</span>
              </div>
              <div className="bar-track">
                <div className="bar-fill" style={{ width:`${calPct}%`, background:"#FF6B35" }}/>
              </div>
              <div style={{ display:"flex", justifyContent:"space-between", fontSize:11, marginTop:5 }}>
                <span style={{ color:"var(--muted)" }}>Remaining</span>
                <span style={{ fontWeight:600 }}>
                  {data ? Math.max(0, data.caloriesGoal - data.caloriesToday).toLocaleString() : "—"} kcal
                </span>
              </div>
            </div>
          </div>

          {/* Water + quick log */}
          <div style={{ display:"flex", flexDirection:"column", gap:14 }}>
            <div className="dash-card" style={{ animationDelay:".15s",
              display:"flex", alignItems:"center", gap:14, flex:1 }}>
              <Ring percent={waterPct} size={70} stroke={7}
                color="#38BDF8" bg="rgba(56,189,248,0.1)">
                <span style={{ fontSize:18 }}>💧</span>
              </Ring>
              <div>
                <p className="stat-label">Hydration</p>
                <p className="stat-val" style={{ fontSize:26, color:"#38BDF8" }}>
                  {data?.waterGlasses ?? "—"}
                  <span style={{ fontSize:13, color:"var(--muted)",
                    fontFamily:"'DM Sans'", fontWeight:400 }}> / {data?.waterGoal ?? 8}</span>
                </p>
                <p style={{ margin:0, fontSize:11, color:"var(--muted)" }}>glasses today</p>
              </div>
            </div>
            <div className="dash-card" style={{ animationDelay:".2s" }}>
              <p className="stat-label" style={{ marginBottom:10 }}>Ready to train?</p>
              <button className="quick-btn" onClick={() => setModal(true)}>
                <span style={{ fontSize:20 }}>+</span> Log Workout
              </button>
            </div>
          </div>
        </div>

        {/* Bottom row */}
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1.4fr", gap:14 }}>

          <div style={{ display:"flex", flexDirection:"column", gap:14 }}>
            {/* Steps */}
            <div className="dash-card" style={{ animationDelay:".25s" }}>
              <div style={{ display:"flex", justifyContent:"space-between" }}>
                <div>
                  <p className="stat-label">Steps Today</p>
                  <p className="stat-val" style={{ fontSize:32 }}>
                    {loading ? <Skeleton w={80} h={28}/> : data?.stepsToday.toLocaleString()}
                  </p>
                  <p style={{ margin:"5px 0 0", fontSize:11, color:"var(--muted)" }}>
                    Goal: {data?.stepsGoal.toLocaleString()}
                  </p>
                </div>
                <span style={{ fontSize:26 }}>🦶</span>
              </div>
              <div className="bar-track" style={{ marginTop:12 }}>
                <div className="bar-fill" style={{ width:`${stepsPct}%`, background:"var(--accent)" }}/>
              </div>
            </div>

            {/* Active minutes */}
            <div className="dash-card" style={{ animationDelay:".3s" }}>
              <div style={{ display:"flex", justifyContent:"space-between" }}>
                <div>
                  <p className="stat-label">Active Minutes</p>
                  <p className="stat-val" style={{ fontSize:32 }}>
                    {loading ? <Skeleton w={60} h={28}/> : data?.activeMinutes}
                  </p>
                  {!loading && data && (
                    <p style={{ margin:"5px 0 0", fontSize:11,
                      color: minDiff >= 0 ? "#22d3ee" : "#f87171" }}>
                      {minDiff >= 0 ? "↑" : "↓"} {Math.abs(minDiff)} min vs yesterday
                    </p>
                  )}
                </div>
                <span style={{ fontSize:26 }}>⚡</span>
              </div>
            </div>

            {/* Weight */}
            <div className="dash-card" style={{ animationDelay:".35s" }}>
              <div style={{ display:"flex", justifyContent:"space-between" }}>
                <div>
                  <p className="stat-label">Weight</p>
                  <p className="stat-val" style={{ fontSize:32 }}>
                    {loading ? <Skeleton w={80} h={28}/> : (
                      <>{data?.weight ?? "—"}
                        <span style={{ fontSize:14, color:"var(--muted)",
                          fontFamily:"'DM Sans'", fontWeight:400 }}> kg</span>
                      </>
                    )}
                  </p>
                  {!loading && data && data.weightLastWeek > 0 && (
                    <p style={{ margin:"5px 0 0", fontSize:11,
                      color: weightDiff <= 0 ? "var(--accent)" : "#f87171" }}>
                      {weightDiff <= 0 ? "↓" : "↑"} {Math.abs(weightDiff)} kg this week
                    </p>
                  )}
                </div>
                <span style={{ fontSize:26 }}>📉</span>
              </div>
            </div>
          </div>

          {/* Recent workouts */}
          <div className="dash-card" style={{ animationDelay:".3s" }}>
            <div style={{ display:"flex", justifyContent:"space-between",
              alignItems:"center", marginBottom:4 }}>
              <h2 style={{ fontFamily:"'Bebas Neue',sans-serif", fontSize:22,
                letterSpacing:"0.04em", margin:0 }}>Recent Workouts</h2>
              <button style={{ background:"none", border:"1px solid var(--border)",
                borderRadius:8, padding:"5px 12px", color:"var(--muted)",
                fontSize:11, cursor:"pointer" }}>View all</button>
            </div>

            {loading ? (
              <div style={{ display:"flex", flexDirection:"column", gap:12, marginTop:16 }}>
                {[1,2,3].map(i => <Skeleton key={i} h={44}/>)}
              </div>
            ) : data?.recentWorkouts.length === 0 ? (
              <p style={{ color:"var(--muted)", fontSize:13, marginTop:16 }}>
                No workouts yet — log your first one! 💪
              </p>
            ) : (
              <div style={{ marginTop:14 }}>
                {data?.recentWorkouts.map((w, i) => {
                  const icons = ["🏋️","🏃","🧘","🚴","🤸"];
                  const timeLabel = new Date(w.created_at).toLocaleDateString("en-US",
                    { weekday:"short", hour:"2-digit", minute:"2-digit" });
                  return (
                    <div key={w.id} className="activity-row">
                      <div className="act-icon">{icons[i % icons.length]}</div>
                      <div style={{ flex:1, minWidth:0 }}>
                        <p style={{ margin:"0 0 2px", fontWeight:600, fontSize:13,
                          whiteSpace:"nowrap", overflow:"hidden", textOverflow:"ellipsis" }}>
                          {w.name}
                        </p>
                        <p style={{ margin:0, fontSize:11, color:"var(--muted)" }}>{timeLabel}</p>
                      </div>
                      <div style={{ textAlign:"right", flexShrink:0 }}>
                        <p style={{ margin:"0 0 2px", fontSize:12, fontWeight:600,
                          color:"var(--accent)" }}>{w.calories} kcal</p>
                        <p style={{ margin:0, fontSize:11, color:"var(--muted)" }}>{w.duration} min</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Weekly bar chart */}
            <div style={{ marginTop:20, paddingTop:16, borderTop:"1px solid var(--border)" }}>
              <p className="stat-label" style={{ marginBottom:10 }}>
                This week — calories burned
              </p>
              <div style={{ display:"flex", gap:6, alignItems:"flex-end", height:52 }}>
                {(data?.weeklyData ?? Array(7).fill({ done:false, calories:0, day:"?" }))
                  .map((d, i) => {
                    const max = Math.max(...(data?.weeklyData.map(x=>x.calories)??[1]), 1);
                    const h = d.done ? Math.max(8, (d.calories/max)*44) : 6;
                    return (
                      <div key={i} style={{ flex:1, display:"flex",
                        flexDirection:"column", alignItems:"center", gap:5 }}>
                        <div style={{ width:"100%", height:h,
                          background: d.done ? "var(--accent)" : "var(--surface3)",
                          borderRadius:3, opacity: d.done ? 1 : 0.4,
                          transition:"height 0.6s ease" }}/>
                        <span style={{ fontSize:9, color:"var(--muted)" }}>{d.day?.[0]}</span>
                      </div>
                    );
                  })}
              </div>
            </div>
          </div>
        </div>
      </div>

      {modal && userId && (
        <QuickLogModal
          userId={userId}
          onClose={() => setModal(false)}
          onLogged={() => load(userId)}
        />
      )}
    </>
  );
}