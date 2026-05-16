import { useEffect, useRef, useState } from "react";
import { supabase } from "../supabase/client";

// ── types ──────────────────────────────────────────────────────────────────
interface Exercise {
  name: string;
  sets: string;
  reps: string;
  done: boolean;
}

interface WorkoutLog {
  id: string;
  name: string;
  duration: number;
  calories: number;
  created_at: string;
}

type Tab = "session" | "history";

// ── helpers ────────────────────────────────────────────────────────────────
function formatTime(seconds: number) {
  const m = Math.floor(seconds / 60).toString().padStart(2, "0");
  const s = (seconds % 60).toString().padStart(2, "0");
  return `${m}:${s}`;
}

function estimateCalories(durationSec: number, exerciseCount: number) {
  const mins = durationSec / 60;
  return Math.round(mins * 6 + exerciseCount * 8);
}

const DEFAULT_EXERCISES: Exercise[] = [
  { name: "Push Ups",  sets: "3", reps: "15",  done: false },
  { name: "Squats",    sets: "3", reps: "20",  done: false },
  { name: "Plank",     sets: "3", reps: "60s", done: false },
];

// ── Skeleton ───────────────────────────────────────────────────────────────
function Skeleton({ w = "100%", h = 20 }: { w?: string | number; h?: number }) {
  return (
    <div style={{
      width: w, height: h, borderRadius: 8,
      background: "linear-gradient(90deg,var(--surface3) 25%,var(--surface2) 50%,var(--surface3) 75%)",
      backgroundSize: "200% 100%", animation: "shimmer 1.4s infinite",
    }} />
  );
}

// ── SaveModal ──────────────────────────────────────────────────────────────
function SaveModal({
  elapsed, completedCount, totalCount,
  onSave, onClose,
}: {
  elapsed: number; completedCount: number; totalCount: number;
  onSave: (name: string) => Promise<void>; onClose: () => void;
}) {
  const [name,    setName]    = useState("Morning Workout");
  const [saving,  setSaving]  = useState(false);
  const [success, setSuccess] = useState(false);
  const estCals = estimateCalories(elapsed, completedCount);

  async function handleSave() {
    if (!name.trim() || saving) return;
    setSaving(true);
    await onSave(name.trim());
    setSuccess(true);
    setTimeout(onClose, 1000);
  }

  return (
    <div onClick={onClose} style={{
      position: "fixed", inset: 0, background: "rgba(0,0,0,0.7)",
      display: "flex", alignItems: "center", justifyContent: "center",
      zIndex: 50, padding: 20, backdropFilter: "blur(4px)",
    }}>
      <div onClick={e => e.stopPropagation()} style={{
        background: "var(--surface2)", border: "1px solid var(--border)",
        borderRadius: 20, padding: 28, width: "100%", maxWidth: 400,
        animation: "slideUp 0.25s ease",
      }}>
        {success ? (
          <div style={{ textAlign: "center", padding: "24px 0" }}>
            <div style={{ fontSize: 48, marginBottom: 12 }}>✓</div>
            <p style={{
              fontFamily: "'Bebas Neue',sans-serif", fontSize: 28,
              color: "var(--accent)", letterSpacing: "0.04em", margin: 0,
            }}>Workout Saved!</p>
          </div>
        ) : (
          <>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
              <h2 style={{ fontFamily: "'Bebas Neue',sans-serif", fontSize: 26, letterSpacing: ".04em", margin: 0 }}>
                Save Workout
              </h2>
              <button onClick={onClose} style={{ background: "none", border: "none", color: "var(--muted)", fontSize: 22, cursor: "pointer" }}>✕</button>
            </div>

            {/* Summary row */}
            <div style={{ display: "flex", gap: 10, marginBottom: 20 }}>
              {[
                { label: "Duration",   value: formatTime(elapsed) },
                { label: "Exercises",  value: `${completedCount}/${totalCount}` },
                { label: "Est. Cals",  value: `${estCals} kcal` },
              ].map(s => (
                <div key={s.label} style={{
                  flex: 1, background: "var(--surface3)", borderRadius: 12,
                  padding: "10px 12px", textAlign: "center",
                }}>
                  <p style={{ margin: "0 0 2px", fontFamily: "'Bebas Neue',sans-serif", fontSize: 20, color: "var(--accent)" }}>
                    {s.value}
                  </p>
                  <p style={{ margin: 0, fontSize: 10, color: "var(--muted)", textTransform: "uppercase", letterSpacing: ".06em" }}>
                    {s.label}
                  </p>
                </div>
              ))}
            </div>

            <p style={{ margin: "0 0 8px", fontSize: 13, color: "var(--muted)" }}>Workout name</p>
            <input
              value={name}
              onChange={e => setName(e.target.value)}
              style={{
                width: "100%", boxSizing: "border-box", padding: "10px 12px",
                borderRadius: 10, border: "1px solid var(--border)",
                background: "var(--surface3)", color: "var(--text)",
                fontSize: 14, outline: "none", fontFamily: "'DM Sans',sans-serif",
                marginBottom: 16,
              }}
            />
            <button onClick={handleSave} disabled={!name.trim() || saving} style={{
              width: "100%", padding: 13, borderRadius: 12, border: "none",
              background: name.trim() ? "var(--accent)" : "var(--surface3)",
              color: name.trim() ? "#111" : "var(--muted)",
              fontWeight: 700, fontSize: 15, cursor: name.trim() ? "pointer" : "not-allowed",
              fontFamily: "'DM Sans',sans-serif", transition: "all .2s",
            }}>
              {saving ? "Saving…" : "Save Workout"}
            </button>
          </>
        )}
      </div>
    </div>
  );
}

