import React from 'react';
import {observer, toJS} from "mobx-react";
import AirlineLogo from '../AirlineLogo';

const ViewDesktop = props => {

	console.log("flight details props");
	console.log(props);

	const {segments} = props;

	return (
		<div className={"col-sm-12 segments-details"}>
			{

				segments.map((segment, sIdx) => {

					return (
						<span key={sIdx}>
							{
								(segment.Flight.StopTime) ? (
									<div className={" text-center"}>
										Stop in {segment.Origin.Airport.City} for {segment.Flight.StopTime}
										<div className="clearfix"></div>
									</div>
								) : ''
							}
							<div key={sIdx} className={"row"} style={{"padding": 0, backgroundColor: '#eee'}}>
								<div className="col-md-4 text-center" style={{"paddingTop": "5px","marginLeft": "-4px"}}>
									<AirlineLogo code={segment.Carrier.Operating.Code} name={segment.Carrier.Operating._}></AirlineLogo>
									{ /*<img src={"../src/img/airline-logos/" + segment.Carrier.Marketing.Code + ".png"} />
										<br /><small>{ option.MultipleAirlines 	? "! Multiple airlines" 	: null }</small>
										<br /><small>{ option.NextDayLanding 	? "! This lands next day"	: null }</small>
									*/ }
								</div>
								<div className="col-md-2" style={{"whiteSpace": "nowrap"}}>
									{segment.Origin.Airport.City} ({segment.Origin.Airport.Code}) <br/>
									{segment.Origin.Time} <br/>
									{segment.Origin.Date} <br/>
								</div>
								<div className="col-md-2" style={{"whiteSpace": "nowrap"}}>
									{segment.Destination.Airport.City} ({segment.Destination.Airport.Code}) <br/>
									{segment.Destination.Time} <br/>
									{segment.Destination.Date} <br/>
								</div>
								<div className="col-md-2 text-right">
									<strong>{segment.Duration}</strong>
								</div>
								<div className="clearfix"></div>
							</div>
						</span>
					)
				})

			}
		</div>
	)
}

export default ViewDesktop;