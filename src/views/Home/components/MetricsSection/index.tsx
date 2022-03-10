import { Heading, Flex, Text, Skeleton, ChartIcon, CommunityIcon, SwapIcon } from '@pancakeswap/uikit'
import { useTranslation } from 'contexts/Localization'
import useTheme from 'hooks/useTheme'
import styled, { css } from 'styled-components'
import { formatLocalisedCompactNumber } from 'utils/formatBalance'
import useSWRImmutable from 'swr/immutable'
import IconCard, { IconCardData } from '../IconCard'
import StatCardContent from './StatCardContent'
// import GradientLogo from '../GradientLogoSvg'

const StyledHeadingsWrapper = styled.div`
  && {
    text-align: center;
    margin-bottom: 40px;
  }

  @media screen and (max-width: 1400px) {
    && {
      margin-bottom: 20px;
    }
  }

  @media screen and (max-width: 576px) {
    && {
      margin-bottom: 15px;
    }
  }
`

const StyledTextsWrapper = styled.div`
  && {
    margin-bottom: 140px;
  }

  && div {
    margin: 0;
  }

  &&,
  && div {
    color: #fff;
    font-style: normal;
    font-weight: 300;
    font-size: 25px;
    line-height: 26px;
    text-align: center;
  }

  @media screen and (max-width: 1400px) {
    && {
      margin-bottom: 140px;
    }

    &&,
    && div {
      font-size: 23px;
      line-height: 24px;
    }
  }

  @media screen and (max-width: 576px) {
    && {
      margin-bottom: 140px;
    }

    &&,
    && div {
      font-size: 23px;
      line-height: 24px;
    }
  }
`

const StyledIconCardWrapper = styled.div`
  && {
    position: relative;
    display: inline-block;
    margin: 20px 40px;
  }
`

const StyledBubbleWrapper = styled.div`
  && {
    position: absolute;
    width: 35%;
    height: 35%;
    border-radius: 50%;
    background: transparent;
    top: 0;
    left: 0;
    // animation: bubbling 1s ease 0s infinite alternate;
  }

  // @keyframes bubbling {
  //   from {
  //     top: 0;
  //   }
  //   to {
  //     top: 30px;
  //   }
  // }
`

const StyledBubble = styled.div`
  && {
    position: relative;
    width: 100%;
    height: 100%;
    border-radius: 50%;
    overflow: hidden;
    box-shadow: -5px -5px 10px 0px #ffffff54 inset;

    &&::after {
      position: absolute;
      content: '';
      width: 100%;
      height: 100%;
      border-radius: 50%;
      bottom: -100%;
      right: -100%;
      box-shadow: 0px 0px 80px 50px #fff;
    }
  }
`

const StyledIconCard = styled(IconCard)<{ $isCircle?: boolean }>`
  && {
    width: 258px;
    height: 258px;
    background: #da54d8;
    background: linear-gradient(
      -60deg,
      #da54d8 0%,
      rgba(218, 84, 216, 0.5) 20%,
      rgba(218, 84, 216, 0) 60%,
      rgba(218, 84, 216, 0) 100%
    );
    box-shadow: 20px 20px 30px -15px #ec4c93a6;
    margin: 0;
    overflow: visible;

    ${(props) =>
      props.$isCircle &&
      css`
        border-radius: 50%;
      `}
  }

  && > div {
    background: transparent;
    position: absolute;
    top: 0;
    left: 0;
    z-index: 1;
  }

  &&::after {
    content: '';
    width: 100%;
    height: 100%;
    position: absolute;
    top: 100%;
    left: 100%;
    box-shadow: -250px -250px 50px 0px rgba(165, 7, 125, 0.5);
    border-radius: 50%;
  }
`

const StyledHeading = styled(Heading)<{ $isHighlighted?: boolean }>`
  && {
    color: #fff;
    font-weight: 500;
    font-size: 60px;
    line-height: 63px;
    text-align: center;
    margin: 0;
    display: inline;

    ${(props) =>
      props.$isHighlighted &&
      css`
        color: #ec4b93;
      `}
  }

  @media screen and (max-width: 1400px) {
    && {
      font-size: 50px;
      line-height: 53px;
    }
  }

  @media screen and (max-width: 576px) {
    && {
      font-size: 35px;
      line-height: 38px;
    }
  }
`

