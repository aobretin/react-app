import React from 'react';
import {observer} from "mobx-react";

import CartDropdown from 'CartDropdown';
import CurrencySelector from 'CurrencySelector';

const ViewMobile = props => {
  return (
    <nav className="navbar navbar-inverse bg-inverse" style={{background: '#292b2c'}}>
      <a className="navbar-brand" href="#" style={{color: '#fff'}}>Header</a>

      <div className="row text-white">
        <CurrencySelector />
        <CartDropdown />
      </div>
    </nav>
  )
}

export default observer(ViewMobile);
