import moment from 'moment'
import React from 'react'
import VideoCandidateFeedbackDialog from './VideoCandidateFeedbackDialog'

function VideoCandidateList({ candidateList }) {
  // Helper function to calculate average score for a candidate
  const calculateAverageScore = (candidate) => {
    if (!candidate.answers || candidate.answers.length === 0) return 0;
    
    const ratings = candidate.answers.map(answer => {
      const rating = parseInt(answer.rating) || 0;
      return rating;
    });
    
    const sum = ratings.reduce((total, score) => total + score, 0);
    const average = ratings.length > 0 ? (sum / ratings.length).toFixed(1) : 0;
    return average;
  };

  return (
    <div className='space-y-3 sm:space-y-4 mt-4 sm:mt-5'>
      <h2 className='text-lg sm:text-xl font-bold text-gray-800 mb-4 sm:mb-6'>
        Candidates ({candidateList?.length || 0})
      </h2>
      
      {candidateList?.length > 0 ? (
        <div className='space-y-2 sm:space-y-3'>
          {candidateList.map((candidate, index) => {
            const averageScore = calculateAverageScore(candidate);
            const percentage = (averageScore / 10) * 100;
            const completedQuestions = candidate.answers?.length || 0;
            
            return (
              <div 
                key={index} 
                className='p-3 sm:p-4 flex flex-col sm:flex-row sm:items-center justify-between bg-white rounded-lg border border-gray-200 hover:border-red-200 transition-colors duration-200 shadow-sm hover:shadow-md'
              >
                <div className='flex items-center gap-3 sm:gap-4 mb-3 sm:mb-0'>
                  <div className='flex-shrink-0 h-10 w-10 sm:h-12 sm:w-12 bg-gradient-to-r from-blue-600 to-blue-500 rounded-full flex items-center justify-center text-white font-bold text-base sm:text-lg'>
                    {candidate.userName?.[0]?.toUpperCase() || 'A'}
                  </div>
                  <div>
                    <h2 className='font-semibold text-gray-800 text-sm sm:text-base'>
                      {candidate?.userName || 'Anonymous Candidate'}
                    </h2>
                    <div className='flex items-center gap-1 sm:gap-2 mt-0.5 sm:mt-1 flex-wrap'>
                      <span className='text-xs sm:text-sm text-gray-500'>
                        Completed: {moment(candidate?.createAt, 'DD-MM-YYYY').format('MMM DD, YYYY')}
                      </span>
                      <span className='text-xs text-gray-400 hidden sm:inline'>•</span>
                      <span className='text-xs sm:text-sm text-gray-500'>
                        {completedQuestions} Questions Answered
                      </span>
                    </div>
                  </div>
                </div>
                
                <div className='flex items-center justify-between sm:justify-end gap-2 sm:gap-4 border-t pt-3 sm:pt-0 sm:border-t-0'>
                  <div className='flex items-center gap-1 sm:gap-2'>
                    <span className='text-base sm:text-lg font-semibold text-gray-800'>
                      {averageScore}/10
                    </span>
                    <div className='h-2 w-12 sm:w-20 bg-gray-200 rounded-full overflow-hidden'>
                      <div 
                        className='h-full bg-gradient-to-r from-green-400 to-green-500' 
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                  <VideoCandidateFeedbackDialog candidate={candidate} />
                </div>
              </div>
            )
          })}
        </div>
      ) : (
        <div className='p-4 sm:p-8 text-center bg-gray-50 rounded-lg border border-gray-200'>
          <p className='text-sm sm:text-base text-gray-500'>
            No candidates have completed this video interview yet
          </p>
        </div>
      )}
    </div>
  )
}

export default VideoCandidateList 