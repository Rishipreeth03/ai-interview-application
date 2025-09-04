import React, { useState } from 'react'

function QuestionListContainer({ questionslist, onChange }) {
  const [editIdx, setEditIdx] = useState(null)
  const [editQuestion, setEditQuestion] = useState('')
  const [editType, setEditType] = useState('')
  const [showDialog, setShowDialog] = useState(false)
  const [newQuestion, setNewQuestion] = useState('')
  const [newType, setNewType] = useState('')

  // Edit handler
  const handleEdit = (idx) => {
    setEditIdx(idx)
    setEditQuestion(questionslist[idx].question)
    setEditType(questionslist[idx].type)
    setShowDialog(true)
  }

  const handleSaveEdit = () => {
    const updated = questionslist.map((q, idx) =>
      idx === editIdx ? { ...q, question: editQuestion, type: editType } : q
    )
    onChange(updated)
    setShowDialog(false)
    setEditIdx(null)
  }

  const handleCancelEdit = () => {
    setShowDialog(false)
    setEditIdx(null)
  }

  // Delete handler
  const handleDelete = (idx) => {
    const updated = questionslist.filter((_, i) => i !== idx)
    onChange(updated)
  }

  // Add handler
  const handleAdd = () => {
    if (!newQuestion || !newType) return
    const updated = [...questionslist, { question: newQuestion, type: newType }]
    onChange(updated)
    setNewQuestion('')
    setNewType('')
  }

  return (
    <div>
      {questionslist.map((q, index) => (
        <div
          key={index}
          className="p-5 border rounded-2xl shadow-md hover:shadow-2xl transition-all duration-300 bg-white mb-4 flex flex-col gap-2 relative group"
        >
          <div className="flex items-center justify-between">
            <p className="text-gray-900 font-semibold text-base">{q.question}</p>
            <span className="inline-block px-3 py-1 text-xs font-semibold text-white bg-indigo-500 rounded-full shadow">
              {q.type}
            </span>
          </div>
          <div className="flex gap-3 mt-2 opacity-80 group-hover:opacity-100 transition-all duration-200">
            <button
              className="text-blue-600 hover:text-blue-800 hover:underline text-sm font-medium px-2 py-1 rounded transition"
              onClick={() => handleEdit(index)}
            >
              Edit
            </button>
            <button
              className="text-red-500 hover:text-red-700 hover:underline text-sm font-medium px-2 py-1 rounded transition"
              onClick={() => handleDelete(index)}
            >
              Delete
            </button>
          </div>
        </div>
      ))}

      {/* Add Question */}
      <div className="flex flex-col md:flex-row gap-2 mt-6 items-center bg-gray-50 p-4 rounded-xl shadow">
        <input
          type="text"
          placeholder="Enter new question..."
          value={newQuestion}
          onChange={e => setNewQuestion(e.target.value)}
          className="border rounded px-3 py-2 flex-1 focus:outline-none focus:ring-2 focus:ring-indigo-300 transition"
        />
        <input
          type="text"
          placeholder="Type (e.g. Technical)"
          value={newType}
          onChange={e => setNewType(e.target.value)}
          className="border rounded px-3 py-2 w-40 focus:outline-none focus:ring-2 focus:ring-indigo-300 transition"
        />
        <button
          className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 font-semibold transition"
          onClick={handleAdd}
        >
          Add
        </button>
      </div>

      {/* Edit Dialog */}
      {showDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50 transition-all duration-300">
          <div className="bg-white rounded-xl shadow-2xl p-8 w-full max-w-md animate-fade-in">
            <h3 className="font-bold text-xl mb-6 text-indigo-700">Edit Question</h3>
            <label className="block mb-2 text-sm font-medium text-gray-700">Question</label>
            <input
              type="text"
              value={editQuestion}
              onChange={e => setEditQuestion(e.target.value)}
              className="border rounded px-3 py-2 w-full mb-4 focus:outline-none focus:ring-2 focus:ring-indigo-300 transition"
            />
            <label className="block mb-2 text-sm font-medium text-gray-700">Type</label>
            <input
              type="text"
              value={editType}
              onChange={e => setEditType(e.target.value)}
              className="border rounded px-3 py-2 w-full mb-6 focus:outline-none focus:ring-2 focus:ring-indigo-300 transition"
            />
            <div className="flex justify-end gap-3">
              <button
                className="bg-gray-200 px-4 py-2 rounded hover:bg-gray-300 font-medium transition"
                onClick={handleCancelEdit}
              >
                Cancel
              </button>
              <button
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 font-medium transition"
                onClick={handleSaveEdit}
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default QuestionListContainer
