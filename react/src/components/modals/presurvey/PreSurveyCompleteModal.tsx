import { Cell } from '../../grid/Cell'
import { BaseModal } from '../BaseModal'
import { getWordsList } from '../../../constants/wordlist'

type Props = {
  isOpen: boolean
  handleClose: () => void
}

export const PreSurveyCompleteModal = ({ isOpen, handleClose }: Props) => {
  const pClass = 'mb-5 text-lg dark:text-white'
  return (
    <BaseModal title='Great Job!' isOpen={isOpen} handleClose={handleClose} showCloseButton={false} isCancelable={false}
    >
      <div className='flex justify-center mb-1 mt-8'>
        <Cell isRevealing={true} isCompleted={true} status='present' value='S' />
        <Cell isRevealing={true} value='T' />
        <Cell isRevealing={true} isCompleted={true} status='correct' value='E' />
        <Cell isRevealing={true} isCompleted={true} status='correct' value='P' />
      </div>
      <div className='flex justify-center mb-1 mt-4'>
        <Cell isRevealing={true} isCompleted={true} status='absent' value='T' />
        <Cell isRevealing={true} isCompleted={true} status='correct' value='W' />
        <Cell isRevealing={true} value='O' />
      </div>

      <div className=' text-gray-800 dark:text-gray-300 mt-8 mb-8'>
        <p className={pClass + ''}>Thank you for answering those questions!</p>
        <p className={pClass}>Now for the next step, we ask that you play {getWordsList().length} rounds of a word
          guessing game. Please play all {getWordsList().length} rounds, win or lose!</p>
      </div>
      <div className='mt-5 sm:mt-6 dark:text-white'>
        <button
          autoFocus={true}
          type='button'
          className='mt-2 w-full rounded-md border border-transparent shadow-sm px-4 py-4 bg-green-600 font-bold font-large text-white hover:bg-green-700 focus:outline-none dark:bg-green-500'
          onClick={() => {
            handleClose()
          }}
        >
          To the Games!
        </button>
      </div>
    </BaseModal>
  )
}
