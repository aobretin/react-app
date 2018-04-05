import React from 'react';
import {observer} from "mobx-react";

const ViewDesktop = props => {
  const {
    data: userData,
    loading,
    register,
    handleChange,
    toggleLoadingState,
    user: {
      getUserFormStates,
      setUserFormStatus
    }
  } = props;

  const FORM_STATES = getUserFormStates();

  const {
    LOGIN
  } = FORM_STATES;

  const {
    Email,
    Password
  } = userData;

  return (
    <form style={{minWidth: '400px'}} onSubmit={e => {
      e.preventDefault();

      toggleLoadingState();
      register(userData, res =>
        {
          if (res.status < 400) setUserFormStatus('');
          setUserFormStatus('');
        }
      )
    }} noValidate>
      <input value={Email} onChange={handleChange} className="form-control" style={{marginBottom: '10px'}} autoComplete="off" name="Email" type="text" placeholder="Email" />
      <input value={Password} onChange={handleChange} className="form-control" autoComplete="off" type="password" name="Password" placeholder="Password" />

      <div style={{overflow: 'hidden', padding: '0', 'marginTop': '10px'}} className="row row justify-content-between no-gutters">
        <a onClick={() => setUserFormStatus(LOGIN)} href="javascript:;">Already have an account ?</a>
      </div>

      <div style={{overflow: 'hidden', padding: '0', 'marginTop': '10px'}} className="row row justify-content-between no-gutters">
        <button type="submit" disabled={!Email.length || !Password.length || loading} className="btn btn-success col">{loading ? 'Registering' : 'Register'}</button>
      </div>
    </form>
  )
}

export default observer(ViewDesktop);
