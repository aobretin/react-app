import React from 'react';
import FormElement from 'FormElement';
import Datepicker from 'Datepicker';
import TypeaheadElement from 'TypeaheadElement';
import moment from 'moment';
import {initialFormatDate} from 'HelperMethods';

import Nouislider from 'react-nouislider';

import {observer} from "mobx-react";

const ROOM_RANGE = [1, 4];

// MAIN RENDER
const ViewDesktop = (props) => {
  const {
    flight_hotel: {
      f: flight,
      h: hotel
    },
    locale,
    languagesData,
    typeaheadOptions,
    handleDateSelectRange,
    handleAutocomplete,
    handleUpdateInput,
    handleSelectChange,
    toggleRooms,
    showAges,
    populateFlightOccupation,
    toggleHotelSettings,
    showHotelSettings,
    switchDestination
  } = props;

  const rooms = hotel.r;

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
        <div className="col-3">
          <label>Origin</label>
          <TypeaheadElement
            name='fot'
            inputProps={{
              placeholder: 'City or airport',
              className: 'form-control',
              autoFocus: true
            }}
            getItemValue={item => item.text}
            onChange={(e, value) => handleUpdateInput(value, 'o', 0)}
            validations={`checkId:${flight.r[0].oCityId}`}
            value={flight.r[0].oInputData}
            items={typeaheadOptions}
            onSelect={(value, res) => handleAutocomplete(res, 0, 'o')}
            required
          />
          {
            flight.r[0].oInputData.length || flight.r[0].dInputData.length
              ?
                <span onClick={() => switchDestination(flight.r)} className="icon-switch-on absolute"></span>
              :
              null
          }
        </div>
        <div className="col-3">
          <label>Destination</label>
          <TypeaheadElement
            name='fdt'
            inputProps={{
              placeholder: 'City or airport',
              className: 'form-control'
            }}
            getItemValue={item => item.text}
            onChange={(e, value) => handleUpdateInput(value, 'd', 0)}
            validations={`checkId:${flight.r[0].dCityId}`}
            value={flight.r[0].dInputData}
            items={typeaheadOptions}
            onSelect={(value, res) => handleAutocomplete(res, 0, 'd')}
            required
          />
        </div>
        <div className="col-3 row no-gutters extended">
          <div key="t0" className="date-labels col-12 row extended">
            <div className="col-6">
              <label>Departure date</label>
            </div>
            <div className="col-6">
              <label>Return date</label>
            </div>
          </div>
          <Datepicker
            key={`${locale}`}
            name="rangeDate"
            isRTL={languagesData.activeLanguage.isRtl}
            startDate={initialFormatDate(flight.r[0].date)}
            endDate={initialFormatDate(flight.r[1].date)}
            onDatesChange={({startDate, endDate}) => props.handleDateSelectRange({startDate, endDate})}
            numberOfMonths={2}
            daySize={50}
            validations={{
              checkEndDate: () => {
                if (flight.type != 1) return false;

                return flight.r[1].date ? true : false;
              }
            }}
          />
        </div>
        <div className="col-4 relative noselect flex align-items-center justify-content-center">
          <div onClick={toggleHotelSettings} style={{cursor: 'pointer'}}>
            <label>
              Rooms & Occupancy
            </label><br/>
            <strong className="active-color">
              {`${roomsNo} ${roomsNo === 1 ? 'room / ' : 'rooms / '}`}
              {`${occupancy.adt} ${occupancy.adt === 1 ? 'adult ' : 'adults '}`}
              {occupancy.chd !== 0 && (`/ ${occupancy.chd} ${occupancy.chd === 1 ? 'child' : 'children '}`)}
            </strong>
          </div>

          <div className="drop-occupancy hotel-occupancy align-right" style={{display: showHotelSettings ? 'block' : 'none'}}>
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
                  start={rooms.length}
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
                        value={hotel.r[rIdx]['adt']}
                        onChange={e => hotel.r[rIdx]['adt'] = e.value}
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
                                value={hotel.r[rIdx]['chd']['age'][cIdx]}
                                className="form-control"
                                validations={{
                                  valid(values, value) {
                                    return value.length != '' ? true : 'Please select an age'
                                  }
                                }}
                                onChange={e => hotel.r[rIdx]['chd']['age'][cIdx] = e.value}
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
		</div>
	)
}

export default observer(ViewDesktop);
