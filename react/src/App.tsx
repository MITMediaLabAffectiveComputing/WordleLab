import { useEffect, useState } from 'react'
import { Grid } from './components/grid/Grid'
import { Keyboard } from './components/keyboard/Keyboard'
import { InfoModal } from './components/modals/InfoModal'
import { StatsModal } from './components/modals/StatsModal'
import { SettingsModal } from './components/modals/SettingsModal'
import useWindowSize from 'react-use/lib/useWindowSize'
import Confetti from 'react-confetti'
import {
  GAME_COPIED_MESSAGE,
  HARD_MODE_ALERT_MESSAGE,
  NOT_ENOUGH_LETTERS_MESSAGE,
  WORD_NOT_FOUND_MESSAGE
} from './constants/strings'
import { GAME_LOST_INFO_DELAY, MAX_CHALLENGES, MAX_WORD_LENGTH, REVEAL_TIME_MS } from './constants/settings'
import { findFirstUnusedReveal, getSolution, isWinningWord, isWordInWordList, unicodeLength } from './lib/words'
import { addStatsForCompletedGame, loadStats } from './lib/stats'
import {
  FeedbackLogElement,
  getHasEnhancedFeedback,
  getIsBonusRoundActive,
  getStoredIsHighContrastMode,
  loadGameStateFromLocalStorage,
  loadIntroCompletedFromLocalStorage,
  loadStudyCompletedFromLocalStorage,
  saveGameStateToLocalStorage,
  saveIntroCompletedToLocalStorage,
  saveIsBonusRoundActive,
  saveStudyCompletedToLocalStorage,
  setStoredIsHighContrastMode
} from './lib/localStorage'
import { default as GraphemeSplitter } from 'grapheme-splitter'

import './App.css'
import { AlertContainer } from './components/alerts/AlertContainer'
import { useAlert } from './context/AlertContext'
import { Navbar } from './components/navbar/Navbar'
import { GameFinishedModal } from './components/modals/GameFinishedModal'
import { IntroModal } from './components/modals/presurvey/IntroModal'
import { PreSurveyModal } from './components/modals/presurvey/PreSurveyModal'
import { EmotionPrimeModalOne } from './components/modals/presurvey/EmotionPrimeModalOne'
import { EmotionPrimeModalTwo } from './components/modals/presurvey/EmotionPrimeModalTwo'
import { PreSurveyCompleteModal } from './components/modals/presurvey/PreSurveyCompleteModal'
import { PostSurveyIntroModal } from './components/modals/postsurvey/PostSurveyIntroModal'
import { PostSurveyCognitiveTestModal } from './components/modals/postsurvey/PostSurveyCognitiveTestModal'
import { StudyCompletedModal } from './components/modals/postsurvey/StudyCompletedModal'
import { BonusRoundIntroModal } from './components/modals/postsurvey/BonusRoundIntroModal'
import { logGuess, logRoundComplete } from './lib/logging'
import { ModalBackground } from './components/modals/ModalBackground'
import { FeedbackMessage } from './components/FeedbackMessage'
import { PostSurveyEmotionalStateModal } from './components/modals/postsurvey/PostSurveyEmotionalStateModal'

import {prompt} from './components/FeedbackMessage'

let Mesagee = "Enjoy Wordle - you've got this!"
let PrevMesage = "Enjoy Wordle - you've got this!"

export const onTextChange = () => {
  PrevMesage = Mesagee
}

