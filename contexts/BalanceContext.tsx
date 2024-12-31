import React, { createContext, useContext, useState, useEffect } from 'react'
import Skeleton from '@/components/Skeleton'

interface BalanceContextType {
  balance: number
  setBalance: React.Dispatch<React.SetStateAction<number>>
}

const BalanceContext = createContext<BalanceContextType | undefined>(undefined)

export const useBalance = () => {
  const context = useContext(BalanceContext)
  if (context === undefined) {
    throw new Error('useBalance must be used within a BalanceProvider')
  }
  return context
}

export const BalanceProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [balance, setBalance] = useState<number | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadBalance = () => {
      if (typeof window !== 'undefined') {
        const savedBalance = localStorage.getItem('balance')
        setBalance(savedBalance ? parseFloat(savedBalance) : 0)
        setLoading(false)
      }
    }

    loadBalance()
  }, [])

  useEffect(() => {
    if (typeof window !== 'undefined' && balance !== null) {
      localStorage.setItem('balance', balance.toString())
    }
  }, [balance])

  if (loading) {
    return <Skeleton />
  }

  return (
    <BalanceContext.Provider
      value={{
        balance: balance as number,
        setBalance: setBalance as React.Dispatch<React.SetStateAction<number>>,
      }}
    >
      {children}
    </BalanceContext.Provider>
  )
}
