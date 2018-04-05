import React from 'react';
import FormElement from 'FormElement';
import Datepicker from 'Datepicker';
import TypeaheadElement from 'TypeaheadElement';
import moment from 'moment';
import {range, initialFormatDate} from 'HelperMethods';

import TranslateWrapper from 'TranslateWrapper';
import Counterpart from 'counterpart';

import {observer} from "mobx-react";

const renderRoutesByType = (props) => {
  let template = null;

  if (props.flight.type != 2) {
    template = [
      <div key="t0" className="col-3 withtypeahead">
        <label>
          From
        </label>
        <TypeaheadElement
          key={props.languagesData.locale}
          name='fot'
          inputProps={{
              placeholder: 'City or airport',
              className: 'form-control',
              autoFocus: true
          }}
          getItemValue={item => item.text}
          onChange={(e, value) => props.handleUpdateInput(value, 'o', 0)}
          validations={`checkId:${props.flight.r[0].oCityId}`}
          value={props.flight.r[0].oInputData}
          items={props.typeaheadOptions}
          onSelect={(value, res) => props.handleAutocomplete(res, 0, 'o')}
          required
        />
        {
          props.flight.r[0].oInputData.length || props.flight.r[0].dInputData.length
            ?
              <span onClick={() => props.switchDestination(props.flight.r, props.flight.type, 0)} className="icon-switch-on absolute"></span>
            :
            null
        }
      </div>,
      <div key="t1" className="col-3 withtypeahead">
        <label>
          To
        </label>
        <TypeaheadElement
          name='fdt'
          inputProps={{
              placeholder: 'City or airport',
              className: 'form-control'
          }}
          getItemValue={item => item.text}
          onChange={(e, value) => props.handleUpdateInput(value, 'd', 0)}
          validations={`checkId:${props.flight.r[0].dCityId}`}
          value={props.flight.r[0].dInputData}
          items={props.typeaheadOptions}
          onSelect={(value, res) => props.handleAutocomplete(res, 0, 'd')}
          required
        />
      </div>,
      <div key="t2" className={`col-3 row no-gutters extended ${props.flight.weekendSearch.enable ? 'we-dates' : ''}`}>
        {periodFields(props)}
      </div>
    ]
  } else {
    const routes = props.flight.r;

    template = <div className="col-9 extended multi-flight">
      {
        routes.map((route, idx) => {
          const dateIndex = idx === 0 ? 0 : idx - 1;

          return (
            <div key={idx} className="row">
              <div className="col-4">
                <label>
                  From
                </label>
                <TypeaheadElement
                  name={`fot${idx}`}
                  inputProps={{
                    placeholder: 'City or airport',
                    className: 'form-control',
                    autoFocus: idx === 0
                  }}
                  getItemValue={item => item.text}
                  onChange={(e, value) => props.handleUpdateInput(value, 'o', idx)}
                  validations={`checkId:${props.flight.r[idx].oCityId}`}
                  value={props.flight.r[idx].oInputData}
                  items={props.typeaheadOptions}
                  onSelect={(value, res) => props.handleAutocomplete(res, idx, 'o')}
                  required
                />
                {
                  props.flight.r[idx].oInputData.length || props.flight.r[idx].dInputData.length
                    ?
                      <span onClick={() => props.switchDestination(props.flight.r, props.flight.type, idx)} className="icon-switch-on absolute"></span>
                    :
                  null
                }
              </div>
              <div className="col-4">
                <label>
                  To
                </label>
                <TypeaheadElement
                  name={`fdt${idx}`}
                  inputProps={{
                    placeholder: 'City or airport',
                    className: 'form-control'
                  }}
                  getItemValue={item => item.text}
                  onChange={(e, value) => props.handleUpdateInput(value, 'd', idx)}
                  validations={`checkId:${props.flight.r[idx].dCityId}`}
                  value={props.flight.r[idx].dInputData}
                  items={props.typeaheadOptions}
                  onSelect={(value, res) => props.handleAutocomplete(res, idx, 'd')}
                  required
                />
              </div>
              <div className="col-4 row no-gutters extended">
                <div className="date-labels col-12 row extended">
                  <div className="col-6">
                    <label>Departure date</label>
                  </div>
                </div>
                <Datepicker
                  key={`${props.locale}${props.flight.type}${props.flight.r[dateIndex].date}`}
                  name="datepicker"
                  range={false}
                    anchorDirection={props.languagesData.activeLanguage.isRtl ? 'right' : 'left'}
                    isRTL={props.languagesData.activeLanguage.isRtl}
                  value={initialFormatDate(props.flight.r[idx].date)}
                  isOutsideRange={day => {
                    let dateToCompare = null;

                    if (idx !== 0) {
                      dateToCompare = moment(props.flight.r[dateIndex].date);
                    } else {
                      dateToCompare = moment().subtract('days', 1);
                    }

                    return day.isBefore(dateToCompare);
                  }}
                  onDateChange={date => {
                    props.handleDateSelectSingle(date, idx);
                    props.formatMinMultiDate(idx);
                  }}
                  numberOfMonths={1}
                  daySize={50}
                />
              </div>
            </div>
          )
        })
      }
      <div className="search-btn-drop col-5 col-xl-4 extended">
        <div className="search-btn-container row no-gutters">
          <button disabled={routes.length === 4} type="button" onClick={props.addMultiRoute} className="col btn btn-success">Add flight</button>
          <button disabled={routes.length === 2} type="button" onClick={props.remMultiRoute} className="col btn btn-danger">Remove flight</button>
        </div>
      </div>
    </div>
  }

  return template;
}

