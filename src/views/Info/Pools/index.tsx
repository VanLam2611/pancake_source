import { useMemo } from 'react'
import { Heading, Card } from '@pancakeswap/uikit'
import Page from 'components/Layout/Page'
import PoolTable from 'views/Info/components/InfoTables/PoolsTable'
import { useAllPoolData, usePoolDatas } from 'state/info/hooks'
import { useWatchlistPools } from 'state/user/hooks'
import { useTranslation } from 'contexts/Localization'
import styled from 'styled-components'

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

const StyledCardForNoSavedPools = styled(Card)`
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

const PoolsOverview: React.FC = () => {
  const { t } = useTranslation()

  // get all the pool datas that exist
  const allPoolData = useAllPoolData()
  const poolDatas = useMemo(() => {
    return Object.values(allPoolData)
      .map((pool) => pool.data)
      .filter((pool) => pool)
  }, [allPoolData])

  const [savedPools] = useWatchlistPools()
  const watchlistPools = usePoolDatas(savedPools)

  return (
    <Page>
      {/* Section 1: */}
      <StyledSection>
        <StyledHeading scale="lg" mb="16px">
          {t('Your Watchlist')}
        </StyledHeading>
        <StyledCardForNoSavedPools>
          {watchlistPools.length > 0 ? (
            <PoolTable poolDatas={watchlistPools} />
          ) : (
            // <Text px="24px" py="16px">
            //   {t('Saved pools will appear here')}
            // </Text>
            <>{t('Saved pools will appear here')}</>
          )}
        </StyledCardForNoSavedPools>
      </StyledSection>

      {/* Section 2: */}
      <StyledSection>
        <StyledHeading scale="lg" mb="16px">
          {t('All Pools')}
        </StyledHeading>
        <PoolTable poolDatas={poolDatas} />
      </StyledSection>
    </Page>
  )
}

export default PoolsOverview
