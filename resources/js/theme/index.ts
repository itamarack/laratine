import { ActionIcon, createTheme, Loader } from '@mantine/core';
import { generateColors } from '@mantine/colors-generator';

export const myTheme = createTheme({
  primaryColor: 'indigo',
  focusRing: 'always',
  fontFamily: 'Open Sans, sans-serif',
  headings: { fontFamily: 'Open Sans, sans-serif' },
  components: {
    ActionIcon: ActionIcon.extend({
      defaultProps: {
        variant: 'subtle',
      },
    }),
    Loader: Loader.extend({
      defaultProps: {
        type: 'bars',
      },
    }),
  },
  colors: {
    whiteAlpha: generateColors('#FAFAFA'),
  }
});
