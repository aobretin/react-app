import React from 'react';
import {observer} from "mobx-react";

import {Link} from 'react-router-dom';

import LoginForm from 'LoginForm';
import RegisterForm from 'RegisterForm';

const setFormStatus = (status, props) => {
  const {
    toggleUserDrop,
    user: {
      setUserFormStatus,
    }
  } = props;

  setUserFormStatus(status);
  toggleUserDrop();
}

// MAIN RENDER
const ViewDesktop = props => {
  const {
    goTo,
    showUserDrop,
    toggleUserDrop,
    isUserLogged,
    logOut,
    redirectTo,
    toggleAllowDashboard,
    user: {
      isAuth,
      getUserData,
      getUserFormStates
    }
  } = props;

  const FORM_STATES = getUserFormStates();

  const {
    LOGIN,
    REGISTER
  } = FORM_STATES;

  const isLoggedIn = isAuth();

  return (
    <div className={`dropdown col${showUserDrop ? ' show' : ''}`}>
      <a href="javascript:;" className="dropdown-toggle" onClick={toggleUserDrop}>
        <span className="icon-profile"></span>
        {
          isLoggedIn ? `Welcome, ${getUserData('name')}` : 'Login / Register'
        }
      </a>

      <div style={{left: 'auto', right: 0}} className={`dropdown-menu align-right${showUserDrop ? ' show' : ''}`}>
        {
          isLoggedIn
            ?
              [
                <li key="0">
                  <Link to="/dashboard" onClick={toggleUserDrop} className="dropdown-item">
                    Dashboard
                  </Link>
                </li>,
              <li key="1">
                <a onClick={() => logOut(() => toggleUserDrop())} className="dropdown-item">Logout</a>
              </li>
              ]
            :
            [
          <li key="0">
            <a onClick={() => setFormStatus(LOGIN, props)} className="dropdown-item">Login</a>
          </li>,
          <li key="1">
            <a onClick={() => setFormStatus(REGISTER, props)} className="dropdown-item">Register</a>
          </li>
            ]
        }
      </div>
    </div>
  )
}

export default observer(ViewDesktop);
