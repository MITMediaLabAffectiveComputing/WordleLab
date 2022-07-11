import { Fragment } from 'react'
import { Transition } from '@headlessui/react'

type Props = {
  isOpen: boolean
}

export const ModalBackground = (props: Props) => {
  const { isOpen } = props
  return (
    <Transition
      show={isOpen}
      as={Fragment}
      appear
      enter='ease-out duration-300'
      enterFrom='opacity-0'
      enterTo='opacity-100'
      leave='ease-in duration-200'
      leaveFrom='opacity-100'
      leaveTo='opacity-0'
    >
      <div>
        {/*<div className='flex items-center justify-center min-h-screen py-10 px-4 text-center sm:block sm:p-0'>*/}
        <div className='fixed inset-0 bg-gray-700 dark:bg-gray-900 bg-opacity-75' />
        {/*</div>*/}
      </div>
    </Transition>
  )
}
