import React from 'react';
import Flight from './Flight/Flight';
import Hotel from './Hotel/Hotel';
import Flight_Hotel from './Flight_Hotel/Flight_Hotel';

import {observer} from "mobx-react";

const formatServiceName = service => service == 'flight_hotel' ? 'FLIGHT & HOTEL' : service.toUpperCase();

const ViewDesktop = (props) => {
	const {services, activeService, changeActiveService} = props;

	return (

		<div className="flex w100">
			{
				// props.toggleForm
				// 	?
				// 		<div style={{paddingBottom: '40px', textAlign: 'center'}} className="col-sm-12">
				// 			<button type="button" onClick={props.toggleFormView} className="btn btn-default">{props.hideForm ? 'Show search form' : 'Hide search form'}</button>
				// 		</div>
				// 	:
				// null
			}

			{
				!props.hideForm
					?
						<div className="col-12 search-area">
							<ul className="search-tabs nav nav-pills" role="tablist">
								{
									services.map( (service,sIdx) => {
										return (
											<li key={sIdx} className="nav-item">
												<a className={`nav-link ${activeService.label == service ? 'active' : null}`} href="javascript:;" onClick={() => changeActiveService(service)}>
													<span className={`icon-${service}-${activeService.label == service ? 'on' : 'off'}`}></span> {formatServiceName(service)}
												</a>
											</li>
										)
									})
								}
							</ul>
							<div className="tab-content">
								<div className="tab-pane fade show active" role="tabpanel">

									{
										(() => {
											switch(activeService.label) {
												case 'flight':
													return <Flight flight={activeService.data} />;
													break;
												case 'hotel':
													return <Hotel hotel={activeService.data} />;
													break;
												case 'flight_hotel':
													return <Flight_Hotel flight_hotel={activeService.data} />;
													break;
											}
										})()
									}

								</div>
							</div>

							<div className="search-btn-drop col-3 col-xl-2">
								<div className="search-btn-container ml-auto">
									<input type="submit" disabled={!props.canSubmit} className="btn btn-medium btn-block" value="Search now" />
								</div>
							</div>

						</div>

					:
				null
			}

		</div>
	)
}

export default observer(ViewDesktop);
