import { BaseModal } from '../BaseModal'
import { addPreSurveyData, getPrimedEmotion } from '../../../lib/localStorage'
import { PRIMING_EMOTION_EXAMPLES } from '../../../constants/strings'
import { useForm } from 'react-hook-form'
import React, { useState } from 'react'
import { logPresurveyEvent } from '../../../lib/logging'

type Props = {
  isOpen: boolean
  handleClose: (goBack: boolean) => void
}

const MIN_LENGTH = 150

const getQuestion = (primedEmotion: string) => {
  if (primedEmotion == 'control') {
    return 'What are three to five activities that you did today?'
  }
  return `What are the three to five things that fill you with ${primedEmotion}?`
}
const getSubQuestion = (primedEmotion: string) => {
  if (primedEmotion == 'control') {
    return 'Please write two-three sentences about each activity that you decide to share. (Examples of things you might write about include: walking, eating lunch, brushing your teeth, etc.)'
  }
  return `Please write two-three sentences about each thing that fill you with ${primedEmotion}. (Examples of things you might write about include: ${PRIMING_EMOTION_EXAMPLES[primedEmotion]}, etc.)`
}

export const EmotionPrimeModalOne = ({ isOpen, handleClose }: Props) => {
  const [isBusy, setIsBusy] = useState(false)
  const [characterCount, setCharacterCount] = useState(0)

  React.useEffect(() => {
    if (isOpen) {
      setIsBusy(false)
    }
  }, [isOpen])

  React.useEffect(() => {
    logPresurveyEvent('emotionprime1', isOpen)
  }, [isOpen])

  const { register, handleSubmit, watch, formState: { errors } } = useForm({ mode: 'all' })
  const onSubmit = (data: object) => {
    if (isBusy) {
      return
    }
    setIsBusy(true)
    addPreSurveyData(data)
    handleClose(false)
  }
  const formIsValid = Object.keys(errors).length == 0
  const primedEmotion = getPrimedEmotion()

  return (
    <BaseModal title='Pre-Game Questionnaire' isOpen={isOpen} handleClose={() => {
      handleClose(false)
    }} showCloseButton={false} isCancelable={false} wide={true}
    >
      <div>
        <form className='mt-8' onSubmit={handleSubmit(onSubmit)}>

          <div
            className={'text-gray-800 text-lg mx-2 dark:text-white text-left mb-1 '}>{getQuestion(primedEmotion)}</div>
          <div
            className={'text-gray-800 text-sm mx-2 dark:text-white text-left mb-4 '}>{getSubQuestion(primedEmotion)}</div>
          <div className=' mx-2'>
          <textarea
            {...register('emotionprime1', {
              minLength: MIN_LENGTH,
              required: true,
              onChange: (e) => setCharacterCount(e.target.value.length)
            })}
            className='outline outline-1 outline-green-800 w-full px-4 py-2 rounded dark:bg-slate-800 dark:text-white dark:outline-green-300'
            style={{ resize: 'none', height: '200px' }}

          />
          </div>
          <div
            className={'text-right text-sm dark:text-white mx-2 ' + (!errors.emotionprime1 ? ' text-green-500 dark:text-green-400' : '')}>{characterCount} characters
            (minimum {MIN_LENGTH} characters)
          </div>

          <div className='mt-8 text-left'>
            <button
              autoFocus={true}
              type='button'
              className='rounded-md dark:bg-slate-800 dark:text-green-400 dark:outline-2 text-sm ml-2 font-bold px-3 py-1 bg-white outline outline-1 outline-green-600 text-green-600 hover:text-green-700'
              onClick={() => {
                handleClose(true)
              }}
            >
              « Back
            </button>
            <button
              autoFocus={true}
              disabled={!formIsValid}
              type='submit'
              className='mt-2 w-full rounded-md border border-transparent shadow-sm px-4 h-14 py-2 bg-green-600 font-bold text-xl text-white hover:bg-green-700 focus:outline-none disabled:bg-gray-400 dark:bg-green-500'
            >
              {MIN_LENGTH - characterCount <= 0 ? 'Next »' : `${MIN_LENGTH - characterCount} ${MIN_LENGTH - characterCount == 1 ? 'Character' : 'Characters'} Remaining`}
            </button>
          </div>
        </form>
      </div>
    </BaseModal>
  )
}
