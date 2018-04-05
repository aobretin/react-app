import React from 'react';

import FormElement from 'FormElement';
import Datepicker from 'Datepicker';
import TypeaheadElement from 'TypeaheadElement';
import moment from 'moment';

import {range, initialFormatDate} from 'HelperMethods';

import Nouislider from 'react-nouislider';

import {observer} from "mobx-react";

const ROOM_RANGE = [1, 4];

const periodFields = props => {
  let template = null;

  if (props.hotel.weekendSearch.enable == 'true') {
    template = [
      <label key="t0" className="col">
        <FormElement value={props.hotel.weekendSearch.data.month} component="select" name="month" onChange={(target) => props.setWeekendData(target)} className="form-control we-sel" required>
          <option value="">Select month</option>
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
      <label key="t1" className="col">
        <FormElement value={props.hotel.weekendSearch.data.startDay} component="select" name="startDay" onChange={(target) => props.setWeekendData(target)} className="form-control we-sel" required>
          <option value="">Select day</option>
          <option value="0">{moment().startOf('week').format('dddd')}</option>
          <option value="1">{moment().startOf('week').add(1, 'days').format('dddd')}</option>
          <option value="2">{moment().startOf('week').add(2, 'days').format('dddd')}</option>
          <option value="3">{moment().startOf('week').add(3, 'days').format('dddd')}</option>
          <option value="4">{moment().startOf('week').add(4, 'days').format('dddd')}</option>
          <option value="5">{moment().startOf('week').add(5, 'days').format('dddd')}</option>
        </FormElement>
      </label>,
      <label key="t2" className="col">
        <FormElement value={props.hotel.weekendSearch.endDay} component="select" name="endDay" onChange={(target) => props.setWeekendData(target)} className="form-control we-sel" required>
          {
            props.hotel.weekendSearch.data.startDay.length
              ?
                range(parseInt(props.hotel.weekendSearch.data.startDay) + 1, 7).map((opt, idx) => {
                  return <option value={opt} key={idx}>{moment().startOf('week').add(opt, 'days').format('dddd')}</option>
                })
              :
              <option value="">Select day</option>
          }
        </FormElement>
      </label>
    ]
  } else {
    template = [
      <div key="t0" className="date-labels col-12 row extended">
        <div className="col-6">
          <label>Departure date</label>
        </div>
        <div className="col-6">
          <label>Return date</label>
        </div>
      </div>,
      <Datepicker
        key={`${props.locale}`}
        name="rangeDate"
        startDate={initialFormatDate(props.hotel.dIn)}
        endDate={initialFormatDate(props.hotel.dOut)}
        onDatesChange={({startDate, endDate}) => props.handleDateSelectRange({startDate, endDate})}
        numberOfMonths={2}
        validations={{checkEndDate: () => props.hotel.dOut ? true : false}}
      />
    ]
  }

  return template;
}

