/* eslint-disable no-nested-ternary */
import {
  Box,
  Breadcrumbs,
  Button,
  ButtonMenu,
  ButtonMenuItem,
  // Card,
  Flex,
  // Heading,
  HelpIcon,
  LinkExternal,
  Spinner,
  Text,
  useMatchBreakpoints,
  useTooltip,
} from '@pancakeswap/uikit'
import Page from 'components/Layout/Page'
import { NextLinkFromReactRouter } from 'components/NextLink'
import { useTranslation } from 'contexts/Localization'
import { useState } from 'react'
import { usePoolChartData, usePoolDatas, usePoolTransactions } from 'state/info/hooks'
import { useWatchlistPools } from 'state/user/hooks'
import styled, { css } from 'styled-components'
import { getBscScanLink } from 'utils'
import { CurrencyLogo, DoubleCurrencyLogo } from 'views/Info/components/CurrencyLogo'
import ChartCard from 'views/Info/components/InfoCharts/ChartCard'
import TransactionTable from 'views/Info/components/InfoTables/TransactionsTable'
import Percent from 'views/Info/components/Percent'
import SaveIcon from 'views/Info/components/SaveIcon'
import { formatAmount } from 'utils/formatInfoNumbers'

// const ContentLayout = styled.div`
//   display: grid;
//   grid-template-columns: 300px 1fr;
//   grid-gap: 1em;
//   margin-top: 16px;
//   @media screen and (max-width: 800px) {
//     grid-template-columns: 1fr;
//     grid-template-rows: 1fr 1fr;
//   }
// `

const TokenButton = styled(Flex)`
  padding: 8px 0px;
  margin-right: 16px;
  :hover {
    cursor: pointer;
    opacity: 0.6;
  }
`

const LockedTokensContainer = styled(Flex)`
  border: 1px solid ${({ theme }) => theme.colors.cardBorder};
  background-color: ${({ theme }) => theme.colors.background};
  padding: 16px;
  flex-direction: column;
  gap: 8px;
  margin-top: 8px;
  border-radius: 16px;
  max-width: 280px;
`

const StyledSection = styled.div`
  margin-bottom: 60px;

  &&:last-child {
    margin-bottom: 0;
  }
`

const StyledInfoPanel = styled.div`
  background: rgba(12, 7, 17, 0.8);
  border: 1px solid #ec4c93;
  box-sizing: border-box;
  border-radius: 10px;
  margin: 0 0 24px 0px;
  padding: 0 24px;
`

const StyledBoxOfInfoValues = styled(Box)`
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  border-top: 1px solid #b5689e;
  padding: 24px 0;
`

const StyledInfoValueTop = styled(Text)`
  font-size: 14px;
  line-height: 14px;
  text-transform: uppercase;
  color: #fff;
  font-weight: 300;
`

const StyledInfoValueMid = styled(Text)`
  font-weight: bold;
  font-size: 24px;
  line-height: 24px;
  display: flex;
  align-items: center;
  color: #ec4c93;
  margin: 6px 0;
`

const StyledLockedTokensContainer = styled(LockedTokensContainer)`
  background: rgba(255, 255, 255, 0.1);
  border-radius: 10px;
  border: none;
`

const StyledButtonMenu = styled(ButtonMenu)`
  background: transparent;
  border: none;
  border-radius: 0;
`

const StyledButtonMenuItem = styled(ButtonMenuItem)<{ $isActive?: boolean }>`
  border-radius: 30px;
  margin-right: 16px;
  padding: 12px 24px;
  background: rgba(255, 255, 255, 0.1);
  color: rgba(255, 255, 255, 0.5);

  &&:last-child {
    margin-right: 0;
  }

  ${(props) =>
    props.$isActive &&
    css`
      background: #ec4c93;
    `}
`

