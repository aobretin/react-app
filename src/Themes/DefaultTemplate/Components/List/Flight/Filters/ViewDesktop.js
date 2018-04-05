import React from 'react';
import {observer} from "mobx-react";

import Nouislider from 'react-nouislider';

const ViewDesktop = props => {

	const {collection, handleFilterCheck, onPriceRangeChange} = props;

	const renderPrices = () => {
		let prices = collection.initPrices.slice();

		if (prices.length == 2) {
			return (
				<div className="filter-group">
					<h5><strong>Prices</strong></h5>
					<div style={{"padding": "0 10px", height: "30px", marginTop: "20px"}}>
						<Nouislider
							range={{min: Math.floor(prices[0]), max: Math.ceil(prices[1])}}
							start={prices}
							step={1}
							onEnd={onPriceRangeChange}
							tooltips={[{to: val => Math.floor(val)}, {to: val => Math.ceil(val)}]}
						/>
					</div>
				</div>
			)
		}
	}

	const renderStops = () => {
		const stops = collection.filters.stops;
		return (
			<div className={" filter-group"}>
				<h5><strong>Stops</strong></h5>
				{
					stops.map( (stop, stopIdx) => {
						let text = stop.value == 0 ? "Direct" : ( stop.value == 1 ? stop.value + " stop" : stop.value + " stops" )
						return (
							<label key={stop.value} className={" checkbox-inline"}>
								<input type="checkbox" name="airlines" checked={stop.checked} onChange={(e, type) => handleFilterCheck(e, "stops")} value={stop.value} /> {text}
							</label>
						)
					})
				}
			</div>
		)
	}

	const renderAirlines = () => {
		const airlines = collection.filters.airlines;
		return (
			<div className={" filter-group"}>
				<h5><strong>Airlines</strong></h5>
				{
					airlines.map( airlineObj => {
						return (
							<label key={airlineObj.value} className={" checkbox-inline"}>
								<input type="checkbox" name="stops" onChange={(e, type) => handleFilterCheck(e, "airlines")} checked={airlineObj.checked} value={airlineObj.value} /> {airlineObj.value}
							</label>
						)
					})
				}
			</div>
		)
	}

	return (
		<div>
			<strong>Filters</strong>
			<br /><br />
			<div className={" col-xs-12 extended"}>
				{ renderPrices() 	}
				{ renderStops() 	}
				{ renderAirlines() 	}
				<div className={" filter-group"}>
				</div>
			</div>
		</div>
	)
}

export default observer(ViewDesktop);
