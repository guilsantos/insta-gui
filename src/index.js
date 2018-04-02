import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import Login from './componentes/Login';
import Logout from './componentes/Logout';
import './css/reset.css';
import './css/timeline.css';
import './css/login.css';
import registerServiceWorker from './registerServiceWorker';
import { BrowserRouter as Router, Route, Switch, Redirect, matchPath } from 'react-router-dom';
import { createStore, applyMiddleware, combineReducers } from 'redux';
import thunkMiddleware from 'redux-thunk';
import { timeline } from './reducers/timeline';
import { notificacao } from './reducers/header';
import {Provider} from 'react-redux';

function verificaAutenticacao(nextState, replace) {

  const match = matchPath('/timeline', {
    path: nextState.match.url,
    exact: true
  });

  let valida = false;
  if (match !== null) {
      valida = match.isExact
  }

  if(valida && localStorage.getItem('auth-token') === null){
    return (
      <Redirect to={{
        pathname: '/',
        state: {msg: 'você precisa estar logado para acessar o endereço'}
      }}/>
    )
  }
  
  return <App login={nextState.match.params.login}/>
  ;
}

const reducers = combineReducers({timeline, notificacao});
const store = createStore(reducers, applyMiddleware(thunkMiddleware));

ReactDOM.render((
  <Provider store={store}>
    <Router>
      <Switch>
        <Route exact path='/' component={Login}/>
        <Route path='/login' component={Login}/>
        <Route path='/logout' component={Logout}/>
        <Route path='/timeline/:login?' render={verificaAutenticacao}/>
      </Switch>
    </Router>
  </Provider>
  ), document.getElementById('root'));
registerServiceWorker();
