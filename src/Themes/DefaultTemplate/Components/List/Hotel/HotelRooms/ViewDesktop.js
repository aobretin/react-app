import React from 'react';
import {observer} from "mobx-react";
import HotelPackages from './HotelPackages/HotelPackages';

const ViewDesktop = props => {
  const {
    packages,
    loading,
    prices,
    compileRefsCombinations,
    selectRoomWithHotel,
    toggleRoomsDetails,
    code,
    id
  } = props;

  console.log(props)

  return(
    <div className="col-sm-12">
      <table className="table table-striped">
        <thead>
          <tr>
            <th>CP</th>
            <th>Room type / Board</th>
            <th>Price</th>
            <th style={{width: '100px'}}>&nbsp;</th>
          </tr>
        </thead>
        <tbody>
          {
            loading
              ?
                <tr>
                  <td><h4 className="text-center">Loading...</h4></td>
                </tr>
              :
              packages.map((pack, pIdx) => {
                return (
                  <tr key={pIdx}>
                    <td>
                      {/* CancellationPolicy here */}
                    </td>
                    <td>
                      <HotelPackages
                        compileRefsCombinations={compileRefsCombinations}
                        packIndex={pIdx}
                        prices={prices}
                        packCode={code}
                        hotelId={id}
                        package={pack}
                      />
                    </td>
                    <td>
                      <span>{prices[pIdx]['Amount']} {prices[pIdx]['Currency']}</span>
                    </td>
                    <td>
                      <button type="button" onClick={() => {selectRoomWithHotel(pack, props); toggleRoomsDetails()}} className="btn btn-medium col-xs-12">Select hotel and room</button>
                    </td>
                  </tr>
                )
              })
          }
          <tr></tr>
        </tbody>
      </table>
    </div>
  )
}

export default observer(ViewDesktop);
