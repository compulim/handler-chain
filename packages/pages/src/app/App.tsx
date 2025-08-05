import { Atelier } from '@compulim/atelier';
import '@compulim/atelier/atelier.css';
import React, { memo } from 'react';

const App = () => <Atelier packageName="handler-chain" repoOwner="compulim" repoName="handler-chain" />;

export default memo(App);
