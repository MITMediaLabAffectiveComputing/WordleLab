import { Histogram } from '../stats/Histogram'
import { GameStats } from '../../lib/localStorage'
import { BaseModal } from './BaseModal'
import { GUESS_DISTRIBUTION_TEXT, STATISTICS_TITLE } from '../../constants/strings'
import { getWordsList } from '../../constants/wordlist'

type Props = {
  isOpen: boolean
  handleClose: () => void
  guesses: string[]
  gameStats: GameStats
  isGameLost: boolean
  isGameWon: boolean
  handleShareToClipboard: () => void
  isHardMode: boolean
  isDarkMode: boolean
  isHighContrastMode: boolean
  numberOfGuessesMade: number
}

export const StatsModal = ({
                             isOpen,
                             handleClose,
                             guesses,
                             gameStats,
                             isGameLost,
                             isGameWon,
                             handleShareToClipboard,
                             isHardMode,
                             isDarkMode,
                             isHighContrastMode,
                             numberOfGuessesMade
                           }: Props) => {
  if (gameStats.totalGames <= 0) {
    return (
      <BaseModal
        title={STATISTICS_TITLE}
        isOpen={isOpen}
        handleClose={handleClose}
        showCloseButton={true}
      >
        <div className='mt-7'>
          <div className='text-lg mb-0.5 dark:text-white'>Current Round</div>
          <h4
            className='text-4xl mb-7 font-bold text-green-900 dark:text-green-500 rounded py-1'>{(gameStats.totalGames + 1) + ' of ' + getWordsList().length}</h4>
        </div>
        <h4 className='text-xl leading-6 mt-6 mb-2 font-medium text-gray-900 dark:text-gray-100'>
          {GUESS_DISTRIBUTION_TEXT}
        </h4>
        <div className='text-xl mb-0.5 dark:text-white mt-8'>No Statistics Yet!</div>
        <div className='text mb-8 dark:text-white mt-2'>Go play some games!</div>
      </BaseModal>
    )
  }
  return (
    <BaseModal
      title={STATISTICS_TITLE}
      isOpen={isOpen}
      handleClose={handleClose}
      showCloseButton={true}
    >
      {/*<div className='mt-7'>*/}
      {/*  <div className='text-lg mb-0.5 dark:text-white'>Current Round</div>*/}
      {/*  <h4*/}
      {/*    className='text-4xl mb-7 font-bold text-green-900 dark:text-green-500 rounded py-1'>{(gameStats.totalGames + 1) + ' of ' + getWordsList().length}</h4>*/}
      {/*</div>*/}
      <div className='border-solid border border-slate-300 rounded mt-7'>
        <h4
          className='text-lg py-2 text-slate-700 dark:text-white border-slate-300 border-b border-solid rounded-t'>
          {GUESS_DISTRIBUTION_TEXT}
        </h4>
        <div className='px-4 py-2'>
          <Histogram
            gameStats={gameStats}
            numberOfGuessesMade={numberOfGuessesMade}
            didWin={isGameWon}
          />
        </div>
      </div>

      <button
        type='button'
        className='mt-7 w-full rounded-md border border-transparent shadow-sm px-4 py-3 bg-green-600 font-bold font-large text-white hover:bg-green-700 focus:outline-none'
        onClick={() => {
          handleClose()
        }}
      >
        Close
      </button>
    </BaseModal>
  )
}
