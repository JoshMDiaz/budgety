import { useBalance } from '@/contexts/BalanceContext'
import { useState } from 'react'
import { Button } from '@/components/ui/button'

export default function DemoButton() {
  const { setBalance } = useBalance()
  const [isDemoActive, setIsDemoActive] = useState(false)

  const generateDemoData = () => {
    // Set balance to 1000
    setBalance(1000)

    // Generate 10 dreams
    const demoDreams = [
      { id: 1, name: 'New Laptop', amount: 1200, saved: 800 },
      { id: 2, name: 'Vacation', amount: 2000, saved: 2000 },
      { id: 3, name: 'Bicycle', amount: 500, saved: 0 },
      { id: 4, name: 'Concert Tickets', amount: 150, saved: 0 },
      { id: 5, name: 'New Phone', amount: 800, saved: 0 },
      { id: 6, name: 'Gaming Console', amount: 400, saved: 0 },
      { id: 7, name: 'Camera', amount: 600, saved: 0 },
      { id: 8, name: 'Fitness Tracker', amount: 100, saved: 0 },
      { id: 9, name: 'Cooking Class', amount: 250, saved: 0 },
      { id: 10, name: 'Art Supplies', amount: 300, saved: 0 },
    ]

    // Save dreams to localStorage
    localStorage.setItem('myDreams', JSON.stringify(demoDreams))

    // Trigger a reload to refresh the components with new data
    window.location.reload()
  }

  return (
    <Button
      className='fixed bottom-4 right-4 bg-blue-500 hover:bg-blue-600 text-white'
      onClick={() => {
        if (!isDemoActive) {
          generateDemoData()
          setIsDemoActive(true)
        }
      }}
    >
      Demo
    </Button>
  )
}
