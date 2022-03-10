import { KeyboardEvent, RefObject, useCallback, useMemo, useRef, useState, useEffect } from 'react'
import { Currency, ETHER, Token } from '@pancakeswap/sdk'
import {  Input, Box } from '@pancakeswap/uikit'
import { useTranslation } from 'contexts/Localization'
import { FixedSizeList } from 'react-window'
import { useAudioModeManager } from 'state/user/hooks'
import useDebounce from 'hooks/useDebounce'
import useActiveWeb3React from 'hooks/useActiveWeb3React'
import styled from 'styled-components'
import { useAllTokens, useToken, useIsUserAddedToken, useFoundOnInactiveList } from '../../hooks/Tokens'
import { isAddress } from '../../utils'
import Column, { AutoColumn } from '../Layout/Column'
import Row from '../Layout/Row'
import CommonBases from './CommonBases'
import CurrencyList from './CurrencyList'
import { filterTokens, useSortedTokensByQuery } from './filtering'
import useTokenComparator from './sorting'
import { getSwapSound } from './swapSound'
import ImportRow from './ImportRow'

interface CurrencyOpenSearchProps {
  selectedCurrency?: Currency | null
  onCurrencySelect: (currency: Currency) => void
  otherSelectedCurrency?: Currency | null
  showCommonBases?: boolean
  showImportView: () => void
  setImportToken: (token: Token) => void
}

const CurrencyOpen = styled.div`
  position: absolute;
  width: 100%;
  height: 100px;
  top: -10px;
  left: 10px;
  z-index: 2;
  .sc-jRQBWg.gwfFOu{
      background: #000;
      border-radius: 10px;
  }
`

function CurrencyOpenSearch({
  selectedCurrency,
  onCurrencySelect,
  otherSelectedCurrency,
  showCommonBases,
  showImportView,
  setImportToken
}: CurrencyOpenSearchProps) {
  const { t } = useTranslation()
  const { chainId } = useActiveWeb3React()

  // refs for fixed size lists
  const fixedList = useRef<FixedSizeList>()

  const [searchQuery, setSearchQuery] = useState<string>('')
  const debouncedQuery = useDebounce(searchQuery, 200)

  const [invertSearchOrder] = useState<boolean>(false)

  const allTokens = useAllTokens()
  // const [parentValue, setParentValue] = useState<string>('')

  // if they input an address, use it
  const searchToken = useToken(debouncedQuery)
  const searchTokenIsAdded = useIsUserAddedToken(searchToken)

  const [audioPlay] = useAudioModeManager()

  const showETH: boolean = useMemo(() => {
    const s = debouncedQuery.toLowerCase().trim()
    return s === '' || s === 'b' || s === 'bn' || s === 'bnb'
  }, [debouncedQuery])

  const tokenComparator = useTokenComparator(invertSearchOrder)

  const filteredTokens: Token[] = useMemo(() => {
    return filterTokens(Object.values(allTokens), debouncedQuery)
  }, [allTokens, debouncedQuery])

  const sortedTokens: Token[] = useMemo(() => {
    return filteredTokens.sort(tokenComparator)
  }, [filteredTokens, tokenComparator])

  const filteredSortedTokens = useSortedTokensByQuery(sortedTokens, debouncedQuery)

  const handleCurrencySelect = useCallback(
    (currency: Currency) => {
      onCurrencySelect(currency)
      if (audioPlay) {
        getSwapSound().play()
      }
    },
    [audioPlay, onCurrencySelect],
  )

  // const getValueInput = useCallback((valueInput)=>{
  //   setParentValue(valueInput)
  //   console.log('Value input: '+ parentValue);
    
  // },[parentValue])

  // manage focus on modal show
  const inputRef = useRef<HTMLInputElement>()

  useEffect(() => {
    inputRef.current.focus()
  }, [])

  // const modalResultSearch = document.querySelector('#currency_open');
  

  const [searchOpen, setSearchOpen] = useState<boolean>(false)

  const handleInput = useCallback((event) => {
    const input = event.target.value
    const checksummedInput = isAddress(input)
    setSearchQuery(checksummedInput || input)
    fixedList.current?.scrollTo(0)
    
    if(input.length === 0){
        setSearchOpen(false);
    }
    else{
        setSearchOpen(true);
    }
  }, [])


  const handleEnter = useCallback(
    (e: KeyboardEvent<HTMLInputElement>) => {
      if (e.key === 'Enter') {
        const s = debouncedQuery.toLowerCase().trim()
        if (s === 'bnb') {
          handleCurrencySelect(ETHER)
        } else if (filteredSortedTokens.length > 0) {
          if (
            filteredSortedTokens[0].symbol?.toLowerCase() === debouncedQuery.trim().toLowerCase() ||
            filteredSortedTokens.length === 1
          ) {
            handleCurrencySelect(filteredSortedTokens[0])
          }
        }
      }
    },
    [filteredSortedTokens, handleCurrencySelect, debouncedQuery],
  )

  // if no results on main list, show option to expand into inactive
  const inactiveTokens = useFoundOnInactiveList(debouncedQuery)
  const filteredInactiveTokens: Token[] = useSortedTokensByQuery(inactiveTokens, debouncedQuery)

  return (
    <>
      <div>
        <AutoColumn gap="16px">
          <Row>
            <Input
              id="token-search-input"
              value={searchQuery}
              placeholder={t('Search your cryptor')}
              scale="sm"
              autoComplete="off"
              ref={inputRef as RefObject<HTMLInputElement>}
              onChange={handleInput}
              onKeyDown={handleEnter}
            />
          </Row>
          {showCommonBases && (
            <CommonBases chainId={chainId} onSelect={handleCurrencySelect} selectedCurrency={selectedCurrency} />
          )}
        </AutoColumn>
        {searchToken && !searchTokenIsAdded ? (
          <Column style={{ padding: '20px 0', height: '100%' }}>
            <ImportRow token={searchToken} showImportView={showImportView} setImportToken={setImportToken} />
          </Column>
        ) : filteredSortedTokens?.length > 0 || filteredInactiveTokens?.length > 0 ? (
          <div style={{ position: 'relative' }}>
            <CurrencyOpen id="currency_open" style={{visibility: searchOpen ? 'visible' : 'hidden'}}>
              <Box margin="24px -24px">
                <CurrencyList
                  height={390}
                  showETH={showETH}
                  currencies={
                    filteredInactiveTokens ? filteredSortedTokens.concat(filteredInactiveTokens) : filteredSortedTokens
                  }
                  breakIndex={inactiveTokens && filteredSortedTokens ? filteredSortedTokens.length : undefined}
                  onCurrencySelect={handleCurrencySelect}
                  otherCurrency={otherSelectedCurrency}
                //   parentValue={valueInput}
                  selectedCurrency={selectedCurrency}
                  fixedListRef={fixedList}
                  showImportView={showImportView}
                  setImportToken={setImportToken}
                  isShow={false}
                />
              </Box>
            </CurrencyOpen>
          </div>
        ) : (
          // <Column style={{ padding: '20px', height: '100%' }}>
          //     <Text color="textSubtle" textAlign="center" mb="20px">
          //         {t('No results found.')}
          //     </Text>
          // </Column>
          <></>
        )}
      </div>
    </>
  )
}

export default CurrencyOpenSearch