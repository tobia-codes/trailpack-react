import type { Preview } from '@storybook/react-vite';
import { darkTheme, vars } from '../src/theme';
// Registers the global (light) theme. Importing it here is what makes the
// tokens resolve in Storybook, exactly as importing the built stylesheet does
// for a consuming app.
import '../src/theme/themes.css';

const preview: Preview = {
  parameters: {
    controls: { matchers: { color: /(background|color)$/i } },
  },

  globalTypes: {
    theme: {
      description: 'Token theme',
      toolbar: {
        title: 'Theme',
        icon: 'circlehollow',
        items: [
          { value: 'light', title: 'Light' },
          { value: 'dark', title: 'Dark' },
        ],
        dynamicTitle: true,
      },
    },
  },

  initialGlobals: { theme: 'light' },

  decorators: [
    (Story, context) => (
      <div
        className={context.globals.theme === 'dark' ? darkTheme : undefined}
        style={{
          background: vars.color.background,
          color: vars.color.foreground,
          fontFamily: vars.font.family.sans,
          padding: vars.space[6],
        }}
      >
        <Story />
      </div>
    ),
  ],
};

export default preview;
