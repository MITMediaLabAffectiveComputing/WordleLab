import { ChartBarIcon, CogIcon, InformationCircleIcon } from '@heroicons/react/outline'
import { GAME_TITLE } from '../../constants/strings'
import { getNumberOfRounds } from '../../constants/wordlist'
import { getIsBonusRoundActive } from '../../lib/localStorage'

type Props = {
  setIsInfoModalOpen: (value: boolean) => void
  setIsStatsModalOpen: (value: boolean) => void
  setIsSettingsModalOpen: (value: boolean) => void
  roundIndex: number
}

export const Navbar = ({
                         setIsInfoModalOpen,
                         setIsStatsModalOpen,
                         setIsSettingsModalOpen,
                         roundIndex
                       }: Props) => {
  return (
    <div className=' bg-white mb-2'>
      <div className='navbar-content px-5'>
        <InformationCircleIcon
          className='h-6 w-6 mr-2 cursor-pointer dark:stroke-white'
          onClick={() => setIsInfoModalOpen(true)}
        />
        <p className='text-xl ml-2.5 font-bold dark:text-white text-center'>
          <span
            className=' text-lg block leading-3 mt-2 sm:mt-0 sm:leading-4 sm:inline sm:text-xl'>{GAME_TITLE}</span>
          <span className=' hidden sm:inline'> - </span>
          <span className='block font-normal text-base mt-1 sm:inline sm:text-xl sm:font-bold sm:inline'>{
            getIsBonusRoundActive() ?
              ('Bonus Round ' + (roundIndex + 1 - getNumberOfRounds()) + ' of ∞')
              : ('Round ' + (roundIndex + 1) + ' of ' + getNumberOfRounds())
          }</span>
        </p>
        <div className='right-icons'>
          <ChartBarIcon
            className='h-6 w-6 mr-3 cursor-pointer dark:stroke-white'
            onClick={() => setIsStatsModalOpen(true)}
          />
          <CogIcon
            className='h-6 w-6 cursor-pointer dark:stroke-white'
            onClick={() => setIsSettingsModalOpen(true)}
          />
        </div>
      </div>
      <hr></hr>
    </div>
  )
}
