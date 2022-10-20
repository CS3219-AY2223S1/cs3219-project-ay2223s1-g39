const URI_USER_SVC = process.env.REACT_APP_URI_USER_SVC || 'http://localhost:8000'

const URI_QUESTION_SVC = process.env.REACT_APP_URI_QUESTION_SVC || 'http://localhost:8002';

const URI_HISTORY_SVC = process.env.REACT_APP_URI_HISTORY_SVC || 'http://localhost:8003';

const URI_TWILIO_SVC = process.env.REACT_APP_URI_TWILIO_SVC || 'http://localhost:3001'

const PREFIX_USER_SVC = '/api/user'

const PREFIX_QUESTION_SVC = '/api/question'

const PREFIX_HISTORY_SVC = '/api/history'

const PREFIX_TWILIO_SVC = '/tokens'

export const URL_USER_SVC = URI_USER_SVC + PREFIX_USER_SVC
export const URL_QUESTION_SVC = URI_QUESTION_SVC + PREFIX_QUESTION_SVC
export const URL_HISTORY_SVC = URI_HISTORY_SVC + PREFIX_HISTORY_SVC 
export const URL_TWILIO_SVC = URI_TWILIO_SVC + PREFIX_TWILIO_SVC
