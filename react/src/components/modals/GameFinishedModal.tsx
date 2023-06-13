import { GameStats, getHasEnhancedFeedback } from '../../lib/localStorage'
import { BaseModal } from './BaseModal'
import { getWordsList } from '../../constants/wordlist'
import { GUESS_DISTRIBUTION_TEXT, NEXT_GAME_TEXT } from '../../constants/strings'
import { getSolution } from '../../lib/words'
import { ModalFeedbackMessage } from '../ModalFeedbackMessage'
import { StatBar } from '../stats/StatBar'
import { Histogram } from '../stats/Histogram'

type Props = {
  isOpen: boolean
  handleClose: (noMoreRounds: boolean) => void
  gameStats: GameStats
  isGameWon: boolean
  numberOfGuessesMade: number
  TextStatus: boolean
  ChatGPTStatus: boolean
}

export const GameFinishedModal = ({
                                    isOpen,
                                    handleClose,
                                    gameStats,
                                    isGameWon,
                                    numberOfGuessesMade,
                                    TextStatus,
                                    ChatGPTStatus
                                  }: Props) => {

  return (
    <BaseModal
      title={`Round ${gameStats.totalGames} Results`}
      isOpen={isOpen}
      handleClose={() => {
        handleClose(true)
      }}
      showCloseButton={false}
    >
      <div className='h-1'></div>
      {!isGameWon && (
        <div className='mt-1 mb-0'>
          <div className='text-lg mb-0 dark:text-white'>The correct word was</div>
          <h4
            className='text-4xl mb-4 font-bold text-green-900 rounded py-0.5 dark:text-green-200'>{getSolution()}</h4>
        </div>
      )}

      <ModalFeedbackMessage numberOfGuessesMade={numberOfGuessesMade} didWin={isGameWon} isIntro={false}
                            isOpen={isOpen} TextStatus={TextStatus} ChatGPTStatus={ChatGPTStatus}/>
      <div className='h1'>
      </div>
      {/*{isGameWon && (*/}
      {/*  <div className='mt-3 mb-5'>*/}
      {/*    <div className='text-lg mb-0 dark:text-white'>You got the solution in</div>*/}
      {/*    <h4*/}
      {/*      className='text-4xl mb-2 font-bold text-green-900 dark:text-green-500 rounded py-1'>{`${numberOfGuessesMade} ${numberOfGuessesMade > 1 ? 'Guesses' : 'Guess'}!`}</h4>*/}
      {/*  </div>*/}
      {/*)}*/}
      <StatBar gameStats={gameStats} />
      <div className='border-solid border border-slate-300 rounded'>
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
      <div className='mt-5 sm:mt-6 dark:text-white'>
        {!isGameWon && getHasEnhancedFeedback() && false && (
          <div>
            <div className='font-medium mb-0.5 dark:text-white'>Well Done!
            </div>
            <div className='text mb-2 dark:text-white'>That was an extra hard word. Most people struggle with it, but
              you were really close!
            </div>
          </div>
        )}
        <button
          type='button'
          className='mt-1 w-full rounded-md border border-transparent shadow-sm px-4 py-4 bg-green-600 font-bold font-large text-white hover:bg-green-700 focus:outline-none'
          onClick={() => {
            handleClose(gameStats.totalGames >= getWordsList().length)
          }}
        >
          {gameStats.totalGames >= getWordsList().length ? 'To Step Three!' : NEXT_GAME_TEXT}
        </button>
      </div>
    </BaseModal>
  )
}
