import { Library } from 'lucide-react'
import React from 'react'

type NoDataProps = {
    label?: string
}

const NoData = ({label="No Data Found"}:NoDataProps) => {
  return (
    <div className='flex justify-center items-center flex-col'>
        <Library size={40} />
        <span className='font-semibold text-gray-700 text-center mt-3' >{label}</span>
    </div>
  )
}

export default NoData