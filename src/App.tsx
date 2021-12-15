import React from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import './App.css';
import ResponsiveAppBar from './components/ResponsiveAppBar';
import { Route, Routes } from 'react-router-dom';
import Home from './pages/Home';
import { Container, CssBaseline } from '@mui/material';
import AddBlog from './pages/AddBlog';
import getApolloClient from './utils/getApolloClient';
import { ApolloProvider } from '@apollo/client';
import BlogDetail from './pages/BlogDetail';
import UpdateBlog from './pages/UpdateBlog';

function App() {
	const { getAccessTokenSilently } = useAuth0();
	const client = getApolloClient(getAccessTokenSilently);

	const { isAuthenticated } = useAuth0();
	if (!isAuthenticated) {
		localStorage.removeItem('user');
	}

	return (
		<ApolloProvider client={client}>
			<ResponsiveAppBar />
			<CssBaseline />
			<Container maxWidth="lg">
				<Routes>
					<Route path="/" element={<Home />} />
					<Route path="add-blog" element={<AddBlog />} />
					<Route path="blogs" element={<Home />} />
					<Route path="blogs/:blogId" element={<BlogDetail />} />
					<Route path="blogs/:blogId/edit" element={<UpdateBlog />} />
					<Route
						path="*"
						element={
							<main style={{ padding: '1rem' }}>
								<p>There's nothing here!</p>
							</main>
						}
					/>
				</Routes>
			</Container>
		</ApolloProvider>
	);
}

export default App;