function App() {
  const { width, height } = useWindowSize()

  const prefersDarkMode = window.matchMedia(
    '(prefers-color-scheme: dark)'
  ).matches

  const { showError: showErrorAlert, showSuccess: showSuccessAlert } =
    useAlert()
  const [currentGuess, setCurrentGuess] = useState('')
  const [isGameWon, setIsGameWon] = useState(false)
  const [isGameActive, setIsGameActive] = useState(true)
  const [isIntroModalOpen, setIsIntroModalOpen] = useState(false)
  const [isPreSurveyModalOpen, setIsPreSurveyModalOpen] = useState(false)
  const [isEmotionPrimeModalOneOpen, setIsEmotionPrimeModalOneOpen] = useState(false)
  const [isEmotionPrimeModalTwoOpen, setIsEmotionPrimeModalTwoOpen] = useState(false)
  const [isPreSurveyCompleteModalOpen, setIsPreSurveyCompleteModalOpen] = useState(false)

  const [invalidGuessCount, setInvalidGuessCount] = useState(0)

  const [isPostSurveyIntroModalOpen, setIsPostSurveyIntroModalOpen] = useState(false)
  const [isPostSurveyEmotionalStateModalOpen, setIsPostSurveyEmotionalStateModalOpen] = useState(false)
  const [isPostSurveyCognitiveTestOpen, setIsPostSurveyCognitiveTestOpen] = useState(false)
  const [isStudyCompletedModalOpen, setIsStudyCompletedModalOpen] = useState(false)
  const [isBonusRoundIntroModalOpen, setIsBonusRoundIntroModalOpen] = useState(false)
  const [isConfettiRunning, setIsConfettiRunning] = useState(false)

  //API STATE
  const [isCallingtotheBackend, setisCallingtotheBackend] = useState(false)
  let TextStatus = true
  let AI_text_status = true

  //handle api return
  const onSuccess = (resp: any) => {
    PrevMesage = Mesagee
    Mesagee = resp
    setisCallingtotheBackend(false)
  }

  const [isInfoModalOpen, setIsInfoModalOpen] = useState(false)
  const [isStatsModalOpen, setIsStatsModalOpen] = useState(false)
  const [isGameFinishedModalOpen, setIsGameFinishedModalOpen] = useState(false)
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false)
  const [currentRowClass, setCurrentRowClass] = useState('')
  const [isGameLost, setIsGameLost] = useState(false)
  const [isDarkMode, setIsDarkMode] = useState(
    localStorage.getItem('theme')
      ? localStorage.getItem('theme') === 'dark'
      : prefersDarkMode
        ? true
        : false
  )
  const [isHighContrastMode, setIsHighContrastMode] = useState(
    getStoredIsHighContrastMode()
  )


  const [isRevealing, setIsRevealing] = useState(false)
  const [feedbackLog, setFeedbackLog] = useState([] as FeedbackLogElement[])
  const [guesses, setGuesses] = useState<string[]>(() => {
    const loaded = loadGameStateFromLocalStorage()
    const solution = getSolution()
    if (loaded == null) {
      setFeedbackLog([])
      return []
    }
    const gameWasWon = loaded.guesses.includes(solution)
    if (gameWasWon) {
      setIsGameWon(true)
    }
    if (loaded.guesses.length === MAX_CHALLENGES && !gameWasWon) {
      setIsGameLost(true)
      // showErrorAlert(CORRECT_WORD_MESSAGE(solution), {
      //   persist: true,
      // })
    }
    setFeedbackLog(loaded.feedback || [])
    return loaded.guesses
  })
  const [currentSolutionIndex, setCurrentSolutionIndex] = useState<number>(() => {
    const loaded = loadGameStateFromLocalStorage()
    if (loaded == null) {
      return 0
    }
    return loaded.index
  })

  const [stats, setStats] = useState(() => loadStats())

  const [isHardMode, setIsHardMode] = useState(
    localStorage.getItem('gameMode')
      ? localStorage.getItem('gameMode') === 'hard'
      : false
  )

  const [isIdle, setIsIdle] = useState(false)
  const [showedIdleThisRound, setShowedIdleThisRound] = useState(false)

  
  useEffect(() => {
    setIsIdle(false)
    if (!isGameActive || showedIdleThisRound) {
      return
    }
    const timer = setTimeout(() => {
      setIsIdle(true)
      setShowedIdleThisRound(true)
    }, 90 * 1000)
    return () => clearTimeout(timer)
  }, [isGameActive, guesses])
  useEffect(() => {
    setShowedIdleThisRound(false)
  }, [currentSolutionIndex])

  const isModalOpen = isIntroModalOpen ||
    isPreSurveyModalOpen ||
    isEmotionPrimeModalOneOpen ||
    isEmotionPrimeModalTwoOpen ||
    isPreSurveyCompleteModalOpen ||
    isPostSurveyIntroModalOpen ||
    isPostSurveyEmotionalStateModalOpen ||
    isPostSurveyCognitiveTestOpen ||
    isStudyCompletedModalOpen ||
    isBonusRoundIntroModalOpen ||
    isInfoModalOpen ||
    isStatsModalOpen ||
    isGameFinishedModalOpen ||
    isSettingsModalOpen

  useEffect(() => {
    if (!loadIntroCompletedFromLocalStorage()) {
      setIsIntroModalOpen(true)
      setIsGameActive(false)
      return
    }
    if (getIsBonusRoundActive()) {
      setIsBonusRoundIntroModalOpen(true)
      return
    }
    if (loadStudyCompletedFromLocalStorage()) {
      setIsStudyCompletedModalOpen(true)
      setIsGameActive(false)
      setIsConfettiRunning(true)
      return
    }

    const gamestate = loadGameStateFromLocalStorage()
    if (!gamestate || (gamestate.index == 0 && !gamestate.guesses.length)) {
      setTimeout(() => {
        setIsInfoModalOpen(true)
      }, 0)
    }
  }, [])

  const onFeedback = (key: string) => {
    if (feedbackLog == undefined) {
      return
    }
    if (feedbackLog.length > 0 && feedbackLog[feedbackLog.length - 1].key == key) {
      // if it shows the same message twice in a row, no need to log it.
      return
    }
    setFeedbackLog([...feedbackLog, { key: key, timestamp: new Date().getTime() }])
  }

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }

    if (isHighContrastMode) {
      document.documentElement.classList.add('high-contrast')
    } else {
      document.documentElement.classList.remove('high-contrast')
    }
  }, [isDarkMode, isHighContrastMode])

  const handleDarkMode = (isDark: boolean) => {
    setIsDarkMode(isDark)
    localStorage.setItem('theme', isDark ? 'dark' : 'light')
  }

  const handleHardMode = (isHard: boolean) => {
    if (guesses.length === 0 || localStorage.getItem('gameMode') === 'hard') {
      setIsHardMode(isHard)
      localStorage.setItem('gameMode', isHard ? 'hard' : 'normal')
    } else {
      showErrorAlert(HARD_MODE_ALERT_MESSAGE)
    }
  }

  const handleHighContrastMode = (isHighContrast: boolean) => {
    setIsHighContrastMode(isHighContrast)
    setStoredIsHighContrastMode(isHighContrast)
  }

  const clearCurrentRowClass = () => {
    setCurrentRowClass('')
  }

  useEffect(() => {
    saveGameStateToLocalStorage({ guesses: guesses, index: currentSolutionIndex, feedback: feedbackLog })
  }, [guesses, currentSolutionIndex])

  useEffect(() => {
    if (isGameWon) {
      const delayMs = REVEAL_TIME_MS * MAX_WORD_LENGTH

      setTimeout(() => {
        if (!loadStudyCompletedFromLocalStorage() || getIsBonusRoundActive()) {
          // setIsConfettiRunning(true)
          setIsGameFinishedModalOpen(true)
          setIsBonusRoundIntroModalOpen(false)
        }
      }, delayMs)
    }

    if (isGameLost) {
      setTimeout(() => {
        if (!loadStudyCompletedFromLocalStorage() || getIsBonusRoundActive()) {
          setIsGameFinishedModalOpen(true)
        }
      }, GAME_LOST_INFO_DELAY)
    }
  }, [isGameWon, isGameLost, showSuccessAlert])

  const onChar = (value: string) => {
    if (!isGameActive) {
      return
    }
    if (
      unicodeLength(`${currentGuess}${value}`) <= MAX_WORD_LENGTH &&
      guesses.length < MAX_CHALLENGES &&
      !isGameWon
    ) {
      setCurrentGuess(`${currentGuess}${value}`)
    }
  }

  const onDelete = () => {
    setCurrentGuess(
      new GraphemeSplitter().splitGraphemes(currentGuess).slice(0, -1).join('')
    )
  }

  TextStatus = false

  const onEnter = () => {
    if (isGameWon || isGameLost || isCallingtotheBackend) {
      return
    }

    if (!(unicodeLength(currentGuess) === MAX_WORD_LENGTH)) {
      setCurrentRowClass('jiggle')
      return showErrorAlert(NOT_ENOUGH_LETTERS_MESSAGE, {
        onClose: clearCurrentRowClass
      })
    }

    if (!isWordInWordList(currentGuess)) {
      setisCallingtotheBackend(true);
      logGuess(currentGuess, guesses, false, getSolution(), currentSolutionIndex, prompt, AI_text_status, onSuccess)
      setInvalidGuessCount(invalidGuessCount + 1)
      setCurrentRowClass('jiggle')
      if (!getHasEnhancedFeedback()) {
        return showErrorAlert(WORD_NOT_FOUND_MESSAGE, {
          onClose: clearCurrentRowClass
        })
      } else {
        setTimeout(clearCurrentRowClass, 300)
        return
      }
    }

    // enforce hard mode - all guesses must contain all previously revealed letters
    if (isHardMode) {
      setisCallingtotheBackend(true);
      logGuess(currentGuess, guesses, false, getSolution(), currentSolutionIndex, prompt, AI_text_status, onSuccess)
      const firstMissingReveal = findFirstUnusedReveal(currentGuess, guesses)
      if (firstMissingReveal) {
        setCurrentRowClass('jiggle')
        return showErrorAlert(firstMissingReveal, {
          onClose: clearCurrentRowClass
        })
      }
    }

    setIsRevealing(true)
    // turn this back off after all
    // chars have been revealed
    setTimeout(() => {
      setIsRevealing(false)
    }, REVEAL_TIME_MS * MAX_WORD_LENGTH)

    const winningWord = isWinningWord(currentGuess)

    if (
      unicodeLength(currentGuess) === MAX_WORD_LENGTH &&
      guesses.length < MAX_CHALLENGES &&
      !isGameWon
    ) {

      setisCallingtotheBackend(true);
      logGuess(currentGuess, guesses, true, getSolution(), currentSolutionIndex, prompt, AI_text_status, onSuccess)
      setGuesses([...guesses, currentGuess])
      setCurrentGuess('')

      if (winningWord) {
        logRoundComplete([...guesses, currentGuess], feedbackLog, true, getSolution(), currentSolutionIndex)
        setStats(addStatsForCompletedGame(stats, guesses.length))
        setIsGameWon(true)
        return
      }

      // if ((guesses.length === MAX_CHALLENGES - 3 || guesses.length === MAX_CHALLENGES - 2) && getHasEnhancedFeedback()) {
      //   const message = ENCOURAGEMENT_MESSAGES[Math.floor(Math.random() * ENCOURAGEMENT_MESSAGES.length)]
      //   showSuccessAlert(message, {}
      //   )
      // }

      if (guesses.length === MAX_CHALLENGES - 1) {
        logRoundComplete([...guesses, currentGuess], feedbackLog, false, getSolution(), currentSolutionIndex)
        setStats(addStatsForCompletedGame(stats, guesses.length + 1))
        setIsGameLost(true)
        // showErrorAlert(CORRECT_WORD_MESSAGE(getSolution()), {
        //   persist: true,
        //   delayMs: REVEAL_TIME_MS * MAX_WORD_LENGTH + 1,
        // })
      }
    }
  }

  if (Mesagee != PrevMesage) {
    TextStatus = true
  } else {
    TextStatus = false
  }

  return (
    <div className='h-screen flex flex-col bg-slate-50'>
      <Navbar
        setIsInfoModalOpen={setIsInfoModalOpen}
        setIsStatsModalOpen={setIsStatsModalOpen}
        setIsSettingsModalOpen={setIsSettingsModalOpen}
        roundIndex={currentSolutionIndex}
      />
      <div
        className='pt-2 px-1 pb-8 md:max-w-7xl w-full mx-auto sm:px-6 lg:px-8 flex flex-col grow'>
        <div className='pb-6 grow'>
          <FeedbackMessage guesses={guesses} invalidGuessCount={invalidGuessCount} isShown={
            !isModalOpen && !isGameWon
          }
                           currentRound={currentSolutionIndex}
                           isIdle={isIdle}
                           Message = {Mesagee}
                           TextStatus = {TextStatus}
                           ai_text_status = {AI_text_status}
                           onFeedback={onFeedback}
          />
          <Grid
            guesses={guesses}
            currentGuess={currentGuess}
            isRevealing={isRevealing}
            currentRowClassName={currentRowClass}
          />
        </div>
        <Keyboard
          onChar={onChar}
          onDelete={onDelete}
          onEnter={onEnter}
          guesses={guesses}
          isRevealing={isRevealing}
        />
        <ModalBackground isOpen={
          isModalOpen
        } />
        <IntroModal
          isOpen={isIntroModalOpen}
          handleClose={() => {
            setIsIntroModalOpen(false)
            setIsPreSurveyModalOpen(true)
          }
          }
        />
        <PreSurveyModal
          isOpen={isPreSurveyModalOpen}
          handleClose={(goBack) => {
            setIsPreSurveyModalOpen(false)
            setIsEmotionPrimeModalOneOpen(true)
          }
          }
        />
        <EmotionPrimeModalOne
          isOpen={isEmotionPrimeModalOneOpen}
          handleClose={(goBack) => {
            setIsEmotionPrimeModalOneOpen(false)
            if (goBack) {
              setIsPreSurveyModalOpen(true)
            } else {
              setIsEmotionPrimeModalTwoOpen(true)
            }
          }}
        />
        <EmotionPrimeModalTwo
          isOpen={isEmotionPrimeModalTwoOpen}
          handleClose={(goBack) => {
            setIsEmotionPrimeModalTwoOpen(false)
            if (goBack) {
              setIsEmotionPrimeModalOneOpen(true)
            } else {
              setIsPreSurveyCompleteModalOpen(true)
              saveIntroCompletedToLocalStorage()
            }
          }}
        />
        <PreSurveyCompleteModal
          isOpen={isPreSurveyCompleteModalOpen}
          handleClose={() => {
            setIsPreSurveyCompleteModalOpen(false)
            setIsInfoModalOpen(true)
          }}
        />

        <PostSurveyIntroModal
          isOpen={isPostSurveyIntroModalOpen}
          handleClose={() => {
            setIsPostSurveyIntroModalOpen(false)
            setIsPostSurveyEmotionalStateModalOpen(true)
          }}
        />
        <PostSurveyEmotionalStateModal
          isOpen={isPostSurveyEmotionalStateModalOpen}
          handleClose={() => {
            setIsPostSurveyEmotionalStateModalOpen(false)
            setIsPostSurveyCognitiveTestOpen(true)
          }}
        />
        <PostSurveyCognitiveTestModal
          isOpen={isPostSurveyCognitiveTestOpen}
          handleClose={(goBack) => {
            if (goBack) {
              setIsPostSurveyEmotionalStateModalOpen(true)
              setIsPostSurveyCognitiveTestOpen(false)
            } else {
              setIsPostSurveyCognitiveTestOpen(false)
              setIsStudyCompletedModalOpen(true)
              saveStudyCompletedToLocalStorage()
              setIsConfettiRunning(true)
            }
          }}
        />
        <StudyCompletedModal
          isOpen={isStudyCompletedModalOpen}
          handleClose={() => {
            setIsStudyCompletedModalOpen(false)
            setIsBonusRoundIntroModalOpen(true)
            setIsConfettiRunning(false)
            saveIsBonusRoundActive()
            setIsGameActive(true)
            setTimeout(() => {
              setFeedbackLog([])

              setGuesses([])
              setCurrentGuess('')
              setIsGameWon(false)
              setIsGameLost(false)
              setCurrentSolutionIndex(currentSolutionIndex + 1)
            }, 200)
          }}
        />
        <BonusRoundIntroModal
          isOpen={isBonusRoundIntroModalOpen}
          handleClose={() => {
            setIsBonusRoundIntroModalOpen(false)
          }}
        />

        <InfoModal
          isOpen={isInfoModalOpen}
          handleClose={() => {
            setIsGameActive(true)
            setIsInfoModalOpen(false)
          }}
        />
        <StatsModal
          isOpen={isStatsModalOpen}
          handleClose={() => setIsStatsModalOpen(false)}
          guesses={guesses}
          gameStats={stats}
          isGameLost={isGameLost}
          isGameWon={isGameWon}
          handleShareToClipboard={() => showSuccessAlert(GAME_COPIED_MESSAGE)}
          isHardMode={isHardMode}
          isDarkMode={isDarkMode}
          isHighContrastMode={isHighContrastMode}
          numberOfGuessesMade={guesses.length}
        />
        <GameFinishedModal
          isOpen={isGameFinishedModalOpen}
          handleClose={(noMoreRounds: boolean) => {
            setIsConfettiRunning(false)
            setIsGameFinishedModalOpen(false)
            if (noMoreRounds) {
              setIsPostSurveyIntroModalOpen(true)
            } else {
              setTimeout(() => {
                setFeedbackLog([])
                setGuesses([])
                setCurrentGuess('')
                setIsGameWon(false)
                setIsGameLost(false)
                setCurrentSolutionIndex(currentSolutionIndex + 1)
              }, 200)
            }

          }}
          gameStats={stats}
          isGameWon={isGameWon}
          numberOfGuessesMade={guesses.length}
          TextStatus={TextStatus}
          ai_text_status={AI_text_status}
        />
        <SettingsModal
          isOpen={isSettingsModalOpen}
          handleClose={() => setIsSettingsModalOpen(false)}
          isHardMode={isHardMode}
          handleHardMode={handleHardMode}
          isDarkMode={isDarkMode}
          handleDarkMode={handleDarkMode}
          isHighContrastMode={isHighContrastMode}
          handleHighContrastMode={handleHighContrastMode}
        />
        <AlertContainer />
      </div>
      <Confetti
        numberOfPieces={isConfettiRunning ? 200 : 0}
        className={'z-50 fixed'} style={{ zIndex: 50 }}
        width={width}
        height={height}
        colors={['#A7F3D0', '#E9D5FF', '#FECDD3', '#A5F3FC', '#D9F99D', '#', '#']}
      />
    </div>
  )
}


export default App