const periodFields = props => {
  let template = null;

  if (props.flight.weekendSearch.enable == 'true' && props.flight.type == 1) {
    template =
      [
        <label key="0" className="col">
          <FormElement value={props.flight.weekendSearch.data.month} component="select" name="month" onChange={(target) => props.setWeekendData(target)} className="form-control we-sel" required>
            <option value="">Month</option>
            <option value="1">{moment().add(1, 'months').format("MMM YYYY")}</option>
            <option value="2">{moment().add(2, 'months').format("MMM YYYY")}</option>
            <option value="3">{moment().add(3, 'months').format("MMM YYYY")}</option>
            <option value="4">{moment().add(4, 'months').format("MMM YYYY")}</option>
            <option value="5">{moment().add(5, 'months').format("MMM YYYY")}</option>
            <option value="6">{moment().add(6, 'months').format("MMM YYYY")}</option>
            <option value="7">{moment().add(7, 'months').format("MMM YYYY")}</option>
            <option value="8">{moment().add(8, 'months').format("MMM YYYY")}</option>
            <option value="9">{moment().add(9, 'months').format("MMM YYYY")}</option>
            <option value="10">{moment().add(10, 'months').format("MMM YYYY")}</option>
            <option value="11">{moment().add(11, 'months').format("MMM YYYY")}</option>
            <option value="12">{moment().add(12, 'months').format("MMM YYYY")}</option>
          </FormElement>
        </label>,
        <label key="1" className="col">
          <FormElement value={props.flight.weekendSearch.data.startDay} component="select" name="startDay" onChange={(target) => props.setWeekendData(target)} className="form-control we-sel" required>
            <option value="">Start day</option>
            <option value="0">{moment().startOf('week').format('ddd')}</option>
            <option value="1">{moment().startOf('week').add(1, 'days').format('ddd')}</option>
            <option value="2">{moment().startOf('week').add(2, 'days').format('ddd')}</option>
            <option value="3">{moment().startOf('week').add(3, 'days').format('ddd')}</option>
            <option value="4">{moment().startOf('week').add(4, 'days').format('ddd')}</option>
            <option value="5">{moment().startOf('week').add(5, 'days').format('ddd')}</option>
          </FormElement>
        </label>,
        <label key="2" className="col">
          <FormElement value={props.flight.weekendSearch.endDay} component="select" name="endDay" onChange={(target) => props.setWeekendData(target)} className="form-control we-sel" required>
            {
              props.flight.weekendSearch.data.startDay.length
                ?
                  range(parseInt(props.flight.weekendSearch.data.startDay) + 1, 7).map((opt, idx) => {
                    return <option value={opt} key={idx}>{moment().startOf('week').add(opt, 'days').format('ddd')}</option>
                  })
                :
                <option value="">End day</option>
            }
          </FormElement>
        </label>
      ]
  } else {
    template =
            props.flight.type == 1  // => DateRangePicker
              ?
                [
                  <div key="t0" className="date-labels col-12 row extended">
                    <div className="col-6">
                      <label>Departure date</label>
                    </div>
                    <div className="col-6">
                      <label>Return date</label>
                    </div>
                  </div>,
                  <Datepicker
                    key={`${props.locale}${props.flight.type}`}
                    name="rangeDate"
                    anchorDirection={props.languagesData.activeLanguage.isRtl ? 'right' : 'left'}
                    isRTL={props.languagesData.activeLanguage.isRtl}
                    startDate={initialFormatDate(props.flight.r[0].date)}
                    endDate={initialFormatDate(props.flight.r[1].date)}
                    onDatesChange={({startDate, endDate}) => props.handleDateSelectRange({startDate, endDate})}
                    numberOfMonths={2}
                    daySize={50}
                    validations={{
                      checkEndDate: () => {
                        if (props.flight.type != 1) return false;

                        return props.flight.r[1].date ? true : false;
                      }
                    }}
                  />
                ]
              :   // => SingleDatePicker

                [
                  <div key="t0" className="date-labels col-12 row extended">
                    <div className="col-6">
                      <label>Departure date</label>
                    </div>
                  </div>,
                  <Datepicker
                    key={`${props.locale}${props.flight.type}`}
                    name="datepicker"
                    range={false}
                    anchorDirection={props.languagesData.activeLanguage.isRtl ? 'right' : 'left'}
                    isRTL={props.languagesData.activeLanguage.isRtl}
                    value={initialFormatDate(props.flight.r[0].date)}
                    onDateChange={date => props.handleDateSelectSingle(date, 0)}
                    numberOfMonths={1}
                    daySize={50}
                  />
                ]
  }

  return template;
}

