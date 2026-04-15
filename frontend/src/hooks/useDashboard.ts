import { useCallback, useEffect, useMemo, useState } from 'react'
import type { FormEvent } from 'react'
import { request } from '../services/api'
import {
  initialFundForm,
  initialTransactionForm,
  type Fund,
  type FundFormState,
  type Transaction,
  type TransactionFormState,
  type WalletSummary,
} from '../types/dashboard'
import { getErrorMessage } from '../utils/error'

export function useDashboard() {
    
  const [funds, setFunds] = useState<Fund[]>([])
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [wallet, setWallet] = useState<WalletSummary | null>(null)

  const [fundForm, setFundForm] = useState<FundFormState>(initialFundForm)
  const [transactionForm, setTransactionForm] = useState<TransactionFormState>(
    initialTransactionForm,
  )

  const [isLoading, setIsLoading] = useState(false)
  const [isSubmittingFund, setIsSubmittingFund] = useState(false)
  const [isSubmittingTransaction, setIsSubmittingTransaction] = useState(false)
  const [feedback, setFeedback] = useState<string>('')
  const [error, setError] = useState<string>('')

  const sortedTransactions = useMemo(
    () =>
      [...transactions].sort(
        (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
      ),
    [transactions],
  )

  const loadDashboardData = useCallback(async () => {
    try {
      setIsLoading(true)
      setError('')

      const [fundsData, transactionsData, walletData] = await Promise.all([
        request<Fund[]>('/funds'),
        request<Transaction[]>('/transactions'),
        request<WalletSummary>('/wallet/summary'),
      ])

      setFunds(fundsData)
      setTransactions(transactionsData)
      setWallet(walletData)

      setTransactionForm((previous) => {
        if (previous.fundId || fundsData.length === 0) {
          return previous
        }

        return {
          ...previous,
          fundId: fundsData[0].id,
        }
      })
    } catch (requestError) {
      setError(getErrorMessage(requestError))
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    void loadDashboardData()
  }, [loadDashboardData])

  async function handleCreateFund(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    try {
      setIsSubmittingFund(true)
      setFeedback('')
      setError('')

      await request<Fund>('/funds', {
        method: 'POST',
        body: JSON.stringify({
          name: fundForm.name,
          ticker: fundForm.ticker,
          type: fundForm.type,
          pricePerShare: Number(fundForm.pricePerShare),
        }),
      })

      setFundForm(initialFundForm)
      setFeedback('Fundo cadastrado com sucesso.')
      await loadDashboardData()
    } catch (requestError) {
      setError(getErrorMessage(requestError))
    } finally {
      setIsSubmittingFund(false)
    }
  }

  async function handleCreateTransaction(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    try {
      setIsSubmittingTransaction(true)
      setFeedback('')
      setError('')

      const normalizedAmount = transactionForm.amount.replace(',', '.')

      await request<Transaction>('/transactions', {
        method: 'POST',
        body: JSON.stringify({
          fundId: transactionForm.fundId,
          type: transactionForm.type,
          amount: Number(normalizedAmount),
          date: transactionForm.date
            ? new Date(transactionForm.date).toISOString()
            : undefined,
        }),
      })

      setTransactionForm((previous) => ({
        ...initialTransactionForm,
        fundId: previous.fundId,
      }))
      setFeedback('Movimentação registrada com sucesso.')
      await loadDashboardData()
    } catch (requestError) {
      setError(getErrorMessage(requestError))
    } finally {
      setIsSubmittingTransaction(false)
    }
  }

  return {
    funds,
    wallet,
    fundForm,
    setFundForm,
    transactionForm,
    setTransactionForm,
    isLoading,
    isSubmittingFund,
    isSubmittingTransaction,
    feedback,
    error,
    sortedTransactions,
    loadDashboardData,
    handleCreateFund,
    handleCreateTransaction,
  }
}
