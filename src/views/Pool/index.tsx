import { useMemo } from 'react'
import styled from 'styled-components'
import useTheme from 'hooks/useTheme'
import { Pair } from '@pancakeswap/sdk'
import { Text, Flex, CardBody, CardFooter, Button, AddIcon } from '@pancakeswap/uikit'
import Link from 'next/link'
import { useTranslation } from 'contexts/Localization'
import useActiveWeb3React from 'hooks/useActiveWeb3React'
import FullPositionCard from '../../components/PositionCard'
import { useTokenBalancesWithLoadingIndicator } from '../../state/wallet/hooks'
import { usePairs } from '../../hooks/usePairs'
import { toV2LiquidityToken, useTrackedTokenPairs } from '../../state/user/hooks'
import Dots from '../../components/Loader/Dots'
import { AppHeader, AppBody } from '../../components/App'
import Page from '../Page'

const Body = styled(CardBody)`
  padding: 1rem;
  background-color: ${({ theme }) => theme.colors.dropdownDeep};
`

const Footer = styled.div<{ $isDark: boolean }>`
  ${({ theme }) => theme.mediaQueries.sm} {
    background: ${({ $isDark }) => ($isDark ? '#0C0711CC' : ' #fff')};
  }
`

const Content = styled.div<{ $isDark: boolean }>`
  padding: 20px 0 32px;
  border-radius: 7px;
  ${({ theme }) => theme.mediaQueries.sm} {
    background: ${({ $isDark }) => ($isDark ? '#EC4C9380' : ' #fff')};
  }
`

export default function Pool() {
  const { account } = useActiveWeb3React()
  const { t } = useTranslation()
  const { isDark } = useTheme()

  // fetch the user's balances of all tracked V2 LP tokens
  const trackedTokenPairs = useTrackedTokenPairs()
  const tokenPairsWithLiquidityTokens = useMemo(
    () => trackedTokenPairs.map((tokens) => ({ liquidityToken: toV2LiquidityToken(tokens), tokens })),
    [trackedTokenPairs],
  )
  const liquidityTokens = useMemo(
    () => tokenPairsWithLiquidityTokens.map((tpwlt) => tpwlt.liquidityToken),
    [tokenPairsWithLiquidityTokens],
  )
  const [v2PairsBalances, fetchingV2PairBalances] = useTokenBalancesWithLoadingIndicator(
    account ?? undefined,
    liquidityTokens,
  )

  // fetch the reserves for all V2 pools in which the user has a balance
  const liquidityTokensWithBalances = useMemo(
    () =>
      tokenPairsWithLiquidityTokens.filter(({ liquidityToken }) =>
        v2PairsBalances[liquidityToken.address]?.greaterThan('0'),
      ),
    [tokenPairsWithLiquidityTokens, v2PairsBalances],
  )

  const v2Pairs = usePairs(liquidityTokensWithBalances.map(({ tokens }) => tokens))
  const v2IsLoading =
    fetchingV2PairBalances || v2Pairs?.length < liquidityTokensWithBalances.length || v2Pairs?.some((V2Pair) => !V2Pair)

  const allV2PairsWithLiquidity = v2Pairs.map(([, pair]) => pair).filter((v2Pair): v2Pair is Pair => Boolean(v2Pair))

  const renderBody = () => {
    if (!account) {
      return (
        <Text color="textSubtle" textAlign="center">
          {t('Connect to a wallet to view your liquidity.')}
        </Text>
      )
    }
    if (v2IsLoading) {
      return (
        <Text color="textSubtle" textAlign="center">
          <Dots>{t('Loading')}</Dots>
        </Text>
      )
    }
    if (allV2PairsWithLiquidity?.length > 0) {
      return allV2PairsWithLiquidity.map((v2Pair, index) => (
        <FullPositionCard
          key={v2Pair.liquidityToken.address}
          pair={v2Pair}
          mb={index < allV2PairsWithLiquidity.length - 1 ? '16px' : 0}
        />
      ))
    }
    return (
      <Text color="textSubtle" textAlign="center">
        {/* {t('No liquidity found.')} */}
      </Text>
    )
  }

  return (
    <Page>
      <AppBody>
        <AppHeader title={t('Your Liquidity')} subtitle={t('Remove liquidity to receive tokens back')} />
        <Body>
          {renderBody()}
          {account && !v2IsLoading && (
            <Content $isDark={isDark}>
              <Flex flexDirection="column" alignItems="center" mt="24px">
                <Text color={isDark ? 'textSubtle' : '#EC4C93'} mb="8px">
                  {t("Don't see a pool you joined?")}
                </Text>
                {/* <Link href="/find" passHref>
                <Button id="import-pool-link" variant="secondary" scale="sm" as="a">
                  {t('Find other LP tokens')}
                </Button>
              </Link> */}
              </Flex>
            </Content>
          )}
        </Body>
        <Footer $isDark={isDark}>
          <CardFooter style={{ textAlign: 'center' }}>
            <Link href="/add" passHref>
              <Button
                style={{ background: isDark ? '#2E001780' : '#EC4C93', border: '1px solid #EC4C93' }}
                id="join-pool-button"
                width="100%"
                startIcon={<AddIcon color="white" />}
              >
                {t('Add Liquidity')}
              </Button>
            </Link>
          </CardFooter>
        </Footer>
      </AppBody>
    </Page>
  )
}
