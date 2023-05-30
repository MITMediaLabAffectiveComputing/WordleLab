import { useRive } from 'rive-react'
import { useEffect, useState } from 'react'
import { Linebreaker, WindupChildren } from 'windups'
import { getHasEnhancedFeedback } from '../lib/localStorage'
import { FeedbackResponse, getEmotionalFeedback } from '../lib/enhancedfeedback'
import { Transition } from '@headlessui/react'

type Props = {
  numberOfGuessesMade: number,
  didWin: boolean
  isIntro: boolean
  isOpen: boolean
  TextStatus: boolean
  ai_text_status: boolean
}

const get_random = function (list: any[]) {
  return list[Math.floor((Math.random() * list.length))];
}

import { onTextChange } from '../App'

export const ModalFeedbackMessage = ({
                                       numberOfGuessesMade, didWin, isIntro, isOpen, TextStatus, ai_text_status
                                     }: Props) => {

  const [message, setMessage] = useState('')
  const [messageCount, setMessageCount] = useState(0)
  const [showTeddy, setShowTeddy] = useState(false)

  const { RiveComponent, rive, canvas } = useRive({
    src: '/teddy.riv',
    stateMachines: 'teddy',
    autoplay: true
  })

  useEffect(() => {
    canvas?.setAttribute('style', 'vertical-align: top; width: 83px; height: 83px;')
    canvas?.setAttribute('width', '160')
    canvas?.setAttribute('height', '160')
  }, [canvas, isOpen, rive])

  const setFeedback = (feedback: FeedbackResponse) => {
    if (!feedback) {
      return
    }

    const inputs: { [id: string]: any; } = {}
    const inputsList = rive?.stateMachineInputs('teddy')
    if (inputsList) {
      for (const input of inputsList) {
        inputs[input.name] = input
      }
    }

    if (ai_text_status) {
      setMessage(feedback.ai_text)
    } else{
      setMessage(get_random(feedback.text))
    }

    setMessageCount(messageCount + 1)
    // inputs['idle']?.fire()
    inputs[feedback.animation]?.fire()
  }


  // useEffect(() => {
  //   if (isIntro) {
  //     setFeedback(getEmotionalFeedback().intro)
  //   }
  // }, [isIntro])

  useEffect(() => {
    if (!getHasEnhancedFeedback()) {
      if (!didWin) {
        setMessage('You lost after 6 guesses.')
      } else {
        setMessage(`You won after ${numberOfGuessesMade} ${numberOfGuessesMade == 1 ? 'guess' : 'guesses'}.`)
      }
      setMessageCount(messageCount + 1)
      return
    }
    if (!didWin) {
      setFeedback(getEmotionalFeedback().onLoss)
    } else {
      setFeedback(getEmotionalFeedback().onWin)
    }
  }, [numberOfGuessesMade, didWin, rive])

  useEffect(() => {
    if (isOpen) {
      setMessageCount(messageCount + 1)
      setTimeout(() => {
        // rive?.reset()
        canvas?.parentElement?.setAttribute('style', '')
        setShowTeddy(true)
      }, 200)
      canvas?.parentElement?.setAttribute('style', '')
    } else {
      setShowTeddy(false)
    }
  }, [isOpen])

  if (!TextStatus) {
    return (
      <div className={'max-w-sm mx-auto mb-3 h-[80px] px-2 relative'}>
        <div className='relative h-[80px] mx-3 '>
          <div
            className='relative h-full'>
            <div className='shadow-md  rounded-full overflow-hidden h-full w-[80px] absolute left-[0px] top-[0px]'>
              <RiveComponent
                className='h-[86px] w-[86px] -mt-[3px] -ml-[3px]' />
            </div>
            <Transition
              show={!showTeddy}
              enter='transition-opacity duration-400'
              enterFrom='opacity-0'
              enterTo='opacity-100'
              leave='transition-opacity duration-400'
              leaveFrom='opacity-100'
              leaveTo='opacity-0'
            >
              <div className='absolute top-0 left-0 right-0 -bottom-2 bg-white' />
  
            </Transition>
  
            <div
              className='shadow-md bg-white rounded-xl justify-center flex flex-col bg-white absolute top-2 left-[90px] right-0 bottom-2 -mr-2 border-solid border border-slate-200'>
              <div
                className='absolute left-[-8px] bottom-[12px] bg-white h-[16px] w-[16px] skew-y-[30deg] -rotate-[60deg] border-l-solid border-b-solid border-l border-t border-slate-200 flex justify-center flex-row'></div>
              {(getHasEnhancedFeedback() && <div
                className='text-sm align-middle px-4 text-left text-[18px] leading-6 font cursor-default'>
                <div className='relative text-white'>
                  {message}
                  <div className='absolute top-0 left-0 right-0 bottom-0 text-black'>
                    <Linebreaker fontStyle={'18px arial'} width={162}>
                      {/* <WindupChildren> */}
                        <span key={messageCount}>{message}</span>
                      {/* </WindupChildren> */}
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
      </div>
    )
  } 

  onTextChange()
  return (
    <div className={'max-w-sm mx-auto mb-3 h-[80px] px-2 relative'}>
      <div className='relative h-[80px] mx-3 '>
        <div
          className='relative h-full'>
          <div className='shadow-md  rounded-full overflow-hidden h-full w-[80px] absolute left-[0px] top-[0px]'>
            <RiveComponent
              className='h-[86px] w-[86px] -mt-[3px] -ml-[3px]' />
          </div>
          <Transition
            show={!showTeddy}
            enter='transition-opacity duration-400'
            enterFrom='opacity-0'
            enterTo='opacity-100'
            leave='transition-opacity duration-400'
            leaveFrom='opacity-100'
            leaveTo='opacity-0'
          >
            <div className='absolute top-0 left-0 right-0 -bottom-2 bg-white' />

          </Transition>

          <div
            className='shadow-md bg-white rounded-xl justify-center flex flex-col bg-white absolute top-2 left-[90px] right-0 bottom-2 -mr-2 border-solid border border-slate-200'>
            <div
              className='absolute left-[-8px] bottom-[12px] bg-white h-[16px] w-[16px] skew-y-[30deg] -rotate-[60deg] border-l-solid border-b-solid border-l border-t border-slate-200 flex justify-center flex-row'></div>
            {(getHasEnhancedFeedback() && <div
              className='text-sm align-middle px-4 text-left text-[18px] leading-6 font cursor-default'>
              <div className='relative text-white'>
                {message}
                <div className='absolute top-0 left-0 right-0 bottom-0 text-black'>
                  <Linebreaker fontStyle={'18px arial'} width={162}>
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
    </div>
  )
}
