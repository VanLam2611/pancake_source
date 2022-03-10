// Initial:
// export const parameters = {
//   actions: { argTypesRegex: '^on[A-Z].*' },
//   controls: {
//     matchers: {
//       color: /(background|color)$/i,
//       date: /Date$/,
//     },
//   },
// }

// Other solution:
import React from 'react'
import { withThemesProvider } from 'themeprovider-storybook'
import light from '../pancake-uikit/src/theme/light'
import dark from '../pancake-uikit/src/theme/dark'
import ResetCSS from '../pancake-uikit/src/ResetCSS'
import { ModalProvider } from '../pancake-uikit/src/widgets/Modal'

const globalDecorator = (StoryFn) => (
  <ModalProvider>
    <ResetCSS />
    <StoryFn />
  </ModalProvider>
)

export const parameters = {
  actions: { argTypesRegex: '^on[A-Z].*' },
}

const themes = [
  {
    name: 'Light',
    backgroundColor: light.colors.background,
    ...light,
  },
  {
    name: 'Dark',
    backgroundColor: dark.colors.background,
    ...dark,
  },
]

export const decorators = [globalDecorator, withThemesProvider(themes)]
