import styled, { css } from 'styled-components'
import { Box, Heading, Text, Button, Flex, useMatchBreakpoints } from '@pancakeswap/uikit'
import Container from 'components/Layout/Container'
import { useTranslation } from 'contexts/Localization'
import { useRouter } from 'next/router'
import Link from 'next/link'

const StyledHero = styled(Box)`
  // background-image: url('/images/ifos/assets/ifo-banner-${({ theme }) => (theme.isDark ? 'dark' : 'light')}.png');
  // background-position: top, center;
  // background-repeat: no-repeat;
  // background-size: auto 100%;
  display: block;
  padding: 0;
  margin: 30px 0;
`

const StyledContainer = styled(Container)`
  @media screen and (min-width: 370px) {
    padding-left: 24px;
    padding-right: 24px;
  }
`

const StyledHeroContentWrapper = styled.div`
  background: rgba(12, 7, 17, 0.8);
  border: 1px solid #ec4c93;
  box-sizing: border-box;
  border-radius: 10px;
  padding: 30px;
`

const StyledHeading = styled(Heading)`
  font-style: normal;
  font-weight: bold;
  font-size: 32px;
  line-height: 32px;
  color: #fff;
  margin-bottom: 8px;
`

const StyledButton = styled(Button)`
  background-color: ${({ theme }) => theme.colors.tertiary};
  color: ${({ theme }) => theme.colors.primary};
  padding: 4px 13px;
  height: auto;
  text-transform: uppercase;
  align-self: flex-start;
  font-size: 12px;
  box-shadow: ${({ theme }) => theme.shadows.inset};
  border-radius: 8px;
  margin-left: 8px;
`

const DesktopButton = styled(Button)`
  // align-self: flex-end;
  // // Custom button style:
  // background: #EC4C93;
  // border: 1px solid #EC4C93;
  // box-sizing: border-box;
  // border-radius: 300px;
  // padding: 18px 40px;
  // border: none; outline: none;
  // // Custom content style:
  // font-size: 20px;
  // line-height: 20px;
  // text-transform: uppercase;
  // color: #fff;
  // font-weight: 400;
`

const StyledSubTitle = styled(Text)`
  font-style: normal;
  font-weight: normal;
  font-size: 24px;
  line-height: 24px;
  color: #b5689e;
  margin: 0;
`

const StyledNavButton = styled.div<{ $isActive?: boolean }>`
  color: #fff;
  font-size: 16px;
  line-height: 16px;
  text-transform: uppercase;
  background: blue;
  padding: 18px 40px;
  background: rgba(46, 0, 23, 0.5);
  border: 1px solid rgba(236, 76, 147, 0.5);
  box-sizing: border-box;
  border-radius: 300px;
  margin-right: 14px;
  cursor: pointer;

  :hover {
    background: #B5689E;
    border: 1px solid #B5689E;
  }

  ${(props) =>
    props.$isActive &&
    css`
      &&, &&:hover {
        background: #ec4c93;
        border: 1px solid #ec4c93;
      }
    `}
`

const Hero = () => {
  const router = useRouter()
  const { t } = useTranslation()
  const { isMobile } = useMatchBreakpoints()
  const currentRoute = router.route

  const handleClick = () => {
    const howToElem = document.getElementById('ifo-how-to')
    if (howToElem != null) {
      howToElem.scrollIntoView()
    } else {
      router.push('/ifo#ifo-how-to')
    }
  }

  return (
    <Box mb="0px">
      <StyledHero>
        <StyledContainer>
          <StyledHeroContentWrapper>
            <Flex
              justifyContent="space-between"
              flexDirection={['column', 'column', 'column', 'row']}
              style={{ gap: '4px' }}
            >
              <Box>
                <StyledHeading as="h1" mb={['12px', '12px', '16px']}>
                  {t('IFO: Initial Farm Offerings')}
                </StyledHeading>
                <StyledSubTitle bold>
                  {t('Buy new tokens launching on BNB Smart Chain')}
                  {isMobile && <StyledButton onClick={handleClick}>{t('How does it work?')}</StyledButton>}
                </StyledSubTitle>
              </Box>

              <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center' }}>
                <Link href="/ifo" passHref>
                  <StyledNavButton $isActive={currentRoute === '/ifo'}>{t('Latest')}</StyledNavButton>
                </Link>
                <Link href="/ifo/history" passHref>
                  <StyledNavButton $isActive={currentRoute === '/ifo/history'}>{t('Finished')}</StyledNavButton>
                </Link>
                {!isMobile && (
                  <DesktopButton onClick={handleClick} variant="subtle">
                    {t('How does it work?')}
                  </DesktopButton>
                )}
              </div>
            </Flex>
          </StyledHeroContentWrapper>
        </StyledContainer>
      </StyledHero>
    </Box>
  )
}

export default Hero
