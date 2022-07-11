import { Cell } from '../../grid/Cell'
import { BaseModal } from '../BaseModal'
import React from 'react'
import { logPostsurveyEvent, markCanLogSurveyEvents } from '../../../lib/logging'

type Props = {
  isOpen: boolean
  handleClose: () => void
}

export const PostSurveyIntroModal = ({ isOpen, handleClose }: Props) => {

  React.useEffect(() => {
    if (isOpen) {
      markCanLogSurveyEvents()
    }
    logPostsurveyEvent('intro', isOpen)
  }, [isOpen])

  const pClass = 'mb-3'
  return (
    <BaseModal title="Great job! You're almost done!" isOpen={isOpen} handleClose={handleClose} showCloseButton={false}
               isCancelable={false}
    >
      <div className='flex justify-center mb-1 mt-8'>
        <Cell isRevealing={true} isCompleted={true} status='present' value='S' />
        <Cell isRevealing={true} value='T' />
        <Cell isRevealing={true} isCompleted={true} status='correct' value='E' />
        <Cell isRevealing={true} isCompleted={true} status='correct' value='P' />
      </div>
      <div className='flex justify-center mb-1 mt-4'>
        <Cell isRevealing={true} isCompleted={true} status='absent' value='T' />
        <Cell isRevealing={true} isCompleted={true} status='correct' value='H' />
        <Cell isRevealing={true} value='R' />
        <Cell isRevealing={true} isCompleted={true} status='correct' value='E' />
        <Cell isRevealing={true} isCompleted={true} status='correct' value='E' />
      </div>

      <div className=' text-gray-800 dark:text-gray-300'>
        <p className={pClass + ' mt-8'}>Now, we just need you to answer a couple more questions, then you'll be all
          set.</p>
        <p className={pClass + ' mt-4'}>Please don't close the browser window until you've filled them out!</p>
      </div>
      <div className='mt-5 sm:mt-8 dark:text-white'>
        <button
          autoFocus={true}
          type='button'
          className='mt-2 w-full rounded-md border border-transparent shadow-sm px-4 py-4 bg-green-600 font-bold font-large text-white hover:bg-green-700 focus:outline-none dark:bg-green-500'
          onClick={() => {
            handleClose()
          }}
        >
          Let's Do It!
        </button>
      </div>
    </BaseModal>
  )
}
