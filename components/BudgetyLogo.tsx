import React from 'react'

const BudgetyLogo: React.FC = () => {
  return (
    <div className='flex flex-col items-center'>
      <svg
        width='200'
        height='50'
        viewBox='0 0 200 50'
        xmlns='http://www.w3.org/2000/svg'
      >
        <defs>
          <linearGradient id='gradient' x1='0%' y1='0%' x2='100%' y2='0%'>
            <stop offset='0%' stopColor='#60a5fa' />
            <stop offset='50%' stopColor='#c084fc' />
            <stop offset='100%' stopColor='#f472b6' />
          </linearGradient>
        </defs>
        <text
          x='100'
          y='40'
          fontFamily='Arial, sans-serif'
          fontSize='40'
          fontWeight='bold'
          textAnchor='middle'
          fill='url(#gradient)'
        >
          Budgety
        </text>
      </svg>
      <p className='text-sm text-gray-600 mt-1'>A fun financial app for kids</p>
    </div>
  )
}

export default BudgetyLogo
