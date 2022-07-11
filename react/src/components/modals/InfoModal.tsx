import { Cell } from '../grid/Cell'
import { BaseModal } from './BaseModal'
import { INFO_CONTINUE_TEXT } from '../../constants/strings'

type Props = {
  isOpen: boolean
  handleClose: () => void
}

export const InfoModal = ({ isOpen, handleClose }: Props) => {
  return (
    <BaseModal title='How to play' isOpen={isOpen} handleClose={handleClose} showCloseButton={true}
    >
      <p className='text-sm text-gray-500 dark:text-gray-300'>
        Guess the word in 6 tries. After each guess, the color of the tiles will
        change to show how close your guess was to the word.
      </p>

      <div className='flex justify-center mb-1 mt-4'>
        <Cell
          isRevealing={true}
          isCompleted={true}
          value='W'
          status='correct'
        />
        <Cell value='E' />
        <Cell value='A' />
        <Cell value='R' />
        <Cell value='Y' />
      </div>
      <p className='text-sm text-gray-500 dark:text-gray-300'>
        The letter W is in the word and in the correct spot.
      </p>

      <div className='flex justify-center mb-1 mt-4'>
        <Cell value='P' />
        <Cell value='I' />
        <Cell
          isRevealing={true}
          isCompleted={true}
          value='L'
          status='present'
        />
        <Cell value='O' />
        <Cell value='T' />
      </div>
      <p className='text-sm text-gray-500 dark:text-gray-300'>
        The letter L is in the word but in the wrong spot.
      </p>

      <div className='flex justify-center mb-1 mt-4'>
        <Cell value='V' />
        <Cell value='A' />
        <Cell value='G' />
        <Cell isRevealing={true} isCompleted={true} value='U' status='absent' />
        <Cell value='E' />
      </div>
      <p className='text-sm text-gray-500 dark:text-gray-300'>
        The letter U is not in the word in any spot.
      </p>
      <div className='mt-5 sm:mt-6 dark:text-white'>
        <button
          type='button'
          className='mt-2 w-full rounded-md border border-transparent shadow-sm px-4 py-4 bg-green-600 font-bold font-large text-white hover:bg-green-700 focus:outline-none'
          onClick={() => {
            handleClose()
          }}
        >
          {INFO_CONTINUE_TEXT}
        </button>
      </div>

      {/*<p className="mt-4 italic text-xs text-gray-500 dark:text-gray-300">*/}
      {/*  This is an MIT Media Lab research project based on the word game we all know and*/}
      {/*  love, using {' '}*/}
      {/*  <a*/}
      {/*    href="https://github.com/cwackerfuss/react-wordle"*/}
      {/*    className="underline font-bold"*/}
      {/*  >*/}
      {/*    React-Wordle*/}
      {/*  </a>{'.'}*/}
      {/*</p>*/}
      <p className='mt-4 italic text-xs text-gray-500 dark:text-gray-300'>
        WordleLab is an MIT Media Lab project. Code base on &nbsp;
        <a
          href='https://github.com/cwackerfuss/react-wordle' target='_blank'
          className='underline font-bold'
        >
          React-Wordle
        </a>. Teddy is used under <a
        href='https://rive.app/community/2244-4463-animated-login-screen/' target='_blank'
        className='underline font-bold'
      >Creative Commons</a>.
      </p>
    </BaseModal>
  )
}
