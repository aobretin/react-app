import React from 'react';

import {observer} from "mobx-react";
import {toJS} from "mobx";

const changeCartBtnText = (statuses, status) => {
  let text = '';

  switch (status) {
    case statuses.CAN_ADD:
      text = 'Add to cart';
      break;
    case statuses.ADD_HOTEL:
      text = 'Please select a hotel';
      break;
    case statuses.CANNOT_ADD:
      text = 'Cannot add to cart at this moment';
      break;
    case statuses.ALREADY_ADDED:
      text = 'Already added to cart';
      break;
  }

  return text;
}

// MAIN RENDER
const ViewDesktop = props => {
    const {
      localCart,
      flightShown,
      toggleServiceInView,
      selectNewService,
      cartStates: {
        state,
        states
      },
      changeCartState
    } = props;

    const {
      [Object.keys(localCart)[0]]: flight,
      [Object.keys(localCart)[1]]: hotel
    } = localCart;

		return (
			<div className="col-sm-12" style={{marginBottom: '30px'}}>
        <div className="card">
          <div className="card-body">
            <h4 className="card-title">Your flight & hotel:</h4>
          </div>
          <ul className="list-group list-group-flush">
            {
              Object.keys(localCart).length == 0
                ?
                  <li className="list-group-item">Loading preselected flight</li>
                :
                <div>
                  {
                    flight && (
                      <li className="list-group-item">
                        {/* flight details to be added here */}
                        Flight - {flight.data.flight.Price}
                      </li>
                    )
                  }
                  {
                    hotel && (
                      <li className="list-group-item">
                        {/* hotel details to be added here */}
                        Hotel - {hotel.data.Price}
                      </li>
                    )
                  }
                </div>
            }
          </ul>
          <div className="card-body row justify-content-between">
            {flight && (<button onClick={toggleServiceInView} className="btn btn-default col-auto col-3">{flightShown ? 'Change hotel' : 'Change flight'}</button>)}
            <button
              disabled={state == states.CANNOT_ADD || state == states.ALREADY_ADDED || state == states.ADD_HOTEL ? true : null}
              onClick={() => selectNewService(localCart, () => changeCartState(states.ALREADY_ADDED))}
              className="btn btn-default col-3"
            >
              {changeCartBtnText(states, state)}
            </button>
          </div>
        </div>
			</div>
		)
}

export default observer(ViewDesktop);
