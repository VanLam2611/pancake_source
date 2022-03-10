import { ifosConfig } from 'config/constants'
import styled from 'styled-components'
import { Box } from '@pancakeswap/uikit'

import useGetPublicIfoV2Data from 'views/Ifos/hooks/v2/useGetPublicIfoData'
import useGetWalletIfoV3Data from 'views/Ifos/hooks/v3/useGetWalletIfoData'
import Container from 'components/Layout/Container'

import { IfoCurrentCard } from './components/IfoFoldableCard'
import IfoLayout, { IfoLayoutWrapper } from './components/IfoLayout'
import IfoPoolVaultCard from './components/IfoPoolVaultCard'
import IfoQuestions from './components/IfoQuestions'
import IfoSteps from './components/IfoSteps'

const IfoStepBackground = styled(Box)`
  // background: ${({ theme }) => theme.colors.gradients.bubblegum};
  background: none;
`

const IfoQuestionsWrapper = styled.div``

const StyledShadowEffect = styled.div`
  background: linear-gradient(180deg, rgba(116, 33, 69, 0) 0%, #490034 100%);
  width: 100%;
  height: 200px;
`

/**
 * Note: currently there should be only 1 active IFO at a time
 */
const activeIfo = ifosConfig.find((ifo) => ifo.isActive)

const Ifo = () => {
  const publicIfoData = useGetPublicIfoV2Data(activeIfo)
  const walletIfoData = useGetWalletIfoV3Data(activeIfo)

  return (
    <IfoLayout id="current-ifo">
      <Container>
        <IfoLayoutWrapper>
          <IfoPoolVaultCard />
          <IfoCurrentCard ifo={activeIfo} publicIfoData={publicIfoData} walletIfoData={walletIfoData} />
        </IfoLayoutWrapper>
      </Container>
      <IfoStepBackground mt="60px">
        <Container>
          <IfoSteps isLive={publicIfoData.status === 'live'} ifo={activeIfo} walletIfoData={walletIfoData} />
        </Container>
      </IfoStepBackground>
      <Container mt="60px" mb="60px">
        <IfoQuestionsWrapper>
          <IfoQuestions />
        </IfoQuestionsWrapper>
      </Container>

      <StyledShadowEffect />
    </IfoLayout>
  )
}

export default Ifo
