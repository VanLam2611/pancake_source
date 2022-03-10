import { ReactNode } from 'react'
import styled from 'styled-components'
import { Flex, Skeleton, Text } from '@pancakeswap/uikit'
import Balance from 'components/Balance'
import { useTranslation } from 'contexts/Localization'

interface TopFarmPoolProps {
  title: ReactNode
  percentage: number
  index: number
  visible: boolean
  style?: any
}

const StyledWrapper = styled(Flex)<{ index: number }>`
  position: relative;

  @media screen and (max-width: 768px) {
    && {
      min-width: 167px;
    }
  }
`

const AbsoluteWrapper = styled(Flex)<{ visible: boolean; index: number; topOffset: string }>`
  position: absolute;
  top: ${({ topOffset }) => topOffset};
  opacity: ${({ visible }) => (visible ? 1 : 0)};
  margin-top: ${({ visible }) => (visible ? 0 : `50%`)};
  transition: opacity, margin-top, 0.4s ease-out;
  flex-direction: column;
  padding: 25px;
  width: 100%;
  background: linear-gradient(134.59deg, rgba(181, 104, 158, 0.59) 1.32%, rgba(181, 104, 158, 0) 60.66%);
  border: 1px solid;
  border-image-source: linear-gradient(137.94deg, #ff0099 2.56%, rgba(255, 0, 153, 0) 73.01%);
  border-image-slice: 1;
  border-radius: 5px;
  max-width: 167px;
  max-height: 163px;
  min-height: 163px;

  ${({ index, theme }) =>
    index > 0
      ? `
         ${theme.mediaQueries.sm} {
           height: auto;
           top: 0;
           border-left: 1px ${theme.colors.inputSecondary} solid;
         }
       `
      : ``}
`

const StyledTextTitle = styled(Text)`
  margin: 6px 0px;
  font-style: normal;
  font-weight: 500;
  font-size: 16px;
  line-height: 17px;
  text-align: center;
  color: #ff0099;
`

const StyledTextBalance = styled(Balance)`
  font-style: normal;
  font-weight: 600;
  font-size: 24px;
  line-height: 25px;
  text-align: center;
  color: #fff;
  margin: 6px 0px;
`

const StyledTextSubtle = styled(Text)`
  font-style: normal;
  font-weight: 500;
  font-size: 16px;
  line-height: 17px;
  text-align: center;
  color: #fff;
`

const StyledAbsoluteWrapper = styled(AbsoluteWrapper)`
  @media screen and (max-width: 576px) {
    backdrop-filter: blur(5px);
  }
`

const TopFarmPool: React.FC<TopFarmPoolProps> = ({ title, percentage, index, visible, style }) => {
  const { t } = useTranslation()

  const topOffset = () => {
    if (index >= 0 && index < 2) {
      // return '0px'
    }

    if (index >= 2 && index < 3) {
      // return '80px'
    }

    // return '160px'
    return '0px'
  }

  return (
    <StyledWrapper index={index} style={style}>
      <StyledAbsoluteWrapper index={index} visible={visible} topOffset={topOffset()}>
        {title ? (
          <StyledTextTitle bold mb="8px" fontSize="12px" color="secondary">
            {title}
          </StyledTextTitle>
        ) : (
          <Skeleton width={80} height={12} mb="8px" />
        )}
        {percentage ? (
          <StyledTextBalance lineHeight="1.1" fontSize="16px" bold unit="%" value={percentage} />
        ) : (
          <Skeleton width={60} height={16} />
        )}
        {percentage ? (
          <StyledTextSubtle fontSize="16px" color="textSubtle">
            {t('APR')}
          </StyledTextSubtle>
        ) : (
          <Skeleton width={30} height={16} mt="4px" />
        )}
      </StyledAbsoluteWrapper>
    </StyledWrapper>
  )
}

export default TopFarmPool
