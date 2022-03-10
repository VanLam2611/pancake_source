import { useState, useEffect, useMemo } from 'react'
import { Flex, Text, Skeleton, Button, ArrowForwardIcon } from '@pancakeswap/uikit'
import { NextLinkFromReactRouter } from 'components/NextLink'
import { useTranslation } from 'contexts/Localization'
import useIntersectionObserver from 'hooks/useIntersectionObserver'
import { usePriceCakeBusd } from 'state/farms/hooks'
import Balance from 'components/Balance'
import styled from 'styled-components'
import { fetchCurrentLotteryIdAndMaxBuy, fetchLottery } from 'state/lottery/helpers'
import BigNumber from 'bignumber.js'
import { getBalanceAmount } from 'utils/formatBalance'
import { useSlowRefreshEffect } from 'hooks/useRefreshEffect'

const StyledLink = styled(NextLinkFromReactRouter)`
  width: 100%;
`

const StyledBalance = styled(Balance)`
  background: ${({ theme }) => theme.colors.gradients.gold};
  background: #fff;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  color: #fff;
  font-style: normal;
  font-weight: 600;
  font-size: 24px;
  line-height: 25px;
  margin: 0;
  padding: 0;
`

const StyledCardHeading = styled(Text)`
  color: #ff0099;
  font-style: normal;
  font-weight: 600;
  font-size: 20px;
  line-height: 21px;
  text-align: center;
  margin-bottom: 20px;
`

const StyledCardTitle = styled(Text)`
  color: #fff;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  flex-direction: column;
  margin-bottom: 20px;
`

const StyledCardTitleUnder = styled(Text)`
  color: #fff;
  font-weight: 300;
  font-size: 16px;
  line-height: 17px;
  margin: 0;
  padding: 0;
`

const StyledCardContent = styled(Text)`
  color: #fff;
  font-weight: 300;
  font-size: 16px;
  line-height: 17px;
  text-align: center;
  margin-bottom: 20px;
`

const LotteryCardContent = () => {
  const { t } = useTranslation()
  const { observerRef, isIntersecting } = useIntersectionObserver()
  const [loadData, setLoadData] = useState(false)
  const [lotteryId, setLotteryId] = useState<string>(null)
  const [currentLotteryPrize, setCurrentLotteryPrize] = useState<BigNumber>(null)
  const cakePriceBusdAsString = usePriceCakeBusd().toString()

  const cakePrizesText = t('%cakePrizeInUsd% in CAKE prizes this round', { cakePrizeInUsd: cakePriceBusdAsString })
  const [pretext, prizesThisRound] = cakePrizesText.split(cakePriceBusdAsString)

  const cakePriceBusd = useMemo(() => {
    return new BigNumber(cakePriceBusdAsString)
  }, [cakePriceBusdAsString])

  useEffect(() => {
    if (isIntersecting) {
      setLoadData(true)
    }
  }, [isIntersecting])

  useEffect(() => {
    // get current lottery ID
    const fetchCurrentID = async () => {
      const { currentLotteryId } = await fetchCurrentLotteryIdAndMaxBuy()
      setLotteryId(currentLotteryId)
    }

    if (loadData) {
      fetchCurrentID()
    }
  }, [loadData, setLotteryId])

  useSlowRefreshEffect(() => {
    // get public data for current lottery
    const fetchCurrentLotteryPrize = async () => {
      const { amountCollectedInCake } = await fetchLottery(lotteryId)
      const prizeInBusd = cakePriceBusd.times(amountCollectedInCake)
      setCurrentLotteryPrize(prizeInBusd)
    }

    if (lotteryId) {
      fetchCurrentLotteryPrize()
    }
  }, [lotteryId, setCurrentLotteryPrize, cakePriceBusd])

  return (
    <>
      <Flex flexDirection="column" mt="0px">
        <StyledCardHeading color="white" bold fontSize="16px">
          {t('Lottery')}
        </StyledCardHeading>

        {pretext && (
          <Text color="white" mt="12px" bold fontSize="16px">
            {pretext}
          </Text>
        )}

        <StyledCardTitle>
          {currentLotteryPrize && currentLotteryPrize.gt(0) ? (
            <StyledBalance
              fontSize="40px"
              bold
              prefix="$"
              decimals={0}
              value={getBalanceAmount(currentLotteryPrize).toNumber()}
            />
          ) : (
            <>
              <Skeleton width={200} height={40} my="8px" />
              <div ref={observerRef} />
            </>
          )}
          <StyledCardTitleUnder color="white" mb="24px" bold fontSize="16px">
            {prizesThisRound}
          </StyledCardTitleUnder>
        </StyledCardTitle>

        <StyledCardContent color="white" mb="40px">
          {t('Buy tickets with Womentech, win Womentech if your numbers match')}
        </StyledCardContent>
      </Flex>

      <Flex alignItems="center" justifyContent="center">
        <StyledLink to="/lottery" id="homepage-prediction-cta">
          <Button width="100%" style={{ background: '#EC4C93' }}>
            <Text bold color="#fff">
              {t('Buy Tickets')}
            </Text>
            <ArrowForwardIcon ml="4px" color="#fff" />
          </Button>
        </StyledLink>
      </Flex>
    </>
  )
}

export default LotteryCardContent
