import React from 'react';
import {observer} from "mobx-react";
import CurrencyConverter from 'CurrencyConverter';
import {Link} from 'react-router-dom';

const renderCartServices = (type, services, props) => {
	const {
		cartData: {
			methods: {
				removeCartItem
			}
		}
	} = props;

	let template = null;

	template = <div>
		{
			(() => {
						console.log(services);
				switch (type) {
					case 'flight':
						return Object.keys(services).map((service, idx) => {
							const routes = services[service].data.flight.Routes;
							return (
								<div key={idx} className="dropdown-item flex row no-gutters align-items-center justify-content-between">
									<div className="flex"><span className="icon-flight-on"></span></div>
									<div className="flex detailed">
										<div>{routes[0].Route[0].Segment[0].Origin.Airport.City} &ndash; {routes[0].Route[0].Segment[routes[0].Route[0].Segment.length-1].Origin.Airport.City}</div>
										<small><CurrencyConverter amount={services[service].data.flight.Price} /></small>
									</div>
									<span className="flex" onClick={() => removeCartItem(type, service)} style={{color: 'red'}} href="javascript:;">
										<strong> X</strong>
									</span>
								</div>
							)
						});
						break;
					case 'hotel':
						return Object.keys(services).map((service, idx) => {
							return (
								<div key={idx} className="dropdown-item flex row no-gutters align-items-center justify-content-between">
									<div className="flex"><span className="icon-hotel-on"></span></div>
									<div className="flex detailed">
										<div>{services[service].data.hotel.Name} - {services[service].searchData.CityName}</div>
										<small><CurrencyConverter amount={services[service].data.hotel.Price} /></small>
									</div>
									<span className="flex" onClick={() => removeCartItem(type, service)} style={{color: 'red'}} href="javascript:;">
										<strong> X</strong>
									</span>
								</div>
							)
						});
						break;
					case 'flight_hotel':
						let amount = 0;

						Object.keys(services).forEach((service, idx) => {
							let prefix = service.split('-')[0];

							amount += parseFloat(services[service].data[prefix].Price, 10);
						});

							return 	<div className="dropdown-item flex row no-gutters align-items-center justify-content-between">
										<div className="flex"><span className="icon-flight-hotel-on"></span></div>
										F & H - <CurrencyConverter amount={amount} />
										<span onClick={() => removeCartItem(type)} style={{color: 'red'}} href="javascript:;">
											<strong> X</strong>
										</span>
									</div>;
						break;
				}
			})()
		}
	</div>

	return template;
}

// MAIN RENDER
const ViewDesktop = props => {
	const {
		cartData: {
			items,
			itemsCount,
			total
		},
		toggleDropdown,
		showCartDropdown,
		goTo,
		redirectTo
	} = props;

	return (
		<div className={`dropdown col${showCartDropdown ? ' show' : ''}`} id="cartDrop">
			<a href="javascript:;" className="dropdown-toggle" onClick={toggleDropdown}><span className="icon-shopping-cart"></span> {parseInt(itemsCount) > 0 ? `${parseInt(itemsCount)} items` : 'no items'}</a>
			<div className={`dropdown-menu align-right ${showCartDropdown ? ' show' : ''}`} aria-labelledby="cartDrop">
				{
					parseInt(itemsCount) > 0
						?
							<div>
								{
									Object.keys(items).map((serviceType, idx) => {
										return (
											<div key={idx}>
												{
													items[serviceType].services && items[serviceType].empty == 'false' && (
														renderCartServices(serviceType, items[serviceType].services, props)
													)
												}
											</div>
										)
									})
								}
							</div>
						:
						<a className="dropdown-item">No items added</a>
				}
				{
					parseInt(itemsCount) > 0
						?
							<div className="row row-total no-margins text-white">
								<div className="col-6">
									Total: <strong><CurrencyConverter amount={total} /></strong>
								</div>
								<div className="col-6 text-right">
									<Link className="btn btn-success col" to="/checkout">Checkout</Link>
								</div>
							</div>
						:
					null
				}
			</div>
		</div>
	)
}

export default observer(ViewDesktop);


// <div className={`dropdown col${showCartDropdown ? ' show' : ''}`}>
// 	<button onClick={toggleDropdown} className="btn btn-secondary dropdown-toggle">
// 		{parseInt(itemsCount) > 0 ? `${parseInt(itemsCount)} items` : 'Cart is empty'}
// 	</button>
// 	<div style={{left: 'auto', right: 0}} className={`dropdown-menu${showCartDropdown ? ' show' : ''}`}>
// 		{
// 			parseInt(itemsCount) > 0
// 				?
// 					<div>
// 						{
// 							Object.keys(items).map((serviceType, idx) => {
// 								return (
// 									<div key={idx}>
// 										{
// 											items[serviceType].services && items[serviceType].empty == 'false' && (
// 												renderCartServices(serviceType, items[serviceType].services, props)
// 											)
// 										}
// 									</div>
// 								)
// 							})
// 						}
// 						<a className="dropdown-item">
// 							<strong>Total - <CurrencyConverter amount={total} /></strong>
// 						</a>
// 					</div>
// 				:
// 				<a className="dropdown-item">No items added</a>
// 		}
// 		{
// 			parseInt(itemsCount) > 0
// 				?
// 					<div>
// 						<a className="dropdown-item">
// 							<button className="btn btn-success col" onClick={() => redirectTo('/checkout')}>Checkout</button>
// 						</a>
// 					</div>
// 				:
// 			null
// 		}
// 		{
// 			goTo.length ? <Redirect to={goTo} push /> : null
// 		}
// 	</div>
// </div>