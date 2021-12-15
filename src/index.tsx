import React from 'react';
import ReactDOM from 'react-dom';
import Auth0ProviderWithHistory from './provider/Auth0ProviderWithHistory';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { BrowserRouter } from 'react-router-dom';

if (!process.env.REACT_APP_AUTH0_CLIENT_ID) {
	throw new Error(
		'`REACT_APP_AUTH0_CLIENT_ID` is required. See development.html or DEVELOPMENT.md. Changes to `.env` files requires a restart.'
	);
}
if (!process.env.REACT_APP_AUTH0_DOMAIN) {
	throw new Error(
		'`REACT_APP_AUTH0_DOMAIN` is required. See development.html or DEVELOPMENT.md. Changes to `.env` files requires a restart.'
	);
}

ReactDOM.render(
	<React.StrictMode>
		<BrowserRouter>
			<Auth0ProviderWithHistory>
				<App />
			</Auth0ProviderWithHistory>
		</BrowserRouter>
	</React.StrictMode>,
	document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
