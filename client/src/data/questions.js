// All 25 assessment questions
// PSS questions: items at index 3,4,6,7 (0-based) are reverse-scored
export const PSS_QUESTIONS = [
  { id:'pss_1',  domain:'pss', isReversed:false, text:'How often have you been upset because of something that happened unexpectedly?', options:['Never','Almost Never','Sometimes','Fairly Often','Very Often'] },
  { id:'pss_2',  domain:'pss', isReversed:false, text:'How often have you felt unable to control the important things in your life?',        options:['Never','Almost Never','Sometimes','Fairly Often','Very Often'] },
  { id:'pss_3',  domain:'pss', isReversed:false, text:'How often have you felt nervous and stressed?',                                        options:['Never','Almost Never','Sometimes','Fairly Often','Very Often'] },
  { id:'pss_4',  domain:'pss', isReversed:true,  text:'How often have you felt confident about your ability to handle your personal problems?', options:['Never','Almost Never','Sometimes','Fairly Often','Very Often'] },
  { id:'pss_5',  domain:'pss', isReversed:true,  text:'How often have you felt that things were going your way?',                             options:['Never','Almost Never','Sometimes','Fairly Often','Very Often'] },
  { id:'pss_6',  domain:'pss', isReversed:false, text:'How often have you been unable to cope with all the things you had to do?',             options:['Never','Almost Never','Sometimes','Fairly Often','Very Often'] },
  { id:'pss_7',  domain:'pss', isReversed:true,  text:'How often have you been able to control irritations in your life?',                     options:['Never','Almost Never','Sometimes','Fairly Often','Very Often'] },
  { id:'pss_8',  domain:'pss', isReversed:true,  text:'How often have you felt that you were on top of things?',                              options:['Never','Almost Never','Sometimes','Fairly Often','Very Often'] },
  { id:'pss_9',  domain:'pss', isReversed:false, text:'How often have you been angered because of things that were outside your control?',     options:['Never','Almost Never','Sometimes','Fairly Often','Very Often'] },
  { id:'pss_10', domain:'pss', isReversed:false, text:'How often have you felt difficulties were piling up so high you could not overcome them?', options:['Never','Almost Never','Sometimes','Fairly Often','Very Often'] },
];

export const WORKLOAD_QUESTIONS = [
  { id:'work_1', domain:'workload', isReversed:false, text:'How often do you feel overwhelmed by your academic workload?',            options:['Never','Rarely','Sometimes','Often','Always'] },
  { id:'work_2', domain:'workload', isReversed:false, text:'How often do you struggle to meet academic deadlines?',                   options:['Never','Rarely','Sometimes','Often','Always'] },
  { id:'work_3', domain:'workload', isReversed:false, text:'How often do you feel the amount of coursework is unreasonable?',          options:['Never','Rarely','Sometimes','Often','Always'] },
  { id:'work_4', domain:'workload', isReversed:false, text:'How many hours per day do you study outside of class?',                   options:['< 1 hour','1–3 hours','3–5 hours','5–7 hours','> 7 hours'] },
  { id:'work_5', domain:'workload', isReversed:false, text:'How often do you feel pressure from upcoming exams or tests?',             options:['Never','Rarely','Sometimes','Often','Always'] },
];

// Sleep questions are POSITIVE scale (0=worst, 4=best) → backend INVERTS them
export const SLEEP_QUESTIONS = [
  { id:'sleep_1', domain:'sleep', isReversed:false, text:'How would you rate your overall sleep quality?',                         options:['Very Poor','Poor','Fair','Good','Excellent'] },
  { id:'sleep_2', domain:'sleep', isReversed:false, text:'On average, how many hours of sleep do you get per night?',             options:['< 4 hours','4–5 hours','5–6 hours','6–7 hours','7+ hours'] },
  { id:'sleep_3', domain:'sleep', isReversed:false, text:'How often do you wake up feeling well-rested?',                         options:['Never','Rarely','Sometimes','Often','Always'] },
  { id:'sleep_4', domain:'sleep', isReversed:false, text:'How consistent is your sleep schedule (same bed/wake time)?',           options:['Very Inconsistent','Inconsistent','Somewhat Consistent','Consistent','Very Consistent'] },
  { id:'sleep_5', domain:'sleep', isReversed:false, text:'How easy is it for you to fall asleep at night?',                      options:['Very Difficult','Difficult','Moderate','Easy','Very Easy'] },
];

export const PEER_QUESTIONS = [
  { id:'peer_1', domain:'peer', isReversed:false, text:'How often do you compare your academic performance to your peers?',           options:['Never','Rarely','Sometimes','Often','Always'] },
  { id:'peer_2', domain:'peer', isReversed:false, text:'How much do family expectations about your grades stress you out?',           options:['Not at all','Slightly','Moderately','Quite a bit','Extremely'] },
  { id:'peer_3', domain:'peer', isReversed:false, text:'How often do you feel anxious about others judging your academic performance?',options:['Never','Rarely','Sometimes','Often','Always'] },
  { id:'peer_4', domain:'peer', isReversed:false, text:'How often does competition with classmates cause you stress?',                options:['Never','Rarely','Sometimes','Often','Always'] },
  { id:'peer_5', domain:'peer', isReversed:false, text:'How often does your social life suffer because of academic demands?',          options:['Never','Rarely','Sometimes','Often','Always'] },
];

export const ALL_STEPS = [
  { label: 'Perceived Stress', icon: '🧠', questions: PSS_QUESTIONS,      color: 'primary'   },
  { label: 'Academic Workload', icon: '📚', questions: WORKLOAD_QUESTIONS, color: 'secondary' },
  { label: 'Sleep Quality',     icon: '😴', questions: SLEEP_QUESTIONS,    color: 'primary'   },
  { label: 'Peer & Social',     icon: '👥', questions: PEER_QUESTIONS,     color: 'secondary' },
];

export const stressMeta = (category) => ({
  Low:      { color: '#52B788', bg: 'bg-green-50',  badge: 'stress-badge-low',      icon: '😊', message: 'Your stress levels are well managed. Keep it up!' },
  Moderate: { color: '#F4C543', bg: 'bg-yellow-50', badge: 'stress-badge-moderate', icon: '😐', message: 'Some stress is present. Small changes can help significantly.' },
  High:     { color: '#F4874B', bg: 'bg-orange-50', badge: 'stress-badge-high',     icon: '😟', message: 'High stress detected. Act on the recommendations below.' },
  Severe:   { color: '#E05C5C', bg: 'bg-red-50',    badge: 'stress-badge-severe',   icon: '😰', message: 'Severe stress. Please prioritise self-care and seek support.' },
}[category] || { color: '#4A90D9', bg: 'bg-blue-50', badge: '', icon: '📊', message: '' });
