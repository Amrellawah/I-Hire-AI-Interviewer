import { Lightbulb, Volume2, Download } from 'lucide-react';
import React from 'react';
import * as XLSX from 'xlsx';

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
    <div className='p-5 border rounded-lg my-10'>

      {/* Questions List */}
      <div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5'>
        {mockInterviewQuestion.map((question, index) => (
          <h2
            key={index}
            className={`p-2 bg-secondary rounded-full
              text-xs md:text-sm text-center cursor-pointer
              ${activeQuestionIndex === index && 'bg-red-100 text-primary font-bold'}`}
          >
            Question #{index + 1}
          </h2>
        ))}
      </div>

      {/* Active Question */}
      <h2 className='my-5 text-md md:text-lg'>
        {mockInterviewQuestion[activeQuestionIndex]?.question}
      </h2>

      {/* Speak Button */}
      <Volume2
        className='cursor-pointer'
        onClick={() => textToSpeech(mockInterviewQuestion[activeQuestionIndex]?.question)}
      />

      {/* Note Section */}
      <div className='border rounded-lg p-5 bg-primary mt-20'>
        <h2 className='flex gap-2 items-center text-yellow-500'>
          <Lightbulb />
          <strong>Note:</strong>
        </h2>
        <h2 className='text-sm text-yellow-500 my-2'>
          {process.env.NEXT_PUBLIC_QUESTION_NOTE}
        </h2>
      </div>

      {/* Download Button (Moved to Bottom) */}
      <div className="flex justify-center mt-10">
        <button
          onClick={downloadQuestionsAsExcel}
          className="flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary/90"
        >
          <Download className="w-4 h-4" />
          Download Questions
        </button>
      </div>

    </div>
  );
}

export default QuestionsSection;
