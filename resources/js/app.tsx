import './bootstrap';

import '@mantine/core/styles.css';
import '@mantine/notifications/styles.css';
import '@mantine/core/styles.layer.css';
import 'mantine-datatable/styles.layer.css';
import '../css/app.css';

import { createRoot, hydrateRoot } from 'react-dom/client';
import { createInertiaApp } from '@inertiajs/react';
import { resolvePageComponent } from 'laravel-vite-plugin/inertia-helpers';
import { MantineProvider } from '@mantine/core';
import { Notifications } from '@mantine/notifications';
import { myTheme } from './theme';

const appName = import.meta.env.VITE_APP_NAME || 'Laravel';
const glob = import.meta.glob('./Pages/**/*.tsx');

createInertiaApp({
  title: title => `${title} - ${appName}`,
  resolve: name => resolvePageComponent(`./Pages/${name}.tsx`, glob),
  setup({ el, App, props }) {
    if (import.meta.env.DEV) {
      createRoot(el).render(
        <MantineProvider theme={myTheme}>
          <Notifications position="top-right" zIndex={1000} />
          <App {...props} />
        </MantineProvider>,
      );
      return;
    }

    hydrateRoot(
      el,
      <MantineProvider theme={myTheme}>
        <Notifications position="top-right" zIndex={1000} />
        <App {...props} />
      </MantineProvider>,
    );
  },
});
