import { CheckCircle2, ShieldAlert } from "lucide-react"

const Step = ({ icon, label, verified, error }) => (
  <div className="flex items-center gap-4 mb-8">
    <div className={`flex items-center justify-center w-12 h-12 rounded-full border-2 shadow-md ${verified ? "border-green-500 bg-green-100" : error ? "border-red-500 bg-red-100" : "border-gray-300 bg-gray-100"} transition`}>
      {verified ? <CheckCircle2 className="w-7 h-7 text-green-500" /> : error ? <ShieldAlert className="w-7 h-7 text-red-500" /> : icon}
    </div>
    <span className={`font-semibold text-lg ${verified ? "text-green-700" : error ? "text-red-600" : "text-gray-500"}`}>{label}</span>
  </div>
)

export default Step
