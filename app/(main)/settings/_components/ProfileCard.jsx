import { Input } from "@/components/ui/input"
import Image from "next/image"

export default function ProfileCard({ name, email, loading }) {
  return (
    <section className="bg-white rounded-2xl shadow-lg p-6 mb-6 flex flex-col items-center">
      <h2 className="text-xl font-semibold mb-4">Profile Details</h2>
      
      {loading ? (
        <div className="text-gray-500">Loading...</div>
      ) : (
        <form className="flex flex-col gap-4 w-full">
          <Input
            placeholder="Name"
            value={name}
            disabled
            className="rounded-xl border-gray-200 bg-gray-50"
          />
          <Input
            placeholder="Email"
            type="email"
            value={email}
            disabled
            className="rounded-xl border-gray-200 bg-gray-50"
          />
        </form>
      )}
    </section>
  )
}
