import { createStore, applyMiddleware } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';
import { createLogger } from 'redux-logger';
import createSagaMiddleware from 'redux-saga';
import { combineReducers } from 'redux-starter-kit';
import sagas from './sagas';
import reducers from './reducers';

const reducer = combineReducers(reducers);
export type IState = ReturnType<typeof reducer>;

export default () => {
  const composeEnhancers = composeWithDevTools({});
  const loggerMiddleware = createLogger({ collapsed: true, duration: true });
  const sagaMiddleware = createSagaMiddleware();
  const middleware = [loggerMiddleware, sagaMiddleware]
  const middlewares = applyMiddleware(...middleware);
  const store = createStore(reducer, composeEnhancers(middlewares));

  sagaMiddleware.run(sagas);

  return store;
};