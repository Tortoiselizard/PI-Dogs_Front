import {createStore, applyMiddleware, compose} from "redux"
import rootReducer from "../reducer/index"
import thunk from "redux-thunk"

const composedEnhancers =
   (typeof window !== 'undefined' &&
      window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__) ||
   compose;

const store = createStore(
   rootReducer,
   composedEnhancers(applyMiddleware(thunk)),
);

export default store;