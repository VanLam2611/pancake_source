import { ReactNode } from 'react'
import styled, { css } from 'styled-components'
import { Card, CardBody, Box, CardProps } from '@pancakeswap/uikit'

const StyledCard = styled(Card)<{
  background: string
  rotation?: string
  $hasBorder?: boolean
  $hasLinearBg?: boolean
}>`
  height: fit-content;
  padding: 1px 1px 4px 1px;
  box-sizing: border-box;
  width: 258px;
  height: auto;
  padding: 0;
  margin: 0;

  ${(props) =>
    props.$hasLinearBg &&
    css`
      background: linear-gradient(134.59deg, rgba(181, 104, 158, 0.59) 1.32%, rgba(181, 104, 158, 0) 60.66%);
    `}

  ${(props) =>
    props.$hasBorder &&
    css`
      border: 1px solid;
      border-image-source: linear-gradient(137.94deg, #ff0099 2.56%, rgba(255, 0, 153, 0) 73.01%);
      border-image-slice: 1;
      border-radius: 5px;
    `}


  ${({ theme }) => theme.mediaQueries.md} {
    ${({ rotation }) => (rotation ? `transform: rotate(${rotation});` : '')}
  }
`

const StyledCardBody = styled(CardBody)`
  width: 100%;
  height: 100%;
  margin: 0;
  padding: 25px;

  @media screen and (max-width: 1400px) {
    padding: 20px;
  }

  @media screen and (max-width: 576px) {
    padding: 15px;
  }
`

const IconWrapper = styled(Box)<{ rotation?: string }>`
  position: absolute;
  top: 24px;
  right: 24px;
  top: 24px;
  left: 50%;
  bottom: auto;
  right: auto;
  transform: translateX(-50%);

  ${({ theme }) => theme.mediaQueries.md} {
    ${({ rotation }) => (rotation ? `transform: rotate(${rotation});` : '')}
  }

  svg {
    width: 80px;
    height: 80px;
  }
`

interface IconCardProps extends IconCardData, CardProps {
  children: ReactNode
}

export interface IconCardData {
  icon: ReactNode
  background?: string
  borderColor?: string
  rotation?: string
  hasMainIcon?: boolean
  hasBorder?: boolean
  hasLinearBg?: boolean
}

const IconCard: React.FC<IconCardProps> = ({
  icon,
  background,
  borderColor,
  rotation,
  children,
  hasMainIcon = true,
  hasBorder = false,
  hasLinearBg = false,
  ...props
}) => {
  return (
    <StyledCard
      background={background}
      borderBackground={borderColor}
      rotation={rotation}
      {...props}
      $hasBorder={hasBorder}
      $hasLinearBg={hasLinearBg}
    >
      <StyledCardBody
        style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}
      >
        {hasMainIcon ? <IconWrapper rotation={rotation}>{icon}</IconWrapper> : <></>}

        {children}
      </StyledCardBody>
    </StyledCard>
  )
}

export default IconCard
