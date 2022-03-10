import { CardHeader, Flex, Heading, Text } from '@pancakeswap/uikit'
import { ReactNode } from 'react'
import styled from 'styled-components'

const Wrapper = styled(CardHeader)<{ isFinished?: boolean; background?: string }>`
  background: ${({ isFinished, background, theme }) =>
    isFinished ? theme.colors.backgroundDisabled : theme.colors.gradients[background]};
  // border-radius: ${({ theme }) => `${theme.radii.card} ${theme.radii.card} 0 0`};
  // Custom style:
  padding: 30px 30px 24px 30px;
  border-radius: 10px 10px 0 0;
  background: none;
`

const StyledTitle = styled(Heading)`
  font-style: normal;
  font-weight: bold;
  font-size: 24px;
  line-height: 24px;
  color: #ec4c93;
`

const StyledSubTitle = styled(Text)`
  font-style: normal;
  font-weight: 600;
  font-size: 14px;
  line-height: 14px;
  color: #b5689e;
`

const PoolCardHeader: React.FC<{
  isFinished?: boolean
  isStaking?: boolean
}> = ({ isFinished = false, isStaking = false, children }) => {
  const background = isStaking ? 'bubblegum' : 'cardHeader'

  return (
    <Wrapper isFinished={isFinished} background={background}>
      <Flex alignItems="center" justifyContent="space-between">
        {children}
      </Flex>
    </Wrapper>
  )
}

export const PoolCardHeaderTitle: React.FC<{ isFinished?: boolean; title: ReactNode; subTitle: ReactNode }> = ({
  isFinished,
  title,
  subTitle,
}) => {
  return (
    <Flex flexDirection="column">
      <StyledTitle color={isFinished ? 'textDisabled' : 'body'} scale="lg">
        {title}
      </StyledTitle>
      <StyledSubTitle fontSize="14px" color={isFinished ? 'textDisabled' : 'textSubtle'}>
        {subTitle}
      </StyledSubTitle>
    </Flex>
  )
}

export default PoolCardHeader
