import { Cell } from '../../grid/Cell'
import { BaseModal } from '../BaseModal'

type Props = {
  isOpen: boolean
  handleClose: () => void
}

export const BonusRoundIntroModal = ({ isOpen, handleClose }: Props) => {
  const pClass = 'mb-3'
  return (
    <BaseModal title='Bonus Rounds' isOpen={isOpen} handleClose={handleClose} showCloseButton={false}
               isCancelable={false}
    >
      <div className='flex justify-center mb-1 mt-8'>
        <Cell isRevealing={true} isCompleted={true} status='present' value='B' />
        <Cell isRevealing={true} value='O' />
        <Cell isRevealing={true} value='N' />
        <Cell isRevealing={true} isCompleted={true} status='correct' value='U' />
        <Cell isRevealing={true} isCompleted={true} status='present' value='S' />
      </div>
      <div className='flex justify-center mb-1 mt-4'>
        <Cell isRevealing={true} isCompleted={true} status='absent' value='R' />
        <Cell isRevealing={true} isCompleted={true} status='correct' value='O' />
        <Cell isRevealing={true} isCompleted={true} status='absent' value='U' />
        <Cell isRevealing={true} value='N' />
        <Cell isRevealing={true} isCompleted={true} status='correct' value='D' />
      </div>

      <div className=' text-gray-800 dark:text-gray-300'>
        <p className={pClass + ' mt-8'}>Alright! Your part in the study is done, but you're more than welcome to keep
          playing!</p>
        <p className={pClass + ' mt-4'}>We'll give you extra random words from here on out. We will continue logging
          your progress for science, but feel free to play as much or as little as you'd like!</p>
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
          To the Bonus Rounds!
        </button>
      </div>
    </BaseModal>
  )
}
