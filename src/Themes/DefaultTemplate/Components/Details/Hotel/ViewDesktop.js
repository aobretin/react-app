import React from 'react';
import {observer} from "mobx-react";

import {Link} from 'react-router-dom';

import HotelInfo from 'HotelInfo';
import HotelRooms from 'HotelRooms';

const ViewDesktop = props => {
	const {
		loading,
		hotelId,
		hotelCode,
		hotelDetails,
		similarHotels
	} = props;

	return (
		loading
		?
		<div style={{marginTop: '80px'}} className="container extended">
			<h1 className="text-center">Loading..</h1>
		</div>
		:
		<div style={{marginTop: '15px'}} className="container extended">
			<ol className="breadcrumb">
				<li className="breadcrumb-item"><a href="javascript:;">{`${hotelDetails.CityName} hotels`}</a></li>
				<li className="breadcrumb-item active">{hotelDetails.Name}</li>
			</ol>
			<div className="row no-gutters">
				{
					similarHotels.length && (
						<div style={{paddingRight: '15px'}} className="col-sm-3">
							<h3>Similar hotels</h3>
							{
								similarHotels.map((hotel, idx) => {
									return (
										<Link key={idx} to={`/hotel-details/${hotelCode}/${hotel.Id}`}>
											<div className="card bg-dark text-white" style={{marginBottom: '15px', overflow: 'hidden'}}>
												<img className="card-img" src={hotel.Image} alt="Card image cap" />
												<div className="card-img-overlay" style={{background: 'rgba(0, 0, 0, .3)'}}>
													<h4 className="card-title">{hotel.Name}</h4>
													<p className="card-text">{`Starting at: ${hotel.MinPrice} ${hotel.Currency}`}</p>
												</div>
											</div>
										</Link>
									)
								})
							}
						</div>
					)
				}
				<div className={`${similarHotels.length ? 'col-sm-9' : 'col-sm-12'}`}>
					<HotelInfo {...hotelDetails} />
					<HotelRooms id={hotelId} code={hotelCode} />
				</div>
			</div>
		</div>
	)
}

export default observer(ViewDesktop);
