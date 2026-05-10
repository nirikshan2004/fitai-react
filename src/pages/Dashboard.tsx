import { supabase } from '../supabase/client'
import { useNavigate } from 'react-router-dom'

export default function Dashboard() {
  const navigate = useNavigate()

  const handleLogout = async () => {
    await supabase.auth.signOut()
    navigate('/login')
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-semibold">Welcome to FitAI 💪</h1>
        <button onClick={handleLogout} className="text-sm text-red-500 hover:underline">Logout</button>
      </div>
      <p className="text-gray-500">Dashboard coming soon...</p>
    </div>
  )
}