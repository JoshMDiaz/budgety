import { useState, useEffect } from 'react'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { LightbulbIcon } from 'lucide-react'

const tips = [
  'Save a portion of your allowance each week.',
  'Before buying something, ask yourself if you really need it.',
  'Set savings goals for things you want to buy.',
  'Ask your parents how you can earn extra money.',
  'Keep track of your spending to see where your money goes.',
  'Donate some of your money to help others.',
  'Learn the difference between needs and wants.',
  'Try to find less expensive alternatives for things you want.',
  'Be patient when saving for something big.',
  'Ask your parents to match your savings to help you reach your goals faster.',
]

export default function FinancialTip() {
  const [tip, setTip] = useState('')

  useEffect(() => {
    const randomTip = tips[Math.floor(Math.random() * tips.length)]
    setTip(randomTip)
  }, [])

  return (
    <Card className='h-full'>
      <CardHeader>
        <CardTitle className='flex items-center'>
          <LightbulbIcon className='mr-2' /> Money Tip
        </CardTitle>
        <CardDescription>Learn something new about money!</CardDescription>
      </CardHeader>
      <CardContent className='min-h-[100px]'>
        <p>{tip}</p>
      </CardContent>
    </Card>
  )
}
