import { Heading, Flex, Text, useMatchBreakpoints } from '@pancakeswap/uikit'

const StatCardContent: React.FC<{
  headingText: string
  bodyText: string
  highlightColor: string
  lastWordColor: string
  style: any
}> = ({ headingText, bodyText, highlightColor, lastWordColor, style }) => {
  const { isMobile, isTablet } = useMatchBreakpoints()
  const isSmallerScreen = isMobile || isTablet
  const split = headingText.split(' ')
  const lastWord = split.pop()
  const remainingWords = split.slice(0, split.length).join(' ')

  return (
    <Flex
      minHeight={[null, null, null, '168px']}
      minWidth="232px"
      width="fit-content"
      flexDirection="column"
      justifyContent="flex-end"
      // mt={[null, null, null, '64px']}
      style={{ alignItems: 'center', ...style }}
    >
      {isSmallerScreen && remainingWords.length > 13 ? (
        <Heading scale="lg" style={{ color: '#fff', fontWeight: '600', fontSize: '35px', lineHeight: '37px' }}>
          {remainingWords}
        </Heading>
      ) : (
        <Heading scale="xl" style={{ color: '#fff', fontWeight: '600', fontSize: '35px', lineHeight: '37px' }}>
          {remainingWords}
        </Heading>
      )}
      <Heading color={highlightColor} scale="xl" mb="5px">
        <span style={{ color: `${lastWordColor}` }}>{lastWord}</span>
      </Heading>
      <Text color="textSubtle" style={{ color: '#fff' }}>
        {bodyText}
      </Text>
    </Flex>
  )
}

export default StatCardContent
