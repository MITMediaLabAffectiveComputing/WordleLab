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
import { Message, set } from 'react-hook-form'
import { FeedbackAnimation } from '../lib/enhancedfeedback'
import { onTextChange } from '../App'

type Props = {
  guesses: string[]
  invalidGuessCount: number
  isShown: boolean
  currentRound: number
  isIdle: boolean
  Message: string
  TextStatus: boolean
  ChatGPTStatus: boolean
  onFeedback: (key: string) => void
}

const get_random = function (list: any[]) {
  return list[Math.floor((Math.random() * list.length))];
}

const modIndex = function (list: any[], index: number) {
  return list[index % list.length]
}

let turnStartTime: number | null = null

export const FeedbackMessage = ({ guesses, invalidGuessCount, isShown, currentRound, isIdle, Message, TextStatus, ChatGPTStatus, onFeedback }: Props) => {

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
      setFeedback(getEmotionalFeedback().onIdle)
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

    //setMessage(feedback.text)
    // console.log(MESSAGE, 'before')

    setMessage(Message)

    // console.log(MESSAGE, 'after')
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
      prompt = 'Guess ' + (currentIndex + 1) + ' of 6'
      if (currentIndex + 1 == 6) {
        prompt = "Enjoy Wordle - you've got this!"
      }
      onFeedback('default' + currentIndex)
      return
    }

    if (!isShown) {
      prompt = ''
      return
    }

    if (guesses.length && getNumberOfRemainingWords(guesses) <= 5 && !shownMessageLog.includes('reallyclose')) {
      setFeedback(getEmotionalFeedback().onReallyClose)
      if (ChatGPTStatus) {
        prompt = getEmotionalFeedback().onReallyClose.ChatGPTResponse
      } else {
        prompt = get_random(getEmotionalFeedback().onReallyClose.text)
      }
      setShownMessageLog([...shownMessageLog, 'reallyclose'])
      return
    }

    if (turnDuration != null && turnDuration < 4000 && !shownMessageLog.includes('fast')) {
      setFeedback(getEmotionalFeedback().onFastGuess)
      if (ChatGPTStatus) {
        prompt = getEmotionalFeedback().onFastGuess.ChatGPTResponse
      } else {
        prompt = get_random(getEmotionalFeedback().onFastGuess.text)
      }
      setShownMessageLog([...shownMessageLog, 'fast'])
      return
    }

    if (turnDuration != null && turnDuration > 60000 && !shownMessageLog.includes('slow')) {
      setFeedback(getEmotionalFeedback().onSlowGuess)
      if (ChatGPTStatus) {
        prompt = getEmotionalFeedback().onSlowGuess.ChatGPTResponse
      } else {
        prompt = get_random(getEmotionalFeedback().onSlowGuess.text)
      }
      setShownMessageLog([...shownMessageLog, 'slow'])
      return
    }

    if (currentIndex == 0) {
      setFeedback(getEmotionalFeedback().firstGuess)
      if (ChatGPTStatus) {
        prompt = getEmotionalFeedback().firstGuess.ChatGPTResponse
      } else {
        prompt = get_random(getEmotionalFeedback().firstGuess.text)
        return
      }
      return
    }

    if (currentIndex == 4) {
      setFeedback(getEmotionalFeedback().fifthGuess)
      if (ChatGPTStatus) {
        prompt = getEmotionalFeedback().fifthGuess.ChatGPTResponse
      } else {
        prompt = get_random(getEmotionalFeedback().fifthGuess.text)
        return
      }

      return
    }
    if (currentIndex == 5) {
      setFeedback(getEmotionalFeedback().sixthGuess)
      if (ChatGPTStatus) {
        prompt = getEmotionalFeedback().sixthGuess.ChatGPTResponse
      } else {
        prompt = get_random(getEmotionalFeedback().sixthGuess.text)
        return
      }

      return
    }

    if (currentIndex == 6) {
      setFeedback(getEmotionalFeedback().newGame)
      if (ChatGPTStatus) {
        prompt = getEmotionalFeedback().newGame.ChatGPTResponse
      } else {
        prompt = get_random(getEmotionalFeedback().newGame.text)
        return
      }
    }

    if (guesses.length && getNumberOfRemainingWords(guesses) <= 100 && !shownMessageLog.includes('gettingclose')) {
      setFeedback(getEmotionalFeedback().onGettingClose)
      if (ChatGPTStatus) {
        prompt = getEmotionalFeedback().onGettingClose.ChatGPTResponse
      } else {
        prompt = get_random(getEmotionalFeedback().onGettingClose.text)
        return
      }
      setShownMessageLog([...shownMessageLog, 'gettingclose'])
      return
    }



    const previousMax = Math.max(...guesses.slice(0, currentIndex - 1).map(guess => getGuessScore(guess)))
    const newScore = getGuessScore(guesses[currentIndex - 1])
    if (newScore > 1 && newScore > previousMax) {
      setFeedback(getEmotionalFeedback().newHighScore)
      feedbackState.highScoreMessageIndex += 1
    } else {
      setFeedback(getEmotionalFeedback().notNewHighScore)
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

  // setFeedback({text: Message, animation: FeedbackAnimation.Success});
  // setFeedbackState(feedbackState)
  // saveFeedbackStateToLocalStorage(feedbackState)

  useEffect(() => {
    if (invalidGuessCount > 0 && getHasEnhancedFeedback()) {
      setFeedback(getEmotionalFeedback().invalidWord)
    }
  }, [invalidGuessCount])

  if (!TextStatus) {
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
                  {Message}
                  <div className='absolute top-0 left-0 right-0 bottom-0 text-black'>
                    <Linebreaker fontStyle={'14px arial'} width={162}>
                      <span key={messageCount}>{Message}</span>
                    </Linebreaker>
                  </div>

                </div>
              </div>)}
              {(!getHasEnhancedFeedback() && <div
                className='text-sm py-2 align-middle pr-4 pl-4 text-center block text-[18px]'>
                {Message}
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

  onTextChange()

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
                {Message}
                <div className='absolute top-0 left-0 right-0 bottom-0 text-black'>
                  <Linebreaker fontStyle={'14px arial'} width={162}>
                    <WindupChildren>
                      <span key={messageCount}>{Message}</span>
                    </WindupChildren>
                  </Linebreaker>
                </div>

              </div>
            </div>)}
            {(!getHasEnhancedFeedback() && <div
              className='text-sm py-2 align-middle pr-4 pl-4 text-center block text-[18px]'>
              {Message}
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

export let prompt = ''