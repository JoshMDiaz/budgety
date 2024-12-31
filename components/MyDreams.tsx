import { useState, useEffect, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Star, Edit, X, Settings, Trash2 } from 'lucide-react'
import { useBalance } from '@/contexts/BalanceContext'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { useToast } from '@/hooks/use-toast'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'

interface Dream {
  id: number
  name: string
  amount: number
  saved: number
}

export default function MyDreams() {
  const { balance, setBalance } = useBalance()
  const [dreams, setDreams] = useState<Dream[]>([])
  const [newDreamName, setNewDreamName] = useState('')
  const [newDreamAmount, setNewDreamAmount] = useState('')
  const [editingDream, setEditingDream] = useState<number | null>(null)
  const [tempSavings, setTempSavings] = useState<{ [key: number]: string }>({})
  const { toast } = useToast()
  const dreamNameInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    const savedDreams = JSON.parse(localStorage.getItem('myDreams') || '[]')
    setDreams(savedDreams)
  }, [])

  const addDream = () => {
    if (newDreamName && newDreamAmount) {
      const newDream: Dream = {
        id: Date.now(),
        name: newDreamName,
        amount: parseFloat(newDreamAmount),
        saved: 0,
      }
      const newDreams = [newDream, ...dreams]
      setDreams(newDreams)
      localStorage.setItem('myDreams', JSON.stringify(newDreams))
      setNewDreamName('')
      setNewDreamAmount('')
      toast({
        title: 'Yay! New Dream Added! 🌟',
        description: `Your dream "${newDreamName}" is now on your list!`,
      })
      if (dreamNameInputRef.current) {
        dreamNameInputRef.current.focus()
      }
    }
  }

  const addSaving = (id: number) => {
    const amount = parseFloat(tempSavings[id] || '0')
    if (isNaN(amount) || amount <= 0) {
      toast({
        title: "Oops! That's not right 🤔",
        description: 'Please enter a number bigger than zero.',
        variant: 'destructive',
      })
      return
    }
    if (amount > balance) {
      toast({
        title: 'Oh no! Not enough money 💰',
        description: 'You need to save up more before you can add this much!',
        variant: 'destructive',
      })
      return
    }
    setDreams(
      dreams.map((dream) =>
        dream.id === id
          ? { ...dream, saved: Math.min(dream.saved + amount, dream.amount) }
          : dream
      )
    )
    setBalance((prevBalance) => prevBalance - amount)
    setTempSavings({ ...tempSavings, [id]: '' })
    toast({
      title: 'Woohoo! Savings Added! 🎉',
      description: `You just saved $${formatNumber(amount)} for your dream!`,
    })
  }

  const deleteDream = (id: number) => {
    const dreamToDelete = dreams.find((dream) => dream.id === id)
    if (dreamToDelete) {
      setBalance((prevBalance) => prevBalance + dreamToDelete.saved)
      setDreams(dreams.filter((dream) => dream.id !== id))
      toast({
        title: 'Dream Removed 🧹',
        description: 'Your dream is gone, but your savings are safe!',
      })
    }
  }

  const achieveDream = (id: number) => {
    const dream = dreams.find((d) => d.id === id)
    if (dream && dream.saved === dream.amount) {
      setDreams(dreams.filter((d) => d.id !== id))
      toast({
        title: 'Dream Achieved! 🎊🎊🎊',
        description: `Wow! You did it! You achieved your dream: "${dream.name}"`,
      })
    }
  }

  const startEditing = (id: number) => {
    setEditingDream(id)
    const dream = dreams.find((d) => d.id === id)
    if (dream) {
      setTempSavings({ ...tempSavings, [id]: dream.saved.toString() })
    }
  }

  const saveEdit = (id: number, newAmount: number, newSaved: number) => {
    if (newAmount < newSaved) {
      toast({
        title: "Oops! That doesn't work 🤔",
        description: "Your dream cost can't be less than what you've saved!",
        variant: 'destructive',
      })
      return
    }
    const oldDream = dreams.find((dream) => dream.id === id)
    if (oldDream) {
      const difference = newSaved - oldDream.saved
      if (difference > balance) {
        toast({
          title: 'Not enough money 💰',
          description: 'You need to save up more before you can add this much!',
          variant: 'destructive',
        })
        return
      }
      setDreams(
        dreams.map((dream) =>
          dream.id === id
            ? { ...dream, amount: newAmount, saved: newSaved }
            : dream
        )
      )
      setBalance((prevBalance) => prevBalance - difference)
    }
    setEditingDream(null)
    setTempSavings({ ...tempSavings, [id]: '' })
    toast({
      title: 'Dream Updated! 🌈',
      description: 'Your dream has new details now!',
    })
  }

  const getProjectedBalance = (dreamId: number) => {
    const dream = dreams.find((d) => d.id === dreamId)
    if (!dream) return balance

    const currentSavings = dream.saved
    const newSavings = parseFloat(tempSavings[dreamId] || '0')

    if (isNaN(newSavings)) return balance

    return balance + (currentSavings - newSavings)
  }

  const handleKeyPress = (
    e: React.KeyboardEvent<HTMLInputElement>,
    action: () => void
  ) => {
    if (e.key === 'Enter') {
      action()
    }
  }

  const catchThisDream = (id: number) => {
    const dream = dreams.find((d) => d.id === id)
    if (dream) {
      const remainingAmount = dream.amount - dream.saved
      const boostAmount = Math.min(balance, remainingAmount)
      setDreams(
        dreams.map((d) =>
          d.id === id ? { ...d, saved: d.saved + boostAmount } : d
        )
      )
      setBalance((prevBalance) => prevBalance - boostAmount)
      toast({
        title: 'Dream Boosted! 🚀',
        description: `You just added $${formatNumber(
          boostAmount
        )} to your dream!`,
      })
    }
  }

  const formatNumber = (num: number) => {
    return num.toLocaleString('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })
  }

  const removeAllDreams = () => {
    setDreams([])
    toast({
      title: 'All Dreams Removed 🧹',
      description: 'Your dream list is now empty.',
    })
  }

  return (
    <div className='bg-gradient-to-r from-pink-200 to-purple-200 p-4 rounded-lg shadow'>
      <div className='flex justify-between items-center mb-4'>
        <h2 className='text-2xl font-bold flex items-center text-purple-800'>
          <Star className='mr-2' /> My Dreams
        </h2>
        {dreams.length > 0 ? (
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant='ghost' size='icon'>
                <Trash2 className='h-5 w-5 text-red-500' />
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Remove All Dreams?</AlertDialogTitle>
                <AlertDialogDescription>
                  This will remove all your dreams. This action cannot be
                  undone.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  onClick={removeAllDreams}
                  className='bg-red-600 hover:bg-red-700'
                >
                  Remove All Dreams
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        ) : null}
      </div>
      <div className='flex flex-col sm:flex-row items-end gap-2 mb-4'>
        <div className='w-full'>
          <Input
            id='newDreamName'
            value={newDreamName}
            onChange={(e) => setNewDreamName(e.target.value)}
            onKeyDown={(e) => handleKeyPress(e, addDream)}
            placeholder='Enter dream name'
            className='w-full text-lg h-12 bg-white'
            ref={dreamNameInputRef}
          />
        </div>
        <div className='w-full'>
          <Input
            id='newDreamAmount'
            type='number'
            value={newDreamAmount}
            onChange={(e) => setNewDreamAmount(e.target.value)}
            onKeyDown={(e) => handleKeyPress(e, addDream)}
            placeholder='Enter dream cost'
            className='w-full text-lg h-12 bg-white'
          />
        </div>
        <Button
          onClick={addDream}
          className='h-12 bg-purple-500 hover:bg-purple-600'
          disabled={!newDreamName || !newDreamAmount}
        >
          Add Dream
        </Button>
      </div>
      <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
        {dreams.map((dream) => (
          <div key={dream.id} className='p-4 rounded-lg relative bg-white'>
            <div className='absolute top-2 right-2 flex items-center'>
              {dream.saved < dream.amount && (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant='ghost' size='icon'>
                      <Settings className='h-4 w-4' />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuItem
                      onSelect={() => startEditing(dream.id)}
                      className='cursor-pointer'
                    >
                      <Edit className='mr-2 h-4 w-4' /> Edit
                    </DropdownMenuItem>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <DropdownMenuItem
                          onSelect={(e) => e.preventDefault()}
                          className='text-red-600 cursor-pointer'
                        >
                          <X className='mr-2 h-4 w-4' /> Remove
                        </DropdownMenuItem>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                          <AlertDialogDescription>
                            This will remove your dream and return any saved
                            amount to your balance. This action cannot be
                            undone.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => {
                              deleteDream(dream.id)
                              document.body.click() // Close the dropdown
                            }}
                            className='bg-red-600 hover:bg-red-700'
                          >
                            Remove Dream
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </DropdownMenuContent>
                </DropdownMenu>
              )}
            </div>
            <h3 className='text-xl font-bold mb-2 text-purple-700'>
              {dream.name}
            </h3>
            {editingDream === dream.id ? (
              <>
                <div className='mb-2'>
                  <Label
                    htmlFor={`dream-amount-${dream.id}`}
                    className='block text-sm font-medium text-gray-700 mb-1'
                  >
                    New Dream Cost
                  </Label>
                  <Input
                    type='number'
                    defaultValue={dream.amount}
                    className='text-lg h-12'
                    placeholder='New dream cost'
                    id={`dream-amount-${dream.id}`}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        const newAmount = parseFloat(
                          (e.target as HTMLInputElement).value
                        )
                        const newSaved = parseFloat(
                          tempSavings[dream.id] || '0'
                        )
                        saveEdit(dream.id, newAmount, newSaved)
                      }
                    }}
                  />
                </div>
                <div className='mb-2'>
                  <Label
                    htmlFor={`dream-saved-${dream.id}`}
                    className='block text-sm font-medium text-gray-700 mb-1'
                  >
                    New Saved Amount
                  </Label>
                  <Input
                    type='number'
                    value={tempSavings[dream.id] || ''}
                    onChange={(e) => {
                      setTempSavings({
                        ...tempSavings,
                        [dream.id]: e.target.value,
                      })
                    }}
                    className='text-lg h-12'
                    placeholder='New saved amount'
                    id={`dream-saved-${dream.id}`}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        const newAmount = parseFloat(
                          (
                            document.getElementById(
                              `dream-amount-${dream.id}`
                            ) as HTMLInputElement
                          ).value
                        )
                        const newSaved = parseFloat(
                          (e.target as HTMLInputElement).value
                        )
                        saveEdit(dream.id, newAmount, newSaved)
                      }
                    }}
                  />
                </div>
                {tempSavings[dream.id] !== dream.saved.toString() && (
                  <p className='text-sm text-gray-600 mb-2'>
                    Projected balance: $
                    {formatNumber(getProjectedBalance(dream.id))}
                  </p>
                )}
                <div className='flex gap-2'>
                  <Button
                    onClick={() => {
                      const newAmount = parseFloat(
                        (
                          document.getElementById(
                            `dream-amount-${dream.id}`
                          ) as HTMLInputElement
                        ).value
                      )
                      const newSaved = parseFloat(tempSavings[dream.id] || '0')
                      saveEdit(dream.id, newAmount, newSaved)
                    }}
                    className='flex-1 h-12 bg-purple-500 hover:bg-purple-600'
                  >
                    Save Changes
                  </Button>
                  <Button
                    onClick={() => {
                      setEditingDream(null)
                      setTempSavings({ ...tempSavings, [dream.id]: '' })
                    }}
                    className='flex-1 h-12 bg-gray-300 hover:bg-gray-400 text-gray-800'
                  >
                    Cancel
                  </Button>
                </div>
              </>
            ) : (
              <>
                <div className='flex justify-between items-center mb-2'>
                  <p className='text-blue-600'>
                    Saved: ${formatNumber(dream.saved)}
                  </p>
                  {dream.saved > 0 && dream.amount > dream.saved && (
                    <p className='text-pink-700 font-semibold'>
                      Only need ${formatNumber(dream.amount - dream.saved)}!
                    </p>
                  )}
                </div>
                <p className='mb-2 text-purple-700'>
                  Dream Cost: ${formatNumber(dream.amount)}
                </p>
                <div className='w-full bg-gray-200 rounded-full h-2.5 mb-4'>
                  <div
                    className='bg-blue-600 h-2.5 rounded-full'
                    style={{
                      width: `${Math.min(
                        (dream.saved / dream.amount) * 100,
                        100
                      )}%`,
                    }}
                  ></div>
                </div>
                {dream.saved < dream.amount && (
                  <div className='flex flex-col gap-2 mb-2'>
                    <div className='flex items-center gap-2'>
                      <div className='flex-grow'>
                        <Input
                          id={`add-savings-${dream.id}`}
                          type='number'
                          placeholder='Enter amount'
                          className='text-lg h-12'
                          value={tempSavings[dream.id] || ''}
                          onChange={(e) =>
                            setTempSavings({
                              ...tempSavings,
                              [dream.id]: e.target.value,
                            })
                          }
                          onKeyDown={(e) =>
                            handleKeyPress(e, () => addSaving(dream.id))
                          }
                        />
                      </div>
                      <div className='flex-shrink-0'>
                        <Button
                          onClick={() => addSaving(dream.id)}
                          className='h-12 bg-blue-500 hover:bg-blue-600'
                          disabled={dream.saved >= dream.amount}
                        >
                          Update
                        </Button>
                      </div>
                    </div>
                    {tempSavings[dream.id] && (
                      <p className='text-sm text-gray-600'>
                        Projected balance: $
                        {formatNumber(getProjectedBalance(dream.id))}
                      </p>
                    )}
                    <Button
                      onClick={() => catchThisDream(dream.id)}
                      className='h-12 bg-purple-500 hover:bg-purple-600'
                      disabled={dream.saved >= dream.amount || balance === 0}
                    >
                      Catch this Dream
                    </Button>
                  </div>
                )}
                {dream.saved === dream.amount && (
                  <div className='absolute inset-0 flex items-center justify-center'>
                    <div className='absolute inset-0 bg-gradient-to-r from-green-200 to-blue-200 opacity-80 rounded-lg'></div>
                    <Button
                      onClick={() => achieveDream(dream.id)}
                      className='h-12 bg-purple-500 hover:bg-purple-600 text-white font-bold py-2 px-4 rounded z-10'
                    >
                      Dream Achieved!
                    </Button>
                  </div>
                )}
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
