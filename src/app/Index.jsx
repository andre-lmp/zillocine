import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import { TmdbProvider } from './shared-components/context-api/tmdb-context/tmdbContext.jsx';

ReactDOM.createRoot(document.getElementById('root')).render(
	<React.StrictMode>
		<TmdbProvider>
			<App/>
		</TmdbProvider>
	</React.StrictMode>
)