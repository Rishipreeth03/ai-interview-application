import React from 'react'

function QuestionListContainer({questionslist}) {
  return (
    <div>
       
                 {questionslist.map((q, index) => (
                    <div
                    key={index}
                    className="p-4 border rounded-2xl shadow-md hover:shadow-xl transition duration-300 bg-white mb-3 "
                  >
                    <p className="text-gray-800 font-medium">{q.question}</p>
                    <span className="inline-block mt-2 px-3 py-1 text-sm font-semibold text-white bg-indigo-500 rounded-full">
                      {q.type}
                    </span>
                  </div>
                  ))}
    </div>
  )
}

export default QuestionListContainer
