import React from 'react'
import { render } from 'react-dom'
import { Provider } from 'react-redux'
import store from '../store'
import DailyCommits from './daily_commits.jsx';
require('bootstrap-css-only/css/bootstrap.css');
require('../style/main.css');

let reactElement = document.getElementById('react')
render(
  <Provider store={store}>
  <div className="container">
    <DailyCommits />
  </div>
  </Provider>,
  reactElement
)