const StyledIconCardList = styled(Flex)`
  && {
    margin: 40px 0 40px 0;
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    align-items: center;
  }

  @media screen and (max-width: 1400px) {
    && {
      margin: 20px 0 20px 0;
    }

    && > div,
    && > div:first-child,
    && > div:last-child {
      margin: 0 20px 20px 20px;
    }
  }

  @media screen and (max-width: 992px) {
    && > div,
    && > div:first-child,
    && > div:last-child {
      margin: 40px 20px 40px 20px;
    }
  }

  @media screen and (max-width: 576px) {
    && {
      margin: 20px 0 20px 0;
    }
  }
`

const Stats = () => {
  const { t } = useTranslation()
  const { theme } = useTheme()

  const { data: tvl } = useSWRImmutable('tvl')
  const { data: txCount } = useSWRImmutable('totalTx30Days')
  const { data: addressCount } = useSWRImmutable('addressCount30Days')
  const trades = formatLocalisedCompactNumber(txCount)
  const users = formatLocalisedCompactNumber(addressCount)
  const tvlString = tvl ? formatLocalisedCompactNumber(tvl) : '-'

  const tvlText = t('And those users are now entrusting the platform with over $%tvl% in funds.', { tvl: tvlString })
  const [entrusting, inFunds] = tvlText.split(tvlString)

  const UsersCardData: IconCardData = {
    icon: <CommunityIcon color="secondary" width="36px" />,
  }

  const TradesCardData: IconCardData = {
    icon: <SwapIcon color="primary" width="36px" />,
  }

  const StakedCardData: IconCardData = {
    icon: <ChartIcon color="failure" width="36px" />,
  }

  return (
    <Flex justifyContent="center" alignItems="center" flexDirection="column">
      <StyledHeadingsWrapper>
        <StyledHeading textAlign="center" scale="xl">
          {t('Used by millions.')}
        </StyledHeading>
        <span> </span>
        <StyledHeading $isHighlighted textAlign="center" scale="xl" mb="32px">
          {t('Trusted with billions.')}
        </StyledHeading>
      </StyledHeadingsWrapper>

      <StyledTextsWrapper>
        <Text textAlign="center" color="textSubtle">
          {t('Womentech has the most users of any decentralized platform, ever.')}
        </Text>
        <Flex flexWrap="wrap">
          <Text display="inline" textAlign="center" color="textSubtle" mb="20px">
            {entrusting}
            <>{tvl ? <>{tvlString}</> : <Skeleton display="inline-block" height={16} width={70} mt="2px" />}</>
            {inFunds}
          </Text>
        </Flex>
      </StyledTextsWrapper>

      <StyledIconCardList flexDirection={['column', null, null, 'row']}>
        <StyledIconCardWrapper>
          <StyledIconCard $isCircle {...UsersCardData} mr={[null, null, null, '16px']} mb={['16px', null, null, '0']}>
            <StatCardContent
              headingText={t('%users% users', { users })}
              bodyText={t('in the last 30 days')}
              highlightColor={theme.colors.secondary}
              lastWordColor="#ff0099"
              style={{ justifyContent: 'flex-start', width: '100%', height: '100%', marginTop: '50%' }}
            />
          </StyledIconCard>
          <StyledBubbleWrapper style={{ top: '-5%', left: '10%' }}>
            <StyledBubble />
          </StyledBubbleWrapper>
        </StyledIconCardWrapper>

        <StyledIconCardWrapper>
          <StyledIconCard $isCircle {...TradesCardData} mr={[null, null, null, '16px']} mb={['16px', null, null, '0']}>
            <StatCardContent
              headingText={t('%trades% trades', { trades })}
              bodyText={t('made in the last 30 days')}
              highlightColor={theme.colors.primary}
              lastWordColor="#6800a8"
              style={{ justifyContent: 'flex-start', width: '100%', height: '100%', marginTop: '50%' }}
            />
          </StyledIconCard>
          <StyledBubbleWrapper style={{ top: '-10%', right: '10%', left: 'auto' }}>
            <StyledBubble />
          </StyledBubbleWrapper>
        </StyledIconCardWrapper>

        <StyledIconCardWrapper>
          <StyledIconCard $isCircle {...StakedCardData}>
            <StatCardContent
              headingText={t('$%tvl% staked', { tvl: tvlString })}
              bodyText={t('Total Value Locked')}
              highlightColor={theme.colors.failure}
              lastWordColor="#ff0099"
              style={{ justifyContent: 'flex-start', width: '100%', height: '100%', marginTop: '50%' }}
            />
          </StyledIconCard>
          <StyledBubbleWrapper style={{ top: '-5%', left: '10%', transform: 'rotate(90deg)' }}>
            <StyledBubble />
          </StyledBubbleWrapper>
        </StyledIconCardWrapper>
      </StyledIconCardList>
    </Flex>
  )
}

export default Stats