// MAIN RENDER
const ViewDesktop = props => {
  const rooms = props.hotel.r;
  const roomsNo = rooms.length;

  let occupancy = {
    adt: 0,
    chd: 0
  }

  rooms.forEach(room => {
    occupancy.adt += parseInt(room.adt);
    occupancy.chd += room.chd.age.length;
  });

	return (
    <div>
      <div className="row bordered-group">
        <div className="col-5">
          <label>Where</label>
          <TypeaheadElement
            name='hot'
            inputProps={{
              placeholder: 'Destination city',
              className: 'form-control',
              autoFocus: true
            }}
            getItemValue={item => item.text}
            onChange={(e, value) => props.handleUpdateInput(value)}
            validations={`checkId:${props.hotel.CityId}`}
            value={props.hotel.CityName}
            items={props.typeaheadOptions}
            onSelect={(value, res) => props.handleAutocomplete(res)}
            required
          />
        </div>
        <div className={`col-3 row no-gutters extended ${props.hotel.weekendSearch.enable ? 'we-dates' : ''}`}>
          {periodFields(props)}
        </div>
        {
          /* <div className="col-3">
          <label>Stars</label>
          <FormElement component="select" name="stars" onChange={props.handleSelectChange} value={props.hotel.stars} className="form-control">
          <option value="0+">All stars</option>
          <option value="1+">At least 1 star</option>
          <option value="2+">At least 2 star</option>
          <option value="3+">At least 3 star</option>
          <option value="4+">At least 4 star</option>
          <option value="5">5 stars</option>
          </FormElement>
          </div> */
        }
        <div className="col-4 relative noselect flex align-items-center justify-content-center">
          <div onClick={props.toggleHotelSettings} style={{cursor: 'pointer'}}>
            <label>
              Rooms & Occupancy
            </label><br/>
            <strong className="active-color">
              {`${roomsNo} ${roomsNo === 1 ? 'room / ' : 'rooms / '}`}
              {`${occupancy.adt} ${occupancy.adt === 1 ? 'adult ' : 'adults '}`}
              {occupancy.chd !== 0 && (`/ ${occupancy.chd} ${occupancy.chd === 1 ? 'child' : 'children '}`)}
            </strong>
          </div>

          <div className="drop-occupancy hotel-occupancy align-right" style={{display: props.showHotelSettings ? 'block' : 'none'}}>
            <div className="row slider no-gutters align-items-center">
              <div className="col-12 slider-label">
                <label>Add / Remove rooms</label>

              </div>
              <span className="col-1 text-center">
                {ROOM_RANGE[0]}
              </span>
              <div className="col-10">
                <Nouislider
                  range={{min: ROOM_RANGE[0], max: ROOM_RANGE[1]}}
                  start={[rooms.length]}
                  step={1}
                  onSlide={props.toggleRooms}
                  tooltips={[{to: val => val}]}
                />
              </div>
              <span className="col-1 text-center">
                {ROOM_RANGE[1]}
              </span>
            </div>

            {
              rooms.map((room, rIdx) => {
                return (
                  <div key={rIdx} className="row flight-occ no-gutters col-12">
                    <div className="col-4 row no-gutters justify-content-center text-white">
                      <div className="col align-self-center" style={{paddingTop: '20px'}}><em>Room #0{rIdx + 1}</em></div>
                    </div>

                    <div className="col-2 form-group">
                      <label>Adults</label>
                      <FormElement
                        name="adt"
                        component="select"
                        value={props.hotel.r[rIdx]['adt']}
                        onChange={e => props.hotel.r[rIdx]['adt'] = e.value}
                        className="form-control"
                      >
                        <option value="1">1</option>
                        <option value="2">2</option>
                        <option value="3">3</option>
                        <option value="4">4</option>
                      </FormElement>
                    </div>

                    <div className="col-2 form-group">
                      <label>Children</label>
                      <FormElement
                        name="adt"
                        component="select"
                        value={room.chd.age.length}
                        onChange={e => props.showAges(e, rIdx, room)}
                        className="form-control"
                      >
                        <option value="0">0</option>
                        <option value="1">1</option>
                        <option value="2">2</option>
                      </FormElement>
                    </div>

                    {
                      room.chd ?
                        room.chd.age.map((child, cIdx) => {
                          return (
                            <div key={cIdx} className="col-2 form-group">
                              <label>Child age</label>
                              <FormElement
                                component="select"
                                name={`age${cIdx}`}
                                value={props.hotel.r[rIdx]['chd']['age'][cIdx]}
                                className="form-control"
                                validations={{
                                  valid(values, value) {
                                    return value.length != '' ? true : 'Please select an age'
                                  }
                                }}
                                onChange={e => props.hotel.r[rIdx]['chd']['age'][cIdx] = e.value}
                                required
                              >
                                <option value="">age</option>
                                <option value="1">infant</option>
                                <option value="2">2</option>
                                <option value="3">3</option>
                                <option value="4">4</option>
                                <option value="5">5</option>
                                <option value="6">6</option>
                                <option value="7">7</option>
                                <option value="8">8</option>
                                <option value="9">9</option>
                                <option value="10">10</option>
                                <option value="11">11</option>
                                <option value="12">12</option>
                                <option value="13">13</option>
                                <option value="14">14</option>
                                <option value="15">15</option>
                                <option value="16">16</option>
                                <option value="17">17</option>
                              </FormElement>
                            </div>
                          )
                        })
                      : null
                    }
                  </div>
                )
              })
            }
          </div>
        </div>
      </div>
      <div className="below-group-options col-12 text-right">
        <label className="col-4 col-sm-3 align-self-right noselect" style={{cursor: 'pointer'}}>
          <input checked={props.hotel.weekendSearch.enable == 'true'} value={props.hotel.weekendSearch.enable} type="checkbox" onClick={props.toggleWeSearch} /> weekend search
        </label>
      </div>
    </div>
	)
}

export default observer(ViewDesktop);
