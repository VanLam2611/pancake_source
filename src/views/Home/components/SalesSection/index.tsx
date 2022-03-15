import styled, { css } from 'styled-components'
import { Flex, Text, Button, Link } from '@pancakeswap/uikit'
import { NextLinkFromReactRouter as RouterLink } from 'components/NextLink'
import { CompositeImageProps } from '../CompositeImage'
// import ColoredWordHeading from '../ColoredWordHeading'

interface SalesSectionButton {
  to: string
  text: string
  external: boolean
}

export interface SalesSectionProps {
  headingText: string
  bodyText: string
  reverse: boolean
  primaryButton: SalesSectionButton
  secondaryButton: SalesSectionButton
  images: CompositeImageProps
  numberOfWords: number
}

const StyledHeadingWrapper = styled(Text)`
  display: inline-block;
  text-align: center;
  margin-bottom: 40px;

  && div {
    display: inline;
  }

  @media screen and (max-width: 1400px) {
    margin-bottom: 20px;
  }

  @media screen and (max-width: 576px) {
    margin-bottom: 15px;
  }
`

const StyledHeading = styled(Text)<{ $isHighlighted?: boolean }>`
  color: #fff;
  font-style: normal;
  font-weight: 500;
  font-size: 60px;
  line-height: 63px;
  text-align: center;
  margin: 0;
  padding: 0;

  ${(props) =>
    props.$isHighlighted &&
    css`
      color: #ec4b93;
    `}

  @media screen and (max-width: 1400px) {
    font-size: 50px;
    line-height: 53px;
  }

  @media screen and (max-width: 576px) {
    font-size: 35px;
    line-height: 38px;
  }
`

const StyledText = styled(Text)`
  color: #fff;
  font-style: normal;
  font-weight: 300;
  font-size: 25px;
  line-height: 26px;
  text-align: center;
  margin-bottom: 40px;

  @media screen and (max-width: 1400px) {
    font-size: 23px;
    line-height: 24px;
    margin-bottom: 20px;
  }

  @media screen and (max-width: 576px) {
    font-size: 23px;
    line-height: 24px;
    margin-bottom: 15px;
  }
`

const SalesSection: React.FC<SalesSectionProps> = (props) => {
  const { headingText, bodyText, reverse, primaryButton, secondaryButton, numberOfWords = 0 } = props
  const highlightedWords = numberOfWords === 0 ? 0 : numberOfWords

  return (
    <Flex flexDirection="column">
      <Flex
        flexDirection={['column-reverse', null, null, reverse ? 'row-reverse' : 'row']}
        alignItems={['flex-end', null, null, 'center']}
        justifyContent="center"
      >
        <Flex
          flexDirection="column"
          justifyContent="center"
          alignItems="center"
          flex="1"
          alignSelf={['flex-start', null, null, 'center']}
        >
          <StyledHeadingWrapper>
            <StyledHeading $isHighlighted>{headingText.split(' ', highlightedWords).join(' ')}</StyledHeading>
            <StyledHeading> </StyledHeading>
            <StyledHeading>{headingText.split(' ').slice(highlightedWords).join(' ')}</StyledHeading>
          </StyledHeadingWrapper>

          <StyledText color="textSubtle" mb="24px">
            {bodyText}
          </StyledText>

          <Flex justifyContent="center" alignItems="center">
            <Button mr="16px" style={{ backgroundColor: '#EC4C93' }}>
              {primaryButton.external ? (
                <Link external href={primaryButton.to}>
                  <Text color="#EC4C93" bold fontSize="16px">
                    {primaryButton.text}
                  </Text>
                </Link>
              ) : (
                <RouterLink to={primaryButton.to}>
                  <Text color="card" bold fontSize="16px">
                    {primaryButton.text}
                  </Text>
                </RouterLink>
              )}
            </Button>
            {secondaryButton.external ? (
              <Link
                external
                href={secondaryButton.to}
                color="#fff"
                p="10px 20px"
                style={{ border: '1px solid #EC4C93', borderRadius: '16px' }}
              >
                {secondaryButton.text}
              </Link>
            ) : (
              <RouterLink to={secondaryButton.to}>{secondaryButton.text}</RouterLink>
            )}
          </Flex>
        </Flex>
      </Flex>
    </Flex>
  )
}

export default SalesSection
