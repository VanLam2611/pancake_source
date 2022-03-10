// import styled from 'styled-components'
import { NextLinkFromReactRouter } from 'components/NextLink'
import { useTheme } from 'styled-components'
import { Flex, Button } from '@pancakeswap/uikit'
import { useWeb3React } from '@web3-react/core'
import { useTranslation } from 'contexts/Localization'
import styled from 'styled-components'
import ConnectWalletButton from 'components/ConnectWalletButton'
// import useTheme from 'hooks/useTheme'
// import { SlideSvgDark, SlideSvgLight } from './SlideSvg'
// import CompositeImage, { getSrcSet, CompositeImageProps } from './CompositeImage'

const StyledHeroHeading = styled.div`
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
const StyledHeroIntroText = styled.div`
  color: #fff;
  font-style: normal;
  font-weight: 300;
  font-size: 25px;
  line-height: 26px;
  text-align: center;
  margin-bottom: 40px;
  max-width: 650px;

  @media screen and (max-width: 1400px) {
    font-size: 23px;
    line-height: 24px;
    margin-bottom: 20px;
    max-width: 500px;
  }

  @media screen and (max-width: 576px) {
    font-size: 23px;
    line-height: 24px;
    margin-bottom: 15px;
  }
`

const Hero = () => {
  const { t } = useTranslation()
  const { account } = useWeb3React()
  const { isDark } = useTheme()
  // const { theme } = useTheme()

  return (
    <>
      {/* <BgWrapper>
        <InnerWrapper>{theme.isDark ? <SlideSvgDark width="100%" /> : <SlideSvgLight width="100%" />}</InnerWrapper>
      </BgWrapper> */}
      <Flex
        position="relative"
        flexDirection={['column-reverse', null, null, 'row']}
        alignItems={['flex-end', null, null, 'center']}
        justifyContent="center"
        // mt={[account ? '280px' : '50px', null, 0]}
        id="homepage-hero"
      >
        <Flex flex="1" flexDirection="column" style={{ justifyContent: 'center', alignItems: 'center' }}>
          <StyledHeroHeading>
            {t('The moon is made of ')}
            <span className="heading-highlighted" style={{ color: '#EC4C93' }}>
              Womentech.
            </span>
          </StyledHeroHeading>

          <StyledHeroIntroText>
            {t('Trade, earn, and win crypto on the most popular decentralized platform in the galaxy.')}
          </StyledHeroIntroText>

          <Flex style={{ justifyContent: 'center', alignItems: 'center' }}>
            <NextLinkFromReactRouter to="/swap" style={{ marginRight: '30px' }}>
              <Button style={{ background: isDark ? '#EC4C93' : 'transparent', border: '1px solid #EC4C93' }}>
                {t('Trade Now')}
              </Button>
            </NextLinkFromReactRouter>
            {!account && <ConnectWalletButton mr="0px" />}
          </Flex>
        </Flex>
      </Flex>
    </>
  )
}

export default Hero
