import moment from 'moment'
import React from 'react'
import CandidateFeedbackDialog from './CandidateFeedbackDialog'

function CandidateList({ candidateList }) {
  // Helper function to calculate average score
  const calculateAverageScore = (candidate) => {
    const feedback = candidate?.feedback?.feedback || {};
    const ratings = [
      feedback?.rating?.technicalSkills || 0,
      feedback?.rating?.communication || 0,
      feedback?.rating?.problemSolving || 0,
      feedback?.rating?.experience || 0
    ];
    
    const sum = ratings.reduce((total, score) => total + score, 0);
    const average = ratings.length > 0 ? (sum / ratings.length).toFixed(1) : 0;
    return average;
  };

  return (
    <div className='space-y-4 mt-5'>
      <h2 className='text-xl font-bold text-gray-800 mb-6'>Candidates ({candidateList?.length || 0})</h2>
      
      {candidateList?.length > 0 ? (
        <div className='space-y-3'>
          {candidateList.map((candidate, index) => {
            const averageScore = calculateAverageScore(candidate);
            const percentage = (averageScore / 10) * 100;
            
            return (
              <div 
                key={index} 
                className='p-4 flex items-center justify-between bg-white rounded-lg border border-gray-200 hover:border-red-200 transition-colors duration-200 shadow-sm hover:shadow-md'
              >
                <div className='flex items-center gap-4'>
                  <div className='flex-shrink-0 h-12 w-12 bg-gradient-to-r from-red-600 to-red-500 rounded-full flex items-center justify-center text-white font-bold text-lg'>
                    {candidate.userName?.[0]?.toUpperCase() || 'A'}
                  </div>
                  <div>
                    <h2 className='font-semibold text-gray-800'>{candidate?.userName || 'Anonymous Candidate'}</h2>
                    <div className='flex items-center gap-2 mt-1'>
                      <span className='text-sm text-gray-500'>
                        Completed: {moment(candidate?.createAt).format('MMM DD, YYYY')}
                      </span>
                      <span className='text-xs text-gray-400'>•</span>
                      <span className='text-sm text-gray-500'>
                        {moment(candidate?.createAt).format('h:mm A')}
                      </span>
                    </div>
                  </div>
                </div>
                
                <div className='flex items-center gap-4'>
                  <div className='flex items-center gap-2'>
                    <span className='text-lg font-semibold text-gray-800'>
                      {averageScore}/10
                    </span>
                    <div className='h-2 w-20 bg-gray-200 rounded-full overflow-hidden'>
                      <div 
                        className='h-full bg-gradient-to-r from-green-400 to-green-500' 
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                  <CandidateFeedbackDialog candidate={candidate} />
                </div>
              </div>
            )
          })}
        </div>
      ) : (
        <div className='p-8 text-center bg-gray-50 rounded-lg border border-gray-200'>
          <p className='text-gray-500'>No candidates have completed this interview yet</p>
        </div>
      )}
    </div>
  )
}

export default CandidateList