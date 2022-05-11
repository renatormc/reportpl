import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import {v4 as uuidv4} from 'uuid';

const rootEl = document.getElementById('root') as HTMLElement;
const modelName = rootEl.getAttribute("model_name") || "";
const randomID = rootEl.getAttribute("random_id") || uuidv4();
console.log(randomID);

const root = ReactDOM.createRoot(
  rootEl
);
root.render(
  <React.StrictMode>
    <App model_name={modelName} randomID={randomID}/>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
