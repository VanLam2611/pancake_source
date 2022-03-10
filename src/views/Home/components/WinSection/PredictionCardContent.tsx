import { useState, useEffect } from 'react'
import styled from 'styled-components'
import { Flex, Text, Skeleton, Button, ArrowForwardIcon, Heading } from '@pancakeswap/uikit'
import { NextLinkFromReactRouter } from 'components/NextLink'
import { useTranslation } from 'contexts/Localization'
import { formatLocalisedCompactNumber } from 'utils/formatBalance'
import useIntersectionObserver from 'hooks/useIntersectionObserver'
import { getTotalWon } from 'state/predictions/helpers'
import { useBNBBusdPrice } from 'hooks/useBUSDPrice'
import { multiplyPriceByAmount } from 'utils/prices'
import { useSlowRefreshEffect } from 'hooks/useRefreshEffect'

const StyledLink = styled(NextLinkFromReactRouter)`
  width: 100%;
`
const StyledCardHeading = styled(Text)`
  color: #ff0099;
  font-style: normal;
  font-weight: 600;
  font-size: 20px;
  line-height: 21px;
  text-align: center;
  margin-bottom: 20px;
  text-shadow: 0px 0px 5px #000;
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

const StyledCardTitleMain = styled(Heading)`
  color: #fff;
  font-style: normal;
  font-weight: 600;
  font-size: 24px;
  line-height: 25px;
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

const PredictionCardContent = () => {
  const { t } = useTranslation()
  const { observerRef, isIntersecting } = useIntersectionObserver()
  const [loadData, setLoadData] = useState(false)
  const bnbBusdPrice = useBNBBusdPrice()
  const [bnbWon, setBnbWon] = useState(0)
  const bnbWonInUsd = multiplyPriceByAmount(bnbBusdPrice, bnbWon)

  const localisedBnbUsdString = formatLocalisedCompactNumber(bnbWonInUsd)
  const bnbWonText = t('$%bnbWonInUsd% in BNB won so far', { bnbWonInUsd: localisedBnbUsdString })
  const [pretext, wonSoFar] = bnbWonText.split(localisedBnbUsdString)

  useEffect(() => {
    if (isIntersecting) {
      setLoadData(true)
    }
  }, [isIntersecting])

  useSlowRefreshEffect(() => {
    const fetchMarketData = async () => {
      const totalWon = await getTotalWon()
      setBnbWon(totalWon)
    }

    if (loadData) {
      fetchMarketData()
    }
  }, [loadData])

  return (
    <>
      <Flex flexDirection="column" mt="0px">
        <StyledCardHeading color="#280D5F" bold fontSize="16px">
          {t('Prediction')}
        </StyledCardHeading>

        <StyledCardTitle>
          {bnbWonInUsd ? (
            <StyledCardTitleMain color="#fff" my="8px" scale="xl" bold style={{ textAlign: 'center' }}>
              {pretext}
              {localisedBnbUsdString}
            </StyledCardTitleMain>
          ) : (
            <>
              <Skeleton width={230} height={40} my="8px" />
              <div ref={observerRef} />
            </>
          )}
          <StyledCardTitleUnder color="#fff" mb="24px" bold fontSize="16px">
            {wonSoFar}
          </StyledCardTitleUnder>
        </StyledCardTitle>

        <StyledCardContent color="#280D5F" mb="40px">
          {t('Will BNB price rise or fall? guess correctly to win!')}
        </StyledCardContent>
      </Flex>

      <Flex alignItems="center" justifyContent="center">
        <StyledLink to="/prediction" id="homepage-prediction-cta">
          <Button width="100%" style={{ background: '#EC4C93' }}>
            <Text bold color="#fff">
              {t('Play')}
            </Text>
            <ArrowForwardIcon ml="4px" color="#fff" />
          </Button>
        </StyledLink>
      </Flex>
    </>
  )
}

export default PredictionCardContent
