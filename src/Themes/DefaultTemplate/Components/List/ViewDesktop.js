import React from 'react';
import Search from 'Search';

import HotelList from 'HotelList';
import FlightList from 'FlightList';
import Flight_Hotel from 'Flight_Hotel';

import {observer} from "mobx-react";
import {toJS} from "mobx";

const ViewDesktop = props => {
  const {
    resultReady,
    searchData,
    type,
    services,
    cartData,
    tabShown,
    changeActiveServiceTab
  } = props;

  const {
    items: {
      [type]: {
        services: availableServices
      }
    }
  } = cartData;

  return (
    <div>
      {
          resultReady
            ?
          <div className="container-fluid">
            <Search searchData={searchData} toggleForm={true} />
            {
              (() => {
                switch (type) {
                  case 'flight':
                    if (services[type].size == 1) {
                      return (
                        <FlightList
                          SID={services[type].get('f0').SID}
                          serviceSearchData={searchData['f0']}
                          index={0}
                          selectedId={
                            availableServices[`flight-${services[type].get("f0").SID}`]
                              ?
                            availableServices[`flight-${services[type].get("f0").SID}`].data
                              :
                            undefined
                          }
                        />
                      )
                    } else {
                      return (
                        <div>
                          <nav className="nav nav-pills nav-justified">
                            {
                              services[type].keys().map((service, idx) => {
                                return <a key={idx} onClick={() => changeActiveServiceTab(idx)} className={`nav-item nav-link ${tabShown == idx ? 'active' : ''}`} href="javascript:;">{`Flight ${idx + 1}`}</a>
                              })
                            }
                          </nav>
                          <div className="tab-content">
                            {
                              services[type].keys().map((service, idx) => {
                                return (
                                  <div key={idx} className={`tab-pane ${tabShown == idx ? 'active' : ''}`}>
                                    <FlightList
                                      SID={services[type].get(service).SID}
                                      serviceSearchData={searchData[service]}
                                      index={0}
                                      selectedId={
                                        availableServices[`flight-${services[type].get(service).SID}`]
                                          ?
                                        availableServices[`flight-${services[type].get(service).SID}`].data
                                          :
                                        undefined
                                      }
                                    />
                                  </div>
                                )
                              })
                            }
                          </div>
                        </div>
                      )
                    }
                    break;
                  case 'hotel':
                    if (services[type].size == 1) {
                      return (
                        <HotelList
                          SID={services[type].get('h0').SID} index={0}
                          serviceSearchData={searchData['h0']}
                          selectedId={
                            availableServices[`hotel-${services[type].get("h0").SID}`]
                              ?
                            availableServices[`hotel-${services[type].get("h0").SID}`].data
                            	:
                            undefined
                          }
                        />
                      )
                    } else {
                      return (
                        <div>
                          <nav className="nav nav-pills nav-justified">
                            {
                              services[type].keys().map((service, idx) => {
                                return <a key={idx} onClick={() => changeActiveServiceTab(idx)} className={`nav-item nav-link ${tabShown == idx ? 'active' : ''}`} href="javascript:;">{`Hotel ${idx + 1}`}</a>
                              })
                            }
                          </nav>
                          <div className="tab-content">
                            {
                              services[type].keys().map((service, idx) => {
                                return (
                                  <div key={idx} className={`tab-pane ${tabShown == idx ? 'active' : ''}`}>
                                    <HotelList
                                      SID={services[type].get(service).SID}
                                      serviceSearchData={searchData[service]}
                                      index={0}
                                      selectedId={
                                        availableServices[`hotel-${services[type].get(service).SID}`]
                                          ?
                                        availableServices[`hotel-${services[type].get(service).SID}`].data
                                          :
                                        undefined
                                      }
                                    />
                                  </div>
                                )
                              })
                            }
                          </div>
                        </div>
                      )
                    }
                    break;
                  case 'flight_hotel':
                    return (
                      <Flight_Hotel
                        serviceSearchData={searchData}
                        services={toJS(services)}
                      />
                    )
                    break;
                }
              })()
            }
          </div>
            :
            <div className="text-center">
              <span className="">Loading services...</span>
            </div>
      }
    </div>
  )
}

export default observer(ViewDesktop);