const PoolPage: React.FC<{ address: string }> = ({ address: routeAddress }) => {
  const { isXs, isSm } = useMatchBreakpoints()
  const { t } = useTranslation()
  const [showWeeklyData, setShowWeeklyData] = useState(0)
  const { tooltip, tooltipVisible, targetRef } = useTooltip(
    t(`Based on last 7 days' performance. Does not account for impermanent loss`),
    {},
  )

  // In case somebody pastes checksummed address into url (since GraphQL expects lowercase address)
  const address = routeAddress.toLowerCase()

  const poolData = usePoolDatas([address])[0]
  const chartData = usePoolChartData(address)
  const transactions = usePoolTransactions(address)

  const [watchlistPools, addPoolToWatchlist] = useWatchlistPools()

  return (
    <Page symbol={poolData ? `${poolData?.token0.symbol} / ${poolData?.token1.symbol}` : null}>
      {poolData ? (
        <>
          <StyledSection>
            <Flex justifyContent="space-between" mb="16px" flexDirection={['column', 'column', 'row']}>
              <Breadcrumbs mb="32px">
                <NextLinkFromReactRouter to="/info">
                  <Text color="primary">{t('Info')}</Text>
                </NextLinkFromReactRouter>
                <NextLinkFromReactRouter to="/info/pools">
                  <Text color="primary">{t('Pools')}</Text>
                </NextLinkFromReactRouter>
                <Flex>
                  <Text color="#EC4C93" mr="8px">{`${poolData.token0.symbol} / ${poolData.token1.symbol}`}</Text>
                </Flex>
              </Breadcrumbs>
            </Flex>

            <StyledInfoPanel>
              <Flex
                justifyContent="space-between"
                alignItems="flex-start"
                flexDirection={['column', 'column', 'column', 'row']}
                style={{ padding: '24px 0' }}
              >
                <Flex alignItems="flex-start" mb={['0px', null]}>
                  <DoubleCurrencyLogo
                    address0={poolData.token0.address}
                    address1={poolData.token1.address}
                    size={44}
                    style={{ width: 'auto', marginRight: '16px' }}
                  />
                  <Flex flexDirection="column" mb={['0px', null]} justifyContent="flex-start" alignItems="flex-start">
                    <Flex alignItems="flex-start" mb="10px">
                      <Text
                        mr="16px"
                        bold
                        fontSize={isXs || isSm ? '24px' : '32px'}
                        lineHeight={isXs || isSm ? '24px' : '32px'}
                        id="info-pool-pair-title"
                        color="#fff"
                      >
                        {`${poolData.token0.symbol} / ${poolData.token1.symbol}`}
                      </Text>
                      <Flex justifyContent={[null, null, 'flex-end']} mt={['8px', '8px', 0]}>
                        <SaveIcon fill={watchlistPools.includes(address)} onClick={() => addPoolToWatchlist(address)} />
                      </Flex>
                    </Flex>
                    <Flex flexDirection={['column', 'column', 'row']} mb={['0px', '0px', null]}>
                      <NextLinkFromReactRouter to={`/info/token/${poolData.token0.address}`}>
                        <TokenButton>
                          <CurrencyLogo address={poolData.token0.address} size="24px" />
                          <Text
                            fontSize="16px"
                            ml="4px"
                            style={{ whiteSpace: 'nowrap' }}
                            width="fit-content"
                            color="#B5689E"
                          >
                            {`1 ${poolData.token0.symbol} =  ${formatAmount(poolData.token1Price, {
                              notation: 'standard',
                              displayThreshold: 0.001,
                              tokenPrecision: true,
                            })} ${poolData.token1.symbol}`}
                          </Text>
                        </TokenButton>
                      </NextLinkFromReactRouter>
                      <NextLinkFromReactRouter to={`/info/token/${poolData.token1.address}`}>
                        <TokenButton ml={[null, null, '10px']}>
                          <CurrencyLogo address={poolData.token1.address} size="24px" />
                          <Text
                            fontSize="16px"
                            ml="4px"
                            style={{ whiteSpace: 'nowrap' }}
                            width="fit-content"
                            color="#B5689E"
                          >
                            {`1 ${poolData.token1.symbol} =  ${formatAmount(poolData.token0Price, {
                              notation: 'standard',
                              displayThreshold: 0.001,
                              tokenPrecision: true,
                            })} ${poolData.token0.symbol}`}
                          </Text>
                        </TokenButton>
                      </NextLinkFromReactRouter>
                    </Flex>
                  </Flex>
                </Flex>
                <Flex justifyContent="space-between" flexDirection={['column', 'column', 'column', 'row']}>
                  <Flex>
                    <LinkExternal mr="8px" href={getBscScanLink(address, 'address')}>
                      {t('View on BscScan')}
                    </LinkExternal>
                    <NextLinkFromReactRouter to={`/add/${poolData.token0.address}/${poolData.token1.address}`}>
                      <Button mr="8px" variant="secondary">
                        {t('Add Liquidity')}
                      </Button>
                    </NextLinkFromReactRouter>
                    <NextLinkFromReactRouter
                      to={`/swap?inputCurrency=${poolData.token0.address}&outputCurrency=${poolData.token1.address}`}
                    >
                      <Button>{t('Trade')}</Button>
                    </NextLinkFromReactRouter>
                  </Flex>
                </Flex>
              </Flex>

              <StyledBoxOfInfoValues>
                <Flex flex="1" flexDirection="row">
                  <Flex flex="1" flexDirection="column">
                    <StyledInfoValueTop color="secondary" bold fontSize="12px" textTransform="uppercase">
                      {t('Liquidity')}
                    </StyledInfoValueTop>
                    <StyledInfoValueMid fontSize="24px" bold>
                      ${formatAmount(poolData.liquidityUSD)}
                    </StyledInfoValueMid>
                    <Percent value={poolData.liquidityUSDChange} />
                  </Flex>
                  <Flex flex="1" flexDirection="column">
                    <StyledInfoValueTop color="secondary" bold fontSize="12px" textTransform="uppercase">
                      {t('LP reward APR')}
                    </StyledInfoValueTop>
                    <StyledInfoValueMid fontSize="24px" bold>
                      {formatAmount(poolData.lpApr7d)}%
                    </StyledInfoValueMid>
                    <Flex alignItems="center">
                      <span ref={targetRef}>
                        <HelpIcon color="textSubtle" />
                      </span>
                      <Text ml="4px" fontSize="12px" color="#FF0099">
                        {t('7D performance')}
                      </Text>
                      {tooltipVisible && tooltip}
                    </Flex>
                  </Flex>
                </Flex>
                <Flex flex="1" flexDirection="column" justifyContent="space-between">
                  <StyledInfoValueTop color="secondary" bold mt="0px" fontSize="12px" textTransform="uppercase">
                    {t('Total Tokens Locked')}
                  </StyledInfoValueTop>
                  <StyledLockedTokensContainer>
                    <Flex justifyContent="space-between" alignItems="center">
                      <Flex alignItems="center">
                        <CurrencyLogo address={poolData.token0.address} size="24px" />
                        <StyledInfoValueTop small color="textSubtle" ml="8px">
                          {poolData.token0.symbol}
                        </StyledInfoValueTop>
                      </Flex>
                      <Text small color="#EC4C93">
                        {formatAmount(poolData.liquidityToken0)}
                      </Text>
                    </Flex>
                    <Flex justifyContent="space-between" alignItems="center">
                      <Flex alignItems="center">
                        <CurrencyLogo address={poolData.token1.address} size="24px" />
                        <StyledInfoValueTop small color="textSubtle" ml="8px">
                          {poolData.token1.symbol}
                        </StyledInfoValueTop>
                      </Flex>
                      <Text small color="#EC4C93">
                        {formatAmount(poolData.liquidityToken1)}
                      </Text>
                    </Flex>
                  </StyledLockedTokensContainer>
                </Flex>
                <Flex flex="1" flexDirection="column" p="0px" alignItems="flex-start">
                  <StyledButtonMenu
                    activeIndex={showWeeklyData}
                    onItemClick={(index) => setShowWeeklyData(index)}
                    scale="sm"
                    variant="subtle"
                  >
                    <StyledButtonMenuItem $isActive={showWeeklyData === 0} width="100%">
                      {t('24H')}
                    </StyledButtonMenuItem>
                    <StyledButtonMenuItem $isActive={showWeeklyData === 1} width="100%">
                      {t('7D')}
                    </StyledButtonMenuItem>
                  </StyledButtonMenu>
                  <Flex mt="24px" width="100%">
                    <Flex flex="1" flexDirection="column">
                      <StyledInfoValueTop color="secondary" fontSize="12px" bold textTransform="uppercase">
                        {showWeeklyData ? t('Volume 7D') : t('Volume 24H')}
                      </StyledInfoValueTop>
                      <StyledInfoValueMid fontSize="24px" bold>
                        ${showWeeklyData ? formatAmount(poolData.volumeUSDWeek) : formatAmount(poolData.volumeUSD)}
                      </StyledInfoValueMid>
                      <Percent value={showWeeklyData ? poolData.volumeUSDChangeWeek : poolData.volumeUSDChange} />
                    </Flex>
                    <Flex flex="1" flexDirection="column">
                      <StyledInfoValueTop color="secondary" fontSize="12px" bold textTransform="uppercase">
                        {showWeeklyData ? t('LP reward fees 7D') : t('LP reward fees 24H')}
                      </StyledInfoValueTop>
                      <StyledInfoValueMid fontSize="24px" bold>
                        ${showWeeklyData ? formatAmount(poolData.lpFees7d) : formatAmount(poolData.lpFees24h)}
                      </StyledInfoValueMid>
                      <Text color="#B5689E" fontSize="12px">
                        {t('out of $%totalFees% total fees', {
                          totalFees: showWeeklyData
                            ? formatAmount(poolData.totalFees7d)
                            : formatAmount(poolData.totalFees24h),
                        })}
                      </Text>
                    </Flex>
                  </Flex>
                </Flex>
              </StyledBoxOfInfoValues>
            </StyledInfoPanel>

            {/* chart: */}
            <ChartCard variant="pool" chartData={chartData} />
          </StyledSection>

          {/* transaction table: */}
          <StyledSection>
            <TransactionTable transactions={transactions} headingContent={t('Transactions')} />
          </StyledSection>
        </>
      ) : (
        <Flex mt="80px" justifyContent="center">
          <Spinner />
        </Flex>
      )}
    </Page>
  )
}

export default PoolPage
