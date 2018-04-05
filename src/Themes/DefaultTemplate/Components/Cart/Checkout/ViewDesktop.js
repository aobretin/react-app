import React from 'react';
import {observer} from "mobx-react";
import CurrencyConverter from 'CurrencyConverter';
import {Redirect} from 'react-router-dom';

const renderFlight = (flight, serviceKey, sIdx, serviceType, props) => {
	const {toggleDetails, detailedServices, cartData, redirectTo} = props;

	const {
		methods: {
			remakeSearch,
			removeCartItem
		}
	} = cartData;

	const flightDetails = {
		Routes: flight.Routes,
		FareRules: [],
		FareDetails: {
			PaxFare: []
		}
	}

	console.log(props);

	return 	<li key={sIdx} className="list-group-item">
		<div className="row">
			<h5 className="card-title col-auto mr-auto">Flight &ndash; <CurrencyConverter amount={flight.PriceDetail.Amount} /></h5>
			{
				serviceType != 'flight_hotel' && (
					<div className="card-title col-auto">
						<a href="javascript:;" style={{color: 'red'}} className="col" onClick={() => removeCartItem(serviceType, serviceKey)}> Remove flight </a>
						<a href="javascript:;" className="col" onClick={() => remakeSearch(
							serviceKey,
							false,
							data => redirectTo(`/list/${data.shortHandType}=${data.SID}/${data.type}`)
						)}> Change flight </a>
						<a href="javascript:;" className="col" onClick={() => toggleDetails(serviceKey)}>{!detailedServices.get(serviceKey) ? ' Show details ' : ' Hide details '}</a>
					</div>
				)
			}
		</div>
		<div className="card-body">
			{ detailedServices.get(serviceKey) ? "FLIGHT DETAILS" : null }
		</div>
	</li>
}

const renderHotel = (hotel, serviceKey, sIdx, serviceType, props) => {
	const {toggleDetails, detailedServices, cartData, redirectTo} = props;

	const {
		methods: {
			remakeSearch,
			removeCartItem
		}
	} = cartData;

	const hotelDetails = {
		Stars: hotel.hotel.Stars,
	    Address: hotel.hotel.Address,
	    CityName: "",
	    Image: hotel.hotel.Image,
	    Name: hotel.hotel.Name
	}

	const details = {
		AccommodationPeriod: {
	      StartDate: "no chkin",
	      EndDate: "no chkout"
	    },
	    PackageRooms: {
	    	PackageRoom: []
	    },
	    CancellationPolicy: {
	    	Policy: []
	    }
	}

	return  <li key={sIdx} className="list-group-item">
		<div className="row">
			<h5 className="card-title col-auto mr-auto">Hotel &ndash; {hotel.hotel.Name} - {hotel.hotel.Stars} stars - <CurrencyConverter amount={hotel.room.roomData.Price.Amount} /></h5>
			{
				serviceType != 'flight_hotel' && (
					<div className="card-title col-auto">
						<a href="javascript:;" style={{color: 'red'}} className="col" onClick={() => removeCartItem(serviceType, serviceKey)}> Remove hotel </a>
						<a href="javascript:;" className="col" onClick={() => remakeSearch(
							serviceKey,
							false,
							data => redirectTo(`/list/${data.shortHandType}=${data.SID}/${data.type}`)
						)}> Change hotel </a>
						<a href="javascript:;" className="col" onClick={() => toggleDetails(serviceKey)}>{!detailedServices.get(serviceKey) ? ' Show details ' : ' Hide details '}</a>
					</div>
				)
			}
		</div>
		<div className="card-body">
			{ detailedServices.get(serviceKey) ? "HOTEL DETAILS" : null }
		</div>
	</li>

}

const renderServices = (items, serviceType, idx, props) => {
	const {empty, services} = items;
	const {toggleDetails, cartData, redirectTo} = props;

	const {
		methods: {
			remakeSearch,
			removeCartItem
		}
	} = cartData;

	if (empty != "false") return false;

	let template =
		<li key={idx} className="list-group-item" style={{padding: 0}}>
			<div className="card-header">
				<div className="row">
					<h5 className="col-auto mr-auto" style={{textTransform: 'uppercase'}}>
						{
							serviceType == 'flight_hotel'
								?
							`Flight and hotel`
								:
							serviceType
						}
					</h5>
					<div className="col-auto">
						<a href="javascript:;" style={{color: 'red'}} className="col ml-auto" onClick={() => removeCartItem(serviceType)}>Remove all</a>
						{
							serviceType == 'flight_hotel' && (
								<a href="javascript:;" className="pull-right" onClick={() => remakeSearch(
									null,
									true,
									data => redirectTo(`/list/${data.flight}-${data.hotel}/flight_hotel`)
								)}>Change flight & hotel</a>
							)
						}
					</div>
				</div>
			</div>

			<ul className="list-group list-group-flush">
				{
					Object.keys(services).map( (serviceKey,sIdx) => {
						const type = serviceKey.split('-')[0]
						const SID = serviceKey.split('-')[1]

						console.log(services[serviceKey])

						switch(type) {
							case 'flight':
								return renderFlight(services[serviceKey].data.flight, serviceKey, `${serviceKey}${sIdx}`, serviceType, props)
								break;
							case 'hotel':
								return renderHotel(services[serviceKey].data, serviceKey, `${serviceKey}${sIdx}`, serviceType, props)
								break;
						}
					})
				}
			</ul>
		</li>

		return template
}

// MAIN RENDER
const ViewDesktop = props => {
	const {
		cartData,
		redirectTo
	} = props;

	const {
		total,
		methods: {
			computeTotal
		}
	} = cartData;

	return (
		<div className="row">
			{
				parseInt(cartData.itemsCount) > 0
					?
						<div className="col">
							<h4>{`You have ${cartData.itemsCount} item${cartData.itemsCount==1 ? '' : 's'} in your cart`}</h4>
							<div className="card">
								<ul className="list-group list-group-flush">
									{
										Object.keys(cartData.items).map((serviceType, idx) => {
											return renderServices(cartData.items[serviceType], serviceType, idx, props)
										})
									}
								</ul>
								<div className="card-footer text-right">
									<h3>
										Total:
										<strong>
											<CurrencyConverter amount={total} />
										</strong>
									</h3>
								</div>
								<div className="card-footer text-right">
									<button onClick={() => redirectTo('/book')} className="btn btn-primary">BOOK</button>
								</div>
							</div>
						</div>
					:
					<div className="col-sm-12 text-center">
						<h2>No items added yet</h2>
					</div>
			}
			{props.goTo.length ? <Redirect to={props.goTo} push /> : null}
		</div>
	)
}

export default observer(ViewDesktop);
