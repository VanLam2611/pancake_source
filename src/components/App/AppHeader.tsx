import styled from 'styled-components'
import useTheme from 'hooks/useTheme'
import { Text, Flex, Heading, IconButton, ArrowBackIcon, NotificationDot } from '@pancakeswap/uikit'
import { useExpertModeManager } from 'state/user/hooks'
import GlobalSettings from 'components/Menu/GlobalSettings'
import Link from 'next/link'
import Transactions from './Transactions'
import QuestionHelper from '../QuestionHelper'

interface Props {
  title: string
  subtitle: string
  helper?: string
  backTo?: string
  noConfig?: boolean
}

const AppHeaderContainer = styled(Flex)<{ $isDark: boolean }>`
  align-items: center;
  justify-content: space-between;
  padding: 24px;
  width: 100%;
  border-bottom: 1px solid ${({ theme }) => theme.colors.cardBorder};
  ${({ theme }) => theme.mediaQueries.sm} {
    background: ${({ $isDark }) => ($isDark ? '#0C0711CC' : '#fff')};
  }
`

const AppHeader: React.FC<Props> = ({ title, subtitle, helper, backTo, noConfig = false }) => {
  const [expertMode] = useExpertModeManager()
  const { isDark } = useTheme()

  return (
    <AppHeaderContainer $isDark={isDark}>
      <Flex alignItems="center" mr={noConfig ? 0 : '16px'}>
        {backTo && (
          <Link passHref href={backTo}>
            <IconButton as="a">
              <ArrowBackIcon width="32px" />
            </IconButton>
          </Link>
        )}
        <Flex flexDirection="column">
          <Heading as="h2" mb="8px" style={{ color: '#EC4C93' }}>
            {title}
          </Heading>
          <Flex alignItems="center">
            {helper && <QuestionHelper text={helper} mr="4px" placement="top-start" />}
            <Text style={{ color: isDark ? '#fff' : '#7A6EAA' }} fontSize="14px">
              {subtitle}
            </Text>
          </Flex>
        </Flex>
      </Flex>
      {!noConfig && (
        <Flex alignItems="center">
          <NotificationDot show={expertMode}>
            <GlobalSettings />
          </NotificationDot>
          <Transactions />
        </Flex>
      )}
    </AppHeaderContainer>
  )
}

export default AppHeader
