import React from 'react';
import {observer} from "mobx-react";

import FormElement from 'FormElement';
import Datepicker from 'Datepicker';

import CountriesJson from 'CountriesJson';

import moment from 'moment';

const ViewDesktop = props => {
  const {
    resultsReady,
    fields,
    canSubmit
  } = props;

  return (
    resultsReady ?
    <div className="card">
      <ul className="list-group list-group-flush">
        {
          Object.keys(fields).map((type, idx) => {
            return (
              <li key={idx} className="list-group-item">
                <div className="card">
                  <div className="card-header">
                    {type.toUpperCase()}
                  </div>
                  <div className="card-body row">
                    {
                      fields[type].map((el, fIdx) => {
                        return (
                          <div key={fIdx} className="form-group col-sm-3">
                            <label>{el.Name}</label>
                            {
                              (() => {
                                switch(el.Type) {
                                  case 'text':
                                    return <FormElement
                                      placeholder={el.Name}
                                      component='input'
                                      type="text"
                                      className="form-control"
                                      name={el.Field}
                                      value={el.Value}
                                      // required={el.Required == '1' ? true : null}
                                           />
                                    break;
                                  case 'date':
                                  case 'Exp20':
                                  case 'Iss20':
                                  case 'Iss5':
                                  case 'Exp5':
                                    return <Datepicker
                                      name={el.Field}
                                      range={false}
                                      isOutsideRange={day => day.isBefore(moment().subtract(120, "years")) || day.isAfter(moment().subtract(1, "day"))}
                                      value={el.Value.length ? moment(el.Value): moment()}
                                      onDateChange={date => () => {}}
                                      numberOfMonths={1}
                                           />
                                    break;
                                  case 'select':
                                    if (el.Field === 'Title') {
                                      return <FormElement component="select" name={el.Field} value={el.Value} className="form-control">
                                        <option value="Mr">Mr.</option>
                                        <option value="Mrs">Mrs.</option>
                                        <option value="Miss">Miss</option>
                                      </FormElement>
                                    } else {
                                      return <FormElement component="select" name={el.Field} value={el.Value} className="form-control">
                                        {
                                          CountriesJson.map((country, oIdx) => {
                                            return <option key={oIdx} value={country.code}>{country.name}</option>
                                          })
                                        }
                                      </FormElement>
                                    }
                                    break;
                                }
                              })()
                            }
                          </div>
                        )

                      })
                    }
                  </div>
                </div>
              </li>
            )
          })
        }
      </ul>
      <button disabled={!canSubmit} className="btn btn-success">SAVE</button>
    </div>
    :
    <h1 className="card-title text-center">Loading data please wait...</h1>
  )
}

export default observer(ViewDesktop);
