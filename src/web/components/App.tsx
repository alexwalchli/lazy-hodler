import 'bootstrap/dist/css/bootstrap.css'

import * as React from 'react'
import { Route, BrowserRouter, Link, Redirect, Switch } from 'react-router-dom'
import { logout } from '../firebase-auth'
import { firebaseAuth } from '../firebase-singletons'
import Dashboard from './Dashboard'
import Login from './Login'
import Register from './Register'

function PrivateRoute ({component: Component, authed, ...rest}) {  // eslint-disable-line
  return (
    <Route
      {...rest}
      render={(props) => authed === true
        ? <Component {...props} />
        : <Redirect to={{pathname: '/login', state: {from: props.location}}} />}
    />
  )
}

function PublicRoute ({component: Component, authed, ...rest}) {  // eslint-disable-line
  return (
    <Route
      {...rest}
      render={(props) => authed === false
        ? <Component {...props} />
        : <Redirect to='/dashboard' />}
    />
  )
}

export interface AppState {
  authed: boolean,
  loading: boolean
}
export interface AppProps { }

export default class App extends React.Component<AppProps, AppState> {
  removeListener
  
  state = {
    authed: false,
    loading: true
  }

  constructor(props) {
    super(props)
  }

  componentDidMount () {
    this.removeListener = firebaseAuth().onAuthStateChanged((user) => {
      if (user) {
        this.setState({
          authed: true,
          loading: false
        })
      } else {
        this.setState({
          authed: false,
          loading: false
        })
      }
    })
  }
  
  componentWillUnmount () {
    this.removeListener()
  }

  render() {
    return this.state.loading === true ? <h1>Loading</h1> : (
      <BrowserRouter>
        <div>
          <nav className='navbar navbar-default navbar-static-top'>
            <div className='container'>
              <div className='navbar-header'>
                <Link to='/' className='navbar-brand'>Lazy Hodler</Link>
              </div>
              <ul className='nav navbar-nav pull-right'>
                <li>
                  <Link to='/' className='navbar-brand'>Dashboard</Link>
                </li>
                <li>
                  {this.state.authed
                    ? <button
                        style={{border: 'none', background: 'transparent'}}
                        onClick={() => {
                          logout()
                        }}
                        className='navbar-brand'>Logout</button>
                    : <span>
                        <Link to='/login' className='navbar-brand'>Login</Link>
                        <Link to='/register' className='navbar-brand'>Register</Link>
                      </span>}
                </li>
              </ul>
            </div>
          </nav>
          <div className='container-fluid'>
            <div className='row'>
              <Switch>
                <PublicRoute authed={this.state.authed} path='/login' component={Login} />
                <PublicRoute authed={this.state.authed} path='/register' component={Register} />
                <PrivateRoute authed={this.state.authed} path='/' component={Dashboard} />
                <Route render={() => <h3>No Match</h3>} />
              </Switch>
            </div>
          </div>
        </div>
      </BrowserRouter>
    );
  }
}