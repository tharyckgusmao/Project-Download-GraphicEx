import React from 'react';
import { render } from 'react-dom';
import './app.global.css';

import Main from './components/main'

import { createStore } from 'redux';
import { Provider } from 'react-redux';
import Reducers from './reducers/Reducers.js';

const store = createStore(Reducers, window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__());
const root = document.getElementById('root');

const renderEl = (

    <Provider store = { store }>
			<Main />
	</Provider>
);



let fnRender = () => {

    render(
        renderEl, root
    )
}

fnRender();
