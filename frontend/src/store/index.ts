import {applyMiddleware, createStore} from 'redux';
import {composeWithDevTools} from 'redux-devtools-extension';
import createSagaMiddleware from 'redux-saga';
import {combineReducers} from 'redux-starter-kit';
import sagas from './sagas';
import reducers from './reducers';

const reducer = combineReducers(reducers);
export type IState = ReturnType<typeof reducer>;

export default () => {
  const composeEnhancers = composeWithDevTools({});
  const sagaMiddleware = createSagaMiddleware();
  const middleware = [sagaMiddleware];
  const middlewares = applyMiddleware(...middleware);
  const store = createStore(reducer, composeEnhancers(middlewares));
  sagaMiddleware.run(sagas);

  return store;
};