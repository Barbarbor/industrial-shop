import { Provider } from 'react-redux'
import { store } from './store/store'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'
import React from 'react'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <Provider store={store}>
    <App />
  </Provider>,
)
