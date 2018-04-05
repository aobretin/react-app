import React from 'react';
import {observer} from "mobx-react";
import {toJS} from "mobx";

import BookForm from './BookForm/BookForm';

const ViewDesktop = props => {
  const {
    hasService,
    resultReady,
    services,
    user: {
      isAuth,
      setUserFormStatus,
      getUserFormStates
    }
  } = props;

  const {
    LOGIN
  } = getUserFormStates();

  const loggedIn = isAuth();

  return (
    <div className="row">
      {
        resultReady
          ?
            hasService
              ?
                <div className="row">
                  {
                    !loggedIn && (
                      <div className="col text-center" style={{marginBottom: '20px'}}>
                        <button onClick={() => setUserFormStatus(LOGIN)} className="btn btn-success">Login to make data completion easier</button>
                      </div>
                    )
                  }
                  <BookForm services={services} />
                </div>
              :
              <h2 style={{textAlign: 'center'}}>No services available... Please search for something</h2>
          :
          <h2 style={{textAlign: 'center'}}>Loading forms... Please wait</h2>
      }
    </div>
  )
}

export default observer(ViewDesktop);
