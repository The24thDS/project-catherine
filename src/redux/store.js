import { createStore, applyMiddleware, compose } from "redux";
import { persistStore } from "redux-persist";
import LogRocket from "logrocket";

import rootReducer from "./rootReducer";

const middlewares = [];

if (process.env.NODE_ENV === "development") {
  middlewares.push(LogRocket.reduxMiddleware());
}

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

const store = createStore(
  rootReducer,
  composeEnhancers(applyMiddleware(...middlewares))
);

const persistor = persistStore(store);

export { store, persistor };
