type ProgressBarProps = {
    value: number
  }
  
  export function ProgressBar({ value }: ProgressBarProps) {
    return (
      <div className="w-full bg-gray-700 rounded-full h-2.5">
        <div className="bg-blue-600 h-2.5 rounded-full" style={{ width: `${value}%` }}></div>
      </div>
    )
  }
  
  