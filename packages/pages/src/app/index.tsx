// import React from 'react';
// import { createRoot } from 'react-dom/client';

// import App from './App';

// const rootElement = document.getElementById('root');

// rootElement && createRoot(rootElement).render(<App />);

import React from 'react';
import './index.css';
// Testing against multiple version of React.
// eslint-disable-next-line react/no-deprecated
import { render } from 'react-dom';

import App from './App.tsx';

const rootElement = document.getElementsByTagName('main')?.[0];

rootElement && render(<App />, rootElement);
