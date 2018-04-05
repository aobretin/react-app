import React from 'react';

import {observer} from "mobx-react";
import {toJS} from "mobx";

import FlightItem from './FlightItem/FlightItem';
import FlightFilters from './Filters/Filters';
import Pagination from 'Pagination';

const DEFAULT_SIZE = 10

const ViewDesktop = props => {

	const renderList = () => {
		let template = null;

		if (props.collection.count == 0) {

			return (
				<div className="text-center">
					<br />
					<br />
					<br />
					<strong>No results for current filters.</strong><br/>
					<small>try removing some of the applied filters</small>
					<br />
					<br />
					<br />
				</div>
			)

		}

		if (props.collection.filtersLoading) {
			template = <div className="text-center">
				<br /><br /><br /><br />loading...
				<br /><br /><br /><br />
			</div>
		}else {
			template =
			<div className={" "}>
				{
					// props.collection.filtered.slice(props.collection.ranges.min, props.collection.ranges.max).map((flight, flightIdx) => {
					props.collection.inViewItems.map((flight, flightIdx) => {
						return (
							<FlightItem
								selectFlight={props.selectFlight}
								checkIfFlightIsSelected={props.checkIfFlightIsSelected}
								key={flightIdx + flight.ItineraryCode}
								className="col-md-12"
								type={props.collection.type}
								flight={flight}
								// isFlightAndHotel={this.props.isFlightAndHotel}
								// selectFlight={this.selectFlight}
								// changeBookData={props.changeBookData}
							/>
						)
					})
				}
				<div className="clearfix"></div>
			</div>
		}

		return template;
	}

	const {SID, loaded, count, noResults} = props.collection;

	let template = null;

	if (loaded) {
		if (noResults) {
			template = 
				<div className="row no-gutters justify-content-center">
					We have not found any flights for your search.
				</div>
		}else {
			template = 
				<div className="row no-gutters coco">
					<div ref={(el) => { props.collection.listTop = el }}></div>
					<div className="col-md-2 extended-right">
						<FlightFilters
							collection={props.collection}
							{...props}
						/>
						<div className="clearfix"></div>
					</div>
					<div className="col-md-10 pl15">
						<strong>Found {props.collection.count} flights for code {SID}</strong>
						{renderList()}
					</div>
					<div className="col-sm-10 ml-auto">
						<Pagination local={true} items={toJS(props.collection.filtered)} onChangePage={props.handlePageChange} />
					</div>
					<div className="clearfix"></div>
				</div>
		}
	}
	else {
		template = 
			<div className="text-center yabadabadoo">
				<br/><br/>
				Loading results... please waittaaaaaaa minute
			</div>
	}

	return template;
}

export default observer(ViewDesktop);
