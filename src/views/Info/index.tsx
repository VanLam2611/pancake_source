import styled from 'styled-components'
import { PoolUpdater, ProtocolUpdater, TokenUpdater } from 'state/info/updaters'
import InfoNav from './components/InfoNav'

const InfoWrapper = styled.div`
  background-image: url('/imagesForWomenTechFinance/info/WomenTech_finance_bg_info_token.png');
  background-attachment: fixed;
  background-size: cover;
  background-position: center center;
  background-repeat: no-repeat;
`

export const InfoPageLayout = ({ children }) => {
  return (
    <InfoWrapper>
      <ProtocolUpdater />
      <PoolUpdater />
      <TokenUpdater />
      <InfoNav />
      {children}
    </InfoWrapper>
  )
}