// ── main ───────────────────────────────────────────────────────────────────
export default function WorkoutTracker() {
  const [tab,       setTab]       = useState<Tab>("session");
  const [exercises, setExercises] = useState<Exercise[]>(DEFAULT_EXERCISES);
  const [form,      setForm]      = useState({ name: "", sets: "", reps: "" });
  const [elapsed,   setElapsed]   = useState(0);
  const [running,   setRunning]   = useState(false);
  const [showSave,  setShowSave]  = useState(false);
  const [history,   setHistory]   = useState<WorkoutLog[]>([]);
  const [loadingH,  setLoadingH]  = useState(false);
  const [userId,    setUserId]    = useState<string | null>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // auth
  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (user) setUserId(user.id);
    });
  }, []);

  // timer
  useEffect(() => {
    if (running) {
      timerRef.current = setInterval(() => setElapsed(e => e + 1), 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [running]);

  // load history when tab switches
  useEffect(() => {
    if (tab === "history" && userId) loadHistory(userId);
  }, [tab, userId]);

  async function loadHistory(uid: string) {
    setLoadingH(true);
    const { data } = await supabase
      .from("workout_logs")
      .select("id, name, duration, calories, created_at")
      .eq("user_id", uid)
      .order("created_at", { ascending: false })
      .limit(20);
    setHistory(data ?? []);
    setLoadingH(false);
  }

  function toggleDone(i: number) {
    setExercises(ex => ex.map((e, idx) => idx === i ? { ...e, done: !e.done } : e));
    if (!running) setRunning(true);
  }

  function addExercise() {
    if (!form.name || !form.sets || !form.reps) return;
    setExercises(ex => [...ex, { ...form, done: false }]);
    setForm({ name: "", sets: "", reps: "" });
    if (!running) setRunning(true);
  }

  function removeExercise(i: number) {
    setExercises(ex => ex.filter((_, idx) => idx !== i));
  }

  async function handleSave(name: string) {
    if (!userId) return;
    const duration = Math.max(1, Math.round(elapsed / 60));
    const calories = estimateCalories(elapsed, completedCount);
    await supabase.from("workout_logs").insert({
      user_id: userId, name, duration, calories,
    });
    setExercises(DEFAULT_EXERCISES);
    setElapsed(0);
    setRunning(false);
    setTab("history");      // ← add
    loadHistory(userId);    // ← add
  }

  function resetSession() {
    setExercises(DEFAULT_EXERCISES);
    setElapsed(0);
    setRunning(false);
  }

  const completedCount = exercises.filter(e => e.done).length;
  const totalCount     = exercises.length;
  const progress       = totalCount ? completedCount / totalCount : 0;

  return (
    <>
      <style>{`
        @keyframes shimmer  { 0%{background-position:200% 0} 100%{background-position:-200% 0} }
        @keyframes fadeIn   { from{opacity:0;transform:translateY(10px)} to{opacity:1;transform:translateY(0)} }
        @keyframes slideUp  { from{opacity:0;transform:translateY(24px)} to{opacity:1;transform:translateY(0)} }
        .wt-card { background:var(--surface2); border:1px solid var(--border); border-radius:20px; padding:22px; animation:fadeIn .4s ease both; }
        .ex-row  { display:flex; align-items:center; gap:14px; padding:13px 16px; border-radius:12px; cursor:pointer; transition:all .2s; }
        .ex-row:hover { border-color:rgba(255,255,255,.15)!important; }
        .tab-btn { padding:8px 20px; border-radius:100px; font-size:13px; font-weight:600; cursor:pointer; transition:all .15s; border:1px solid var(--border); background:var(--surface3); color:var(--muted); font-family:'DM Sans',sans-serif; }
        .tab-btn.active { background:rgba(200,241,53,.12); border-color:rgba(200,241,53,.4); color:var(--accent); }
        .wt-input { padding:9px 12px; border-radius:10px; border:1px solid var(--border); background:var(--surface3); color:var(--text); font-size:14px; outline:none; font-family:'DM Sans',sans-serif; width:100%; box-sizing:border-box; }
        .wt-input:focus { border-color:rgba(200,241,53,.4); }
        .icon-btn { background:none; border:none; cursor:pointer; color:var(--muted); font-size:15px; padding:2px 6px; border-radius:6px; transition:color .15s; }
        .icon-btn:hover { color:var(--text); }
      `}</style>

      <div style={{ padding: "28px 24px", maxWidth: 680, margin: "0 auto" }}>

        {/* Header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 22 }}>
          <div>
            <h1 style={{ fontFamily: "'Bebas Neue',sans-serif", fontSize: 36, letterSpacing: "0.04em", margin: "0 0 2px", lineHeight: 1 }}>
              Workout Tracker 💪
            </h1>
            <p style={{ margin: 0, fontSize: 13, color: "var(--muted)" }}>
              {completedCount} / {totalCount} exercises done
            </p>
          </div>

          {/* Timer */}
          <div style={{
            display: "flex", alignItems: "center", gap: 10,
            background: running ? "rgba(200,241,53,0.08)" : "var(--surface2)",
            border: `1px solid ${running ? "rgba(200,241,53,0.25)" : "var(--border)"}`,
            borderRadius: 100, padding: "10px 16px", transition: "all .3s",
          }}>
            <span style={{ fontSize: 18 }}>⏱</span>
            <div>
              <p style={{ margin: 0, fontFamily: "'Bebas Neue',sans-serif", fontSize: 22, color: running ? "var(--accent)" : "var(--muted)", lineHeight: 1 }}>
                {formatTime(elapsed)}
              </p>
              <p style={{ margin: 0, fontSize: 10, color: "var(--muted)", lineHeight: 1 }}>
                {running ? "active" : "paused"}
              </p>
            </div>
            <button
              onClick={() => setRunning(r => !r)}
              style={{
                background: "none", border: "1px solid var(--border)", borderRadius: 8,
                color: "var(--muted)", fontSize: 14, cursor: "pointer", padding: "4px 8px",
              }}
            >
              {running ? "⏸" : "▶"}
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div style={{ display: "flex", gap: 6, marginBottom: 20 }}>
          {(["session", "history"] as Tab[]).map(t => (
            <button key={t} className={`tab-btn${tab === t ? " active" : ""}`} onClick={() => setTab(t)}>
              {t === "session" ? "Current Session" : "History"}
            </button>
          ))}
        </div>

        {/* ── SESSION TAB ── */}
        {tab === "session" && (
          <>
            {/* Progress bar */}
            <div style={{ width: "100%", background: "var(--surface3)", borderRadius: 99, height: 6, marginBottom: 20 }}>
              <div style={{
                height: 6, borderRadius: 99, background: "var(--accent)",
                width: `${progress * 100}%`, transition: "width 0.5s ease",
              }} />
            </div>

            {/* Exercise list */}
            <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 20 }}>
              {exercises.map((ex, i) => (
                <div key={i} className="ex-row" onClick={() => toggleDone(i)} style={{
                  border: `1px solid ${ex.done ? "rgba(200,241,53,0.3)" : "var(--border)"}`,
                  background: ex.done ? "rgba(200,241,53,0.06)" : "var(--surface2)",
                }}>
                  {/* Checkbox */}
                  <div style={{
                    width: 20, height: 20, borderRadius: "50%", flexShrink: 0,
                    border: `2px solid ${ex.done ? "var(--accent)" : "var(--border)"}`,
                    background: ex.done ? "var(--accent)" : "transparent",
                    display: "flex", alignItems: "center", justifyContent: "center", transition: "all .2s",
                  }}>
                    {ex.done && <span style={{ fontSize: 11, color: "#111", fontWeight: 700 }}>✓</span>}
                  </div>
                  <div style={{ flex: 1 }}>
                    <p style={{
                      margin: 0, fontSize: 14, fontWeight: 600,
                      color: ex.done ? "var(--muted)" : "var(--text)",
                      textDecoration: ex.done ? "line-through" : "none",
                    }}>{ex.name}</p>
                    <p style={{ margin: 0, fontSize: 12, color: "var(--muted)" }}>
                      {ex.sets} sets × {ex.reps}
                    </p>
                  </div>
                  <button
                    className="icon-btn"
                    onClick={e => { e.stopPropagation(); removeExercise(i); }}
                    title="Remove"
                  >✕</button>
                </div>
              ))}
            </div>

            {/* Add exercise */}
            <div className="wt-card" style={{ marginBottom: 14, animationDelay: ".1s" }}>
              <p style={{ margin: "0 0 12px", fontSize: 13, fontWeight: 600 }}>Add Exercise</p>
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                <input
                  className="wt-input"
                  placeholder="Exercise name"
                  value={form.name}
                  onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                />
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
                  <input className="wt-input" placeholder="Sets" value={form.sets}
                    onChange={e => setForm(f => ({ ...f, sets: e.target.value }))} />
                  <input className="wt-input" placeholder="Reps / Duration" value={form.reps}
                    onChange={e => setForm(f => ({ ...f, reps: e.target.value }))} />
                </div>
                <button
               onClick={addExercise}
                style={{
                padding: "10px", borderRadius: 10,
                background: "var(--surface3)",
                color: "var(--muted)", fontSize: 14, fontWeight: 700,
                cursor: "pointer", fontFamily: "'DM Sans',sans-serif",
                border: "1px solid var(--border)", transition: "all .15s",
                }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = "rgba(200,241,53,.3)"; e.currentTarget.style.color = "var(--accent)"; }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = "var(--border)"; e.currentTarget.style.color = "var(--muted)"; }}
                >
                  + Add Exercise
                </button>
              </div>
            </div>

            {/* Action buttons */}
            <div style={{ display: "flex", gap: 10 }}>
              <button
                onClick={() => setShowSave(true)}
                disabled={completedCount === 0}
                style={{
                  flex: 1, padding: 13, borderRadius: 12, border: "none",
                  background: completedCount > 0 ? "var(--accent)" : "var(--surface3)",
                  color: completedCount > 0 ? "#111" : "var(--muted)",
                  fontWeight: 700, fontSize: 15, cursor: completedCount > 0 ? "pointer" : "not-allowed",
                  fontFamily: "'DM Sans',sans-serif", transition: "all .2s",
                }}
              >
                💾 Save Workout
              </button>
              <button
                onClick={resetSession}
                style={{
                  padding: "13px 18px", borderRadius: 12,
                  border: "1px solid var(--border)", background: "none",
                  color: "var(--muted)", fontSize: 14, cursor: "pointer",
                  fontFamily: "'DM Sans',sans-serif",
                }}
              >
                Reset
              </button>
            </div>
          </>
        )}

        {/* ── HISTORY TAB ── */}
        {tab === "history" && (
          <div className="wt-card">
            <h2 style={{ fontFamily: "'Bebas Neue',sans-serif", fontSize: 22, letterSpacing: ".04em", margin: "0 0 16px" }}>
              Past Workouts
            </h2>
            {loadingH ? (
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {Array(5).fill(0).map((_, i) => <Skeleton key={i} h={54} />)}
              </div>
            ) : history.length === 0 ? (
              <p style={{ color: "var(--muted)", fontSize: 13 }}>No workouts logged yet. Complete your first session! 💪</p>
            ) : (
              <div style={{ display: "flex", flexDirection: "column" }}>
                {history.map((w, i) => {
                  const icons = ["🏋️", "🏃", "🧘", "🚴", "🤸", "🥊", "⚡", "🔥"];
                  const dateLabel = new Date(w.created_at).toLocaleDateString("en-US", {
                    weekday: "short", month: "short", day: "numeric",
                  });
                  return (
                    <div key={w.id} style={{
                      display: "flex", alignItems: "center", gap: 12,
                      padding: "12px 0",
                      borderBottom: i < history.length - 1 ? "1px solid var(--border)" : "none",
                    }}>
                      <div style={{
                        width: 40, height: 40, borderRadius: 12, background: "var(--surface3)",
                        display: "flex", alignItems: "center", justifyContent: "center", fontSize: 17, flexShrink: 0,
                      }}>
                        {icons[i % icons.length]}
                      </div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <p style={{ margin: "0 0 2px", fontWeight: 600, fontSize: 13, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                          {w.name}
                        </p>
                        <p style={{ margin: 0, fontSize: 11, color: "var(--muted)" }}>{dateLabel}</p>
                      </div>
                      <div style={{ textAlign: "right", flexShrink: 0 }}>
                        <p style={{ margin: "0 0 2px", fontSize: 12, fontWeight: 600, color: "var(--accent)" }}>
                          {w.calories} kcal
                        </p>
                        <p style={{ margin: 0, fontSize: 11, color: "var(--muted)" }}>{w.duration} min</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </div>

      {showSave && (
        <SaveModal
          elapsed={elapsed}
          completedCount={completedCount}
          totalCount={totalCount}
          onSave={handleSave}
          onClose={() => setShowSave(false)}
        />
      )}
    </>
  );
}