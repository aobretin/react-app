import React from 'react';
import {observer} from "mobx-react";

const ViewDesktop = props => {
  const {
    data: userData,
    loading,
    logIn,
    handleChange,
    toggleLoadingState,
    user: {
      getUserFormStates,
      setUserFormStatus
    }
  } = props;

  const FORM_STATES = getUserFormStates();

  const {
    REGISTER
  } = FORM_STATES;

  const {
    Username,
    Password
  } = userData;

  return (
    <form style={{minWidth: '400px'}} onSubmit={e => {
      e.preventDefault();

      toggleLoadingState();
      logIn(userData, res =>
        {
          if (res.status < 400) setUserFormStatus('');
          toggleLoadingState();
        }
      )
    }} noValidate>
      <input value={Username} onChange={handleChange} className="form-control" style={{marginBottom: '10px'}} autoComplete="off" name="Username" type="text" placeholder="Email" />
      <input value={Password} onChange={handleChange} className="form-control" autoComplete="off" type="password" name="Password" placeholder="Password" />

      <div style={{overflow: 'hidden', padding: '0', 'marginTop': '10px'}} className="row row justify-content-between no-gutters">
        <a onClick={() => setUserFormStatus(REGISTER)} href="javascript:;">Don't have an account ?</a>
      </div>

      <div style={{overflow: 'hidden', padding: '0', 'marginTop': '10px'}} className="row row justify-content-between no-gutters">
        <button type="submit" disabled={!Username.length || !Password.length || loading} className="btn btn-success col">{loading ? 'Loggin in' : 'Login'}</button>
      </div>
    </form>
  )
}

export default observer(ViewDesktop);
