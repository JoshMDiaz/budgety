import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { PlusCircle, MinusCircle, Wallet } from 'lucide-react'
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group'
import { useBalance } from '@/contexts/BalanceContext'
import { useToast } from '@/hooks/use-toast'

const formatNumber = (number: number) =>
  number.toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })

export default function BalanceForm() {
  const { balance, setBalance } = useBalance()
  const [amount, setAmount] = useState('')
  const [isAdding, setIsAdding] = useState(true)
  const [previewBalance, setPreviewBalance] = useState(balance)
  const { toast } = useToast()

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

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      updateBalance()
    }
  }

  return (
    <Card className='bg-gradient-to-r from-green-200 to-blue-200 p-4 rounded-lg shadow'>
      <h2 className='text-2xl font-bold mb-4 flex items-center text-blue-800'>
        <Wallet className='mr-2' /> Adjust Money
      </h2>
      <div className='flex items-center gap-2'>
        <Input
          id='amount'
          type='number'
          value={amount}
          onChange={(e) => {
            setAmount(e.target.value)
            const value = parseFloat(e.target.value)
            if (!isNaN(value)) {
              setPreviewBalance(
                isAdding ? balance + value : Math.max(0, balance - value)
              )
            } else {
              setPreviewBalance(balance)
            }
          }}
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
            className='h-12 px-4 py-2 rounded-md cursor-pointer transition-colors hover:bg-indigo-400 hover:text-white data-[state=on]:bg-indigo-400 data-[state=on]:text-white'
          >
            <PlusCircle className='w-6 h-6' />
          </ToggleGroupItem>
          <ToggleGroupItem
            value='subtract'
            aria-label='Toggle subtract'
            className='h-12 px-4 py-2 rounded-md cursor-pointer transition-colors hover:bg-indigo-400 hover:text-white data-[state=on]:bg-indigo-400 data-[state=on]:text-white'
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
      {amount && (
        <div className='mt-2 text-sm text-gray-600'>
          <p>
            Preview: ${formatNumber(previewBalance)}
            <span className='ml-1 text-xs'>
              ({isAdding ? '+' : '-'}${formatNumber(parseFloat(amount) || 0)})
            </span>
          </p>
        </div>
      )}
    </Card>
  )
}
