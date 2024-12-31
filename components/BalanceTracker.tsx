import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import {
  PiggyBank,
  PlusCircle,
  MinusCircle,
  ChevronDown,
  ChevronUp,
} from 'lucide-react'
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group'
import { useBalance } from '@/contexts/BalanceContext'
import { useToast } from '@/hooks/use-toast'
import { useState } from 'react'

export default function BalanceTracker() {
  const { balance, setBalance } = useBalance()
  const [amount, setAmount] = useState('')
  const [isAdding, setIsAdding] = useState(true)
  const { toast } = useToast()
  const [isCollapsed, setIsCollapsed] = useState(false)

  const toggleCollapse = () => {
    setIsCollapsed(!isCollapsed)
  }

  const updateBalance = () => {
    const value = parseFloat(amount)
    if (!isNaN(value) && value > 0) {
      setBalance((prevBalance) =>
        isAdding ? prevBalance + value : Math.max(0, prevBalance - value)
      )
      setAmount('')
      toast({
        title: isAdding ? 'Yay! Money Added! 💰' : 'Money Taken Out 🎈',
        description: `$${value.toLocaleString('en-US', {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        })} has been ${isAdding ? 'added to' : 'taken from'} your piggy bank!`,
      })
    } else {
      toast({
        title: "Oops! That's not right 🤔",
        description: 'Please enter a number bigger than zero.',
        variant: 'destructive',
      })
    }
  }

  const previewBalance = () => {
    const value = parseFloat(amount)
    if (!isNaN(value)) {
      return isAdding ? balance + value : Math.max(0, balance - value)
    }
    return balance
  }

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      updateBalance()
    }
  }

  const formatNumber = (num: number) => {
    return num.toLocaleString('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })
  }

  return (
    <Card className='bg-gradient-to-r from-blue-200 to-purple-200 p-4 rounded-lg shadow sticky top-0 z-50'>
      <div className='bg-gray-100 p-2 rounded-lg shadow-lg mb-4'>
        <p className='text-sm text-gray-700 font-semibold'>Hello</p>
      </div>
      <div className='flex flex-col gap-4'>
        <div className='flex justify-between items-center'>
          <h2 className='text-2xl font-bold flex items-center text-blue-800'>
            <PiggyBank className='mr-2' /> My Money
          </h2>
          <div className='flex items-center'>
            <p className='text-3xl font-bold mr-4 text-blue-600'>
              ${formatNumber(balance)}
            </p>
            <Button variant='ghost' size='icon' onClick={toggleCollapse}>
              {isCollapsed ? <ChevronDown /> : <ChevronUp />}
            </Button>
          </div>
        </div>
        {!isCollapsed && (
          <div
            className={`transition-all duration-300 ease-in-out overflow-hidden ${
              isCollapsed ? 'max-h-0 opacity-0' : 'max-h-[1000px] opacity-100'
            }`}
          >
            {amount && (
              <p className='text-xl mb-4 text-purple-600'>
                Preview: ${formatNumber(previewBalance())}
                <span className='text-sm ml-2 text-blue-600'>
                  ({isAdding ? '+' : '-'}${formatNumber(parseFloat(amount))})
                </span>
              </p>
            )}
            <div className='flex items-center gap-2'>
              <Input
                id='amount'
                type='number'
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                onKeyDown={handleKeyPress}
                placeholder={isAdding ? 'Add money' : 'Take out money'}
                className='flex-grow text-lg h-12 bg-white'
              />
              <ToggleGroup
                type='single'
                value={isAdding ? 'add' : 'subtract'}
                onValueChange={(value) => setIsAdding(value === 'add')}
              >
                <ToggleGroupItem
                  value='add'
                  aria-label='Toggle add'
                  className='h-12 px-4 py-2 rounded-md cursor-pointer transition-colors hover:bg-purple-400 hover:text-white data-[state=on]:bg-purple-400 data-[state=on]:text-white'
                >
                  <PlusCircle className='w-6 h-6' />
                </ToggleGroupItem>
                <ToggleGroupItem
                  value='subtract'
                  aria-label='Toggle subtract'
                  className='h-12 px-4 py-2 rounded-md cursor-pointer transition-colors hover:bg-purple-400 hover:text-white data-[state=on]:bg-purple-400 data-[state=on]:text-white'
                >
                  <MinusCircle className='w-6 h-6' />
                </ToggleGroupItem>
              </ToggleGroup>
              <Button
                onClick={updateBalance}
                className='h-12 bg-blue-500 hover:bg-blue-600'
              >
                Update
              </Button>
            </div>
          </div>
        )}
      </div>
    </Card>
  )
}
