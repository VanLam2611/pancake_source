/* eslint-disable no-nested-ternary */
import { useMemo } from 'react'
import { NextLinkFromReactRouter } from 'components/NextLink'
import { Duration } from 'date-fns'
import styled from 'styled-components'
import {
  Text,
  Box,
  Heading,
  Button,
  Card,
  Flex,
  Breadcrumbs,
  Link as UIKitLink,
  LinkExternal,
  Spinner,
  Image,
  useMatchBreakpoints,
} from '@pancakeswap/uikit'
import Page from 'components/Layout/Page'
import { getBscScanLink } from 'utils'
import truncateHash from 'utils/truncateHash'
import useCMCLink from 'views/Info/hooks/useCMCLink'
import { CurrencyLogo } from 'views/Info/components/CurrencyLogo'
import { formatAmount } from 'utils/formatInfoNumbers'
import Percent from 'views/Info/components/Percent'
import SaveIcon from 'views/Info/components/SaveIcon'
import {
  usePoolDatas,
  useTokenData,
  usePoolsForToken,
  useTokenChartData,
  useTokenPriceData,
  useTokenTransactions,
} from 'state/info/hooks'
import PoolTable from 'views/Info/components/InfoTables/PoolsTable'
import TransactionTable from 'views/Info/components/InfoTables/TransactionsTable'
import { useWatchlistTokens } from 'state/user/hooks'
import { ONE_HOUR_SECONDS } from 'config/constants/info'
import { useTranslation } from 'contexts/Localization'
import ChartCard from 'views/Info/components/InfoCharts/ChartCard'

// const ContentLayout = styled.div`
//   margin-top: 16px;
//   display: grid;
//   grid-template-columns: 260px 1fr;
//   grid-gap: 1em;
//   @media screen and (max-width: 800px) {
//     grid-template-columns: 1fr;
//     grid-template-rows: 1fr 1fr;
//   }
// `

const StyledCMCLink = styled(UIKitLink)`
  width: 24px;
  height: 24px;
  margin-right: 8px;

  & :hover {
    opacity: 0.8;
  }
`

const StyledSection = styled.div`
  margin-bottom: 60px;

  &&:last-child {
    margin-bottom: 0;
  }
`

const StyledHeading = styled(Heading)`
  color: #ec4c93;
  font-style: normal;
  font-weight: bold;
  font-size: 24px;
  line-height: 24px;
  text-transform: capitalize;
  margin: 0 0 30px 0;
  text-shadow: 0px 0px 5px #000;
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
  align-items: flex-start;
  border-top: 1px solid #b5689e;
  padding: 24px 0;
`

const StyledInfoValue = styled(Box)`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;
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

const StyledInfoPanelPrice = styled(Text)`
  font-weight: bold;
  font-size: 24px;
  line-height: 24px;
  display: flex;
  align-items: center;
  color: #b5689e;
`

const StyledInfoPanelPercentWrapper = styled.span`
  background: #ff0099;
  border-radius: 30px;
  padding: 3px 10px;

  && div {
    color: #fff;
    font-weight: 300;
    font-size: 16px;
    line-height: 16px;
  }
