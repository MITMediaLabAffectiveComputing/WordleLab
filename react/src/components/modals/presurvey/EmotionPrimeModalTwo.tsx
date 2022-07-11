import { BaseModal } from '../BaseModal'
import { addPreSurveyData, getPreSurveyData, getPrimedEmotion, getUserData } from '../../../lib/localStorage'
import { useForm } from 'react-hook-form'
import React, { useState } from 'react'
import { ScaleLoader } from 'react-spinners'
import axios from 'axios'
import * as qs from 'querystring'
import { logPresurveyEvent, logPresurveySendEvent, presurvey_events } from '../../../lib/logging'

type Props = {
  isOpen: boolean
  handleClose: (goBack: boolean) => void
}

const MIN_LENGTH = 150

const getQuestion = (primedEmotion: string) => {
  if (primedEmotion == 'control') {
    return 'Now, we’d like you to describe in more detail the way you typically spend your evenings.'
  }
  return `Now, we’d like you to describe in more detail the one situation that makes you (or has made you) experience the most ${primedEmotion}.`
}
const getSubQuestion = (primedEmotion: string) => {
  if (primedEmotion == 'control') {
    return 'Begin by writing\n' +
      'down a description of your activities and then figure out how much time you devote to each activity.\n' +
      'Examples of things you might describe include eating dinner, studying for an exam, working, talking to\n' +
      'friends, watching TV, etc. If you can, please write your description so that someone reading this might be\n' +
      'able to reconstruct the way in which you, specifically, spend your evenings.'
  }
  return `This could be something you are presently experiencing or something from the past. Begin by writing
down what you remember of the ${primedEmotion}-inducing event(s) and continue by writing as detailed a description
of the event(s) as is possible. If you can, please write your description so that someone reading this might even feel ${primedEmotion} just from learning about the situation. What is it like to be in this situation? Why does it make
you so feel such ${primedEmotion}?`
}

export const EmotionPrimeModalTwo = ({ isOpen, handleClose }: Props) => {
  const [isBusy, setIsBusy] = useState(false)
  const [characterCount, setCharacterCount] = useState(0)
  const [didError, setDidError] = useState(false)

  React.useEffect(() => {
    if (isOpen) {
      setIsBusy(false)
      setDidError(false)
    }
  }, [isOpen])

  React.useEffect(() => {
    logPresurveyEvent('emotionprime2', isOpen)
  }, [isOpen])

  const { register, handleSubmit, watch, formState: { errors } } = useForm({ mode: 'all' })
  const onSubmit = (data: object) => {
    if (isBusy) {
      return
    }
    setIsBusy(true)
    addPreSurveyData(data)

    logPresurveySendEvent()
    const formData = { ...getPreSurveyData(), ...getUserData(), presurvey_events: JSON.stringify(presurvey_events) }
    axios.post('/api/presurvey/', qs.stringify(formData))
      .then(function(response) {
        setDidError(false)
        handleClose(false)
      })
      .catch(function(error) {
        setDidError(true)
        setIsBusy(false)
      })
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
            className={'text-gray-800 text-lg mx-3 dark:text-white text-left mb-1 '}>{getQuestion(primedEmotion)}</div>
          <div
            className={'text-gray-800 text-sm mx-3 dark:text-white text-left mb-4 '}>{getSubQuestion(primedEmotion)}</div>
          <div className=' mx-2'>
          <textarea
            {...register('emotionprime2', {
              minLength: MIN_LENGTH,
              required: true,
              onChange: (e) => setCharacterCount(e.target.value.length)
            })}
            className='outline outline-1 outline-green-800 w-full px-4 py-2 rounded dark:bg-slate-800 dark:text-white dark:outline-green-300'
            style={{ resize: 'none', height: '200px' }}

          />
          </div>
          <div
            className={'text-right text-sm dark:text-white mx-2 ' + (!errors.emotionprime2 ? ' text-green-500 dark:text-green-400' : '')}>{characterCount} characters
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
              <ScaleLoader color={'#ffffff'} loading={isBusy} css='display: block; margin: -5px auto;'
                           speedMultiplier={.7} />
              {isBusy ? ' ' : (MIN_LENGTH - characterCount <= 0 ? 'Submit' : `${MIN_LENGTH - characterCount} ${MIN_LENGTH - characterCount == 1 ? 'Character' : 'Characters'} Remaining`)}
              {}
            </button>
            {didError && (<div className='text font-bold text-rose-700 mt-3 text-center'>
              Oh no! We had an error submitting your form. Please try again!
            </div>)}
          </div>
        </form>
      </div>
    </BaseModal>
  )
}
