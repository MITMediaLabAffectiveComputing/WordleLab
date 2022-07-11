import { Fragment } from 'react'
import { Dialog, Transition } from '@headlessui/react'
import { XIcon } from '@heroicons/react/outline'

type Props = {
  title: string
  children: React.ReactNode
  isOpen: boolean
  handleClose: () => void
  showCloseButton: boolean
  isCancelable?: boolean
  wide?: boolean
}

export const BaseModal = (props: Props) => {
  const { title, children, isOpen, handleClose, showCloseButton } = props
  const isCancelable = props.isCancelable === undefined || props.isCancelable
  const wide = props.wide
  return (
    <Transition.Root show={isOpen} as={Fragment}>
      <Dialog
        as='div'
        className='fixed z-10 inset-0 overflow-y-auto'
        onClose={() => {
          if (isCancelable) {
            handleClose()
          }
        }}
      >
        <div className='flex items-center justify-center min-h-screen py-10 px-4 text-center sm:block sm:p-0'>
          <Dialog.Overlay className='fixed inset-0' />

          {/* This element is to trick the browser into centering the modal contents. */}
          <span
            className='hidden sm:inline-block sm:align-middle sm:h-screen'
            aria-hidden='true'
          >
            &#8203;
          </span>
          <Transition.Child
            as={Fragment}
            enter='ease-out duration-300'
            enterFrom='opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95'
            enterTo='opacity-100 translate-y-0 sm:scale-100'
            leave='ease-in duration-200'
            leaveFrom='opacity-100 translate-y-0 sm:scale-100'
            leaveTo='opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95'
            afterLeave={() => {
              document.documentElement.setAttribute('style', '')
            }}
            afterEnter={() => {
              document.documentElement.setAttribute('style', 'overflow: hidden; padding-right: 0px;')
            }}
          >
            <div
              className={'inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:p-6 dark:bg-gray-800 ' + (wide ? ' max-w-screen-sm w-full' : ' max-w-sm w-full')}>
              <div className='absolute right-6 top-5'>
                {showCloseButton && isCancelable && (
                  <XIcon
                    className='h-8 w-6 cursor-pointer dark:stroke-white'
                    onClick={() => handleClose()}
                  />
                )}
              </div>
              <div>
                <div className='text-center'>
                  <Dialog.Title
                    as='h3'
                    className='text-xl leading-2 mb-4 font-medium text-gray-900 dark:text-gray-100'
                  >
                    {title}
                  </Dialog.Title>
                  <div className=''>{children}</div>
                </div>
              </div>
            </div>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition.Root>
  )
}
