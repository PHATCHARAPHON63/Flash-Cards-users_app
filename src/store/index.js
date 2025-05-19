import { applyMiddleware, createStore } from 'redux';
import { persistStore, persistReducer } from 'redux-persist';
import { thunk } from 'redux-thunk'; // Corrected import
import storage from 'redux-persist/lib/storage'; // defaults to localStorage for web
import rootReducer from './reducer';

const persistConfig = {
  key: 'root',
  storage,
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

const store = createStore(persistedReducer, applyMiddleware(thunk));
const persister = persistStore(store);

export { store, persister };
