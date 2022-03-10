import { Box, ButtonMenu, ButtonMenuItem, Flex, Text } from '@pancakeswap/uikit'
import { useTranslation } from 'contexts/Localization'
import { useState, useEffect, memo, useRef } from 'react'
import useTheme from 'hooks/useTheme'
import { DefaultTheme } from 'styled-components'
import useScript from 'hooks/useScript'
import { useFetchPairPrices } from 'state/swap/hooks'
import dynamic from 'next/dynamic'
import { PairDataTimeWindowEnum } from 'state/swap/types'
import { LineChartLoader } from 'views/Info/components/ChartLoaders'
import NoChartAvailable from './NoChartAvailable'
import TokenDisplay from './TokenDisplay'
import { getTimeWindowChange } from './utils'
import styled from 'styled-components'

const SwapLineChart = dynamic(() => import('./SwapLineChart'), {
  ssr: false,
  loading: () => <LineChartLoader />,
})

const ParentChart = styled.div`
  :first-child{
    button{
      background-color: #EC4C93;
      color: #fff;
    }
    button.sc-bkkeKt.eGBDrg{
      background-color: transparent !important;
      color: #EC4C93;
    }
  }
`
// interface TradingViewProps {
//   id: string
//   symbol: string
// }

const BasicChart = ({
  token0Address,
  token1Address,
  isChartExpanded,
  inputCurrency,
  outputCurrency,
  isMobile,
  currentSwapPrice,
}) => {
  const [timeWindow, setTimeWindow] = useState<PairDataTimeWindowEnum>(0)
  const { isDark } = useTheme()

  const { pairPrices = [], pairId } = useFetchPairPrices({
    token0Address,
    token1Address,
    timeWindow,
    currentSwapPrice,
  })
  const [hoverValue, setHoverValue] = useState<number | undefined>()
  const [hoverDate, setHoverDate] = useState<string | undefined>()
  const valueToDisplay = hoverValue || pairPrices[pairPrices.length - 1]?.value
  const { changePercentage, changeValue } = getTimeWindowChange(pairPrices)
  const isChangePositive = changeValue >= 0
  const chartHeight = isChartExpanded ? 'calc(100% - 120px)' : '378px'
  const {
    t,
    currentLanguage: { locale },
  } = useTranslation()
  const currentDate = new Date().toLocaleString(locale, {
    year: 'numeric',
    month: 'short',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  })

  // Sometimes we might receive array full of zeros for obscure tokens while trying to derive data
  // In that case chart is not useful to users
  const isBadData =
    pairPrices &&
    pairPrices.length > 0 &&
    pairPrices.every(
      (price) => !price.value || price.value === 0 || price.value === Infinity || Number.isNaN(price.value),
    )

  if (isBadData) {
    return (
      <NoChartAvailable
        token0Address={token0Address}
        token1Address={token1Address}
        pairAddress={pairId}
        isMobile={isMobile}
      />
    )
  }
  //Get value symbol of button cryptor

  useScript('https://s3.tradingview.com/tv.js')
  const initializeTradingView = (TradingViewObj: any, theme: DefaultTheme, localeCode: string, opts: any) => {
    let timezone = 'Etc/UTC'
    try {
      timezone = Intl.DateTimeFormat().resolvedOptions().timeZone
    } catch (e) {
      // noop
    }
    /* eslint-disable new-cap */
    /* eslint-disable no-new */
    // @ts-ignore
    return new TradingViewObj.widget({
      // Advanced Chart Widget uses the legacy embedding scheme,
      // an id property should be specified in the settings object
      width: 'auto',
      height: '100%',
      symbol: 'BINANCE:BNBUSDT',
      interval: "D",
      timezone,
      theme: "dark",
      style: "1",
      locale: "vi_VN",
      toolbar_bg: "#f1f3f6",
      enable_publishing: false,
      hide_top_toolbar: true,
      allow_symbol_change: true,
      container_id: "tradingview_82ac1"
    })
  }

  const { currentLanguage } = useTranslation()
  const widgetRef = useRef<any>()
  const tradingViewListener = async () =>
  new Promise<void>((resolve) =>
    Object.defineProperty(window, 'TradingView', {
      configurable: true,
      set(value) {
        this.tv = value
        resolve(value)
      },
    }),
  )
  
  // useEffect(() => {
  //   const opts: any = {
  //     container_id: 'tradingview_82ac1',
  //     symbol,
  //   }

  //   if (isMobile) {
  //     opts.hide_side_toolbar = true
  //   }

  //   // @ts-ignore
  //   if (window.tv) {
  //     // @ts-ignore
      
  //     widgetRef.current = initializeTradingView(window.tv, isDark, currentLanguage.code, opts)
  //   }
    
  //   else {
  //     console.log('CurrentcyL: ' + currentSwapPrice);
  //     tradingViewListener().then((tv) => {
  //       widgetRef.current = initializeTradingView(tv, isDark, currentLanguage.code, opts)
  //     })
  //   }


  //   // Ignore isMobile to avoid re-render TV
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [currentLanguage, id, symbol])



  return (
    <>
      <Flex
        flexDirection={['column', null, null, null, null, null, 'row']}
        alignItems={['flex-start', null, null, null, null, null, 'center']}
        justifyContent="space-between"
        px="24px"
      >
        <Flex flexDirection="column" pt="12px">
          <TokenDisplay
            value={pairPrices?.length > 0 && valueToDisplay}
            inputSymbol={inputCurrency?.symbol}
            outputSymbol={outputCurrency?.symbol}
          >
            <Text fontSize="20px" mt="-8px" mb="8px" bold color="#EC4C93">
              {`${isChangePositive ? '+' : ''}${changeValue.toFixed(3)} (${changePercentage}%)`}
            </Text>
          </TokenDisplay>
          <Text small color="#EC4C93">
            {hoverDate || currentDate}
          </Text>
        </Flex>
        <Box>
          <ParentChart>
            <ButtonMenu activeIndex={timeWindow} onItemClick={setTimeWindow} scale="sm">
              <ButtonMenuItem>{t('24H')}</ButtonMenuItem>
              <ButtonMenuItem>{t('1W')}</ButtonMenuItem>
              <ButtonMenuItem>{t('1M')}</ButtonMenuItem>
              <ButtonMenuItem>{t('1Y')}</ButtonMenuItem>
            </ButtonMenu>
          </ParentChart>
        </Box>
      </Flex>
      <Box height={isMobile ? '100%' : chartHeight} p={isMobile ? '0px' : '16px'} width="100%">
      {/* <div className="tradingview-widget-container">
        <div id="tradingview_82ac1"></div>
      </div> */}
      <SwapLineChart
          data={pairPrices}
          setHoverValue={setHoverValue}
          setHoverDate={setHoverDate}
          isChangePositive={isChangePositive}
          timeWindow={timeWindow}
        />
      </Box>
    </>
  )
}

export default memo(BasicChart, (prev, next) => {
  return (
    prev.token0Address === next.token0Address &&
    prev.token1Address === next.token1Address &&
    prev.isChartExpanded === next.isChartExpanded &&
    prev.isMobile === next.isMobile &&
    prev.isChartExpanded === next.isChartExpanded &&
    ((prev.currentSwapPrice !== null &&
      next.currentSwapPrice !== null &&
      prev.currentSwapPrice[prev.token0Address] === next.currentSwapPrice[next.token0Address] &&
      prev.currentSwapPrice[prev.token1Address] === next.currentSwapPrice[next.token1Address]) ||
      (prev.currentSwapPrice === null && next.currentSwapPrice === null))
  )
})