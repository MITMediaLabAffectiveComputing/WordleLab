import { useRive } from 'rive-react'
import { useEffect, useState } from 'react'
import { Linebreaker, WindupChildren } from 'windups'
import {
  getHasEnhancedFeedback,
  loadFeedbackStateFromLocalStorage,
  saveFeedbackStateToLocalStorage
} from '../lib/localStorage'
import { getGuessScore, getNumberOfRemainingWords } from '../lib/statuses'
import { FeedbackResponse, getEmotionalFeedback, getFeedbackKey } from '../lib/enhancedfeedback'
import { Transition } from '@headlessui/react'

type Props = {
  guesses: string[]
  invalidGuessCount: number
  isShown: boolean
  currentRound: number
  isIdle: boolean
  onFeedback: (key: string) => void
}

const modIndex = function(list: any[], index: number) {
  return list[index % list.length]
}

let turnStartTime: number | null = null

export const FeedbackMessage = ({
                                  guesses, invalidGuessCount, isShown, currentRound, isIdle, onFeedback
                                }: Props) => {

  const [message, setMessage] = useState('')
  const [messageCount, setMessageCount] = useState(0)
  const [feedbackState, setFeedbackState] = useState(() => loadFeedbackStateFromLocalStorage())
  const [shownMessageLog, setShownMessageLog] = useState([] as string[])

  const { RiveComponent, rive, canvas } = useRive({
    src: '/teddy.riv',
    stateMachines: 'teddy',
    autoplay: true
  })

  useEffect(() => {
    if (isIdle && getHasEnhancedFeedback()) {
      setFeedback(modIndex(getEmotionalFeedback().onIdle, currentRound))
    }
  }, [isIdle])

  useEffect(() => {
    canvas?.setAttribute('style', 'vertical-align: top; width: 80px; height: 80px;')
    canvas?.setAttribute('width', '160')
    canvas?.setAttribute('height', '160')
  }, [canvas])

  useEffect(() => {
    setShownMessageLog([])
  }, [currentRound])

  const setFeedback = (feedback: FeedbackResponse) => {

    const feedbackKey = getFeedbackKey(feedback)
    if (feedbackKey != null) {
      onFeedback(feedbackKey as string)
    }

    const inputs: { [id: string]: any; } = {}
    const inputsList = rive?.stateMachineInputs('teddy')
    if (inputsList) {
      for (const input of inputsList) {
        inputs[input.name] = input
      }
    }

    setMessage(feedback.text)
    setMessageCount(messageCount + 1)
    // inputs['idle']?.fire()
    inputs[feedback.animation]?.fire()
  }


  useEffect(() => {
    const oldTurnStartTime = turnStartTime
    turnStartTime = new Date().getTime()
    let turnDuration = null
    if (oldTurnStartTime != null && guesses.length > 0) {
      turnDuration = turnStartTime - oldTurnStartTime
    }

    const currentIndex = guesses.length
    if (!getHasEnhancedFeedback()) {
      setMessage('Guess ' + (currentIndex + 1) + ' of 6')
      onFeedback('default' + currentIndex)
      return
    }

    if (!isShown) {
      setMessage('')
      return
    }

    if (guesses.length && getNumberOfRemainingWords(guesses) <= 5 && !shownMessageLog.includes('reallyclose')) {
      setFeedback(getEmotionalFeedback().onReallyClose)
      setShownMessageLog([...shownMessageLog, 'reallyclose'])
      return
    }

    if (turnDuration != null && turnDuration < 4000 && !shownMessageLog.includes('fast')) {
      setFeedback(getEmotionalFeedback().onFastGuess)
      setShownMessageLog([...shownMessageLog, 'fast'])
      return
    }

    if (turnDuration != null && turnDuration > 60000 && !shownMessageLog.includes('slow')) {
      setFeedback(getEmotionalFeedback().onSlowGuess)
      setShownMessageLog([...shownMessageLog, 'slow'])
      return
    }

    if (currentIndex == 0) {
      setFeedback(modIndex(getEmotionalFeedback().firstGuess, currentRound))
      return
    }
    if (currentIndex == 4) {
      setFeedback(modIndex(getEmotionalFeedback().fifthGuess, currentRound))
      return
    }
    if (currentIndex == 5) {
      setFeedback(modIndex(getEmotionalFeedback().sixthGuess, currentRound))
      return
    }

    if (guesses.length && getNumberOfRemainingWords(guesses) <= 100 && !shownMessageLog.includes('gettingclose')) {
      setFeedback(modIndex(getEmotionalFeedback().onGettingClose, currentRound))
      setShownMessageLog([...shownMessageLog, 'gettingclose'])
      return
    }


    const previousMax = Math.max(...guesses.slice(0, currentIndex - 1).map(guess => getGuessScore(guess)))
    const newScore = getGuessScore(guesses[currentIndex - 1])
    if (newScore > 1 && newScore > previousMax) {
      setFeedback(modIndex(getEmotionalFeedback().newHighScore, feedbackState.highScoreMessageIndex))
      feedbackState.highScoreMessageIndex += 1
    } else {
      setFeedback(modIndex(getEmotionalFeedback().notNewHighScore, feedbackState.noHighScoreMessageIndex))
      feedbackState.noHighScoreMessageIndex += 1
    }
    setFeedbackState(feedbackState)
    saveFeedbackStateToLocalStorage(feedbackState)

  }, [guesses, isShown])

  useEffect(() => {
    if (invalidGuessCount > 0 && getHasEnhancedFeedback()) {
      setFeedback(getEmotionalFeedback().invalidWord)
    }
  }, [invalidGuessCount])

  return (
    <div className={'max-w-sm mx-auto mb-3 h-[80px] px-10 relative'}>
      <div className='relative h-[80px] mx-3 '>
        <div
          className='relative h-full'>
          <div className='shadow-md  rounded-full overflow-hidden h-full w-[80px] absolute left-[0px] top-[0px]'>
            <RiveComponent
              className='h-[80px] w-[80px]' />
          </div>
          <div
            className='shadow-md bg-white rounded-xl justify-center flex flex-col bg-white absolute top-4 left-[90px] right-0 bottom-4 -mr-2 border-solid border border-slate-200'>
            <div
              className='absolute left-[-8px] bottom-[12px] bg-white h-[16px] w-[16px] skew-y-[30deg] -rotate-[60deg] border-l-solid border-b-solid border-l border-t border-slate-200 flex justify-center flex-row'></div>
            {(getHasEnhancedFeedback() && <div
              className='text-sm align-middle pr-4 pl-4 text-left text-[14px] cursor-default'>
              <div className='relative text-white'>
                {message}
                <div className='absolute top-0 left-0 right-0 bottom-0 text-black'>
                  <Linebreaker fontStyle={'14px arial'} width={162}>
                    <WindupChildren>
                      <span key={messageCount}>{message}</span>
                    </WindupChildren>
                  </Linebreaker>
                </div>

              </div>
            </div>)}
            {(!getHasEnhancedFeedback() && <div
              className='text-sm py-2 align-middle pr-4 pl-4 text-center block text-[18px]'>
              {message}
            </div>)}
          </div>

        </div>
      </div>
      <Transition
        show={!isShown}
        enter='transition-opacity duration-200'
        enterFrom='opacity-0'
        enterTo='opacity-100'
        leave='transition-opacity duration-200'
        leaveFrom='opacity-100'
        leaveTo='opacity-0'
      >
        <div className='absolute top-0 left-0 right-0 -bottom-2 bg-slate-50' />

      </Transition>
    </div>
  )
}
