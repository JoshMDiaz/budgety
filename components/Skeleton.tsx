import React from 'react'

const Skeleton: React.FC = () => {
  return (
    <div className='container mx-auto p-4 max-w-4xl'>
      <div className='mb-6 flex flex-col items-center'>
        <div className='w-48 h-12 bg-gradient-to-r from-blue-200 to-purple-200 rounded-lg animate-pulse'></div>
        <div className='w-36 h-4 mt-2 bg-gray-200 rounded animate-pulse'></div>
      </div>
      <div className='space-y-4'>
        <div className='h-32 bg-gradient-to-r from-blue-200 to-purple-200 rounded-lg animate-pulse'></div>
        <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
          {[...Array(4)].map((_, i) => (
            <div
              key={i}
              className='h-48 bg-gradient-to-r from-pink-200 to-purple-200 rounded-lg animate-pulse'
            ></div>
          ))}
        </div>
        <div className='h-32 bg-gradient-to-r from-blue-200 to-purple-200 rounded-lg animate-pulse'></div>
      </div>
    </div>
  )
}

export default Skeleton
