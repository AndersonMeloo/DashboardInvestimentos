import type { WalletSummary } from '../types/dashboard'
import { formatCurrency, formatShares } from '../utils/format'

type WalletOverviewProps = {
    wallet: WalletSummary | null
}

export function WalletOverview({ wallet }: WalletOverviewProps) {

    return (

        <>
            <div className="grade-cartoes">
                <article className="cartao destaque">
                    <h2>Saldo Total da Carteira</h2>

                    <p className="numero-grande">
                        {formatCurrency(wallet?.totalBalance ?? 0)}
                    </p>

                    <p className="texto-suave">
                        Posições em aberto: {wallet?.positions.length ?? 0}
                    </p>

                </article>

                <article className="cartao cartaoPosicoes">
                    <h2>Posições por Fundo</h2>

                    {wallet && wallet.positions.length > 0 ? (
                        <ul className="lista-posicoes">
                            {wallet.positions.map((position) => (
                                <li key={position.fundId}>
                                    <strong>{position.ticker}</strong>
                                    <span>{position.fundName}</span>
                                    <span>{formatShares(position.shares)} cotas</span>
                                    <span>{formatCurrency(position.balance)}</span>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p className="texto-suave">Ainda não existem posições com cotas em carteira.</p>
                    )}
                </article>
            </div>
        </>
    )
}
