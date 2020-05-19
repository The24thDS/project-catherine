import { createStore, applyMiddleware, compose } from "redux";
import { persistStore } from "redux-persist";
import LogRocket from "logrocket";

import rootReducer from "./rootReducer";

const middlewares = [];
middlewares.push(LogRocket.reduxMiddleware());

let store;

if (process.env.REACT_APP_ENV === "development") {
  const composeEnhancers =
    window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
  store = createStore(
    rootReducer,
    composeEnhancers(applyMiddleware(...middlewares))
  );
}
if (process.env.REACT_APP_ENV === "production") {
  store = createStore(rootReducer, applyMiddleware(...middlewares));
}

const persistor = persistStore(store);

export { store, persistor };
