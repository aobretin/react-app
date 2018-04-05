import React from 'react';
import {observer} from "mobx-react";

const ViewDesktop = props => {
  console.log(props)

  const {
    pax,
    cpLoader,
    packIndex,
    handleSelectChange
  } = props;

  return(
    <div className="col-sm-12" style={{paddingLeft: '0'}}>
      {
        cpLoader
          ?
            <div><h4>Loading...</h4></div>
          :
          pax.PackageRooms.PackageRoom.map((room, rIdx) => {
            return (
              <div key={rIdx} className="row">
                <div className="col">
                  <span>Room No: {rIdx + 1} | {room.Occupancy.Adults}</span>
                  <span>{(room.Occupancy.Adults > 1) ? 'Adults' : 'Adult'}</span>
                  <span>
                    {
                      (room.Occupancy.Children > 0) ?
                        <span> {room.Occupancy.Children}
                          {
                            (room.Occupancy.Children > 1) ? ' Children' : ' Child'
                          }
                        </span> : ''
                    }
                  </span>
                </div>

                <div className="col">
                  <span>
                    {
                      (room.RoomRefs.RoomRef.length > 1) ?
                        <select value={pax.refs['Rooms'][rIdx]['RoomCode']} onChange={(e, index, value) => {props.handleSelectChange(e, rIdx, packIndex)}}>
                          {
                            room.RoomRefs.RoomRef.map((elem, sIdx) => {
                              return(
                                <option key={sIdx} value={elem.RoomCode}>{elem.Name}</option>
                              )
                            })
                          }
                        </select>
                      :
                      <div>
                        <span>{room.RoomRefs.RoomRef[0].Name}</span>
                      </div>
                    }
                  </span>
                  <div>
                    <span>{pax.refs['Rooms'][rIdx]['Info']}</span>
                  </div>
                </div>
                <div className="col-sm-4 text-left">
                  <span>{pax.refs['Rooms'][rIdx]['Board']}</span>
                </div>
              </div>
            )
          })
      }
    </div>
  )
}

export default observer(ViewDesktop);