`

const DEFAULT_TIME_WINDOW: Duration = { weeks: 1 }

const TokenPage: React.FC<{ routeAddress: string }> = ({ routeAddress }) => {
  const { isXs, isSm } = useMatchBreakpoints()
  const { t } = useTranslation()

  // In case somebody pastes checksummed address into url (since GraphQL expects lowercase address)
  const address = routeAddress.toLowerCase()

  const cmcLink = useCMCLink(address)

  const tokenData = useTokenData(address)
  const poolsForToken = usePoolsForToken(address)
  const poolDatas = usePoolDatas(poolsForToken ?? [])
  const transactions = useTokenTransactions(address)
  const chartData = useTokenChartData(address)

  // pricing data
  const priceData = useTokenPriceData(address, ONE_HOUR_SECONDS, DEFAULT_TIME_WINDOW)
  const adjustedPriceData = useMemo(() => {
    // Include latest available price
    if (priceData && tokenData && priceData.length > 0) {
      return [
        ...priceData,
        {
          time: new Date().getTime() / 1000,
          open: priceData[priceData.length - 1].close,
          close: tokenData?.priceUSD,
          high: tokenData?.priceUSD,
          low: priceData[priceData.length - 1].close,
        },
      ]
    }
    return undefined
  }, [priceData, tokenData])

  const [watchlistTokens, addWatchlistToken] = useWatchlistTokens()

  return (
    <Page symbol={tokenData?.symbol}>
      {tokenData ? (
        !tokenData.exists ? (
          <Card>
            <Box p="16px">
              <Text>
                {t('No pool has been created with this token yet. Create one')}
                <NextLinkFromReactRouter style={{ display: 'inline', marginLeft: '6px' }} to={`/add/${address}`}>
                  {t('here.')}
                </NextLinkFromReactRouter>
              </Text>
            </Box>
          </Card>
        ) : (
          <>
            <StyledSection>
              {/* Stuff on top */}
              <Flex justifyContent="space-between" mb="24px" flexDirection={['column', 'column', 'row']}>
                <Breadcrumbs mb="32px">
                  <NextLinkFromReactRouter to="/info">
                    <Text color="primary">{t('Info')}</Text>
                  </NextLinkFromReactRouter>
                  <NextLinkFromReactRouter to="/info/tokens">
                    <Text color="primary">{t('Tokens')}</Text>
                  </NextLinkFromReactRouter>
                  <Flex>
                    <Text color="#EC4C93" mr="8px">
                      {tokenData.symbol}
                    </Text>
                    <Text color="#EC4C93">{`(${truncateHash(address)})`}</Text>
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
                  <div style={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'flex-start' }}>
                    <CurrencyLogo size="44px" address={address} style={{ marginRight: '16px' }} />
                    <Flex flexDirection="column" mb={['8px', null]} justifyContent="flex-start" alignItems="flex-start">
                      <Flex alignItems="center" mb="10px">
                        <Text
                          mr="8px"
                          bold
                          fontSize={isXs || isSm ? '24px' : '32px'}
                          lineHeight={isXs || isSm ? '24px' : '32px'}
                          id="info-token-name-title"
                          color="#fff"
                        >
                          {tokenData.name}
                        </Text>
                        <Text
                          ml="0px"
                          lineHeight="1"
                          color="textSubtle"
                          fontSize={isXs || isSm ? '14px' : '20px'}
                          mr="16px"
                        >
                          ({tokenData.symbol})
                        </Text>
                        <Flex justifyContent={[null, null, 'flex-end']} mt={['8px', '8px', 0]}>
                          {cmcLink && (
                            <StyledCMCLink href={cmcLink} rel="noopener noreferrer nofollow" target="_blank">
                              <Image
                                src="/images/CMC-logo.svg"
                                height={22}
                                width={22}
                                alt={t('View token on CoinMarketCap')}
                              />
                            </StyledCMCLink>
                          )}
                          <SaveIcon
                            fill={watchlistTokens.includes(address)}
                            onClick={() => addWatchlistToken(address)}
                          />
                        </Flex>
                      </Flex>
                      <Flex mt="0px" ml="0px" alignItems="center">
                        <StyledInfoPanelPrice mr="16px" bold fontSize="24px">
                          ${formatAmount(tokenData.priceUSD, { notation: 'standard' })}
                        </StyledInfoPanelPrice>
                        <StyledInfoPanelPercentWrapper>
                          <Percent value={tokenData.priceUSDChange} fontWeight={600} />
                        </StyledInfoPanelPercentWrapper>
                      </Flex>
                    </Flex>
                  </div>
                  <Flex justifyContent="flex-end" alignItems="center">
                    <LinkExternal mr="8px" color="primary" href={getBscScanLink(address, 'address')}>
                      {t('View on BscScan')}
                    </LinkExternal>
                    <NextLinkFromReactRouter to={`/add/${address}`}>
                      <Button mr="8px" variant="secondary">
                        {t('Add Liquidity')}
                      </Button>
                    </NextLinkFromReactRouter>
                    <NextLinkFromReactRouter to={`/swap?inputCurrency=${address}`}>
                      <Button>{t('Trade')}</Button>
                    </NextLinkFromReactRouter>
                  </Flex>
                </Flex>

                <StyledBoxOfInfoValues p="24px">
                  <StyledInfoValue>
                    <StyledInfoValueTop bold small color="secondary" fontSize="12px" textTransform="uppercase">
                      {t('Liquidity')}
                    </StyledInfoValueTop>
                    <StyledInfoValueMid bold fontSize="24px">
                      ${formatAmount(tokenData.liquidityUSD)}
                    </StyledInfoValueMid>
                    <Percent value={tokenData.liquidityUSDChange} />
                  </StyledInfoValue>

                  <StyledInfoValue>
                    <StyledInfoValueTop mt="0px" bold color="secondary" fontSize="12px" textTransform="uppercase">
                      {t('Volume 24H')}
                    </StyledInfoValueTop>
                    <StyledInfoValueMid bold fontSize="24px" textTransform="uppercase">
                      ${formatAmount(tokenData.volumeUSD)}
                    </StyledInfoValueMid>
                    <Percent value={tokenData.volumeUSDChange} />
                  </StyledInfoValue>

                  <StyledInfoValue>
                    <StyledInfoValueTop mt="0px" bold color="secondary" fontSize="12px" textTransform="uppercase">
                      {t('Volume 7D')}
                    </StyledInfoValueTop>
                    <StyledInfoValueMid bold fontSize="24px">
                      ${formatAmount(tokenData.volumeUSDWeek)}
                    </StyledInfoValueMid>
                  </StyledInfoValue>

                  <StyledInfoValue>
                    <StyledInfoValueTop mt="0px" bold color="secondary" fontSize="12px" textTransform="uppercase">
                      {t('Transactions 24H')}
                    </StyledInfoValueTop>
                    <StyledInfoValueMid bold fontSize="24px">
                      {formatAmount(tokenData.txCount, { isInteger: true })}
                    </StyledInfoValueMid>
                  </StyledInfoValue>
                </StyledBoxOfInfoValues>
              </StyledInfoPanel>

              {/* chart: */}
              <ChartCard
                variant="token"
                chartData={chartData}
                tokenData={tokenData}
                tokenPriceData={adjustedPriceData}
              />
            </StyledSection>

            {/* pools table: */}
            <StyledSection>
              <StyledHeading scale="lg" mb="16px" mt="40px">
                {t('Pools')}
              </StyledHeading>
              <PoolTable poolDatas={poolDatas} />
            </StyledSection>

            {/* transaction table: */}
            <StyledSection>
              <TransactionTable transactions={transactions} headingContent={t('Transactions')} />
            </StyledSection>
          </>
        )
      ) : (
        <Flex mt="80px" justifyContent="center">
          <Spinner />
        </Flex>
      )}
    </Page>
  )
}

export default TokenPage
