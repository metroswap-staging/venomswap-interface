import { ChainId, TokenAmount } from '@viperswap/sdk'
import React from 'react'
//import React, { useMemo } from 'react'
import { X } from 'react-feather'
import styled from 'styled-components'
import tokenLogo from '../../assets/images/token-logo.png'
import { VIPER } from '../../constants'
import { useViperSupply } from '../../data/TotalSupply'
import { useActiveWeb3React } from '../../hooks'
//import { useMerkleDistributorContract } from '../../hooks/useContract'
//import useCurrentBlockTimestamp from '../../hooks/useCurrentBlockTimestamp'
import { useTotalLockedViperEarned, useTotalUnlockedViperEarned } from '../../state/stake/hooks'
import { useAggregateViperBalance, useTokenBalance } from '../../state/wallet/hooks'
import { ExternalLink, StyledInternalLink, TYPE, UniTokenAnimated } from '../../theme'
//import { computeUniCirculation } from '../../utils/computeUniCirculation'
import useUSDCPrice from '../../utils/useUSDCPrice'
import { AutoColumn } from '../Column'
import { RowBetween } from '../Row'
import { Break, CardBGImage, CardNoise, CardSection, DataCard } from '../earn/styled'
import { VIPER_INTERFACE } from '../../constants/abis/viper'

const ContentWrapper = styled(AutoColumn)`
  width: 100%;
`

const ModalUpper = styled(DataCard)`
  box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.1);
  background: radial-gradient(76.02% 75.41% at 1.84% 0%, #008c6b 0%, #000 100%);
  padding: 0.5rem;
`

const StyledClose = styled(X)`
  position: absolute;
  right: 16px;
  top: 16px;

  :hover {
    cursor: pointer;
  }
`

/**
 * Content for balance stats modal
 */
export default function ViperBalanceContent({ setShowUniBalanceModal }: { setShowUniBalanceModal: any }) {
  const { account, chainId } = useActiveWeb3React()
  const viper = chainId ? VIPER[chainId] : undefined

  const total = useAggregateViperBalance()
  const viperBalance: TokenAmount | undefined = useTokenBalance(
    account ?? undefined,
    viper,
    'balanceOf',
    VIPER_INTERFACE
  )
  const viperLockedBalance: TokenAmount | undefined = useTokenBalance(
    account ?? undefined,
    viper,
    'lockOf',
    VIPER_INTERFACE
  )
  const viperTotalBalance: TokenAmount | undefined = useTokenBalance(
    account ?? undefined,
    viper,
    'totalBalanceOf',
    VIPER_INTERFACE
  )
  const lockedViperToClaim: TokenAmount | undefined = useTotalLockedViperEarned()
  const unlockedViperToClaim: TokenAmount | undefined = useTotalUnlockedViperEarned()
  const totalSupply: TokenAmount | undefined = useViperSupply()
  const totalUnlockedSupply: TokenAmount | undefined = useViperSupply('unlockedSupply')
  const viperPrice = useUSDCPrice(viper)
  /*const blockTimestamp = useCurrentBlockTimestamp()
  const unclaimedUni = useTokenBalance(useMerkleDistributorContract()?.address, viper)
  const circulation: TokenAmount | undefined = useMemo(
    () =>
      blockTimestamp && viper && chainId === ChainId.MAINNET
        ? computeUniCirculation(viper, blockTimestamp, unclaimedUni)
        : totalSupply,
    [blockTimestamp, chainId, totalSupply, unclaimedUni, viper]
  )*/

  return (
    <ContentWrapper gap="lg">
      <ModalUpper>
        <CardBGImage />
        <CardNoise />
        <CardSection gap="md">
          <RowBetween>
            <TYPE.white color="white">Your VIPER Breakdown</TYPE.white>
            <StyledClose stroke="white" onClick={() => setShowUniBalanceModal(false)} />
          </RowBetween>
        </CardSection>
        <Break />
        {account && (
          <>
            <CardSection gap="sm">
              <AutoColumn gap="md" justify="center">
                <UniTokenAnimated width="48px" src={tokenLogo} />{' '}
                <TYPE.white fontSize={48} fontWeight={600} color="white">
                  {total?.toFixed(2, { groupSeparator: ',' })}
                </TYPE.white>
              </AutoColumn>
              <AutoColumn gap="md">
                <RowBetween>
                  <TYPE.white color="white">Balance:</TYPE.white>
                  <TYPE.white color="white">{viperBalance?.toFixed(2, { groupSeparator: ',' })}</TYPE.white>
                </RowBetween>
                <RowBetween>
                  <TYPE.white color="white">Unlocked rewards:</TYPE.white>
                  <TYPE.white color="white">
                    {unlockedViperToClaim?.toFixed(2, { groupSeparator: ',' })}{' '}
                    {unlockedViperToClaim && unlockedViperToClaim.greaterThan('0') && (
                      <StyledInternalLink onClick={() => setShowUniBalanceModal(false)} to="/staking">
                        (claim)
                      </StyledInternalLink>
                    )}
                  </TYPE.white>
                </RowBetween>
                <RowBetween>
                  <TYPE.white color="white">Locked rewards:</TYPE.white>
                  <TYPE.white color="white">
                    {lockedViperToClaim?.toFixed(2, { groupSeparator: ',' })}{' '}
                    {lockedViperToClaim && lockedViperToClaim.greaterThan('0') && (
                      <StyledInternalLink onClick={() => setShowUniBalanceModal(false)} to="/staking">
                        (claim)
                      </StyledInternalLink>
                    )}
                  </TYPE.white>
                </RowBetween>
                <RowBetween>
                  <TYPE.white color="white">Locked Balance:</TYPE.white>
                  <TYPE.white color="white">{viperLockedBalance?.toFixed(2, { groupSeparator: ',' })}</TYPE.white>
                </RowBetween>
                <RowBetween>
                  <TYPE.white color="white">Total Balance:</TYPE.white>
                  <TYPE.white color="white">{viperTotalBalance?.toFixed(2, { groupSeparator: ',' })}</TYPE.white>
                </RowBetween>
              </AutoColumn>
            </CardSection>
            <Break />
          </>
        )}
        <CardSection gap="sm">
          <AutoColumn gap="md">
            {viper && viper.chainId === ChainId.MAINNET ? (
              <RowBetween>
                <TYPE.white color="white">VIPER price:</TYPE.white>
                <TYPE.white color="white">${viperPrice?.toFixed(2) ?? '-'}</TYPE.white>
              </RowBetween>
            ) : null}
            <RowBetween>
              <TYPE.white color="white">VIPER in circulation:</TYPE.white>
              <TYPE.white color="white">{totalUnlockedSupply?.toFixed(0, { groupSeparator: ',' })}</TYPE.white>
            </RowBetween>
            <RowBetween>
              <TYPE.white color="white">Total Supply</TYPE.white>
              <TYPE.white color="white">{totalSupply?.toFixed(0, { groupSeparator: ',' })}</TYPE.white>
            </RowBetween>
            {viper && viper.chainId === ChainId.MAINNET ? (
              <ExternalLink href={`https://uniswap.info/token/${viper.address}`}>View UNI Analytics</ExternalLink>
            ) : null}
          </AutoColumn>
        </CardSection>
      </ModalUpper>
    </ContentWrapper>
  )
}