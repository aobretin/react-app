import React from 'react';
import {observer} from "mobx-react";
import {toJS} from "mobx";
import AirlineLogo from './AirlineLogo';
import FlightDetails from './FlightDetails/FlightDetails';

const ViewDesktop = props => {
	const {rIdx, oIdx} = props;
	const Route = props.option.Route;
	let firstSegment = props.option.Segment[0];
	let optionCheckedClass = props.option.Ref == props.selectedRefs[rIdx] ? "checked": ''; //styles.optionChecked : ''
	let optionDetailedClass = props.detailed ? "detailed" : '';
	let lastSegment = props.option.Segment[props.option.Segment.length - 1];
	let toggleDetailsClassName = props.detailed ? 'more' : 'less';

	return (
		<div key={`item-${rIdx}-${oIdx}`} className={`row ${optionDetailedClass}`}>
			<div className="col-md-1">
				<label className="col-md-1">
					<input type="radio" name={"r" + rIdx} value={props.option.Ref} checked={props.option.Ref == props.selectedRefs[rIdx]} onChange={() => props.updateOptions(rIdx, props.option.Ref)} />
				</label>
			</div>
			<div className="col-md-3 text-center">
				<AirlineLogo code={firstSegment.Carrier.Operating.Code} name={firstSegment.Carrier.Operating._}></AirlineLogo>
				{ /*
					<br /><small>{ props.option.MultipleAirlines 	? "! Multiple airlines" 	: null }</small>
					<br /><small>{ props.option.NextDayLanding 	? "! This lands next day"	: null }</small>
				*/ }
			</div>
			<div className="col-md-2" style={{"whiteSpace": "nowrap"}}>
				<strong>{firstSegment.Origin.Airport.City}</strong> ({firstSegment.Origin.Airport.Code}) <br/>
				{firstSegment.Origin.Time.slice(0,-3)} <br/>
				{firstSegment.Origin.Date} <br/>
			</div>
			<div className="col-md-2" style={{"whiteSpace": "nowrap"}}>
				<strong>{lastSegment.Destination.Airport.City}</strong> ({lastSegment.Destination.Airport.Code}) <br/>
				{lastSegment.Destination.Time.slice(0,-3)} <br/>
				{lastSegment.Destination.Date} <br/>
			</div>
			<div className="col-md-2 text-right">
				<strong>{props.option.Duration}</strong> <br/>
				{
					props.option.Segment.length > 1 ? props.option.Segment.length - 1 + ( props.option.Segment.length - 1 == 1 ? " stop" : " stops" ) : "Direct flight"
				}
			</div>
			<div className="col-md-2">
				<button type="button" className={toggleDetailsClassName + " btn btn-flat pull-right"} onClick={props.toggleDetails} style={{border: "1px solid #888",background: "transparent"}}>
					<span className="more">+</span><span className="less">-</span> details
				</button>
			</div>
			<div className="clearfix"></div>
			{
				props.detailed 
				?
				<FlightDetails 
					segments={props.option.Segment}
				/>
				:
				null
			}
		</div>
	)

}

export default observer(ViewDesktop);