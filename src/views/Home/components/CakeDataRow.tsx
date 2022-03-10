import { Flex, Heading, Skeleton, Text } from '@pancakeswap/uikit'
import Balance from 'components/Balance'
import cakeAbi from 'config/abi/cake.json'
import tokens from 'config/constants/tokens'
import { useTranslation } from 'contexts/Localization'
import useIntersectionObserver from 'hooks/useIntersectionObserver'
import { useSlowRefreshEffect } from 'hooks/useRefreshEffect'
import { useEffect, useState } from 'react'
import { usePriceCakeBusd } from 'state/farms/hooks'
import styled from 'styled-components'
import { formatBigNumber, formatLocalisedCompactNumber } from 'utils/formatBalance'
import { multicallv2 } from 'utils/multicall'

const styleForBasicColumn = `
  background: linear-gradient(134.59deg, rgba(181, 104, 158, 0.59) 1.32%, rgba(181, 104, 158, 0) 60.66%);
  border: 1px solid;
  border-image-source: linear-gradient(137.94deg, #FF0099 2.56%, rgba(255, 0, 153, 0) 73.01%);
  border-image-slice: 1;
  border-radius: 5px;
  padding: 25px;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  color: #fff;
  
  @media screen and (max-width: 576px) {
    backdrop-filter: blur(5px);
  }
`

const styleForColumnValue = `
  font-style: normal;
  font-weight: 600;
  font-size: 24px;
  line-height: 25px;
  text-align: center;
  color: #fff;
  text-shadow: 0px 0px 5px #000;
  width: 130px;
`

const StyledColumnBasic = styled(Flex)`
  ${styleForBasicColumn}
`

const StyledColumnTitle = styled(Text)`
  font-style: normal;
  font-weight: 500;
  font-size: 16px;
  line-height: 17px;
  text-align: center;
  color: #ff0099;
  text-shadow: 0px 0px 5px #000;
  margin-bottom: 6px;
`

const StyledColumBalanceValue = styled(Balance)`
  ${styleForColumnValue}
`

const StyledColumHeadingValue = styled(Heading)`
  ${styleForColumnValue}
`

const StyledColumn = styled(Flex)<{ noMobileBorder?: boolean }>`
  ${styleForBasicColumn}

  flex-direction: column;
  ${({ noMobileBorder, theme }) =>
    noMobileBorder
      ? `${theme.mediaQueries.md} {
           padding: 0 16px;
           border-left: 1px ${theme.colors.inputSecondary} solid;
         }
       `
      : `border-left: 1px ${theme.colors.inputSecondary} solid;
         padding: 0 8px;
         ${theme.mediaQueries.sm} {
           padding: 0 16px;
         }
       `}
`

const Grid = styled.div`
  display: grid;
  grid-gap: 16px 8px;
  margin-top: 24px;
  grid-template-columns: repeat(2, auto);

  ${({ theme }) => theme.mediaQueries.sm} {
    grid-gap: 16px;
  }

  ${({ theme }) => theme.mediaQueries.md} {
    grid-gap: 32px;
    grid-template-columns: repeat(4, auto);
  }
`

const emissionsPerBlock = 14.25

const CakeDataRow = () => {
  const { t } = useTranslation()
  const { observerRef, isIntersecting } = useIntersectionObserver()
  const [loadData, setLoadData] = useState(false)
  const [cakeSupply, setCakeSupply] = useState(0)
  const [burnedBalance, setBurnedBalance] = useState(0)
  const cakePriceBusd = usePriceCakeBusd()
  const mcap = cakePriceBusd.times(cakeSupply)
  const mcapString = formatLocalisedCompactNumber(mcap.toNumber())

  useEffect(() => {
    if (isIntersecting) {
      setLoadData(true)
    }
  }, [isIntersecting])

  useSlowRefreshEffect(() => {
    const fetchTokenData = async () => {
      const totalSupplyCall = { address: tokens.cake.address, name: 'totalSupply' }
      const burnedTokenCall = {
        address: tokens.cake.address,
        name: 'balanceOf',
        params: ['0x000000000000000000000000000000000000dEaD'],
      }
      const tokenDataResultRaw = await multicallv2(cakeAbi, [totalSupplyCall, burnedTokenCall], {
        requireSuccess: false,
      })
      const [totalSupply, burned] = tokenDataResultRaw.flat()
      setCakeSupply(totalSupply && burned ? +formatBigNumber(totalSupply.sub(burned)) : 0)
      setBurnedBalance(burned ? +formatBigNumber(burned) : 0)
    }

    if (loadData) {
      fetchTokenData()
    }
  }, [loadData])

  return (
    <Grid>
      <StyledColumnBasic flexDirection="column">
        <StyledColumnTitle color="textSubtle">{t('Total supply')}</StyledColumnTitle>
        {cakeSupply ? (
          <StyledColumBalanceValue decimals={0} lineHeight="1.1" fontSize="24px" bold value={cakeSupply} />
        ) : (
          <>
            <div ref={observerRef} />
            <Skeleton height={24} width={126} my="4px" />
          </>
        )}
      </StyledColumnBasic>
      <StyledColumn>
        <StyledColumnTitle color="textSubtle">{t('Burned to date')}</StyledColumnTitle>
        {burnedBalance ? (
          <StyledColumBalanceValue decimals={0} lineHeight="1.1" fontSize="24px" bold value={burnedBalance} />
        ) : (
          <Skeleton height={24} width={126} my="4px" />
        )}
      </StyledColumn>
      <StyledColumn noMobileBorder>
        <StyledColumnTitle color="textSubtle">{t('Market cap')}</StyledColumnTitle>
        {mcap?.gt(0) && mcapString ? (
          <StyledColumHeadingValue scale="lg">{t('$%marketCap%', { marketCap: mcapString })}</StyledColumHeadingValue>
        ) : (
          <Skeleton height={24} width={126} my="4px" />
        )}
      </StyledColumn>
      <StyledColumn>
        <StyledColumnTitle color="textSubtle">{t('Current emissions')}</StyledColumnTitle>

        <StyledColumHeadingValue scale="lg">
          {t('%cakeEmissions%/block', { cakeEmissions: emissionsPerBlock })}
        </StyledColumHeadingValue>
      </StyledColumn>
    </Grid>
  )
}

export default CakeDataRow
