import { BaseModal } from '../BaseModal'
import { addPreSurveyData } from '../../../lib/localStorage'
import { useController, UseControllerProps, useForm } from 'react-hook-form'
import React, { useState } from 'react'
import { logPresurveyEvent } from '../../../lib/logging'

type Props = {
  isOpen: boolean
  handleClose: (goBack: boolean) => void
}

interface RadioInputProps extends UseControllerProps {
  choices: Array<string>
  question: string
}

function RadioInput(props: RadioInputProps) {
  const { field, fieldState } = useController(props)
  return (
    <div>
      <div
        className={'text-gray-800 text-lg px-1 text-center mb-1 dark:text-white  max-w-sm mx-auto'}>{props.question}</div>
      <div className='align-top grid grid-cols-2 pt-1 gap-x-3 gap-y-1 mb-6 max-w-sm mx-auto'
           style={{ 'columnFill': 'balance' }}>
        {props.choices.map(function(value, i) {
          return <label key={i}
                        className={'inline-block dark:text-white text-left block w-full mb-0.5 mt-1 cursor-pointer mx-auto outline px-4 py-2 outline-1 rounded' + (field.value == value.toLowerCase() ? ' bg-green-400 outline-green-400 text-white' : ' outline-slate-300 dark:outline-green-300')}>
            <input className='w-0' {...field} value={value.toLowerCase()} type='radio' />
            <span className=''>{value}</span>
          </label>
        })}
      </div>
    </div>
  )
}

export const PreSurveyModal = ({ isOpen, handleClose }: Props) => {
  const [isBusy, setIsBusy] = useState(false)

  const { register, handleSubmit, watch, formState: { errors }, control } = useForm({ mode: 'all' })

  React.useEffect(() => {
    if (isOpen) {
      setIsBusy(false)
    }
  }, [isOpen])

  React.useEffect(() => {
    logPresurveyEvent('demographics', isOpen)
  }, [isOpen])

  const onSubmit = (data: object) => {
    if (isBusy) {
      return
    }
    setIsBusy(true)
    addPreSurveyData(data)
    handleClose(false)
  }
  const formIsValid = Object.keys(errors).length == 0

  return (
    <BaseModal title='Pre-Game Questionnaire' isOpen={isOpen} handleClose={() => {
      handleClose(false)
    }} showCloseButton={false} isCancelable={false} wide={true}
    >
      <div>

        <form className='mt-6' onSubmit={handleSubmit(onSubmit)}>

          <RadioInput control={control} choices={['0', '1', '2-10', '11-100', '101+']}
                      question='How many times have you played Wordle?' name='wordleplayfrequency'
                      rules={{ required: true }} />

          <RadioInput control={control} choices={['Yes', 'No']} question='Are you a native English speaker?'
                      name='nativeenglish' rules={{ required: true }} />

          <div className='mt-8'>
            <button
              autoFocus={true}
              disabled={!formIsValid}
              type='submit'
              className='mt-2 w-full rounded-md border border-transparent shadow-sm px-4 h-14 py-2 bg-green-600 font-bold text-xl text-white hover:bg-green-700 focus:outline-none disabled:bg-gray-400 dark:bg-green-500'
            >
              Next »
            </button>
          </div>
        </form>
      </div>
    </BaseModal>
  )
}
