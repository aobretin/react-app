import React from 'react';
import {observer} from "mobx-react";
import {toJS} from "mobx";

import FormElement from 'FormElement';
import Datepicker from 'Datepicker';
import ThreeWayDateSelector from 'ThreeWayDateSelector';

import AirlinesJson from 'AirlinesJson';
import CountriesJson from 'CountriesJson';

import moment from 'moment';

const ViewDesktop = props => {
  const {
    idx: flightIdx,
    passengers,
    formatTaveller,
    formatPreselectedUser,
    watchFFValue,
    FFWatcher,
    applyPreselectedUser
  } = props;

  const preselectedUsers = toJS(props.preselectedUsers);

  const titles = ['Mr', 'Mrs', 'Miss'];

  return (
    <div className="card">
      <div className="card-header">
        <strong>Travellers</strong>
      </div>
      <ul className="list-group list-group-flush">
        {
          passengers.map((passenger, idx) => {
            let date = moment(passenger.dates.maxBd);

            return (
              <li key={idx} className="list-group-item" style={{padding: 0}}>
                <div className="card">
                  <div className="card-header row justify-content-between" style={{margin: 0}}>
                    <div className="col-4" style={{padding: 0}}>{formatTaveller(passenger)}</div>
                    <div className="col-4" style={{padding: 0}}>
                      {
                        Object.keys(preselectedUsers).length && !passenger.owner ?
                          <FormElement
                            className="form-control"
                            component='select'
                            name={`preselectedUsersSelect-${flightIdx}`}
                            onChange={e => applyPreselectedUser(e, flightIdx, passenger, 'flight')}
                            value={""}
                          >
                            <option value="">Choose user</option>
                            {
                              Object.keys(preselectedUsers).map((user, userIdx) => {
                                return <option key={userIdx} value={JSON.stringify(preselectedUsers[user])}>{preselectedUsers[user].label}</option>
                              })
                            }
                          </FormElement>
                        : null
                      }
                    </div>
                  </div>

                  <div className="card-body row">
                    <div className="form-group col-sm-3">
                      <label>Title</label>
                      <FormElement
                        className="form-control"
                        component='select'
                        value={titles[0]}
                        onChange={target => formatPreselectedUser(passenger, 'title', target.value, idx)}
                        name={`services[flight][${flightIdx}][passenger][${passenger.passCode}][${passenger.passIndex}][title]`}>
                        {
                          titles.map((title, index) => {
                            return <option key={index} value={title}>{title}</option>
                          })
                        }
                      </FormElement>
                    </div>

                    <div className="form-group col-sm-3">
                      <label>First name</label>
                      <FormElement
                        placeholder="First name"
                        className="form-control"
                        component='input'
                        onChange={target => formatPreselectedUser(passenger, 'firstName', target.value, idx)}
                        name={`services[flight][${flightIdx}][passenger][${passenger.passCode}][${passenger.passIndex}][firstName]`}
                        required
                      />
                    </div>

                    <div className="form-group col-sm-3">
                      <label>Last name</label>
                      <FormElement
                        placeholder="Last name"
                        className="form-control"
                        component='input'
                        onChange={target => formatPreselectedUser(passenger, 'lastName', target.value, idx)}
                        name={`services[flight][${flightIdx}][passenger][${passenger.passCode}][${passenger.passIndex}][lastName]`}
                        required
                      />
                    </div>

                    {
                      passenger.owner && ([
                        <div key={0} className="form-group col-sm-3">
                          <label>Email</label>
                          <FormElement
                            placeholder="Email"
                            className="form-control"
                            component='input'
                            onChange={target => formatPreselectedUser(passenger, 'email', target.value, idx)}
                            name={`services[flight][${flightIdx}][passenger][${passenger.passCode}][${passenger.passIndex}][email]`}
                            required
                          />
                        </div>,
                        <div key={1} className="form-group col-sm-3">
                          <label>Phone</label>
                          <FormElement
                            placeholder="Phone"
                            className="form-control"
                            component='input'
                            onChange={target => formatPreselectedUser(passenger, 'phone', target.value, idx)}
                            name={`services[flight][${flightIdx}][passenger][${passenger.passCode}][${passenger.passIndex}][phone]`}
                            required
                          />
                        </div>
                      ])
                    }

                    <div className="form-group col-sm-3">
                      <label>Date of Birth</label>
                      <ThreeWayDateSelector
                        name={`services[flight][${flightIdx}][passenger][${passenger.passCode}][${passenger.passIndex}][birthDate]`}
                        startDate={moment(passenger.dates.minBd)}
                        endDate={moment(passenger.dates.maxBd)}
                        customChangeEvent={date => formatPreselectedUser(passenger, 'birthDate', date, idx)}
                        // initialValue={moment().subtract('years', 20)}
                        required
                      />
                    </div>

                    {/* // <div className="form-group col-sm-3">
                      // <label>Date of Birth</label>
                      //   <Datepicker
                        //     range={false}
                        //     value={moment(passenger.dates.maxBd)}
                        //     numberOfMonths={2}
                        //     isOutsideRange={day => day.isBefore(moment(passenger.dates.minBd).add(1, 'days')) || day.isAfter(moment(passenger.dates.maxBd).add(1, 'days'))}
                        //     onDateChange={value => formatPreselectedUser(passenger, 'birthDate', value, idx)}
                        //     name={`services[flight][${flightIdx}][passenger][${passenger.passCode}][${passenger.passIndex}][birthDate]`}
                        //     className="form-control"
                        //     required
                        //   />
                    // </div> */}

                    {
                      passenger.secured && ([
                        <div key={0} className="form-group col-sm-3">
                          <label>Passport Number</label>
                          <FormElement
                            placeholder="Passport number"
                            className="form-control"
                            component='input'
                            onChange={target => formatPreselectedUser(passenger, 'idDocNumber', target.value, idx)}
                            name={`services[flight][${flightIdx}][passenger][${passenger.passCode}][${passenger.passIndex}][idDocNumber]`}
                            required
                          />
                        </div>,
                        <div key={1} className="form-group col-sm-3">
                          <label>Passport Expiration Date</label>
                          <Datepicker
                            range={false}
                            value={moment().subtract(25, "years")}
                            numberOfMonths={2}
                            isOutsideRange={day => day.isBefore(moment().subtract(120, "years")) || day.isAfter(moment().subtract(1, "day"))}
                            onDateChange={value => formatPreselectedUser(passenger, 'idDocExpiryDate', value, idx)}
                            name={`services[flight][${flightIdx}][passenger][${passenger.passCode}][${passenger.passIndex}][idDocExpiryDate]`}
                            className="form-control"
                            placeholder="Passport expiration date"
                            required
                          />
                        </div>,
                        <div key={2} className="form-group col-sm-3">
                          <label>Nationality</label>
                          <FormElement
                            className="form-control"
                            component='select'
                            onChange={target => formatPreselectedUser(passenger, 'idDocPaxNationality', target.value, idx)}
                            name={`services[flight][${flightIdx}][passenger][${passenger.passCode}][${passenger.passIndex}][idDocPaxNationality]`}
                            required
                          >
                            <option value="">Choose nationality</option>
                            {
                              CountriesJson.map((country, oidx) => {
                                return <option key={oidx} value={country.code}>{country.name}</option>
                              })
                            }
                          </FormElement>
                        </div>,
                        <div key={3} className="form-group col-sm-3">
                          <label>Issuing Country</label>
                          <FormElement
                            className="form-control"
                            component='select'
                            onChange={target => formatPreselectedUser(passenger, 'idDocPaxNationality', target.value, idx)}
                            name={`services[flight][${flightIdx}][passenger][${passenger.passCode}][${passenger.passIndex}][idDocPaxNationality]`}
                            required
                          >
                            <option value="">Choose nationality</option>
                            {
                              CountriesJson.map((country, oidx) => {
                                return <option key={oidx} value={country.code}>{country.name}</option>
                              })
                            }
                          </FormElement>
                        </div>
                      ])
                    }

                    <div className="form-group col-sm-3">
                      <label>Frequent airline name</label>
                      <FormElement
                        className="form-control"
                        component='select'
                        onChange={target => {
                          watchFFValue(target, `[${passenger.passCode}][${passenger.passIndex}][FqTvAirlineCode]`);
                          formatPreselectedUser(passenger, 'FqTvAirlineCode', target.value, idx)}
                        }
                        name={`services[flight][${flightIdx}][passenger][${passenger.passCode}][${passenger.passIndex}][FqTvAirlineCode]`}
                        required={FFWatcher.get([`[${passenger.passCode}][${passenger.passIndex}][FqTvNumber]`]) == true}
                      >
                        <option value="">Choose airline</option>
                        {
                          AirlinesJson.map((airline, oidx) => {
                            return <option key={oidx} value={airline.key}>{airline.value}</option>
                          })
                        }
                      </FormElement>
                    </div>

                    <div className="form-group col-sm-3">
                      <label>Frequent flyer number</label>
                      <FormElement
                        placeholder="frequent flyer no"
                        className="form-control"
                        component='input'
                        onChange={target => {
                          watchFFValue(target, `[${passenger.passCode}][${passenger.passIndex}][FqTvNumber]`);
                          formatPreselectedUser(passenger, 'FqTvNumber', target.value, idx)}
                        }
                        name={`services[flight][${flightIdx}][passenger][${passenger.passCode}][${passenger.passIndex}][FqTvNumber]`}
                        required={FFWatcher.get([`[${passenger.passCode}][${passenger.passIndex}][FqTvAirlineCode]`]) == true}
                      />
                    </div>
                  </div>
                </div>
              </li>
            )
          })
        }
      </ul>
    </div>
  )
}

export default observer(ViewDesktop);
