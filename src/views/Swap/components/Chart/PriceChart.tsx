import { useState, useCallback, useEffect } from 'react'
import {
  Button,
  ExpandIcon,
  Flex,
  Box,
  IconButton,
  ShrinkIcon,
  SyncAltIcon,
  Text,
  TradingViewIcon,
  LineGraphIcon,
  useMatchBreakpoints,
  useModal
} from '@pancakeswap/uikit'
import { CurrencyLogo, DoubleCurrencyLogo } from 'components/Logo'
import { TradingViewLabel } from 'components/TradingView'
import { useTranslation } from 'contexts/Localization'
import { ChartViewMode } from 'state/user/actions'
import { useExchangeChartViewManager } from 'state/user/hooks'
import styled from 'styled-components'
import BasicChart from './BasicChart'
import { StyledPriceChart } from './styles'
import TradingViewChart from './TradingViewChart'
import TokenDisplay from './TokenDisplay'
import { Currency, Pair, Token, CurrencyAmount } from '@pancakeswap/sdk'
import CurrencyOpenSearch from 'components/SearchModal/CurrencyOpenSearch'
import CurrencyInputPanel from 'components/CurrencyInputPanel'
import {
  useExpertModeManager,
  useUserSlippageTolerance,
  useUserSingleHopOnly,
  useExchangeChartManager,
} from 'state/user/hooks'
import {
  useDefaultsFromURLSearch,
  useDerivedSwapInfo,
  useSwapActionHandlers,
  useSwapState,
  useSingleTokenSwapInfo,
} from 'state/swap/hooks'
import { Field } from 'state/swap/actions'
import { useSwapCallback } from 'hooks/useSwapCallback'
import useWrapCallback, { WrapType } from 'hooks/useWrapCallback'
import { maxAmountSpend } from 'utils/maxAmountSpend'
import { ApprovalState, useApproveCallbackFromTrade } from 'hooks/useApproveCallback'
import SwapWarningTokens from 'config/constants/swapWarningTokens'


