import { useState } from 'react'
import BigNumber from 'bignumber.js'
import styled from 'styled-components'
import { useTranslation } from 'contexts/Localization'
import { Flex, CardFooter, ExpandableLabel, HelpIcon, useTooltip } from '@pancakeswap/uikit'
import { DeserializedPool } from 'state/types'
import { CompoundingPoolTag, ManualPoolTag } from 'components/Tags'
import ExpandedFooter from './ExpandedFooter'

interface FooterProps {
  pool: DeserializedPool
  account: string
  totalCakeInVault?: BigNumber
  defaultExpanded?: boolean
  txtColor?: string
  txtColorMain?: string
}

const ExpandableButtonWrapper = styled(Flex)`
  align-items: center;
  justify-content: space-between;
  button {
    padding: 0;
  }
`

const StyledCardFooter = styled(CardFooter)`
  background: rgba(12, 7, 17, 0.5);
  border-radius: 10px;
  padding: 24px;
  border: none;
`

const StyledTagWrapper = styled.div <{ $color?: string }>`
  > div {
    padding: 8px 12px;
    background: rgba(116, 33, 69, 0.5);
    border: 1px solid #EC4C93;
    box-sizing: border-box;
    border-radius: 10px;
    border: ${props => props.$color ? `1px solid ${props.$color}` : '1px solid #fff'};
    color: ${props => props.$color ? props.$color : '#fff'};
  
    > svg {
      margin-right: 8px;
      fill: ${props => props.$color ? props.$color : '#fff'};
    }
  }
`

const Footer: React.FC<FooterProps> = ({ pool, account, defaultExpanded, txtColor, txtColorMain }) => {
  const { vaultKey } = pool
  const { t } = useTranslation()
  const [isExpanded, setIsExpanded] = useState(defaultExpanded || false)

  const manualTooltipText = t('You must harvest and compound your earnings from this pool manually.')
  const autoTooltipText = t(
    'Any funds you stake in this pool will be automagically harvested and restaked (compounded) for you.',
  )

  const { targetRef, tooltip, tooltipVisible } = useTooltip(vaultKey ? autoTooltipText : manualTooltipText, {
    placement: 'bottom',
  })

  return (
    <StyledCardFooter>
      <ExpandableButtonWrapper>
        <Flex alignItems="center">
          {
            vaultKey ? (
              <StyledTagWrapper $color={txtColorMain}>
                <CompoundingPoolTag />
              </StyledTagWrapper>
            ) : (
              <StyledTagWrapper $color='#B5689E'>
                <ManualPoolTag />
              </StyledTagWrapper>
            )
          }
          {tooltipVisible && tooltip}
          <Flex ref={targetRef}>
            <HelpIcon ml="8px" width="20px" height="20px" color={txtColorMain || "textSubtle"} />
          </Flex>
        </Flex>
        <ExpandableLabel expanded={isExpanded} onClick={() => setIsExpanded(!isExpanded)}>
          {isExpanded ? t('Hide') : t('Details')}
        </ExpandableLabel>
      </ExpandableButtonWrapper>
      {isExpanded && <ExpandedFooter pool={pool} account={account} labelColor={txtColor} valueColor={txtColorMain} />}
    </StyledCardFooter>
  )
}

export default Footer
