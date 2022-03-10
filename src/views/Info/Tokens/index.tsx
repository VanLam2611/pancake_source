import { Card, Heading } from '@pancakeswap/uikit'
import Page from 'components/Layout/Page'
import { useTranslation } from 'contexts/Localization'
import { useMemo } from 'react'
import { useAllTokenData, useTokenDatas } from 'state/info/hooks'
import { useWatchlistTokens } from 'state/user/hooks'
import styled from 'styled-components'
import TokenTable from 'views/Info/components/InfoTables/TokensTable'
import TopTokenMovers from 'views/Info/components/TopTokenMovers'

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

const StyledCardForNoSavedTokens = styled(Card)`
  background: rgba(0, 0, 0, 0.8);
  font-style: normal;
  font-weight: normal;
  font-size: 16px;
  line-height: 16px;
  padding: 30px;
  border-radius: 10px;
  border: 1px solid #ec4c93;
  backdrop-filter: blur(5px);
  // Content:
  color: #ec4c93;
  font-style: normal;
  font-weight: normal;
  font-size: 16px;
  line-height: 16px;

  && > div {
    background: transparent;
  }
`

const TokensOverview: React.FC = () => {
  const { t } = useTranslation()

  const allTokens = useAllTokenData()

  const formattedTokens = useMemo(() => {
    return Object.values(allTokens)
      .map((token) => token.data)
      .filter((token) => token)
  }, [allTokens])

  const [savedTokens] = useWatchlistTokens()
  const watchListTokens = useTokenDatas(savedTokens)

  return (
    <Page>
      {/* Section 1: */}
      <StyledSection>
        <StyledHeading scale="lg" mb="16px">
          {t('Your Watchlist')}
        </StyledHeading>
        {savedTokens.length > 0 ? (
          <TokenTable tokenDatas={watchListTokens} />
        ) : (
          <StyledCardForNoSavedTokens>
            {/* <Text py="16px" px="24px">
              {t('Saved tokens will appear here')}
            </Text> */}
            {t('Saved tokens will appear here')}
          </StyledCardForNoSavedTokens>
        )}
      </StyledSection>

      {/* Section 2: */}
      <StyledSection>
        <StyledHeading scale="lg" mb="16px">
          {t('Top Movers')}
        </StyledHeading>
        <TopTokenMovers />
      </StyledSection>

      {/* Section 3: */}
      <StyledSection>
        <StyledHeading scale="lg" mt="40px" mb="16px" id="info-tokens-title">
          {t('All Tokens')}
        </StyledHeading>
        <TokenTable tokenDatas={formattedTokens} />
      </StyledSection>
    </Page>
  )
}

export default TokensOverview
