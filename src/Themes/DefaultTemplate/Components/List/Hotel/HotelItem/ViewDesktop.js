import React from 'react';
import {observer} from "mobx-react";

import CurrencyConverter from 'CurrencyConverter';
import {Link} from 'react-router-dom';

import Config from 'Config';

const renderHotelActionBtn = ({code, hotel, updateSelectedHotel, toggleRoomsDetails}) => {
  let template = null;

  if (Config.HotelSeparateDetailsPage) {
    template = <Link className="btn btn-primary" to={`/hotel-details/${code}/${hotel.Id}`}>View details</Link>
  } else {
    template = <Link to={{hash: `${hotel.Id}`}} onClick={() => {updateSelectedHotel(hotel); toggleRoomsDetails()}} className="btn btn-primary">View details</Link>;
  }

  return template;
}

// MAIN RENDER
const ViewDesktop = props => {
  const {
    hotel,
    code,
    validateImage,
    imgSrc,
    isFinished,
    toggleDetails,
    updateSelectedHotel,
    checkIfHotelIsSelected,
    toggleRoomsDetails
  } = props;

  const {
    Stars,
    Name,
    Address,
    ShortDesc,
    MinPrice,
    Id
  } = hotel;

  return(
    <div className="card" style={{'marginBottom': '10px', border: checkIfHotelIsSelected(Id) ? '2px solid red' : '1px solid #ccc'}}>
      <h5 className="card-header">
        {Name} - {Stars} stars
      </h5>

      <div className="card-block row" style={{'padding': '1.25rem'}}>
        <div className="col-sm-2">
          <img className="card-img-top" onError={e => validateImage(e)} alt={Name} src={imgSrc} />
        </div>

        <div className="col-sm-10">
          <h4 className="card-title"><CurrencyConverter amount={MinPrice} /></h4>
          <p className="card-text">
            <span>{Address}</span>
          </p>
          {isFinished ? renderHotelActionBtn(props) : null}
        </div>
      </div>
    </div>
  )
}

export default observer(ViewDesktop);
