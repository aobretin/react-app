import React from 'react';
import {observer} from "mobx-react";

import CurrencyConverter from 'CurrencyConverter';
import BookFormContact from './BookFormContact/BookFormContact';
import BookFormFlight from './BookFormFlight/BookFormFlight';
import BookFormHotel from './BookFormHotel/BookFormHotel';
import BookFormFH from './BookFormFH/BookFormFH';

const determineServiceText = (type, idx) => {
  let text = '';

  switch (type) {
    case 'flight':
      text = `Flight ${idx + 1}`;
      break;
    case 'hotel':
      text = `Hotel ${idx + 1}`;
      break;
    case 'flight_hotel':
      text = 'Flight & Hotel';
      break;
  }

  return text;
}

// MAIN RENDER
const ViewDesktop = props => {
  const {
    forms,
    amount,
    selectedTab,
    changeSelectedTab,
    enableForm,
    syncs,
    preselectedUsers,
    applyPreselectedUser,
    handleLoginPrecomplete,
    user: {
      isAuth
    }
  } = props;

  const loggedIn = isAuth();

  if (loggedIn) handleLoginPrecomplete();

  return (
    <div>
      <BookFormContact />
      {
        forms.length > 1 && (
          <nav className="nav nav-pills nav-justified">
            {
              forms.map((form, idx) => {
                return <a key={idx} onClick={() => changeSelectedTab(idx)} className={`nav-item nav-link ${selectedTab == idx ? 'active' : ''}`} href="javascript:;">{determineServiceText(form.type, idx)}</a>
              })
            }
          </nav>
        )
      }
      <div className="tab-content">
        {
          forms.map((form, idx) => {
            return (
              <div key={idx} className={`tab-pane ${selectedTab == idx ? 'active' : ''}`}>
                {
                  (() => {
                    switch (form.type) {
                      case 'flight':
                        return <BookFormFlight
                          idx={form.idx}
                          passengers={form.passengers}
                          preselectedUsers={preselectedUsers}
                          applyPreselectedUser={applyPreselectedUser}
                               />
                        break;
                      case 'hotel':
                        return <BookFormHotel
                          idx={form.idx}
                          clients={form.clients}
                          preselectedUsers={preselectedUsers}
                          applyPreselectedUser={applyPreselectedUser}
                               />
                        break;
                      case 'flight_hotel':
                        return <BookFormFH
                          syncs={syncs}
                          flightIdx={form.idxs.flightIdx}
                          hotelIdx={form.idxs.hotelIdx}
                          passengers={form.passengers}
                          clients={form.clients}
                          preselectedUsers={preselectedUsers}
                          applyPreselectedUser={applyPreselectedUser}
                               />
                        break;
                    }
                  })()
                }
              </div>
            )
          })
        }
      </div>
      <div className="row text-right justify-content-end" style={{marginTop: '20px'}}>
        <h3 style={{marginBottom: 0}} className="col-sm-3 align-self-center">
          <strong>Total: <CurrencyConverter amount={amount} /></strong>
        </h3>
        <button disabled={!enableForm} className="btn btn-success col-sm-3">SUBMIT</button>
      </div>
    </div>
  )
}

export default observer(ViewDesktop);
