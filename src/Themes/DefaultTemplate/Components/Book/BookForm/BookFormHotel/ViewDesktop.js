import React from 'react';
import {observer} from "mobx-react";
import {toJS} from "mobx";

import FormElement from 'FormElement';
import Datepicker from 'Datepicker';

import CountriesJson from 'CountriesJson';

import moment from 'moment';

const ViewDesktop = props => {
  const {
    idx: hotelIdx,
    clients,
    formatClient,
    formatPreselectedUser,
    applyPreselectedUser
  } = props;

  const preselectedUsers = toJS(props.preselectedUsers);

  const titles = ['Mr', 'Mrs', 'Miss'];

  return (
    <div>
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
                          onChange={target => formatPreselectedUser(client, 'title', target.value, idx)}
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
                          onChange={target => formatPreselectedUser(client, 'firstName', target.value, idx)}
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
                          onChange={target => formatPreselectedUser(client, 'lastName', target.value, idx)}
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
                              onChange={target => formatPreselectedUser(client, 'email', target.value, idx)}
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
                              onChange={target => formatPreselectedUser(client, 'phone', target.value, idx)}
                              name={`services[hotel][${hotelIdx}][room][${client.roomIndex}][${client.clientCategory}][${client.clientIndex}][phone]`}
                              required
                            />
                          </div>
                        ])
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
                              onDateChange={value => formatPreselectedUser(client, 'birthdate', value, idx)}
                              name={`services[hotel][${hotelIdx}][room][${client.roomIndex}][${client.clientCategory}][${client.clientIndex}][birthdate]`}
                              className="form-control"
                              required
                            />
                          </div>
                        )
                      }

                    </div>
                  </div>
                </li>
              )
            })
          }
        </ul>
      </div>
    </div>
  )
}

export default observer(ViewDesktop);
