import { createRoot } from 'react-dom/client';

// third party
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { composeWithDevTools } from 'redux-devtools-extension';

// project imports
import * as serviceWorker from 'serviceWorker';
import App from 'App';
import { store } from 'store';

// fetching data with caching and fetch status library
import { useQuery, useMutation, useQueryClient, QueryClient, QueryClientProvider } from '@tanstack/react-query';

// style + assets
import 'assets/scss/style.scss';
import config from './config';
import { StrictMode } from 'react';

// ==============================|| REACT DOM RENDER  ||============================== //

const queryClient = new QueryClient();

const container = document.getElementById('root');
const root = createRoot(container, store, composeWithDevTools()); // createRoot(container!) if you use TypeScript
root.render(
  // <StrictMode>
  <QueryClientProvider client={queryClient}>
    <Provider store={store}>
      <BrowserRouter basename={config.basename}>
        <App />
      </BrowserRouter>
    </Provider>
  </QueryClientProvider>
  // </StrictMode>
);

serviceWorker.unregister();
