import { BrowserRouter } from 'react-router-dom';

import '../public/css/font-awesome.css';
import '../public/css/themify-icons.css';
import '../public/css/reset.css';

import '../src/App.scss';
import '../src/sb/styles.scss';

export const parameters = {
  actions: { argTypesRegex: "^on[A-Z].*" },
  controls: {
    matchers: {
      color: /(background|color)$/i,
      date: /Date$/,
    },
  },
}

export const decorators = [
  (Story) => (
    <BrowserRouter>
      <Story />
    </BrowserRouter>
  ),
];