// MAIN RENDER
const ViewDesktop = (props) => {
  const travellersNo = parseInt(props.flight.adt) + parseInt(props.flight.chd) + parseInt(props.flight.inf);
  const selectedClass = props.classes.map(opt => opt.value == props.flight.class ? opt.text : null);

	return (
		<div>
      <div className="row flight-type align-items-center justify-content-center">
        <div className="connected-cols">
          <label className={`radio-inline centered ${props.flight.type == 1 ? 'checked' : null}`}>
            Round trip
            <input className="form-check-input" type="radio" name="type" value="1" checked={props.flight.type == 1} onChange={() => props.handleTypeChange(1)} />
          </label>
        </div>
        <div className="connected-cols">
          <label className={`radio-inline centered ${props.flight.type == 0 ? 'checked' : null}`}>
            One way
            <input className="form-check-input" type="radio" name="type" value="0" checked={props.flight.type == 0} onChange={() => props.handleTypeChange(0)} />
          </label>
        </div>
        <div className="connected-cols">
          <label className={`radio-inline centered ${props.flight.type == 2 ? 'checked' : null}`}>
            Multiple cities
            <input className="form-check-input" type="radio" name="type" value="2" checked={props.flight.type == 2} onChange={() => props.handleTypeChange(2)} />
          </label>
        </div>
      </div>

      <div className="row bordered-group">
  			{renderRoutesByType(props)}

  			<div className="col-3 relative noselect flex align-items-center justify-content-center">
          <div onClick={props.toggleFlightSettings} style={{cursor: 'pointer'}}>
            <label>
              Cabin class & Travelers
            </label><br/>
            <strong className="active-color">
              {`${travellersNo} ${travellersNo === 1 ? 'traveller ' : 'travellers '}`}
              <span className="d-none d-xl-inline-block">/ {selectedClass}</span>
            </strong>
          </div>

          <div className="drop-occupancy align-right" style={{display: props.showFlightSettings ? 'block' : 'none'}}>
            <div className="col-12">
              <label>Class</label>
              <FormElement component="select" name="class" onChange={props.handleSelectChange} value={props.flight.class} className="form-control">
                {
                  props.classes.map((opt, idx) => {
                    return (
                      <option key={idx} value={opt.value}>{opt.text}</option>
                    )
                  })
                }
              </FormElement>
            </div>

            <div className="row flight-occ no-gutters col-12">
              <div className="col-3 row no-gutters justify-content-center text-white">
                <div className="col align-self-center" style={{paddingTop: '20px'}}><em>Travellers</em></div>
              </div>

              <div className="col-3 form-group">
                <label>Adults</label>
                <FormElement component="select" name="adt" onChange={props.handleSelectChange} value={props.flight.adt} className="form-control">
                  <option value={1}>1</option>
                  <option value={2}>2</option>
                  <option value={3}>3</option>
                  <option value={4}>4</option>
                  <option value={5}>5</option>
                </FormElement>
              </div>

              <div className="col-3 form-group">
                <label>Children</label>
                <FormElement component="select" name="chd" onChange={props.handleSelectChange} value={props.flight.chd} className="form-control">
                  <option value={0}>Children</option>
                  <option value={1}>1</option>
                  <option value={2}>2</option>
                  <option value={3}>3</option>
                  <option value={4}>4</option>
                  <option value={5}>5</option>
                </FormElement>
              </div>

              <div className="col-3 form-group">
                <label>Infants</label>
                <FormElement component="select" name="inf" onChange={props.handleSelectChange} value={props.flight.inf} className="form-control">
                  <option value={0}>Infants</option>
                  <option value={1}>1</option>
                  <option value={2}>2</option>
                  <option value={3}>3</option>
                  <option value={4}>4</option>
                  <option value={5}>5</option>
                </FormElement>
              </div>
            </div>

          </div>

        </div>
			</div>


      {
        props.flight.type == 1  && (
          <div className="below-group-options col-12 text-right">
            <label className="col-4 col-sm-3 align-self-right noselect" style={{cursor: 'pointer'}}>
              <input checked={props.flight.weekendSearch.enable == 'true'} value={props.flight.weekendSearch.enable} type="checkbox" onClick={props.toggleWeSearch} /> weekend search
            </label>
          </div>
        )
      }

		</div>
	)
}

export default observer(ViewDesktop);
