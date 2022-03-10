/* eslint-disable react/no-array-index-key */
import styled from 'styled-components'
import { Text, Heading, Card, CardHeader, CardBody, Flex } from '@pancakeswap/uikit'
import { useTranslation } from 'contexts/Localization'
import FoldableText from 'components/FoldableSection/FoldableText'
import config from './config'

// const ImageWrapper = styled.div`
//   flex: none;
//   order: 2;
//   max-width: 414px;
//   width: 100%;

//   ${({ theme }) => theme.mediaQueries.md} {
//     order: 1;
//   }
// `

const DetailsWrapper = styled.div`
  order: 1;
  // margin-bottom: 40px;
  margin: 0;

  ${({ theme }) => theme.mediaQueries.md} {
    order: 2;
    // margin-bottom: 0;
    // margin-left: 40px;
    margin: 0;
  }
`

const StyledCard = styled(Card)`
  background: rgba(12, 7, 17, 0.8);
  border-radius: 10px 10px 0px 0px;
  padding: 0;

  > div {
    background: none;
    border-radius: 0;
  }
`

const StyledCardHeader = styled(CardHeader)`
  background: linear-gradient(180deg, #6800a8 0%, rgba(104, 0, 168, 0) 147.22%);
  border-radius: 10px 10px 0px 0px;
  padding: 32px;
`

const StyledCardHeading = styled(Heading)`
  font-weight: bold;
  font-size: 24px;
  line-height: 24px;
  text-transform: uppercase;
  color: #fff;
  text-align: center;
`

const StyledFoldableText = styled(FoldableText)`
  margin: 0;
  padding: 12px 24px;
  border-bottom: 1px solid #ec4c93;

  :last-child {
    border-bottom: none;
  }

  > div:nth-child(1) {
    padding: 0;
  }

  > div > div {
    color: #fff;
    font-weight: bold;
  }
`

const IfoQuestions = () => {
  const { t } = useTranslation()

  return (
    <Flex alignItems={['center', null, null, 'start']} flexDirection={['column', null, null, 'row']}>
      {/* <ImageWrapper>
        <Image src="/images/ifos/ifo-bunny.png" alt="ifo bunny" width={414} height={500} />
      </ImageWrapper> */}

      <DetailsWrapper>
        <StyledCard>
          <StyledCardHeader>
            <StyledCardHeading scale="lg" color="#fff">
              {t('Details')}
            </StyledCardHeading>
          </StyledCardHeader>
          <CardBody p="0">
            {config.map(({ title, description }, i, { length }) => {
              return (
                <StyledFoldableText key={i} mb={i + 1 === length ? '' : '24px'} title={title} isLineBreakHided>
                  {description.map((desc, index) => {
                    return (
                      <Text key={index} color="#B5689E" as="p">
                        {desc}
                      </Text>
                    )
                  })}
                </StyledFoldableText>
              )
            })}
          </CardBody>
        </StyledCard>
      </DetailsWrapper>
    </Flex>
  )
}

export default IfoQuestions
