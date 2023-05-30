import { PRIMING_EMOTIONS } from '../constants/strings'
import { logStartedBonusRounds } from './logging'

const uuid = require('react-uuid')

const gameStateKey = 'gameState'
const highContrastKey = 'highContrast'

export type FeedbackLogElement = {
  key: string
  timestamp: number
}


type StoredGameState = {
  feedback: FeedbackLogElement[]
  guesses: string[]
  index: number
}

export const saveGameStateToLocalStorage = (gameState: StoredGameState) => {
  localStorage.setItem(gameStateKey, JSON.stringify(gameState))
}

export const loadGameStateFromLocalStorage = () => {
  const state = localStorage.getItem(gameStateKey)
  return state ? (JSON.parse(state) as StoredGameState) : null
}

const gameStatKey = 'gameStats'

export type GameStats = {
  winDistribution: number[]
  gamesFailed: number
  currentStreak: number
  bestStreak: number
  totalGames: number
  successRate: number
}

export const saveStatsToLocalStorage = (gameStats: GameStats) => {
  localStorage.setItem(gameStatKey, JSON.stringify(gameStats))
}

export const loadStatsFromLocalStorage = () => {
  const stats = localStorage.getItem(gameStatKey)
  return stats ? (JSON.parse(stats) as GameStats) : null
}


const feedbackStateKey = 'feedbackState'

export type FeedbackState = {
  highScoreMessageIndex: number
  noHighScoreMessageIndex: number
}

export const saveFeedbackStateToLocalStorage = (feedbackState: FeedbackState) => {
  localStorage.setItem(feedbackStateKey, JSON.stringify(feedbackState))
}
const tryToParse = (text: string | null): object => {
  try {
    return JSON.parse(text || '')
  } catch (e) {

  }
  return { highScoreMessageIndex: 0, noHighScoreMessageIndex: 0 }
}
export const loadFeedbackStateFromLocalStorage = (): FeedbackState => {
  const feedbackState = localStorage.getItem(feedbackStateKey)
  return tryToParse(feedbackState) as FeedbackState
}

export const saveIntroCompletedToLocalStorage = () => {
  localStorage.setItem(introCompletedKey, 'true')
}
export const loadIntroCompletedFromLocalStorage = () => {
  return localStorage.getItem(introCompletedKey)
}
const introCompletedKey = 'introCompleted'

export const saveStudyCompletedToLocalStorage = () => {
  localStorage.setItem(studyCompletedKey, 'true')
}
export const loadStudyCompletedFromLocalStorage = () => {
  return localStorage.getItem(studyCompletedKey)
}
const studyCompletedKey = 'studyCompleted'

export const saveIsBonusRoundActive = () => {
  const wasActive = localStorage.getItem(bonusRoundActiveKey)
  localStorage.setItem(bonusRoundActiveKey, 'true')
  if (!wasActive) {
    logStartedBonusRounds()
  }
}
export const getIsBonusRoundActive = () => {
  return localStorage.getItem(bonusRoundActiveKey)
}
const bonusRoundActiveKey = 'bonusRoundActive'

export const getUserID = () => {
  let userID = localStorage.getItem('userID')
  if (!userID) {
    userID = uuid()
    localStorage.setItem('userID', userID as string)
  }
  return userID
}

export const getPrimedEmotion = () => {
  let primedEmotion = localStorage.getItem('primedEmotion')
  if (!primedEmotion) {
    const params = (new URL(document.location.toString())).searchParams
    if (params.get('mightymorphin')) {
      primedEmotion = PRIMING_EMOTIONS[0]
    } else {
      primedEmotion = PRIMING_EMOTIONS[Math.floor(Math.random() * PRIMING_EMOTIONS.length)]
    }
    localStorage.setItem('primedEmotion', primedEmotion as string)
  }
  return primedEmotion
}

export const getHasEnhancedFeedback = () => {
  // let hasEnhancedFeedback = localStorage.getItem('enhancedFeedback')
  // if (!hasEnhancedFeedback) {
  //   const params = (new URL(document.location.toString())).searchParams
  //   if (params.get('mightymorphin')) {
  //     hasEnhancedFeedback = 'true'
  //   } else {
  //     //hasEnhancedFeedback = Math.random() < 0.5 ? 'true' : 'false'
  //     hasEnhancedFeedback = 'true'
  //   }
  //   localStorage.setItem('enhancedFeedback', hasEnhancedFeedback)
  // }
  // return hasEnhancedFeedback == 'true'
  return true
}

export const getUserData = () => {
  const params = (new URL(document.location.toString())).searchParams
  const userData = {
    user_id: getUserID(),
    prolific_pid: getProlificID(),
    study_id: params.get('study_id') || params.get('STUDY_ID'),
    session_id: params.get('session_id') || params.get('SESSION_ID'),
    primed_emotion: getPrimedEmotion(),
    has_enhanced_feedback: getHasEnhancedFeedback()
  }
  return userData
}

const preSurveyData = {}
export const addPreSurveyData = (d: object) => {
  Object.assign(preSurveyData, d)
}
export const getPreSurveyData = () => {
  return preSurveyData
}

const postSurveyData = {}
export const addPostSurveyData = (d: object) => {
  Object.assign(postSurveyData, d)
}
export const getPostSurveyData = () => {
  return postSurveyData
}

export const setStoredIsHighContrastMode = (isHighContrast: boolean) => {
  if (isHighContrast) {
    localStorage.setItem(highContrastKey, '1')
  } else {
    localStorage.removeItem(highContrastKey)
  }
}

export const getStoredIsHighContrastMode = () => {
  const highContrast = localStorage.getItem(highContrastKey)
  return highContrast === '1'
}


export const saveProlificID = () => {
  const params = (new URL(document.location.toString())).searchParams
  const pid = params.get('prolific_pid') || params.get('PROLIFIC_PID')
  if (pid) {
    localStorage.setItem('prolific_pid', pid as string)
  }
}
saveProlificID()
export const getProlificID = () => {
  const params = (new URL(document.location.toString())).searchParams
  const pid = params.get('prolific_pid') || params.get('PROLIFIC_PID')
  if (pid) {
    return pid
  }
  return localStorage.getItem('prolific_pid') || ''
}
