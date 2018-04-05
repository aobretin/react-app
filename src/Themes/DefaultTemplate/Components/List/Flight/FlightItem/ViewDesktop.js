import React from 'react';
import {observer, toJS} from "mobx-react";
import RouteOption from './RouteOption/RouteOption';
import CurrencyConverter from 'CurrencyConverter';

const ViewDesktop = (props) => {

	const renderOptions = (routes, rIdx) => {
		return 	(
			<div>
				{
					routes.map( (option, oIdx) => {

						return <RouteOption
							key={oIdx}
							option={option}
							rIdx={rIdx}
							oIdx={oIdx}
							selectedRefs={props.selectedRefs}
							updateOptions={props.updateOptions}
						/>

					})
				}
				<div className="clearfix"></div>
			</div>
		)

	}

	const {flight, type} = props;

	const headerTexts = ['Departure'];
	const flightStyles = {
		border: '1px solid #888',
		marginBottom: 10
		// border: this.props.checkIfFlightIsSelected(this.props.flight.ItineraryCode) ? '2px solid red' : '',
		// ...this.props.style
	}

	switch(props.type) {
		case '1': // round trip

			headerTexts[1] = 'Return'
			break;
		case '2': // multi
			break;
	}

	return (
		<div className="flight-item" style={{border: props.checkIfFlightIsSelected(flight.ItineraryCode) ? '2px solid red' : ''}}>
			<div style={{}} className={" col-md-12"}>
				<form action="">
					{
						flight.Routes.map( (route,rIdx) => {
							let originCity = route.Route[0].Segment[0].Origin.Airport.City
							let destinationCity = route.Route[0].Segment[route.Route[0].Segment.length-1].Destination.Airport.City
							let icoStyle = rIdx == 1 && type == 1 ? {"transform": "rotate(90deg)"} : {}

							return (
								<div key={rIdx} className="flight-route">
									<h5 className="row">
										<span className="col-auto">
											<span className="fa fa-plane" style={icoStyle}></span> {type != 2 ? <strong>{headerTexts[rIdx]} &mdash;</strong> : null} {originCity} to {destinationCity}
											{
												rIdx == 0
													?
														<button type="button" className="btn btn-success" onClick={() => props.selectFlight({flight: flight, selectedRefs: props.selectedRefs})}>
															{props.checkIfFlightIsSelected(flight.ItineraryCode) ? 'SELECTED' : 'SELECT FLIGHT'}
														</button>
													:
													null
											}

										</span>
										{
											// rIdx == 0 ? <strong className={styles.flightPrice + " col-md-3 pull-right text-right"}><CurrencyConverterHandler amount={flight.Price} /></strong> : null
											rIdx == 0 ? <strong className={" flight-item-price col-auto ml-auto text-right"}><CurrencyConverter amount={flight.Price} /></strong> : null
										}
									</h5>
									{
										renderOptions(route.Route, rIdx)
									}
									<div className="clearfix"></div>
								</div>
							)
						})

					}
				</form>
			</div>
		</div>
	)

}

export default observer(ViewDesktop)
