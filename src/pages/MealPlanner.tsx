// src/pages/MealPlanner.tsx
import { useState } from 'react';
import { generateMealPlan } from '../services/gemini';
import { Sparkles, Clock, Flame, Leaf } from 'lucide-react';

interface MealCard {
  title: string;
  content: string;
  emoji: string;
  color: string;
}

function parseMeals(text: string): MealCard[] {
  const meals: MealCard[] = [
    { title: 'Breakfast', content: '', emoji: '🌅', color: '#f97316' },
    { title: 'Lunch',     content: '', emoji: '☀️', color: '#22c55e' },
    { title: 'Snacks',    content: '', emoji: '🍎', color: '#3b82f6' },
    { title: 'Dinner',    content: '', emoji: '🌙', color: '#a855f7' },
  ];

  meals.forEach(meal => {
    const regex = new RegExp(
      `${meal.title}:?\\s*([^\\n]+(?:\\n(?!Breakfast:|Lunch:|Snacks:|Dinner:)[^\\n]+)*)`,
      'i'
    );
    const match = text.match(regex);
    if (match) meal.content = match[1].trim();
  });

  return meals;
}

export default function MealPlanner() {
  const [form,    setForm]    = useState({ age: '', weight: '', goal: '', diet: '' });
  const [meals,   setMeals]   = useState<MealCard[]>([]);
  const [rawText, setRawText] = useState('');
  const [error,   setError]   = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleGenerate = async () => {
    setError('');
    setMeals([]);
    setRawText('');
    if (!form.age || !form.weight || !form.goal || !form.diet) {
      setError('Please fill in all fields.');
      return;
    }
    setLoading(true);
    const prompt = `Create a healthy one-day meal plan.
Age: ${form.age}
Weight: ${form.weight} kg
Goal: ${form.goal}
Diet: ${form.diet}

Return the plan in this exact format:
Breakfast: [meal details]
Lunch: [meal details]
Snacks: [meal details]
Dinner: [meal details]

Keep it simple and practical. No markdown. Plain text only.`;

    try {
      const result = await generateMealPlan(prompt);
      setRawText(result);
      setMeals(parseMeals(result));
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Something went wrong. Try again.');
    } finally {
      setLoading(false);
    }
  };

  const inputStyle: React.CSSProperties = {
    width: '100%',
    padding: '12px 16px',
    background: 'var(--surface3)',
    border: '1px solid var(--border)',
    borderRadius: '10px',
    color: 'var(--text)',
    fontSize: '14px',
    outline: 'none',
    fontFamily: "'DM Sans', sans-serif",
    boxSizing: 'border-box',
  };

  return (
    <div style={{ padding: '28px 24px', maxWidth: 960, margin: '0 auto' }}>

      {/* Header */}
      <div style={{ marginBottom: '28px' }}>
        <h1 style={{
          margin: '0 0 4px',
          fontFamily: "'Bebas Neue', sans-serif",
          fontSize: '36px',
          letterSpacing: '0.04em',
          color: 'var(--text)',
          lineHeight: 1,
        }}>
          AI Meal <span style={{ color: 'var(--accent)' }}>Planner</span>
        </h1>
        <p style={{ margin: 0, fontSize: '13px', color: 'var(--muted)' }}>
          Get a personalized daily meal plan powered by Gemini AI
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '340px 1fr', gap: '24px', alignItems: 'start' }}>

        {/* Form */}
        <div style={{
          background: 'var(--surface2)',
          border: '1px solid var(--border)',
          borderRadius: '20px',
          padding: '22px',
        }}>
          <h2 style={{
            margin: '0 0 20px',
            fontFamily: "'Bebas Neue', sans-serif",
            fontSize: '18px',
            letterSpacing: '0.06em',
            color: 'var(--text)',
          }}>
            Your Details
          </h2>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '11px', color: 'var(--muted)', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                Age
              </label>
              <input
                type="number" name="age" placeholder="25"
                value={form.age} onChange={handleChange} style={inputStyle}
                onFocus={e => (e.target.style.borderColor = 'var(--accent)')}
                onBlur={e  => (e.target.style.borderColor = 'var(--border)')}
              />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '11px', color: 'var(--muted)', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                Weight (kg)
              </label>
              <input
                type="number" name="weight" placeholder="70"
                value={form.weight} onChange={handleChange} style={inputStyle}
                onFocus={e => (e.target.style.borderColor = 'var(--accent)')}
                onBlur={e  => (e.target.style.borderColor = 'var(--border)')}
              />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '11px', color: 'var(--muted)', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                Goal
              </label>
              <select name="goal" value={form.goal} onChange={handleChange} style={inputStyle}>
                <option value="">Select goal</option>
                <option value="weight loss">Weight Loss</option>
                <option value="muscle gain">Muscle Gain</option>
                <option value="maintain">Maintain</option>
              </select>
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '11px', color: 'var(--muted)', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                Diet
              </label>
              <select name="diet" value={form.diet} onChange={handleChange} style={inputStyle}>
                <option value="">Select diet</option>
                <option value="vegetarian">Vegetarian</option>
                <option value="non vegetarian">Non Vegetarian</option>
              </select>
            </div>

            {error && (
              <p style={{
                margin: 0, fontSize: '13px', color: '#f87171',
                padding: '10px 14px', background: 'rgba(239,68,68,0.08)',
                borderRadius: '8px', border: '1px solid rgba(239,68,68,0.15)',
              }}>
                {error}
              </p>
            )}

            <button
              onClick={handleGenerate}
              disabled={loading}
              style={{
                marginTop: '4px', padding: '13px',
                background: loading ? 'var(--surface3)' : 'var(--accent)',
                color: loading ? 'var(--muted)' : '#111',
                border: 'none', borderRadius: '12px',
                fontSize: '15px', fontWeight: 700,
                fontFamily: "'Bebas Neue', sans-serif",
                letterSpacing: '0.1em',
                cursor: loading ? 'not-allowed' : 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                transition: 'opacity 0.2s',
              }}
            >
              {loading ? <>Generating...</> : <><Sparkles size={16} /> Generate Meal Plan</>}
            </button>
          </div>

          {/* Info chips */}
          <div style={{ marginTop: '20px', display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
            {[
              { icon: Flame, label: 'Calorie optimized' },
              { icon: Leaf,  label: 'Nutritious' },
              { icon: Clock, label: 'Quick & easy' },
            ].map(({ icon: Icon, label }) => (
              <div key={label} style={{
                display: 'flex', alignItems: 'center', gap: '5px',
                padding: '4px 10px',
                background: 'var(--surface3)', border: '1px solid var(--border)',
                borderRadius: '20px', fontSize: '11px', color: 'var(--muted)',
              }}>
                <Icon size={11} />
                {label}
              </div>
            ))}
          </div>
        </div>

        {/* Results */}
        <div>
          {!meals.length && !loading && (
            <div style={{
              background: 'var(--surface2)',
              border: '1px dashed var(--border)',
              borderRadius: '20px',
              padding: '60px 24px',
              textAlign: 'center',
            }}>
              <div style={{ fontSize: '48px', marginBottom: '16px' }}>🍽️</div>
              <h3 style={{
                margin: '0 0 8px',
                fontFamily: "'Bebas Neue', sans-serif",
                fontSize: '22px', color: 'var(--text)', letterSpacing: '0.04em',
              }}>
                Your Meal Plan Appears Here
              </h3>
              <p style={{ margin: 0, fontSize: '13px', color: 'var(--muted)' }}>
                Fill in your details and click Generate
              </p>
            </div>
          )}

          {loading && (
            <div style={{
              background: 'var(--surface2)',
              border: '1px solid var(--border)',
              borderRadius: '20px',
              padding: '60px 24px',
              textAlign: 'center',
            }}>
              <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
              <div style={{ fontSize: '48px', marginBottom: '16px', display: 'inline-block', animation: 'spin 1s linear infinite' }}>✨</div>
              <p style={{ margin: 0, fontFamily: "'Bebas Neue', sans-serif", fontSize: '20px', color: 'var(--accent)', letterSpacing: '0.06em' }}>
                Gemini is cooking...
              </p>
              <p style={{ margin: '8px 0 0', fontSize: '13px', color: 'var(--muted)' }}>
                Building your personalized meal plan
              </p>
            </div>
          )}

          {meals.length > 0 && (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
              {meals.map(meal => (
                <div key={meal.title} style={{
                  background: 'var(--surface2)',
                  border: '1px solid var(--border)',
                  borderRadius: '20px',
                  padding: '22px',
                  borderTop: `3px solid ${meal.color}`,
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
                    <span style={{ fontSize: '24px' }}>{meal.emoji}</span>
                    <h3 style={{
                      margin: 0,
                      fontFamily: "'Bebas Neue', sans-serif",
                      fontSize: '18px', color: 'var(--text)', letterSpacing: '0.04em',
                    }}>
                      {meal.title}
                    </h3>
                  </div>
                  <p style={{ margin: 0, fontSize: '13px', color: 'var(--muted)', lineHeight: 1.7 }}>
                    {meal.content || 'No details available'}
                  </p>
                </div>
              ))}

              {/* Raw text fallback if parsing fails */}
              {meals.every(m => !m.content) && rawText && (
                <div style={{
                  gridColumn: '1 / -1',
                  background: 'var(--surface3)', borderRadius: '12px',
                  padding: '22px', fontSize: '13px', color: 'var(--muted)',
                  lineHeight: 1.8, whiteSpace: 'pre-wrap',
                }}>
                  {rawText}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}