import React from 'react';
import { Auth0Provider } from '@auth0/auth0-react';

const Auth0ProviderWithHistory = ({ children }: { children: JSX.Element }) => {
	// const navigate = useNavigate();

	// const onRedirectCallback = (appState: any) => {
	// 	console.log(appState);
	// };

	return (
		<Auth0Provider
			clientId={process.env.REACT_APP_AUTH0_CLIENT_ID || ''}
			domain={process.env.REACT_APP_AUTH0_DOMAIN || ''}
			redirectUri={window.location.origin}
			audience={process.env.REACT_APP_AUTH0_AUDIENCE}
			useRefreshTokens
			cacheLocation="localstorage"
			// onRedirectCallback={onRedirectCallback}
		>
			{children}
		</Auth0Provider>
	);
};

export default Auth0ProviderWithHistory;
