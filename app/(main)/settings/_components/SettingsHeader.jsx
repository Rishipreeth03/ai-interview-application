import { User } from "lucide-react"

export default function SettingsHeader() {
  return (
    <h1 className="text-3xl font-bold mb-8 flex items-center gap-2">
      <User className="w-7 h-7 text-blue-600" /> Account Settings
    </h1>
  )
}
