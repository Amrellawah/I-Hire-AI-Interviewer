import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { ClipboardCheck, Clipboard, Star, ChevronDown, ChevronUp } from 'lucide-react'

function QuestionListContainer({ questionList }) {
  const [copiedIndex, setCopiedIndex] = useState(null);
  const [expandedIndex, setExpandedIndex] = useState(null);
  const [starredQuestions, setStarredQuestions] = useState([]);

  const copyToClipboard = (text, index) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const toggleExpand = (index) => {
    setExpandedIndex(expandedIndex === index ? null : index);
  };

  const toggleStar = (index) => {
    if (starredQuestions.includes(index)) {
      setStarredQuestions(starredQuestions.filter(i => i !== index));
    } else {
      setStarredQuestions([...starredQuestions, index]);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-800">Generated Interview Questions</h2>
        <span className='px-3 py-1 text-sm bg-green-50 text-green-600 rounded-full'>
          {questionList.length} Questions
        </span>
      </div>

      <div className="space-y-4">
        {questionList.map((item, index) => (
          <motion.div 
            key={index}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            className="p-4 bg-white rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow"
          >
            <div className="flex justify-between items-start gap-3">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <span 
                    className={`px-2 py-1 text-xs font-medium rounded-full ${
                      item.type === 'Technical' 
                        ? 'bg-purple-100 text-purple-800' 
                        : item.type === 'Behavioral' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-blue-100 text-blue-800'
                    }`}
                  >
                    {item.type}
                  </span>
                  {item.difficulty && (
                    <span className="px-2 py-1 text-xs font-medium bg-gray-100 text-gray-800 rounded-full">
                      {item.difficulty}
                    </span>
                  )}
                </div>
                
                <h3 className="font-medium text-gray-800 mb-2">{item.question}</h3>
                
                {expandedIndex === index && item.details && (
                  <div className="mt-3 p-3 bg-gray-50 rounded-lg text-sm text-gray-600">
                    {item.details}
                  </div>
                )}
              </div>
              
              <div className="flex gap-2">
                <button
                  onClick={() => toggleStar(index)}
                  className="p-2 text-gray-400 hover:text-yellow-500 transition-colors"
                  aria-label={starredQuestions.includes(index) ? "Unstar question" : "Star question"}
                >
                  <Star 
                    className={`h-4 w-4 ${starredQuestions.includes(index) ? 'fill-yellow-400 text-yellow-500' : ''}`} 
                  />
                </button>
                
                <button
                  onClick={() => copyToClipboard(item.question, index)}
                  className="p-2 text-gray-400 hover:text-blue-500 transition-colors"
                  aria-label="Copy question"
                >
                  {copiedIndex === index ? <ClipboardCheck className="h-4 w-4 text-blue-500" /> : <Clipboard className="h-4 w-4" />}
                </button>
                
                {item.details && (
                  <button
                    onClick={() => toggleExpand(index)}
                    className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                    aria-label={expandedIndex === index ? "Collapse details" : "Expand details"}
                  >
                    {expandedIndex === index ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                  </button>
                )}
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {starredQuestions.length > 0 && (
        <div className="mt-8">
          <h3 className="text-lg font-semibold text-gray-700 mb-3 flex items-center gap-2">
            <Star className="h-5 w-5 text-yellow-500 fill-yellow-200" />
            Starred Questions ({starredQuestions.length})
          </h3>
          <div className="space-y-3">
            {starredQuestions.map((index) => (
              <div key={`starred-${index}`} className="p-3 bg-yellow-50 border border-yellow-100 rounded-lg">
                <p className="text-sm font-medium text-gray-800">{questionList[index].question}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default QuestionListContainer