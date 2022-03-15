import styled from 'styled-components'
import PageSection from 'components/PageSection'
import { useWeb3React } from '@web3-react/core'
import useTheme from 'hooks/useTheme'
import Container from 'components/Layout/Container'
import { PageMeta } from 'components/Layout/Page'
import { useTranslation } from 'contexts/Localization'
import Hero from './components/Hero'
import { swapSectionData, earnSectionData, cakeSectionData } from './components/SalesSection/data'
import MetricsSection from './components/MetricsSection'
import SalesSection from './components/SalesSection'
import WinSection from './components/WinSection'
import FarmsPoolsRow from './components/FarmsPoolsRow'
import Footer from './components/Footer'
import CakeDataRow from './components/CakeDataRow'
// import { InnerWedgeWrapper, OuterWedgeWrapper, WedgeTopRight } from './components/WedgeSvgs'
// import UserBanner from './components/UserBanner'
// import MultipleBanner from './components/Banners/MultipleBanner'

const StyledHeroSection = styled(PageSection)`
  background-image: url('/imagesForWomenTechFinance/home/WomenTech_finance_02_1.png');
  background-size: cover;
  background-position: center center;
  background-repeat: no-repeat;
  min-height: calc(100vh - 57px);
  max-height: calc(100vh - 57px);
  height: calc(100vh - 57px);
  overflow: hidden;
  padding: 40px 0;
  margin-bottom: 100px;

  @media screen and (max-width: 1400px) {
    padding: 0px 0;

    && > div {
      padding: 40px;
    }
  }

  @media screen and (max-width: 576px) {
    padding: 0px 0;

    && > div {
      padding: 20px;
    }
  }
`

const StyledMetricsSection = styled(PageSection)`
  min-height: calc(100vh);
  overflow: hidden;
  background-color: transparent;
  padding: 40px 0;
  margin-bottom: 100px;

  @media screen and (max-width: 1400px) {
    padding: 0px 0;

    && > div {
      padding: 40px;
    }
  }

  @media screen and (max-width: 576px) {
    padding: 0px 0;

    && > div {
      padding: 20px;
    }
  }
`

const StyledSwapSection = styled(PageSection)`
  background-image: url('/imagesForWomenTechFinance/home/WomenTech_finance_SwapSection.png');
  background-size: cover;
  background-position: center center;
  background-repeat: no-repeat;
  min-height: calc(100vh);
  overflow: hidden;
  background-color: transparent;
  padding: 40px 0;
  margin-bottom: 100px;

  @media screen and (max-width: 1400px) {
    padding: 0px 0;

    && > div {
      padding: 40px;
    }
  }

  @media screen and (max-width: 576px) {
    padding: 0px 0;

    && > div {
      padding: 20px;
    }
  }
`

const StyledSalesSection = styled(PageSection)`
  background-image: url('/imagesForWomenTechFinance/home/WomenTech_finance_SalesSection.png');
  background-size: cover;
  background-position: center center;
  background-repeat: no-repeat;
  min-height: calc(100vh);
  overflow: hidden;
  background-color: transparent;
  padding: 40px 0;
  margin-bottom: 100px;

  && > div {
    flex: 1;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
  }

  @media screen and (max-width: 1400px) {
    padding: 0px 0;

    && > div {
      padding: 40px;
    }
  }

  @media screen and (max-width: 576px) {
    padding: 0px 0;

    && > div {
      padding: 20px;
    }
  }
`

const StyledWinSection = styled(PageSection)`
  background-image: url('/imagesForWomenTechFinance/home/WomenTech_finance_WinSection.png');
  background-size: cover;
  background-position: center center;
  background-repeat: no-repeat;
  min-height: calc(100vh);
  overflow: hidden;
  background-color: transparent;
  padding: 40px 0;
  margin-bottom: 100px;

  && > div {
    flex: 1;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
  }

  @media screen and (max-width: 1400px) {
    padding: 0px 0;

    && > div {
      padding: 40px;
    }
  }

  @media screen and (max-width: 576px) {
    padding: 0px 0;

    && > div {
      padding: 20px;
    }
  }
`

