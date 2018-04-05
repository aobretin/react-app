import React from 'react';

import {observer} from "mobx-react";
import {toJS} from "mobx";

import HotelList from 'HotelList';
import FlightList from 'FlightList';
import LocalCart from './LocalCart/LocalCart';

import Pagination from 'Pagination';

const ViewDesktop = props => {
		const {
			flightShown,
			localCart,
			selectNewService,
			cartStates,
			services: {
				flight_hotel: {
					f0: flight,
					h1: hotel
				}
			},
			serviceSearchData: {
				f0: flightSearch,
				h1: hotelSearch
			},
			toggleServiceInView,
			selectFlight,
			selectRoomWithHotel,
			changeCartState
		} = props;

		const {
      [Object.keys(localCart)[0]]: flightSelected,
      [Object.keys(localCart)[1]]: hotelSelected
    } = localCart;

		return (
			<div className="row">
        <LocalCart
					localCart={localCart}
					cartStates={cartStates}
					selectNewService={selectNewService}
					flightShown={flightShown}
					toggleServiceInView={toggleServiceInView}
					changeCartState={changeCartState}
				/>
				<div className="col">
					<div className="tab-content">
						<div className={`tab-pane ${!flightShown ? 'active' : ''}`}>
							<HotelList
								SID={hotel.SID} index={0}
								serviceSearchData={hotelSearch}
								selectedId={hotelSelected ? hotelSelected.data : undefined}
								selectRoomWithHotel={(pax, props) => selectRoomWithHotel(pax, props, hotel.SID, hotelSearch)}
							/>
						</div>
						<div className={`tab-pane ${flightShown ? 'active' : ''}`}>
							<FlightList
								SID={flight.SID}
								serviceSearchData={flightSearch}
								isFlightAndHotel={true}
								index={0}
								selectedId={flightSelected ? flightSelected.data : undefined}
								selectFlight={(flightObj, SID = flight.SID, search = flightSearch) => selectFlight(flightObj, SID, search)} // we send the params from the method
							/>
						</div>
					</div>
				</div>
			</div>
		)
}

export default observer(ViewDesktop);
