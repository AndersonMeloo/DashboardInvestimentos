import type { Transaction } from '../types/dashboard'
import { formatCurrency, formatDate, formatShares } from '../utils/format'

type TransactionsTableProps = {
    transactions: Transaction[]
}

export function TransactionsTable({ transactions }: TransactionsTableProps) {

    return (

        <>
            <div className="cartao cartao-tabela">
                <h2>Movimentações</h2>

                {transactions.length > 0 ? (
                    <div className="container-tabela">
                        <table>
                            <thead>
                                <tr>
                                    <th>Data</th>
                                    <th>Fundo</th>
                                    <th>Tipo</th>
                                    <th>Valor</th>
                                    <th>Cotas</th>
                                </tr>
                            </thead>
                            
                            <tbody>
                                {transactions.map((transaction) => (
                                    <tr key={transaction.id}>
                                        <td>{formatDate(transaction.date)}</td>
                                        <td>
                                            {transaction.fund.ticker} - {transaction.fund.name}
                                        </td>
                                        <td>
                                            <span
                                                className={`etiqueta ${transaction.type === 'APORTE' ? 'aporte' : 'resgate'
                                                    }`}
                                            >
                                                {transaction.type}
                                            </span>
                                        </td>
                                        <td>{formatCurrency(transaction.amount)}</td>
                                        <td>{formatShares(transaction.shares)}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <p className="texto-suave">Nenhuma movimentação cadastrada.</p>
                )}
            </div>
        </>
    )
}
