'use client'

import BalanceDisplay from '@/components/BalanceDisplay'
import BalanceForm from '@/components/BalanceForm'
import MyDreams from '@/components/MyDreams'
import FinancialTip from '@/components/FinancialTip'
import BudgetyLogo from '@/components/BudgetyLogo'
import { BalanceProvider, useBalance } from '@/contexts/BalanceContext'
import { Toaster } from '@/components/ui/toaster'
// import DemoButton from '@/components/DemoButton'

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
        {/* Uncomment for testing purposes. */}
        {/* <DemoButton /> */}
        <Toaster />
      </div>
    </BalanceProvider>
  )
}
