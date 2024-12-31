import { Card } from '@/components/ui/card'
import { PiggyBank } from 'lucide-react'
import { useBalance } from '@/contexts/BalanceContext'

export default function BalanceDisplay() {
  const { balance } = useBalance()

  const formatNumber = (num: number) => {
    return num.toLocaleString('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })
  }

  return (
    <Card className='bg-gradient-to-r from-blue-200 to-purple-200 p-4 rounded-lg shadow sticky top-0 z-50'>
      <div className='flex justify-between items-center'>
        <h2 className='text-2xl font-bold flex items-center text-blue-800'>
          <PiggyBank className='mr-2' /> My Money
        </h2>
        <div className='flex items-center'>
          <p className='text-3xl font-bold text-blue-600'>
            ${formatNumber(balance)}
          </p>
        </div>
      </div>
    </Card>
  )
}
