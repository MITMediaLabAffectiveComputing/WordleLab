import classNames from 'classnames'

type Props = {
  index: number
  size: number
  label: string
  currentDayStatRow: boolean
}

export const Progress = ({ index, size, label, currentDayStatRow }: Props) => {
  const currentRowClass = classNames(
    'text-xs font-bold text-white text-center p-1 rounded',
    { 'bg-green-600 dark:bg-green-400': currentDayStatRow, 'bg-green-700 dark:bg-green-500': !currentDayStatRow }
  )
  return (
    <div className="flex justify-left m-1">
      <div className="items-center justify-center w-2 py-0.5">{index + 1}</div>
      <div className="w-full ml-2">
        <div style={{ width: `${8 + size}%` }} className={currentRowClass}>
          {label}
        </div>
      </div>
    </div>
  )
}
