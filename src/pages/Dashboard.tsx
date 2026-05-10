import { useEffect, useState } from 'react'
import { supabase } from '../supabase/client'
import { useNavigate } from 'react-router-dom'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts'

const weekData = [
  { day: 'Mon', calories: 1600 },
  { day: 'Tue', calories: 1450 },
  { day: 'Wed', calories: 1900 },
  { day: 'Thu', calories: 1300 },
  { day: 'Fri', calories: 1750 },
  { day: 'Sat', calories: 2000 },
  { day: 'Sun', calories: 1100 },
]

export default function Dashboard() {
  const [email, setEmail] = useState('')
  const navigate = useNavigate()

  useEffect(() => {
    const getUser = async () => {
      const { data } = await supabase.auth.getUser()
      if (!data.user) navigate('/login')
      else setEmail(data.user.email || '')
    }
    getUser()
  }, [])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    navigate('/login')
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white border-b px-6 py-4 flex justify-between items-center">
        <h1 className="text-xl font-semibold text-green-600">FitAI</h1>
        <div className="flex items-center gap-4">
          <span className="text-sm text-gray-500">{email}</span>
          <button onClick={handleLogout} className="text-sm text-red-500 hover:underline">Logout</button>
        </div>
      </nav>

      <div className="p-6 max-w-5xl mx-auto">
        <h2 className="text-2xl font-semibold mb-6">Good morning 💪</h2>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-xl p-4 border">
            <p className="text-sm text-gray-500 mb-1">🔥 Calories</p>
            <p className="text-2xl font-semibold">1,420</p>
            <p className="text-xs text-gray-400">of 1,800 kcal</p>
            <div className="mt-2 h-1.5 bg-gray-100 rounded-full">
              <div className="h-1.5 bg-orange-400 rounded-full" style={{ width: '79%' }}></div>
            </div>
          </div>
          <div className="bg-white rounded-xl p-4 border">
            <p className="text-sm text-gray-500 mb-1">🚶 Steps</p>
            <p className="text-2xl font-semibold">7,284</p>
            <p className="text-xs text-gray-400">of 10,000 goal</p>
            <div className="mt-2 h-1.5 bg-gray-100 rounded-full">
              <div className="h-1.5 bg-green-400 rounded-full" style={{ width: '73%' }}></div>
            </div>
          </div>
          <div className="bg-white rounded-xl p-4 border">
            <p className="text-sm text-gray-500 mb-1">💧 Water</p>
            <p className="text-2xl font-semibold">1.8 L</p>
            <p className="text-xs text-gray-400">of 2.5 L target</p>
            <div className="mt-2 h-1.5 bg-gray-100 rounded-full">
              <div className="h-1.5 bg-blue-400 rounded-full" style={{ width: '72%' }}></div>
            </div>
          </div>
          <div className="bg-white rounded-xl p-4 border">
            <p className="text-sm text-gray-500 mb-1">⚖️ Weight</p>
            <p className="text-2xl font-semibold">74.2 kg</p>
            <p className="text-xs text-gray-400">-0.8 kg this week</p>
            <div className="mt-2 h-1.5 bg-gray-100 rounded-full">
              <div className="h-1.5 bg-purple-400 rounded-full" style={{ width: '60%' }}></div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 border">
          <h3 className="text-lg font-semibold mb-4">Weekly Calories</h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={weekData}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="day" axisLine={false} tickLine={false} />
              <YAxis axisLine={false} tickLine={false} />
              <Tooltip />
              <Bar dataKey="calories" fill="#4ade80" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  )
}