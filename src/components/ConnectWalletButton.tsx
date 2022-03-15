import { Button, useWalletModal, ButtonProps } from '@pancakeswap/uikit'
import useAuth from 'hooks/useAuth'
import { useTranslation } from 'contexts/Localization'
import useTheme from 'hooks/useTheme'
import Trans from './Trans'

const ConnectWalletButton = ({ children, ...props }: ButtonProps) => {
  const { t } = useTranslation()
  const { isDark } = useTheme()
  const { login, logout } = useAuth()
  const { onPresentConnectModal } = useWalletModal(login, logout, t)

  return (
    <Button
      style={{
        background: isDark ? 'transparent' : '#EC4C93',
        border: isDark ? '1px solid #EC4C93' : '1px solid transparent',
      }}
      onClick={onPresentConnectModal}
      {...props}
    >
      {children || <Trans>Connect Wallet</Trans>}
    </Button>
  )
}

export default ConnectWalletButton
