import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Wallet } from 'lucide-react'
import { useBalance } from '@/contexts/BalanceContext'
import { useToast } from '@/hooks/use-toast'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Label } from '@/components/ui/label'

const formatNumber = (number: number) =>
  number.toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })

type BalanceAction = 'set' | 'add' | 'subtract'

export default function BalanceForm() {
  const { balance, setBalance } = useBalance()
  const [amount, setAmount] = useState('')
  const [action, setAction] = useState<BalanceAction>('set')
  const [previewBalance, setPreviewBalance] = useState(balance)
  const { toast } = useToast()

  const updateBalance = () => {
    const value = parseFloat(amount)
    if (!isNaN(value) && value >= 0) {
      let newBalance: number
      switch (action) {
        case 'set':
          newBalance = value
          break
        case 'add':
          newBalance = balance + value
          break
        case 'subtract':
          newBalance = Math.max(0, balance - value)
          break
      }
      setBalance(newBalance)
      setAmount('')
      toast({
        title: 'Balance Updated! 💰',
        description: `Your new balance is $${formatNumber(newBalance)}.`,
      })
    } else {
      toast({
        title: "Oops! That's not right 🤔",
        description: 'Please enter a valid number.',
        variant: 'destructive',
      })
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      updateBalance()
    }
  }

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setAmount(value)
    const numValue = parseFloat(value)
    if (!isNaN(numValue)) {
      switch (action) {
        case 'set':
          setPreviewBalance(numValue)
          break
        case 'add':
          setPreviewBalance(balance + numValue)
          break
        case 'subtract':
          setPreviewBalance(Math.max(0, balance - numValue))
          break
      }
    } else {
      setPreviewBalance(balance)
    }
  }

  return (
    <Card className='bg-gradient-to-r from-green-200 to-blue-200 p-4 rounded-lg shadow'>
      <h2 className='text-2xl font-bold mb-4 flex items-center text-blue-800'>
        <Wallet className='mr-2' /> Adjust Money
      </h2>
      <div className='space-y-4'>
        <div className='flex flex-col space-y-2'>
          <Label
            htmlFor='balance-action'
            className='block text-sm font-medium text-gray-700 mb-1'
          >
            Adjustment Type
          </Label>
          <Select
            value={action}
            onValueChange={(value: BalanceAction) => setAction(value)}
          >
            <SelectTrigger id='balance-action'>
              <SelectValue placeholder='Select an action' />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value='set'>Set The Balance</SelectItem>
              <SelectItem value='add'>Add To The Balance</SelectItem>
              <SelectItem value='subtract'>
                Subtract From The Balance
              </SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className='flex items-center gap-2'>
          <Input
            id='amount'
            type='number'
            value={amount}
            onChange={handleAmountChange}
            onKeyDown={handleKeyPress}
            placeholder={`Enter amount to ${action}`}
            className='flex-grow text-lg h-12 bg-white'
          />
          <Button
            onClick={updateBalance}
            className='h-12 bg-blue-500 hover:bg-blue-600'
          >
            Update
          </Button>
        </div>
        {amount && (
          <div className='text-sm text-gray-600'>
            <p>
              Preview: ${formatNumber(previewBalance)}
              {action !== 'set' && (
                <span className='ml-1 text-xs'>
                  ({action === 'add' ? '+' : '-'}$
                  {formatNumber(parseFloat(amount) || 0)})
                </span>
              )}
            </p>
          </div>
        )}
      </div>
    </Card>
  )
}