const StyledTokenSection = styled(PageSection)`
  background-image: url('/imagesForWomenTechFinance/home/WomenTech_finance_TokenSection.png');
  background-size: cover;
  background-position: center center;
  background-repeat: no-repeat;
  min-height: calc(100vh);
  overflow: hidden;
  background-color: transparent;
  padding: 40px 0;
  margin-bottom: 100px;

  && > div {
    flex: 1;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
  }

  @media screen and (max-width: 1400px) {
    padding: 0px 0;

    && > div {
      padding: 40px;
    }
  }

  @media screen and (max-width: 576px) {
    padding: 0px 0;

    && > div {
      padding: 20px;
    }
  }
`

const StyledHomeFooter = styled(PageSection)`
  max-height: calc(100vh);
  background: transparent;
  padding: 40px 0;
  background-image: url('/imagesForWomenTechFinance/home/WomenTech_finance_Footer.png');
  background-size: cover;
  background-position: center center;
  background-repeat: no-repeat;
`

const UserBannerWrapper = styled(Container)`
  z-index: 1;
  position: absolute;
  width: 100%;
  top: 0;
  left: 50%;
  transform: translate(-50%, 0);
  padding-left: 0px;
  padding-right: 0px;

  ${({ theme }) => theme.mediaQueries.lg} {
    padding-left: 24px;
    padding-right: 24px;
  }
`

const HomeWrapper = styled.div`
  @media screen and (max-width: 1366px) {
    font-size: 23px;
  }
`

const Home: React.FC = () => {
  const { theme } = useTheme()
  const { account } = useWeb3React()

  const HomeSectionContainerStyles = { margin: '0', width: '100%', maxWidth: '968px' }

  const { t } = useTranslation()

  return (
    <HomeWrapper>
      <PageMeta />
      <StyledHeroSection
        innerProps={{ style: { margin: '0', width: '100%' } }}
        background={
          theme.isDark
            ? 'radial-gradient(103.12% 50% at 50% 50%, #21193A 0%, #191326 100%)'
            : 'linear-gradient(139.73deg, #E6FDFF 0%, #F3EFFF 100%)'
        }
        index={2}
        hasCurvedDivider={false}
      >
        {account && (
          <UserBannerWrapper>
            {/* <UserBanner /> */}
          </UserBannerWrapper>
        )}
        {/* <MultipleBanner /> */}
        <Hero />
      </StyledHeroSection>

      <StyledMetricsSection
        innerProps={{ style: { margin: '0', width: '100%' } }}
        background={
          theme.isDark
            ? 'linear-gradient(180deg, #09070C 22%, #201335 100%)'
            : 'linear-gradient(180deg, #FFFFFF 22%, #D7CAEC 100%)'
        }
        index={2}
        hasCurvedDivider={false}
        style={{ background: 'transparent' }}
      >
        <MetricsSection />
      </StyledMetricsSection>

      <StyledSwapSection
        innerProps={{ style: HomeSectionContainerStyles }}
        background={theme.colors.background}
        index={2}
        hasCurvedDivider={false}
      >
        <SalesSection {...swapSectionData(t)} numberOfWords={2} />
      </StyledSwapSection>

      <StyledSalesSection
        innerProps={{ style: HomeSectionContainerStyles }}
        background={theme.colors.gradients.cardHeader}
        index={2}
        hasCurvedDivider={false}
        style={{ backgroundColor: 'transparent' }}
      >
        <SalesSection {...earnSectionData(t)} numberOfWords={3} />
        <FarmsPoolsRow />
      </StyledSalesSection>

      <StyledWinSection
        innerProps={{ style: HomeSectionContainerStyles }}
        background={
          theme.isDark
            ? 'linear-gradient(180deg, #0B4576 0%, #091115 100%)'
            : 'linear-gradient(180deg, #6FB6F1 0%, #EAF2F6 100%)'
        }
        index={2}
        hasCurvedDivider={false}
      >
        <WinSection />
      </StyledWinSection>

      <StyledTokenSection
        innerProps={{ style: HomeSectionContainerStyles }}
        background={theme.colors.background}
        index={2}
        hasCurvedDivider={false}
        style={{ backgroundColor: 'transparent' }}
      >
        <SalesSection {...cakeSectionData(t)} numberOfWords={1} />
        <CakeDataRow />
      </StyledTokenSection>

      <StyledHomeFooter
        innerProps={{ style: HomeSectionContainerStyles }}
        background="linear-gradient(180deg, #7645D9 0%, #5121B1 100%)"
        index={2}
        hasCurvedDivider={false}
        style={{ backgroundColor: 'transparent' }}
      >
        <Footer />
      </StyledHomeFooter>
    </HomeWrapper>
  )
}

export default Home
