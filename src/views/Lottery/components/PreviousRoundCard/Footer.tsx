import { useEffect, useState } from 'react'
import { Flex, ExpandableLabel, CardFooter } from '@pancakeswap/uikit'
import { useTranslation } from 'contexts/Localization'
import { LotteryRound } from 'state/types'
import FooterExpanded from './FooterExpanded'
import styled from 'styled-components'

interface PreviousRoundCardFooterProps {
  lotteryNodeData: LotteryRound
  lotteryId: string
}

const Sibling = styled.div`
  color: #ec4c93;
  + svg {
    fill: #ec4c93;
  }
`

const PreviousRoundCardFooter: React.FC<PreviousRoundCardFooterProps> = ({ lotteryNodeData, lotteryId }) => {
  const { t } = useTranslation()
  const [isExpanded, setIsExpanded] = useState(false)

  useEffect(() => {
    if (!lotteryId) {
      setIsExpanded(false)
    }
  }, [lotteryId])

  return (
    <CardFooter p="0">
      {isExpanded && <FooterExpanded lotteryNodeData={lotteryNodeData} lotteryId={lotteryId} />}
      <Flex p="8px 24px" alignItems="center" justifyContent="center">
        <ExpandableLabel
          expanded={isExpanded}
          onClick={() => {
            if (lotteryId) {
              setIsExpanded(!isExpanded)
            }
          }}
        >
          <Sibling>{isExpanded ? t('Hide') : t('Details')}</Sibling>
        </ExpandableLabel>
      </Flex>
    </CardFooter>
  )
}

export default PreviousRoundCardFooter
