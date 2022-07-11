import { BaseModal } from '../BaseModal'
import { getWordsList } from '../../../constants/wordlist'
import React from 'react'
import { logPresurveyEvent, markCanLogSurveyEvents } from '../../../lib/logging'
import { Cell } from '../../grid/Cell'

type Props = {
  isOpen: boolean
  handleClose: () => void
}

export const IntroModal = ({ isOpen, handleClose }: Props) => {

  React.useEffect(() => {
    if (isOpen) {
      markCanLogSurveyEvents()
    }
    logPresurveyEvent('intro', isOpen)
  }, [isOpen])

  const pClass = 'mb-3'
  return (
    <BaseModal title='Welcome to WordleLab!' isOpen={isOpen} handleClose={handleClose} showCloseButton={false}
               isCancelable={false} wide={true}
    >
      <div className='flex justify-center mb-1 mt-6'>
        <Cell value='W' />
        <Cell value='E' status='present' />
        <Cell value='L' />
        <Cell isRevealing={true} isCompleted={true} value='C' status='correct' />
        <Cell value='O' />
        <Cell value='M' isCompleted={true} status='absent' />
        <Cell value='E' status='correct' />
      </div>

      <div className=' text-gray-800 dark:text-gray-300 mt-6'>
        <p className={pClass}>WorldleLab is a research project created by the MIT Media Lab.</p>
        <div className={pClass + ' text-left flex items-center mt-6 max-w-sm mx-auto'}>
          <div className='ml-2 text-3xl align-middle font-bold float-left text-green-900 dark:text-green-500 mb-1'>1
          </div>
          <div className={'ml-4'}>We will first ask you several brief survey questions.</div>
        </div>
        <div className={pClass + ' text-left flex items-center max-w-sm mx-auto'}>
          <div className='ml-2 text-3xl align-middle font-bold float-left text-green-900 dark:text-green-500 mb-1'>2
          </div>
          <div className={'ml-4'}>Then, we will ask you to play {getWordsList().length} rounds of a word guessing
            game.
          </div>
        </div>
        <div className={pClass + ' text-left flex items-center max-w-sm mx-auto'}>
          <div className='ml-2 text-3xl align-middle font-bold float-left text-green-900 dark:text-green-500 mb-1'>3
          </div>
          <div className={'ml-4'}>Finally, we will ask you some final followup questions.</div>
        </div>
        <p className={' mt-8'}>All submissions are collected anonymously for research purposes, and participation is
          entirely voluntary. For questions, please contact <a href='mailto:wordlelab@media.mit.edu'
                                                               className='text-green-600 dark:text-green-300'>wordlelab@media.mit.edu</a>.
        </p>
      </div>
      <div className='mt-5 sm:mt-2 dark:text-white'>
        <button
          autoFocus={true}
          type='button'
          className='mt-2 w-full rounded-md border border-transparent shadow-sm px-4 py-4 bg-green-600 font-bold font-large text-white hover:bg-green-700 focus:outline-none dark:bg-green-500'
          onClick={() => {
            handleClose()
          }}
        >
          I Accept
        </button>
      </div>
    </BaseModal>
  )
}
