import './bootstrap';
import '../css/app.css';
import '@mantine/core/styles.css';

import { createRoot, hydrateRoot } from 'react-dom/client';
import { createInertiaApp } from '@inertiajs/react';
import { resolvePageComponent } from 'laravel-vite-plugin/inertia-helpers';
import { MantineProvider } from '@mantine/core';
import { theme } from './theme';

const appName = import.meta.env.VITE_APP_NAME || 'Laravel';
const glob = import.meta.glob('./Pages/**/*.tsx');

createInertiaApp({
  title: (title) => `${title} - ${appName}`,
  resolve: (name) => resolvePageComponent(`./Pages/${name}.tsx`, glob),
  setup({ el, App, props }) {
    if (import.meta.env.DEV) {
      createRoot(el).render(
        <MantineProvider theme={theme}>
          <App {...props} />
        </MantineProvider>
      );
      return;
    }

    hydrateRoot(
      el,
      <MantineProvider theme={theme}>
        <App {...props} />
      </MantineProvider>
    );
  },
  progress: {
    color: '#4B5563',
  },
});
