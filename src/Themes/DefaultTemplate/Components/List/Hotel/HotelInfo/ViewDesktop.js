import React from 'react';
import {observer} from "mobx-react";


const ViewDesktop = props => {
  const {
    Image,
    Stars,
    Name,
    Address,
    Phone,
    Email,
    ShortDesc
  } = props;

  let img = Image ? Image : '';

  return(
    <div className="card mb-3">
      <div style={{height: '200px', 'overflow': 'hidden', 'position': 'relative'}}>
        <img style={{position: 'absolute'}} className="card-img-top img-fluid" src={Image} alt="Card image cap" />
      </div>
      <div className="card-block" style={{padding: '15px'}}>
        <h4 style={{textDecoration: 'underline'}} className="card-title"><strong>{Name}</strong></h4>
        <div className="row">
          <div className="col">
            <p className="card-text"><strong>Rating: </strong>{Stars} stars</p>
            <p className="card-text"><strong>Address: </strong>{Address}</p>
            <p className="card-text"><strong>Phone: </strong>{Phone}</p>
            <p className="card-text"><strong>Email: </strong>{Email}</p>
          </div>
          <div className="col">
            <p className="card-text"><strong>ShortDesc: </strong>{ShortDesc}</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default observer(ViewDesktop);
