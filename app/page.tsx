'use client'

import { useState } from 'react'
import BalanceDisplay from '@/components/BalanceDisplay'
import BalanceForm from '@/components/BalanceForm'
import MyDreams from '@/components/MyDreams'
import FinancialTip from '@/components/FinancialTip'
import BudgetyLogo from '@/components/BudgetyLogo'
import { BalanceProvider, useBalance } from '@/contexts/BalanceContext'
import { Toaster } from '@/components/ui/toaster'
import { Button } from '@/components/ui/button'

function DemoButton() {
  const { setBalance } = useBalance()
  const [isDemoActive, setIsDemoActive] = useState(false)

  ///// Only for testing purposes /////
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
///// Only for testing purposes /////

export default function Page() {
  return (
    <BalanceProvider>
      <div className='container mx-auto p-4 max-w-4xl'>
        <div className='mb-6'>
          <BudgetyLogo />
        </div>
        <div className='grid grid-cols-1 gap-4'>
          <BalanceDisplay />
          <BalanceForm />
          <MyDreams />
          <FinancialTip />
        </div>
        <DemoButton />
        <Toaster />
      </div>
    </BalanceProvider>
  )
}
