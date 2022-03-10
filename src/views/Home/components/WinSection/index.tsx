import styled from 'styled-components'
import { Flex, Text, TicketFillIcon, PredictionsIcon } from '@pancakeswap/uikit'
import { useTranslation } from 'contexts/Localization'
// import useTheme from 'hooks/useTheme'
import ColoredWordHeading from '../ColoredWordHeading'
import IconCard, { IconCardData } from '../IconCard'
import PredictionCardContent from './PredictionCardContent'
import LotteryCardContent from './LotteryCardContent'
import CompositeImage from '../CompositeImage'

// const TransparentFrame = styled.div<{ isDark: boolean }>`
//   background: ${({ theme }) => (theme.isDark ? 'rgba(8, 6, 11, 0.6)' : ' rgba(255, 255, 255, 0.6)')};
//   padding: 16px;
//   border: 1px solid ${({ theme }) => theme.colors.cardBorder};
//   box-sizing: border-box;
//   backdrop-filter: blur(12px);
//   border-radius: 72px;

//   ${({ theme }) => theme.mediaQueries.md} {
//     padding: 40px;
//   }
// `

const BgWrapper = styled.div`
  z-index: -1;
  overflow: hidden;
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0px;
  left: 0px;
`

const BottomLeftImgWrapper = styled(Flex)`
  position: absolute;
  left: 0;
  bottom: -64px;
  max-width: 192px;

  ${({ theme }) => theme.mediaQueries.md} {
    max-width: 100%;
  }
`

const TopRightImgWrapper = styled(Flex)`
  position: absolute;
  right: 0;
  top: -64px;
  max-width: 192px;

  ${({ theme }) => theme.mediaQueries.md} {
    max-width: 100%;
  }
`

const StyledColoredWordHeading = styled(ColoredWordHeading)`
  color: #fff;
  font-weight: 500;
  font-size: 60px;
  line-height: 63px;
  text-align: center;
  margin-bottom: 40px;

  @media screen and (max-width: 1400px) {
    font-size: 50px;
    line-height: 53px;
    margin-bottom: 20px;
  }

  @media screen and (max-width: 576px) {
    font-size: 35px;
    line-height: 38px;
    margin-bottom: 15px;
  }
`

const StyledTextWrapper = styled(Text)`
  margin-bottom: 40px;
  text-align: center;

  @media screen and (max-width: 1400px) {
    margin-bottom: 20px;
  }

  @media screen and (max-width: 576px) {
    margin-bottom: 15px;
  }
`

const StyledText = styled(Text)`
  color: #fff;
  font-style: normal;
  font-weight: 300;
  font-size: 25px;
  line-height: 26px;
  text-align: center;
  margin: 0;
  padding: 0;
  display: inline;

  @media screen and (max-width: 1400px) {
    font-size: 23px;
    line-height: 24px;
  }

  @media screen and (max-width: 576px) {
    font-size: 23px;
    line-height: 24px;
  }
`

const StyledCardListWrapper = styled(Flex)`
  flex: 1 1 0%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  position: relative;
`

const StyledCardWrapper = styled(Flex)`
  position: absolute;
  margin: 0;

  &&:nth-child(1) {
    bottom: 0;
    left: 50%;
    transform: translateX(calc(-50% - (275px / 2)));
  }

  &&:nth-child(2) {
    bottom: calc(60px);
    left: 50%;
    transform: translateX(calc(-50% + (275px / 2) + 40px));
  }

  @media screen and (max-width: 576px) {
    && {
      backdrop-filter: blur(5px);
    }

    &&,
    &&:nth-child(1),
    &&:nth-child(2) {
      position: relative;
      transform: translate(0, 0);
      top: 0;
      left: 0;
      margin-bottom: 15px;
    }
  }
`

const StyledContentWrapper = styled.div`
  margin: 0;
  padding: 0;
`

const PredictionCardData: IconCardData = {
  icon: <PredictionsIcon width="36px" color="inverseContrast" />,
  background: 'linear-gradient(180deg, #ffb237 0%, #ffcd51 51.17%, #ffe76a 100%);',
  borderColor: '#ffb237',
  rotation: '-2.36deg',
}

const LotteryCardData: IconCardData = {
  icon: <TicketFillIcon color="white" width="36px" />,
  background: ' linear-gradient(180deg, #7645D9 0%, #5121B1 100%);',
  borderColor: '#3C1786',
  rotation: '1.43deg',
}

const bottomLeftImage = {
  path: '/images/home/prediction-cards/',
  attributes: [
    { src: 'bottom-left', alt: 'CAKE card' },
    { src: 'green', alt: 'Green CAKE card with up arrow' },
    { src: 'red', alt: 'Red Cake card with down arrow' },
    { src: 'top-right', alt: 'CAKE card' },
  ],
}

const topRightImage = {
  path: '/images/home/lottery-balls/',
  attributes: [
    { src: '2', alt: 'Lottery ball number 2' },
    { src: '4', alt: 'Lottery ball number 4' },
    { src: '6', alt: 'Lottery ball number 6' },
    { src: '7', alt: 'Lottery ball number 7' },
    { src: '9', alt: 'Lottery ball number 9' },
  ],
}

const WinSection = () => {
  const { t } = useTranslation()
  // const { theme } = useTheme()

  return (
    <>
      <BgWrapper>
        <BottomLeftImgWrapper>
          <CompositeImage {...bottomLeftImage} />
        </BottomLeftImgWrapper>
        <TopRightImgWrapper>
          <CompositeImage {...topRightImage} />
        </TopRightImgWrapper>
      </BgWrapper>

      {/* <TransparentFrame isDark={theme.isDark}> */}
      <StyledCardListWrapper flexDirection="column" alignItems="center" justifyContent="center">
        <StyledContentWrapper>
          <StyledColoredWordHeading
            numberOfColoredWords={2}
            firstColorCustomized="#ec4b93"
            textAlign="center"
            text={t('Win millions in prizes')}
            style={{ color: '#fff' }}
          />

          <StyledTextWrapper>
            <StyledText color="textSubtle">{t('Provably fair, on-chain games.')}</StyledText>
            <StyledText> </StyledText>
            <StyledText mb="0px" color="textSubtle">
              {t('Win big with Womentech.')}
            </StyledText>
          </StyledTextWrapper>
        </StyledContentWrapper>

        <Flex m="0 auto" flexDirection={['column', null, null, 'row']} maxWidth="600px">
          <StyledCardWrapper
            flex="1"
            maxWidth={['275px', null, null, '100%']}
            mr={[null, null, null, '24px']}
            mb={['32px', null, null, '0']}
          >
            <IconCard
              {...PredictionCardData}
              style={{ transform: 'rotate(0)' }}
              hasMainIcon={false}
              hasBorder
              hasLinearBg
              background="transparent"
            >
              <PredictionCardContent />
            </IconCard>
          </StyledCardWrapper>

          <StyledCardWrapper flex="1" maxWidth={['275px', null, null, '100%']}>
            <IconCard
              {...LotteryCardData}
              style={{ transform: 'rotate(0)' }}
              hasMainIcon={false}
              hasBorder
              hasLinearBg
              background="transparent"
            >
              <LotteryCardContent />
            </IconCard>
          </StyledCardWrapper>
        </Flex>
      </StyledCardListWrapper>
      {/* </TransparentFrame> */}
    </>
  )
}

export default WinSection
