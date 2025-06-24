import { Lightbulb, Volume2, Download } from 'lucide-react';
import React from 'react';
import * as XLSX from 'xlsx';
import { Tooltip, TooltipProvider } from '@/components/ui/tooltip';

function QuestionsSection({ mockInterviewQuestion, activeQuestionIndex }) {

  const textToSpeech = (text) => {
    if ('speechSynthesis' in window) {
      const speech = new SpeechSynthesisUtterance(text);
      window.speechSynthesis.speak(speech);
    } else {
      alert('Sorry, your browser does not support text to speech');
    }
  };

  const downloadQuestionsAsExcel = () => {
    if (!mockInterviewQuestion || mockInterviewQuestion.length === 0) return;

    const data = mockInterviewQuestion.map((question, index) => ({
      "Question Number": index + 1,
      "Question Text": question.question,
    }));

    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Questions');

    XLSX.writeFile(workbook, 'Interview_Questions.xlsx');
  };

  return mockInterviewQuestion && (
    <TooltipProvider>
      <div className='p-8 border rounded-2xl my-10 bg-white shadow-lg'>
        {/* Questions List */}
        <div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-6'>
          {mockInterviewQuestion.map((question, index) => (
            <button
              key={index}
              className={`transition-all px-4 py-2 rounded-full text-xs md:text-sm font-semibold shadow-sm border
                ${activeQuestionIndex === index
                  ? 'bg-gradient-to-r from-[#be3144] to-[#f05941] text-white border-[#be3144] scale-105'
                  : 'bg-gray-100 text-gray-700 border-transparent hover:bg-[#f1e9ea] hover:text-[#be3144]'}
              `}
              style={{ outline: activeQuestionIndex === index ? '2px solid #be3144' : 'none' }}
              tabIndex={0}
              aria-current={activeQuestionIndex === index}
            >
              Question #{index + 1}
            </button>
          ))}
        </div>
        <div className="border-b border-gray-200 mb-6" />
        {/* Active Question */}
        <div className="flex items-center gap-3 mb-4">
          <h2 className='text-lg font-bold text-gray-900'>{mockInterviewQuestion[activeQuestionIndex]?.question}</h2>
          <Tooltip content="Read aloud">
            <Volume2
              className='cursor-pointer text-primary hover:text-[#be3144] transition'
              onClick={() => textToSpeech(mockInterviewQuestion[activeQuestionIndex]?.question)}
              aria-label="Read question aloud"
            />
          </Tooltip>
        </div>
        {/* Note Section */}
        <div className='flex items-start gap-3 bg-yellow-50 border-l-4 border-yellow-400 rounded-xl p-5 my-8 shadow-sm'>
          <Lightbulb className='h-6 w-6 text-yellow-500 mt-1' />
          <div>
            <h2 className='font-bold text-yellow-700 mb-1'>Note:</h2>
            <p className='text-yellow-700 text-sm'>{process.env.NEXT_PUBLIC_QUESTION_NOTE || 'Click on Record Answer when you want to answer the question.'}</p>
          </div>
        </div>
        {/* Download Button */}
        <div className="flex justify-center mt-8">
          <Tooltip content="Download all questions as Excel">
            <button
              onClick={downloadQuestionsAsExcel}
              className="flex items-center gap-2 bg-gradient-to-r from-[#be3144] to-[#f05941] text-white px-6 py-3 rounded-lg font-semibold shadow-md hover:scale-105 hover:shadow-lg transition"
            >
              <Download className="w-5 h-5" />
              Download Questions
            </button>
          </Tooltip>
        </div>
      </div>
    </TooltipProvider>
  );
}

export default QuestionsSection;
