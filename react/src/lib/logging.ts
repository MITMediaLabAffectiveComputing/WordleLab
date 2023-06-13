import axios from 'axios'
import qs from 'querystring'
import { FeedbackLogElement, getIsBonusRoundActive, getUserID } from './localStorage'


export const logGuess = (guess: string, guesses: string[], wasValid: boolean, solution: string, roundIndex: number, prompt: string, ChatGPTStatus: boolean, onSuccess: (response: any) => any) => {
  axios.post('/api/logguess/', qs.stringify({
    user_id: getUserID(),
    guess: guess,
    guesses: JSON.stringify(guesses),
    wasValid: wasValid,
    roundIndex: roundIndex,
    solution: solution,
    timestamp: Date.now(),
    prompt: prompt,
    ChatGPTStatus: ChatGPTStatus
  }))
    .then(function(response) {
      onSuccess(response.data)
    })
    .catch(function(error) {
      console.error(error)
    })
}

export const logRoundComplete = (guesses: string[], feedbackLog: FeedbackLogElement[], didWin: boolean, solution: string, roundIndex: number) => {
  axios.post('/api/logroundend/', qs.stringify({
    user_id: getUserID(),
    guesses: JSON.stringify(guesses),
    feedbackLog: JSON.stringify(feedbackLog),
    didWin: didWin,
    solution: solution,
    roundIndex: roundIndex,
    wasBonusRound: getIsBonusRoundActive(),
    timestamp: Date.now()
  }))
    .then(function(response) {
    })
    .catch(function(error) {
      console.error(error)
    })
}

export const logStartedBonusRounds = () => {
  axios.post('/api/startedbonusrounds/', qs.stringify({
    user_id: getUserID(),
    timestamp: Date.now()
  }))
    .then(function(response) {
    })
    .catch(function(error) {
      console.error(error)
    })
}

let canLogSurveyEvents = false
export const markCanLogSurveyEvents = () => {
  canLogSurveyEvents = true
}

export const presurvey_events = []
export const logPresurveyEvent = (modalName: string, isOpen: boolean) => {
  if (!canLogSurveyEvents) {
    return
  }
  // @ts-ignore
  presurvey_events.push({ 'event': `${modalName}_${isOpen ? 'open' : 'close'}`, 'timestamp': Date.now() })
}
export const logPresurveySendEvent = () => {
  // @ts-ignore
  presurvey_events.push({ 'event': 'upload', 'timestamp': Date.now() })
}

export const postsurvey_events = []
export const logPostsurveyEvent = (modalName: string, isOpen: boolean) => {
  if (!canLogSurveyEvents) {
    return
  }
  // @ts-ignore
  postsurvey_events.push({ 'event': `${modalName}_${isOpen ? 'open' : 'close'}`, 'timestamp': Date.now() })
}
export const logPostsurveySendEvent = () => {
  // @ts-ignore
  postsurvey_events.push({ 'event': 'upload', 'timestamp': Date.now() })
}
