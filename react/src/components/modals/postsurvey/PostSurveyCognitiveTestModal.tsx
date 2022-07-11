import { BaseModal } from '../BaseModal'
import { addPostSurveyData, getPostSurveyData, getUserData } from '../../../lib/localStorage'
import { useForm } from 'react-hook-form'
import React, { useState } from 'react'
import { ScaleLoader } from 'react-spinners'
import axios from 'axios'
import * as qs from 'querystring'
import { logPostsurveyEvent, logPostsurveySendEvent, postsurvey_events } from '../../../lib/logging'

type Props = {
  isOpen: boolean
  handleClose: (goBack: boolean) => void
}

export const PostSurveyCognitiveTestModal = ({ isOpen, handleClose }: Props) => {
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
    logPostsurveyEvent('cognitivetest', isOpen)
  }, [isOpen])

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, dirtyFields, touchedFields },
    getValues
  } = useForm({ mode: 'all' })
  const onSubmit = (data: object) => {
    if (isBusy) {
      return
    }
    setIsBusy(true)
    addPostSurveyData(data)

    logPostsurveySendEvent()
    const formData = { ...getPostSurveyData(), ...getUserData(), postsurvey_events: JSON.stringify(postsurvey_events) }
    axios.post('/api/postsurvey/', qs.stringify(formData))
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

  return (
    <BaseModal title='Post-Game Questionnaire' isOpen={isOpen} handleClose={() => {
      handleClose(false)
    }} showCloseButton={false} isCancelable={false} wide={true}
    >
      <div>
        <form className='mt-8' onSubmit={handleSubmit(onSubmit)}>

          <div className={'text-gray-800 text mx-10 dark:text-white text-left mb-3 '}>A bat and a ball cost $1.10 in
            total. The bat costs $1.00 more than the ball. How much does the ball cost?
          </div>
          <div className='relative max-w-sm mx-auto px-10'>
            <span className='mr-1 absolute left-0 text-3xl h-full ml-4 font-extralight dark:text-white'>$</span>
            <input
              {...register('baseballcost', { required: true, valueAsNumber: true })}
              className={'outline outline-1 outline-green-800 w-full px-4 py-2 rounded dark:bg-slate-800 dark:text-white dark:outline-green-300 ' + (errors['baseballcost'] && dirtyFields['baseballcost'] ? ' outline-rose-600 dark:outline-rose-300' : '')}
              type='number'
              step='0.01'
              min='0'
              max='500'
            />
          </div>
          <div className={'text-gray-800 text mx-10 dark:text-white text-left mb-3 mt-8 '}>If it takes 5 machines 5
            minutes to make 5 widgets, how long would it take 100 machines to make 100 widgets?
          </div>
          <div className='relative max-w-sm mx-auto px-10'>
            <span className='pr-0 relative w-full box-border inline-block'>

            <input
              {...register('widgettime', { required: true, valueAsNumber: true })}
              className={'outline outline-1 outline-green-800 w-full px-4 py-2 rounded dark:bg-slate-800 dark:text-white dark:outline-green-300 ' + (errors['widgettime'] && dirtyFields['widgettime'] ? ' outline-rose-600 dark:outline-rose-300' : '')}
              type='number'
              step='0.01'
              min='0'
              max='500'
            />
            </span>
            <span
              className='absolute left-full inline-block top-0 bottom-0 w-20 -ml-8 justify-center flex-col flex text-left'><span
              className=''>Minutes</span></span>
          </div>
          <div className={'text-gray-800 text mx-10 dark:text-white text-left mb-3 mt-8 '}>In a lake, there is a patch
            of lily pads. Every day, the patch doubles in size. If it takes 48 days for the patch to cover the entire
            lake, how long would it take for the patch to cover half of the lake?
          </div>
          <div className='relative max-w-sm mx-auto px-10'>
            <input
              {...register('lakedays', { required: true, valueAsNumber: true })}
              className={'outline outline-1 outline-green-800 w-full px-4 py-2 rounded dark:bg-slate-800 dark:text-white dark:outline-green-300 ' + (errors['lakedays'] && dirtyFields['lakedays'] ? ' outline-rose-600 dark:outline-rose-300' : '')}
              type='number'
              step='0.01'
              min='0'
              max='500'
            />
            <span
              className='absolute left-full inline-block top-0 bottom-0 w-20 -ml-8 justify-center flex-col flex text-left'><span
              className=''>Days</span></span>

          </div>

          <div className='mt-8 text-left'>
            <button
              autoFocus={true}
              disabled={isBusy}
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
              {isBusy ? ' ' : 'Submit'}
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
