export default function FeedbackAlert({ error, success }) {
  if (!error && !success) return null
  return (
    <div className="mb-4">
      {error && (
        <div className="bg-red-100 text-red-700 px-4 py-2 rounded-lg font-semibold shadow">
          {error}
        </div>
      )}
      {success && (
        <div className="bg-green-100 text-green-700 px-4 py-2 rounded-lg font-semibold shadow">
          {success}
        </div>
      )}
    </div>
  )
}