const ChartButton = styled(Button)`
  // background-color: ${({ $active, theme }) => $active && `${theme.colors.primary}0f`};
  background-color: #74214580;
  color: #b5689e;
  padding: 4px 8px;
  border-radius: 5px;
`
const BIcon = styled(Button)`
  background-color: #74214580;
  width: 32px;
  height: 32px;
  border-radius: 5px !important;
  display: inline-block;
  padding: 0px !important;
`
interface CurrencyInputPanelProps {
  onCurrencySelect: (currency: Currency) => void
  currency?: Currency | null
  otherCurrency?: Currency | null
  showCommonBases?: boolean
  showImportView: () => void
  setImportToken: (token: Token) => void
}
const PriceChart = (
  {
    inputCurrency,
    outputCurrency,
    onSwitchTokens,
    isDark,
    isChartExpanded,
    setIsChartExpanded,
    isMobile,
    token0Address,
    token1Address,
    currentSwapPrice,
  },
  {
    onCurrencySelect,
    currency,
    otherCurrency,
    showCommonBases,
    showImportView,
    setImportToken,
  }: CurrencyInputPanelProps,
) => {
  const { isDesktop } = useMatchBreakpoints()
  const toggleExpanded = () => setIsChartExpanded((currentIsExpanded) => !currentIsExpanded)
  const [chartView, setChartView] = useExchangeChartViewManager()
  const [twChartSymbol, setTwChartSymbol] = useState('')
  const { t } = useTranslation()

  const handleTwChartSymbol = useCallback((symbol) => {
    setTwChartSymbol(symbol)
  }, [])
  const StypeParent = styled(Box)<{ $isDark: boolean }>`
    ${({ theme }) => theme.mediaQueries.sm} {
      background: ${({ $isDark }) => ($isDark ? '#74214580' : '#fff')};
    }
  `
  const [textInput, setTextInput] = useState('NASDAQ:AAPL')
  // let t2 = document.querySelector('#token-search-input').value
    // for expert mode
    const [isExpertMode] = useExpertModeManager()

    // get custom setting values for user
    const [allowedSlippage] = useUserSlippageTolerance()
  
    // swap state
    const { independentField, typedValue, recipient } = useSwapState()
    const { v2Trade, currencyBalances, parsedAmount, currencies, inputError: swapInputError } = useDerivedSwapInfo()
      // Price data
    const {
      [Field.INPUT]: { currencyId: inputCurrencyId },
      [Field.OUTPUT]: { currencyId: outputCurrencyId },
    } = useSwapState()
    const {
      wrapType,
      execute: onWrap,
      inputError: wrapInputError,
    } = useWrapCallback(currencies[Field.INPUT], currencies[Field.OUTPUT], typedValue)
    const showWrap: boolean = wrapType !== WrapType.NOT_APPLICABLE
    const trade = showWrap ? undefined : v2Trade
    const dependentField: Field = independentField === Field.INPUT ? Field.OUTPUT : Field.INPUT
    const parsedAmounts = showWrap
    ? {
        [Field.INPUT]: parsedAmount,
        [Field.OUTPUT]: parsedAmount,
      }
    : {
        [Field.INPUT]: independentField === Field.INPUT ? parsedAmount : trade?.inputAmount,
        [Field.OUTPUT]: independentField === Field.OUTPUT ? parsedAmount : trade?.outputAmount,
      }

    const formattedAmounts = {
      [independentField]: typedValue,
      [dependentField]: showWrap
        ? parsedAmounts[independentField]?.toExact() ?? ''
        : parsedAmounts[dependentField]?.toSignificant(6) ?? '',
    }
    const maxAmountInput: CurrencyAmount | undefined = maxAmountSpend(currencyBalances[Field.INPUT])
    const atMaxAmountInput = Boolean(maxAmountInput && parsedAmounts[Field.INPUT]?.equalTo(maxAmountInput))
    const { onCurrencySelection, onUserInput, onChangeRecipient } = useSwapActionHandlers()
    const handleTypeInput = useCallback(
      (value: string) => {
        onUserInput(Field.INPUT, value)
      },
      [onUserInput],
    )
    const handleTypeOutput = useCallback(
      (value: string) => {
        onUserInput(Field.OUTPUT, value)
      },
      [onUserInput],
    )
    const handleMaxInput = useCallback(() => {
      if (maxAmountInput) {
        onUserInput(Field.INPUT, maxAmountInput.toExact())
      }
    }, [maxAmountInput, onUserInput])
    const [approval, approveCallback] = useApproveCallbackFromTrade(trade, allowedSlippage)

    // check if user has gone through approval process, used to show two step buttons, reset on token change
    const [approvalSubmitted, setApprovalSubmitted] = useState<boolean>(false)
  
    // mark when a user has submitted an approval, reset onTokenSelection for input field
    useEffect(() => {
      if (approval === ApprovalState.PENDING) {
        setApprovalSubmitted(true)
      }
    }, [approval, approvalSubmitted])
    const shouldShowSwapWarning = (swapCurrency) => {
      const isWarningToken = Object.entries(SwapWarningTokens).find((warningTokenConfig) => {
        const warningTokenData = warningTokenConfig[1]
        return swapCurrency.address === warningTokenData.address
      })
      return Boolean(isWarningToken)
    }
    const [swapWarningCurrency, setSwapWarningCurrency] = useState(null)
    const handleInputSelect = useCallback(
      (inputCurrency) => {
        setApprovalSubmitted(false) // reset 2 step UI for approvals
        onCurrencySelection(Field.INPUT, inputCurrency)
        const showSwapWarning = shouldShowSwapWarning(inputCurrency)
        if (showSwapWarning) {
          setSwapWarningCurrency(inputCurrency)
        } else {
          setSwapWarningCurrency(null)
        }
      },
      [onCurrencySelection],
    )

  // const [onPresentCurrencyModal] = useModal(
  //   <CurrencyOpenSearch
  //     onCurrencySelect={onCurrencySelect}
  //     selectedCurrency={currency}
  //     otherSelectedCurrency={otherCurrency}
  //     showCommonBases={showCommonBases}
  //     showImportView={showImportView}
  //     setImportToken={setImportToken}
  //   />,
  // )

  return (
    <StyledPriceChart
      height={chartView === ChartViewMode.TRADING_VIEW ? '100%' : '70%'}
      overflow={chartView === ChartViewMode.TRADING_VIEW ? 'hidden' : 'unset'}
      $isDark={isDark}
      $isExpanded={isChartExpanded}
      style={{ padding: '10px', border: '1px solid #EC4C93' }}
    >
      <Flex justifyContent="space-between" px="24px">
        <Flex alignItems="center">
          <StypeParent $isDark={isDark} style={{ display: 'flex', padding: '5px', borderRadius: '5px' }}>
            {outputCurrency ? (
              <DoubleCurrencyLogo currency0={inputCurrency} currency1={outputCurrency} size={24} margin />
            ) : (
              inputCurrency && <CurrencyLogo currency={inputCurrency} size="24px" style={{ marginRight: '8px' }} />
            )}
            {inputCurrency && (
              <Text color="#EC4C93" bold>
                {outputCurrency ? `${inputCurrency.symbol}/${outputCurrency.symbol}` : inputCurrency.symbol}
              </Text>
            )}
          </StypeParent>
          <IconButton variant="text" onClick={onSwitchTokens}>
            <BIcon>
              <SyncAltIcon ml="6px" color="#B5689E" />
            </BIcon>
          </IconButton>
          <Flex>
            <ChartButton
              aria-label={t('Basic')}
              title={t('Basic')}
              $active={chartView === ChartViewMode.BASIC}
              scale="sm"
              variant="text"
              color="primary"
              onClick={() => setChartView(ChartViewMode.BASIC)}
              mr="8px"
            >
              {isDesktop ? t('Basic') : <LineGraphIcon color="primary" />}
            </ChartButton>
            <ChartButton
              aria-label="TradingView"
              title="TradingView"
              $active={chartView === ChartViewMode.TRADING_VIEW}
              scale="sm"
              variant="text"
              onClick={() => setChartView(ChartViewMode.TRADING_VIEW)}
            >
              {isDesktop ? 'TradingView' : <TradingViewIcon color="primary" />}
            </ChartButton>
          </Flex>
        </Flex>
        {!isMobile && (
          <Flex>
            <IconButton variant="text" onClick={toggleExpanded}>
              {isChartExpanded ? <ShrinkIcon color="text" /> : <ExpandIcon color="#742145" />}
            </IconButton>
          </Flex>
        )}
      </Flex>
      {chartView === ChartViewMode.BASIC && (
        <BasicChart
          token0Address={token0Address}
          token1Address={token1Address}
          isChartExpanded={isChartExpanded}
          inputCurrency={inputCurrency}
          outputCurrency={outputCurrency}
          isMobile={isMobile}
          currentSwapPrice={currentSwapPrice}
        />
      )}
      {chartView === ChartViewMode.TRADING_VIEW && (
        <Flex
          flexDirection="column"
          justifyContent="space-between"
          height={isMobile ? '100%' : isChartExpanded ? 'calc(100% - 48px)' : '458px'}
          pt="12px"
        >
          <Flex justifyContent="space-between" alignItems="baseline" flexWrap="wrap">
            {/* <TokenDisplay
              value={currentSwapPrice?.[token0Address]}
              inputSymbol={inputCurrency?.symbol}
              outputSymbol={outputCurrency?.symbol}
              mx="24px"
            /> */}
            {twChartSymbol && <TradingViewLabel symbol={twChartSymbol} />}
            <Flex justifyContent="space-between" alignItems="baseline" flexWrap="wrap" mb="20px" ml="10px">
              <CurrencyInputPanel
                label={
                  independentField === Field.OUTPUT && !showWrap && trade ? t('From (estimated)') : t('From')
                }
                value={formattedAmounts[Field.INPUT]}
                showMaxButton={!atMaxAmountInput}
                currency={currencies[Field.INPUT]}
                onUserInput={handleTypeInput}
                onMax={handleMaxInput}
                onCurrencySelect={handleInputSelect}
                otherCurrency={currencies[Field.OUTPUT]}
                id="swap-currency-input"
                isShow={false}
              />
                
            </Flex>
          </Flex>

          <TradingViewChart
            // unmount the whole component when symbols is changed
            key={`${inputCurrency?.symbol}-${outputCurrency?.symbol}`}
            inputSymbol={inputCurrency?.symbol}
            outputSymbol={outputCurrency?.symbol}
            isDark={isDark}
            onTwChartSymbol={handleTwChartSymbol}
            id={isDark}
            symbol={isDark}
            valueSymbol={textInput}
          />
        </Flex>
      )}
    </StyledPriceChart>
  )
}

export default PriceChart
