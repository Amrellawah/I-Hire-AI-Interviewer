import { v4 as uuidv4 } from 'uuid';
import moment from 'moment';

/**
 * Generate a unique session ID for each interview attempt
 * @param {string} userEmail - User's email address
 * @param {string} mockId - Interview ID
 * @returns {string} Unique session ID
 */
export const generateSessionId = (userEmail, mockId) => {
  const timestamp = moment().format('YYYYMMDD_HHmmss');
  const randomId = uuidv4().substring(0, 8);
  return `${userEmail}_${mockId}_${timestamp}_${randomId}`;
};

/**
 * Check if a question has been answered in the current session
 * @param {Array} answers - Array of user answers
 * @param {number} questionIndex - Index of the question
 * @param {string} sessionId - Current session ID
 * @returns {boolean} True if answered, false otherwise
 */
export const isQuestionAnswered = (answers, questionIndex, sessionId) => {
  const answer = answers.find(a => 
    a.questionIndex === questionIndex && 
    a.sessionId === sessionId && 
    a.isAnswered === true
  );
  return !!answer;
};

/**
 * Check if a question has been skipped in the current session
 * @param {Array} answers - Array of user answers
 * @param {number} questionIndex - Index of the question
 * @param {string} sessionId - Current session ID
 * @returns {boolean} True if skipped, false otherwise
 */
export const isQuestionSkipped = (answers, questionIndex, sessionId) => {
  const answer = answers.find(a => 
    a.questionIndex === questionIndex && 
    a.sessionId === sessionId && 
    a.isSkipped === true
  );
  return !!answer;
};

/**
 * Get the current answer for a question in the session
 * @param {Array} answers - Array of user answers
 * @param {number} questionIndex - Index of the question
 * @param {string} sessionId - Current session ID
 * @returns {Object|null} Answer object or null if not found
 */
export const getCurrentAnswer = (answers, questionIndex, sessionId) => {
  return answers.find(a => 
    a.questionIndex === questionIndex && 
    a.sessionId === sessionId
  ) || null;
};

/**
 * Calculate progress for the current session
 * @param {Array} answers - Array of user answers
 * @param {string} sessionId - Current session ID
 * @param {number} totalQuestions - Total number of questions
 * @returns {Object} Progress object with answered, skipped, and total counts
 */
export const calculateSessionProgress = (answers, sessionId, totalQuestions) => {
  const sessionAnswers = answers.filter(a => a.sessionId === sessionId);
  const answered = sessionAnswers.filter(a => a.isAnswered).length;
  const skipped = sessionAnswers.filter(a => a.isSkipped).length;
  
  return {
    answered,
    skipped,
    total: totalQuestions,
    progress: Math.round(((answered + skipped) / totalQuestions) * 100)
  };
}; 