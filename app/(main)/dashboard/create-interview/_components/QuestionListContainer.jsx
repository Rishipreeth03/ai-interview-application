import React, { useState } from 'react'

function QuestionListContainer({ questionslist, onChange }) {
  const [editIdx, setEditIdx] = useState(null)
  const [editQuestion, setEditQuestion] = useState('')
  const [editType, setEditType] = useState('')
  const [editDifficulty, setEditDifficulty] = useState('')
  const [showDialog, setShowDialog] = useState(false)
  const [newQuestion, setNewQuestion] = useState('')
  const [newType, setNewType] = useState('')
  const [newDifficulty, setNewDifficulty] = useState('')

  // Edit handler
  const handleEdit = (idx) => {
    setEditIdx(idx)
    setEditQuestion(questionslist[idx].question)
    setEditType(questionslist[idx].type || '')
    setEditDifficulty(questionslist[idx].difficulty || '')
    setShowDialog(true)
  }

  const handleSaveEdit = () => {
    if (!editQuestion.trim()) return; // Don't save empty questions
    
    const updated = questionslist.map((q, idx) =>
      idx === editIdx ? { 
        ...q, 
        question: editQuestion.trim(),
        type: editType || 'technical',
        difficulty: editDifficulty || q.difficulty || 'medium'
      } : q
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
    
    // Make sure question ends with question mark
    let formattedQuestion = newQuestion.trim();
    if (!formattedQuestion.endsWith('?')) {
      formattedQuestion += '?';
    }
    
    const updated = [
      ...questionslist, 
      { 
        question: formattedQuestion, 
        type: newType,
        difficulty: newDifficulty || 'medium'
      }
    ]
    onChange(updated)
    setNewQuestion('')
    setNewType('')
    setNewDifficulty('')
  }

  return (
    <div>
      <div className="mb-4">
        <h3 className="font-semibold text-lg text-gray-700 mb-2">Generated Questions ({questionslist.length})</h3>
        <p className="text-sm text-gray-500 mb-4">You can edit, delete or add questions before creating the interview.</p>
      </div>
      
      {questionslist.map((q, index) => (
        <div
          key={index}
          className="p-5 border rounded-lg shadow-sm hover:shadow-md transition-all duration-300 bg-white mb-4 flex flex-col gap-2 relative group"
        >
          <div className="flex items-start justify-between">
            <div className="flex gap-3">
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-semibold">
                {index + 1}
              </div>
              <p className="text-gray-800 font-medium text-base leading-relaxed">{q.question}</p>
            </div>
            <div className="flex flex-col items-end gap-2">
              <span className={`inline-block px-3 py-1 text-xs font-medium rounded-full shadow-sm ${
                q.type?.toLowerCase().includes('tech') ? 'bg-blue-500 text-white' :
                q.type?.toLowerCase().includes('behav') ? 'bg-green-500 text-white' :
                q.type?.toLowerCase().includes('sit') ? 'bg-purple-500 text-white' :
                q.type?.toLowerCase().includes('cod') ? 'bg-amber-500 text-white' :
                'bg-gray-500 text-white'
              }`}>
                {q.type || 'General'}
              </span>
              
              {q.difficulty && (
                <span className={`inline-block px-3 py-1 text-xs font-medium rounded-full shadow-sm ${
                  q.difficulty?.toLowerCase().includes('easy') ? 'bg-green-100 text-green-800' :
                  q.difficulty?.toLowerCase().includes('hard') ? 'bg-red-100 text-red-800' :
                  'bg-blue-100 text-blue-800'
                }`}>
                  {q.difficulty}
                </span>
              )}
            </div>
          </div>
          
          {/* Additional metadata if available */}
          {(q.category || q.timeToAnswer) && (
            <div className="mt-2 text-sm text-gray-500 flex flex-wrap gap-3">
              {q.category && (
                <span className="inline-flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                  </svg>
                  {q.category}
                </span>
              )}
              
              {q.timeToAnswer && (
                <span className="inline-flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  {q.timeToAnswer} mins
                </span>
              )}
            </div>
          )}
          
          <div className="flex gap-3 mt-3 pt-2 border-t border-gray-100 opacity-70 group-hover:opacity-100 transition-all duration-200">
            <button
              className="text-blue-600 hover:text-blue-800 hover:bg-blue-50 text-sm font-medium px-3 py-1 rounded transition flex items-center gap-1"
              onClick={() => handleEdit(index)}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
              Edit
            </button>
            <button
              className="text-red-500 hover:text-red-700 hover:bg-red-50 text-sm font-medium px-3 py-1 rounded transition flex items-center gap-1"
              onClick={() => handleDelete(index)}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
              Delete
            </button>
          </div>
        </div>
      ))}

      {/* Add Question */}
      <div className="mt-6 border border-dashed border-gray-300 rounded-lg p-6 bg-gray-50">
        <h3 className="font-semibold text-lg text-gray-700 mb-2 flex items-center gap-2">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
          Add Your Own Question
        </h3>
        
        <div className="flex flex-col gap-4 mt-4">
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-gray-700">Question Text</label>
            <input
              type="text"
              placeholder="Enter your question..."
              value={newQuestion}
              onChange={e => setNewQuestion(e.target.value)}
              className="border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-300 transition bg-white"
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium text-gray-700">Question Type</label>
              <select 
                value={newType}
                onChange={e => setNewType(e.target.value)}
                className="border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-300 transition bg-white"
              >
                <option value="">Select Type</option>
                <option value="technical">Technical</option>
                <option value="behavioral">Behavioral</option>
                <option value="situational">Situational</option>
                <option value="coding">Coding</option>
                <option value="general">General</option>
              </select>
            </div>
            
            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium text-gray-700">Difficulty (Optional)</label>
              <select 
                value={newDifficulty || ''}
                onChange={e => setNewDifficulty(e.target.value)}
                className="border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-300 transition bg-white"
              >
                <option value="">Select Difficulty</option>
                <option value="easy">Easy</option>
                <option value="medium">Medium</option>
                <option value="hard">Hard</option>
              </select>
            </div>
          </div>
          
          <button
            className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 font-medium transition mt-2 flex items-center justify-center gap-2"
            onClick={handleAdd}
            disabled={!newQuestion || !newType}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            Add Question
          </button>
        </div>
      </div>

      {/* Edit Dialog */}
      {showDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 transition-all duration-300">
          <div className="bg-white rounded-xl shadow-2xl p-8 w-full max-w-lg animate-fade-in relative">
            <button 
              onClick={handleCancelEdit}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
              aria-label="Close"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            
            <h3 className="font-bold text-xl mb-6 text-indigo-700 flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
              Edit Interview Question
            </h3>
            
            <div className="space-y-4">
              <div className="flex flex-col gap-1">
                <label className="block text-sm font-medium text-gray-700">Question Text</label>
                <textarea
                  value={editQuestion}
                  onChange={e => setEditQuestion(e.target.value)}
                  rows={3}
                  className="border rounded-md px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-indigo-300 transition"
                  placeholder="Enter interview question..."
                ></textarea>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1">
                  <label className="block text-sm font-medium text-gray-700">Question Type</label>
                  <select
                    value={editType}
                    onChange={e => setEditType(e.target.value)}
                    className="border rounded-md px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-indigo-300 transition"
                  >
                    <option value="">Select Type</option>
                    <option value="technical">Technical</option>
                    <option value="behavioral">Behavioral</option>
                    <option value="situational">Situational</option>
                    <option value="coding">Coding</option>
                    <option value="general">General</option>
                  </select>
                </div>
                
                <div className="flex flex-col gap-1">
                  <label className="block text-sm font-medium text-gray-700">Difficulty Level</label>
                  <select
                    value={editDifficulty}
                    onChange={e => setEditDifficulty(e.target.value)}
                    className="border rounded-md px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-indigo-300 transition"
                  >
                    <option value="">Select Difficulty</option>
                    <option value="easy">Easy</option>
                    <option value="medium">Medium</option>
                    <option value="hard">Hard</option>
                  </select>
                </div>
              </div>
            </div>
            
            <div className="flex justify-end gap-3 mt-8">
              <button
                className="px-4 py-2 rounded border border-gray-300 hover:bg-gray-100 font-medium transition flex items-center gap-1"
                onClick={handleCancelEdit}
              >
                Cancel
              </button>
              <button
                className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 font-medium transition flex items-center gap-2"
                onClick={handleSaveEdit}
                disabled={!editQuestion.trim()}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default QuestionListContainer
