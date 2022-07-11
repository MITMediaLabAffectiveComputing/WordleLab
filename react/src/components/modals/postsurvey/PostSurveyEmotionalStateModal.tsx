import { BaseModal } from '../BaseModal'
import { addPostSurveyData } from '../../../lib/localStorage'
import React, { useState } from 'react'
import { logPostsurveyEvent } from '../../../lib/logging'
import RangeSlider from 'react-bootstrap-range-slider'
import 'react-bootstrap-range-slider/dist/react-bootstrap-range-slider.css'

type Props = {
  isOpen: boolean
  handleClose: () => void
}

export const PostSurveyEmotionalStateModal = ({ isOpen, handleClose }: Props) => {
  const [isBusy, setIsBusy] = useState(false)
  const [arousal, setArousal] = useState(50)
  const [pleasure, setPleasure] = useState(50)
  const [didInteractWithArousal, setDidInteractWithArousal] = useState(false)
  const [didInteractWithPleasure, setDidInteractWithPleasure] = useState(false)

  React.useEffect(() => {
    if (isOpen) {
      setIsBusy(false)
    }
  }, [isOpen])

  React.useEffect(() => {
    logPostsurveyEvent('emotionalstate', isOpen)
  }, [isOpen])

  const onSubmit = () => {
    if (isBusy) {
      return
    }
    setIsBusy(true)
    addPostSurveyData({ valence: pleasure, arousal: arousal })
    handleClose()
  }
  const formIsValid = didInteractWithArousal && didInteractWithPleasure

  return (
    <BaseModal title='How are you feeling right now?' isOpen={isOpen} handleClose={() => {
      handleClose()
    }} showCloseButton={false} isCancelable={false} wide={true}
    >
      <div className=' text-center'>
        <form className='mt-8' onSubmit={e => e.preventDefault()}>

          <div className={'text-gray-900 text-lg mx-10 dark:text-white mb-1 mt-8 font-medium'}>
            Please move the slider to rate your valence.
          </div>
          <div className={'text-gray-700 text-sm mx-10 dark:text-white mb-3 '}>
            (Valence is how positive or negative you’re feeling)
          </div>
          <div className='relative max-w-sm mx-auto px-10 relative mt-3 pb-4'>
            <div className='relative'>
              <div className='z-10'>
                <RangeSlider
                  value={pleasure}
                  tooltip={'off'}
                  variant={'success'}
                  inputProps={{ name: 'valence' }}
                  onChange={changeEvent => {
                    setPleasure(parseInt(changeEvent.target.value))
                    setDidInteractWithPleasure(true)
                  }}
                />
              </div>
              <div
                className='h-4 w-full bg-gradient-to-r from-slate-500 via-transparent to-slate-500 relative -mt-1'>
                <div className='absolute top-0 left-0 right-0 bottom-0 bg-white'
                     style={{ 'clipPath': 'polygon(50% 50%, 0% 100%, 100% 100%)' }} />
                <div className='absolute top-0 left-0 right-0 bottom-0 bg-white'
                     style={{ 'clipPath': 'polygon(50% 50%, 0% 0%, 100% 0%)' }} />
              </div>
              <div className='absolute right-full mr-3 top-2 bottom-0 justify-center flex flex-col w-12 h-12'>
                <img src='/images/sad.png' className='h-full w-full' />
              </div>
              <div className='absolute left-full ml-3 top-2 bottom-0 justify-center flex flex-col w-12 h-12'>
                <img src='/images/happy.png' className='h-full w-full' />
              </div>
            </div>
          </div>

          <div className={'text-gray-900 text-lg mx-10 dark:text-white mb-1 mt-8 font-medium'}>
            Please move the slider to rate your level of arousal.
          </div>
          <div className={'text-gray-700 text-sm mx-10 dark:text-white mb-3 '}>
            (Arousal is how high energy or low energy you’re feeling)
          </div>
          <div className='relative max-w-sm mx-auto px-10 relative mt-3 pb-4'>
            <div className='relative'>
              <div className='z-10'>
                <RangeSlider
                  value={arousal}
                  tooltip={'off'}
                  variant={'success'}
                  inputProps={{ name: 'arousal' }}
                  onChange={changeEvent => {
                    setArousal(parseInt(changeEvent.target.value))
                    setDidInteractWithArousal(true)
                  }}
                />
              </div>
              <div
                className='h-4 w-full bg-gradient-to-r from-slate-500 via-transparent to-slate-500 relative -mt-1 rounded-4'>
                <div className='absolute top-0 left-0 right-0 bottom-0 bg-white'
                     style={{ 'clipPath': 'polygon(50% 50%, 0% 100%, 100% 100%)' }} />
                <div className='absolute top-0 left-0 right-0 bottom-0 bg-white'
                     style={{ 'clipPath': 'polygon(50% 50%, 0% 0%, 100% 0%)' }} />
              </div>
              <div className='absolute right-full mr-3 top-2 bottom-0 justify-center flex flex-col w-12 h-12'>
                <img src='/images/tired.png' className='h-full w-full' />
              </div>
              <div className='absolute left-full ml-3 top-2 bottom-0 justify-center flex flex-col w-12 h-12'>
                <img src='/images/wired.png' className='h-full w-full' />
              </div>
            </div>
          </div>

          <div className='mt-8 text-left'>
            <button
              autoFocus={true}
              disabled={!formIsValid}
              onClick={onSubmit}
              className='mt-2 w-full rounded-md border border-transparent shadow-sm px-4 h-14 py-2 bg-green-600 font-bold text-xl text-white hover:bg-green-700 focus:outline-none disabled:bg-gray-400 dark:bg-green-500'
            >
              {formIsValid ? 'Next »' : 'Please adjust both sliders'}
            </button>
          </div>
        </form>
      </div>
    </BaseModal>
  )
}
