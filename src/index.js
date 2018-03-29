import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import Login from './componentes/Login';
import './css/reset.css';
import './css/timeline.css';
import './css/login.css';
import registerServiceWorker from './registerServiceWorker';
import {BrowserRouter as Router, Route,Switch} from 'react-router-dom';

ReactDOM.render((
  <Router>
    <Switch>
      <Route exact path='/' component={Login}/>
      <Route path='/login' component={Login}/>
      <Route path='/timeline' component={App}/>
    </Switch>
  </Router>), document.getElementById('root'));
registerServiceWorker();
