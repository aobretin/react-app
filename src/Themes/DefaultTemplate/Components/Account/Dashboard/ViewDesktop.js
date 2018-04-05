import React from 'react';
import {observer} from "mobx-react";

// MAIN RENDER
const ViewDesktop = props => {
  const {
    currenServiceIdx,
    changeCurrenServiceIdx,
    goTo,
    user: {
      getDashboardServices
    }
  } = props;

  const services = getDashboardServices();

  return (
    <div>
      <nav className="nav nav-pills nav-justified">
        {
          services.map((service, idx) => {
            return <a key={idx} onClick={() => changeCurrenServiceIdx(idx)} className={`nav-item nav-link ${currenServiceIdx == idx ? 'active' : ''}`} href="javascript:;">{service.name}</a>
          })
        }
      </nav>
      <div className="tab-content">
        {
          services.map((service, idx) => {
            return (
              currenServiceIdx == idx && (
                <div key={idx} className='tab-pane active'>
                  <service.component />
                </div>
              )
            )
          })
        }
      </div>
    </div>
  )
}

export default observer(ViewDesktop);
