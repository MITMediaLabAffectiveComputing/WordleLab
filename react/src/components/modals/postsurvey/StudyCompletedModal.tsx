import { Cell } from '../../grid/Cell'
import { BaseModal } from '../BaseModal'
import { getProlificID } from '../../../lib/localStorage'
import { useState } from 'react'

type Props = {
  isOpen: boolean
  handleClose: () => void
}

export const StudyCompletedModal = ({ isOpen, handleClose }: Props) => {

  const [didPressProlificLink, setDidPressProlificLink] = useState(false)

  const openProlific = () => {
    window.open('https://app.prolific.co/submissions/complete?cc=[INSERT YOUR PROLIFIC ID HERE]')
    setDidPressProlificLink(true)
  }

  const pClass = 'mb-3'
  return (
    <BaseModal title='Study Complete!' isOpen={isOpen} handleClose={handleClose} showCloseButton={false}
               isCancelable={false} wide={true}
    >
      <div className=' text-gray-800 dark:text-white'>
        <p className={pClass + ' text-lg'}>You did it! Great job!</p>
        <p className={pClass + ' mt-2 mx-10'}>We really appreciate your help with our study, and we thank you for
          furthering our advances in science.</p>

        <div className='flex justify-center mb-1 mt-8'>
          <Cell isRevealing={true} isCompleted={true} status='present' value='Y' />
          <Cell isRevealing={true} value='O' />
          <Cell isRevealing={true} isCompleted={true} status='correct' value='U' />
        </div>
        <div className='flex justify-center mb-1 mt-4'>
          <Cell isRevealing={true} isCompleted={true} status='absent' value='R' />
          <Cell isRevealing={true} isCompleted={true} status='correct' value='O' />
          <Cell isRevealing={true} isCompleted={true} status='absent' value='C' />
          <Cell isRevealing={true} value='K' />
          <Cell isRevealing={true} isCompleted={true} status='correct' value='!' />
        </div>

        {!getProlificID() && (
          <p className={pClass + ' mt-8 mx-10 mb-6'}>If you do have any questions about the study, feel free to reach
            out
            to us at <a href='mailto:wordlelab@media.mit.edu'
                        className='text-green-600 dark:text-green-300'>wordlelab@media.mit.edu</a>.</p>
        )}
      </div>
      {getProlificID() && (
        <div className='mt-10 sm:mt-8 dark:text-white'>
          <p className={' text mx-8 mt-12 mb-0.5'}>Don't forget to notify Prolific that you
            have completed our tasks</p>
          <p className={' text mx-8 mb-2'}>(And quite well, I might add!). You <strong>need</strong> to press this
            button to <strong>get
              paid</strong>!</p>
          <button
            autoFocus={true}
            type='button'
            className='w-full rounded-md border border-transparent shadow-sm px-4 py-4 bg-green-600 font-bold text-lg text-white hover:bg-green-700 focus:outline-none dark:bg-green-500 cursor-pointer'
            onClick={() => {
              openProlific()
            }}
          >
            Notify Prolific and Get Paid!
          </button>
          <div>
            <button
              autoFocus={true}
              type='button'
              disabled={!didPressProlificLink}
              className=
                {didPressProlificLink ?
                  'w-full mt-2 mb-6 rounded-md dark:bg-slate-800 dark:text-green-400 dark:outline-2 text font-bold px-9 py-5 bg-white outline outline-1 outline-green-600 text-green-600 hover:text-green-700 cursor-pointer' :
                  'w-full mt-2 mb-6 rounded-md text font-bold px-9 py-5 bg-slate-400 text-white'
                }
              onClick={() => {
                handleClose()
              }}
            >
              {didPressProlificLink ? 'I Want to Keep Playing!' : 'You can come back to play more after notifying Prolific!'}
            </button>

          </div>
          <p className={pClass + ' mt-6 mx-10'}>If you do have any questions about the study, feel free to reach
            out
            to us at <a href='mailto:wordlelab@media.mit.edu'
                        className='text-green-600 dark:text-green-300'>wordlelab@media.mit.edu</a>.</p>
        </div>
      )}

      {(!getProlificID()) && (
        <div className='mt-5 sm:mt-8 dark:text-white'>
          <button
            autoFocus={true}
            type='button'
            className='mt-2 w-full rounded-md border border-transparent shadow-sm px-4 py-4 bg-green-600 font-bold font-large text-white hover:bg-green-700 focus:outline-none dark:bg-green-500'
            onClick={() => {
              handleClose()
            }}
          >
            I Want to Keep Playing!
          </button>
        </div>
      )}

    </BaseModal>
  )
}
