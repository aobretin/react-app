import React from 'react';
import {observer} from "mobx-react";
import {toJS} from "mobx";

import FormElement from 'FormElement';
import Datepicker from 'Datepicker';

import AirlinesJson from 'AirlinesJson';
import CountriesJson from 'CountriesJson';

import moment from 'moment';

const ViewDesktop = props => {
  const {
    hotelIdx,
    flightIdx,
    clients,
    passengers,
    formatClient,
    formatPreselectedUser,
    watchFFValue,
    FFWatcher,
    handleSpecialCase,
    handleSpecialCaseDatepicker,
    applyPreselectedUser
  } = props;

  const preselectedUsers = toJS(props.preselectedUsers);

  const titles = ['Mr', 'Mrs', 'Miss'];

  return (
    <div className="card">
      <div className="card-header">
        <strong>Clients</strong>
      </div>
      <ul className="list-group list-group-flush">
        {
          clients.map((client, idx) => {
            return (
              <li key={idx} className="list-group-item" style={{padding: 0}}>
                <div className="card">
                  <div className="card-header row justify-content-between" style={{margin: 0}}>
                    <div className="col-4" style={{padding: 0}}>{formatClient(client)}</div>
                    <div className="col-4" style={{padding: 0}}>
                      {
                        Object.keys(preselectedUsers).length && !client.owner ?
                          <FormElement
                            className="form-control"
                            component='select'
                            name={`preselectedUsersSelect-${hotelIdx}`}
                            onChange={e => applyPreselectedUser(e, hotelIdx, client, 'hotel')}
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
                        onChange={target => {
                          handleSpecialCase(target, `services[flight][${flightIdx}][passenger][${passengers[idx].passCode}][${passengers[idx].passIndex}][title]`);
                          formatPreselectedUser(client, 'title', target.value, idx);
                        }}
                        name={`services[hotel][${hotelIdx}][room][${client.roomIndex}][${client.clientCategory}][${client.clientIndex}][title]`}>
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
                        onChange={target => {
                          handleSpecialCase(target, `services[flight][${flightIdx}][passenger][${passengers[idx].passCode}][${passengers[idx].passIndex}][firstName]`);
                          formatPreselectedUser(client, 'firstName', target.value, idx);
                        }}
                        name={`services[hotel][${hotelIdx}][room][${client.roomIndex}][${client.clientCategory}][${client.clientIndex}][firstName]`}
                        required
                      />
                    </div>

                    <div className="form-group col-sm-3">
                      <label>Last name</label>
                      <FormElement
                        placeholder="Last name"
                        className="form-control"
                        component='input'
                        onChange={target => {
                          handleSpecialCase(target, `services[flight][${flightIdx}][passenger][${passengers[idx].passCode}][${passengers[idx].passIndex}][lastName]`);
                          formatPreselectedUser(client, 'lastName', target.value, idx);
                        }}
                        name={`services[hotel][${hotelIdx}][room][${client.roomIndex}][${client.clientCategory}][${client.clientIndex}][lastName]`}
                        required
                      />
                    </div>

                    {
                      client.owner && ([
                        <div key={0} className="form-group col-sm-3">
                          <label>Email</label>
                          <FormElement
                            placeholder="Email"
                            className="form-control"
                            component='input'
                            onChange={target => {
                              handleSpecialCase(target, `services[flight][${flightIdx}][passenger][${passengers[idx].passCode}][${passengers[idx].passIndex}][email]`);
                              formatPreselectedUser(client, 'email', target.value, idx);
                            }}
                            name={`services[hotel][${hotelIdx}][room][${client.roomIndex}][${client.clientCategory}][${client.clientIndex}][email]`}
                            required
                          />
                        </div>,
                        <div key={1} className="form-group col-sm-3">
                          <label>Phone</label>
                          <FormElement
                            placeholder="Phone"
                            className="form-control"
                            component='input'
                            onChange={target => {
                              handleSpecialCase(target, `services[flight][${flightIdx}][passenger][${passengers[idx].passCode}][${passengers[idx].passIndex}][phone]`);
                              formatPreselectedUser(client, 'phone', target.value, idx);
                            }}
                            name={`services[hotel][${hotelIdx}][room][${client.roomIndex}][${client.clientCategory}][${client.clientIndex}][phone]`}
                            required
                          />
                        </div>
                      ])
                    }

                    {
                      client.clientType === 'Adult' && (
                        <div className="form-group col-sm-3">
                          <label>Date of Birth</label>
                          <Datepicker
                            range={false}
                            value={moment(passengers[idx].dates.maxBd)}
                            numberOfMonths={2}
                            isOutsideRange={day => day.isBefore(moment(passengers[idx].dates.minBd).add(1, 'days')) || day.isAfter(moment(passengers[idx].dates.maxBd).add(1, 'days'))}
                            onDateChange={value => formatPreselectedUser(passengers[idx], 'birthDate', value, idx)}
                            name={`services[flight][${flightIdx}][passenger][${passengers[idx].passCode}][${passengers[idx].passIndex}][birthDate]`}
                            className="form-control"
                            required
                          />
                        </div>
                      )
                    }

                    {
                      client.clientType === 'Child' && (
                        <div className="form-group col-sm-3">
                          <label>Date of Birth</label>
                          <Datepicker
                            range={false}
                            value={moment(client.dates.minBd)}
                            numberOfMonths={2}
                            isOutsideRange={day => day.isBefore(moment(client.dates.minBd).add(1, 'days')) || day.isAfter(moment(client.dates.maxBd).add(1, 'days'))}
                            onDateChange={value => {
                              handleSpecialCaseDatepicker(value, `services[flight][${flightIdx}][passenger][${passengers[idx].passCode}][${passengers[idx].passIndex}][birthDate]`);
                              formatPreselectedUser(client, 'birthdate', value, idx);
                            }}
                            name={`services[hotel][${hotelIdx}][room][${client.roomIndex}][${client.clientCategory}][${client.clientIndex}][birthdate]`}
                            className="form-control"
                            required
                          />
                        </div>
                      )
                    }

                    {
                      passengers[idx].secured && ([
                        <div key={0} className="form-group col-sm-3">
                          <label>Passport Number</label>
                          <FormElement
                            placeholder="Passport number"
                            className="form-control"
                            component='input'
                            onChange={target => formatPreselectedUser(passengers[idx], 'idDocNumber', target.value, idx)}
                            name={`services[flight][${flightIdx}][passenger][${passengers[idx].passCode}][${passengers[idx].passIndex}][idDocNumber]`}
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
                            onDateChange={value => formatPreselectedUser(passengers[idx], 'idDocExpiryDate', value, idx)}
                            name={`services[flight][${flightIdx}][passenger][${passengers[idx].passCode}][${passengers[idx].passIndex}][idDocExpiryDate]`}
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
                            onChange={target => formatPreselectedUser(passengers[idx], 'idDocPaxNationality', target.value, idx)}
                            name={`services[flight][${flightIdx}][passenger][${passengers[idx].passCode}][${passengers[idx].passIndex}][idDocPaxNationality]`}
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
                            onChange={target => formatPreselectedUser(passengers[idx], 'idDocPaxNationality', target.value, idx)}
                            name={`services[flight][${flightIdx}][passenger][${passengers[idx].passCode}][${passengers[idx].passIndex}][idDocPaxNationality]`}
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
                          watchFFValue(target, `[${passengers[idx].passCode}][${passengers[idx].passIndex}][FqTvAirlineCode]`);
                          formatPreselectedUser(passengers[idx], 'FqTvAirlineCode', target.value, idx)}
                        }
                        name={`services[flight][${flightIdx}][passenger][${passengers[idx].passCode}][${passengers[idx].passIndex}][FqTvAirlineCode]`}
                        required={FFWatcher.get([`[${passengers[idx].passCode}][${passengers[idx].passIndex}][FqTvNumber]`]) == true}
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
                          watchFFValue(target, `[${passengers[idx].passCode}][${passengers[idx].passIndex}][FqTvNumber]`);
                          formatPreselectedUser(passengers[idx], 'FqTvNumber', target.value, idx)}
                        }
                        name={`services[flight][${flightIdx}][passenger][${passengers[idx].passCode}][${passengers[idx].passIndex}][FqTvNumber]`}
                        required={FFWatcher.get([`[${passengers[idx].passCode}][${passengers[idx].passIndex}][FqTvAirlineCode]`]) == true}
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
