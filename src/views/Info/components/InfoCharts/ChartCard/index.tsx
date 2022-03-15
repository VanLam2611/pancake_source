import { useMemo, useState } from 'react'
import styled, { css } from 'styled-components'
import { Text, Box, Flex, Skeleton } from '@pancakeswap/uikit'
import LineChart from 'views/Info/components/InfoCharts/LineChart'
import BarChart from 'views/Info/components/InfoCharts/BarChart'
import { TabToggle } from 'components/TabToggle'
import { useTranslation } from 'contexts/Localization'
import { formatAmount } from 'utils/formatInfoNumbers'
import { ChartEntry, TokenData, PriceChartEntry } from 'state/info/types'
import { fromUnixTime } from 'date-fns'
import dynamic from 'next/dynamic'

const StyledTabToggleList = styled.div`
  display: flex;
  position: absolute;
  top: 24px;
  right: 24px;
`

const StyledTabToggle = styled(TabToggle)<{ $isActive?: boolean }>`
  background: #0c0711;
  border: 1px solid #ec4c93;
  box-sizing: border-box;
  border-radius: 5px;
  padding: 12px 24px;
  margin-right: 16px;

  &&:last-child {
    margin-right: 0;
  }

  ${(props) =>
    props.$isActive &&
    css`
      background: #ec4c93;
    `}
`

const StyledTabToggleText = styled(Text)`
  font-size: 16px;
  line-height: 16px;
  color: #fff;
`

const ChartCardWrapper = styled.div`
  position: relative;
  background: rgba(12, 7, 17, 0.8);
  border: 1px solid #ec4c93;
  box-sizing: border-box;
  border-radius: 10px;
`

const StyledTextForLatestValue = styled(Text)`
  font-weight: bold;
  font-size: 32px;
  line-height: 32px;
  display: flex;
  align-items: center;
  color: #ec4c93;
  margin-bottom: 15px;
`

const StyledTextForDate = styled(Text)`
  font-size: 20px;
  line-height: 20px;
  display: flex;
  align-items: center;
  color: #b5689e;
`

const CandleChart = dynamic(() => import('views/Info/components/InfoCharts/CandleChart'), {
  ssr: false,
})

enum ChartView {
  LIQUIDITY,
  VOLUME,
  PRICE,
}

interface ChartCardProps {
  variant: 'pool' | 'token'
  chartData: ChartEntry[]
  tokenData?: TokenData
  tokenPriceData?: PriceChartEntry[]
}

const ChartCard: React.FC<ChartCardProps> = ({ variant, chartData, tokenData, tokenPriceData }) => {
  const [view, setView] = useState(ChartView.VOLUME)
  const [hoverValue, setHoverValue] = useState<number | undefined>()
  const [hoverDate, setHoverDate] = useState<string | undefined>()
  const {
    t,
    currentLanguage: { locale },
  } = useTranslation()

  const currentDate = new Date().toLocaleString(locale, { month: 'short', year: 'numeric', day: 'numeric' })

  const formattedTvlData = useMemo(() => {
    if (chartData) {
      return chartData.map((day) => {
        return {
          time: fromUnixTime(day.date),
          value: day.liquidityUSD,
        }
      })
    }
    return []
  }, [chartData])
  const formattedVolumeData = useMemo(() => {
    if (chartData) {
      return chartData.map((day) => {
        return {
          time: fromUnixTime(day.date),
          value: day.volumeUSD,
        }
      })
    }
    return []
  }, [chartData])

  const getLatestValueDisplay = () => {
    let valueToDisplay = null
    if (hoverValue) {
      valueToDisplay = formatAmount(hoverValue)
    } else if (view === ChartView.VOLUME && formattedVolumeData.length > 0) {
      valueToDisplay = formatAmount(formattedVolumeData[formattedVolumeData.length - 1]?.value)
    } else if (view === ChartView.LIQUIDITY && formattedTvlData.length > 0) {
      valueToDisplay = formatAmount(formattedTvlData[formattedTvlData.length - 1]?.value)
    } else if (view === ChartView.PRICE && tokenData?.priceUSD) {
      valueToDisplay = formatAmount(tokenData.priceUSD)
    }

    return valueToDisplay ? (
      <StyledTextForLatestValue fontSize="24px" bold>
        ${valueToDisplay}
      </StyledTextForLatestValue>
    ) : (
      <Skeleton height="36px" width="128px" />
    )
  }

  return (
    <ChartCardWrapper>
      <StyledTabToggleList>
        <StyledTabToggle
          isActive={view === ChartView.VOLUME}
          $isActive={view === ChartView.VOLUME}
          onClick={() => setView(ChartView.VOLUME)}
        >
          <StyledTabToggleText>{t('Volume')}</StyledTabToggleText>
        </StyledTabToggle>
        <StyledTabToggle
          isActive={view === ChartView.LIQUIDITY}
          $isActive={view === ChartView.LIQUIDITY}
          onClick={() => setView(ChartView.LIQUIDITY)}
        >
          <StyledTabToggleText>{t('Liquidity')}</StyledTabToggleText>
        </StyledTabToggle>
        {variant === 'token' && (
          <StyledTabToggle
            isActive={view === ChartView.PRICE}
            $isActive={view === ChartView.PRICE}
            onClick={() => setView(ChartView.PRICE)}
          >
            <StyledTabToggleText>{t('Price')}</StyledTabToggleText>
          </StyledTabToggle>
        )}
      </StyledTabToggleList>

      <Flex flexDirection="column" px="24px" pt="24px">
        {getLatestValueDisplay()}
        <StyledTextForDate small color="secondary">
          {hoverDate || currentDate}
        </StyledTextForDate>
      </Flex>

      <Box px="24px" height={variant === 'token' ? '250px' : '335px'}>
        {view === ChartView.LIQUIDITY ? (
          <LineChart
            data={formattedTvlData}
            setHoverValue={setHoverValue}
            setHoverDate={setHoverDate}
            customMainColor="#EC4C93"
            customYAxisColor="#B5689E"
          />
        ) : view === ChartView.VOLUME ? (
          <BarChart
            data={formattedVolumeData}
            setHoverValue={setHoverValue}
            setHoverDate={setHoverDate}
            customMainColor="#EC4C93"
            customYAxisColor="#B5689E"
          />
        ) : view === ChartView.PRICE ? (
          <CandleChart data={tokenPriceData} setValue={setHoverValue} setLabel={setHoverDate} />
        ) : null}
      </Box>
    </ChartCardWrapper>
  )
}

export default ChartCard
