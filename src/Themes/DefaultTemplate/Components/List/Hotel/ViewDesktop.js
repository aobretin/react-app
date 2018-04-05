import React from 'react';
import HotelItem from './HotelItem/HotelItem';
import HotelFilters from './HotelFilters/HotelFilters';
import HotelInfo from 'HotelInfo';
import HotelRooms from 'HotelRooms';

import Pagination from 'Pagination';
import {Link} from 'react-router-dom';

import Popup from 'react-popup';

import {observer} from "mobx-react";

const renderDetails = props => {
  const {
    selectedHotel,
    code,
    updateSelectedHotel,
    checkIfHotelIsSelected,
    selectRoomWithHotel,
    toggleRoomsDetails
  } = props;

  return <div className="card">
    <h4 className="card-title">{selectedHotel.Name} - {selectedHotel.Stars} stars</h4>
    <Link to={{hash: ''}} onClick={toggleRoomsDetails} style={{position: 'absolute', right: 10, fontSize: 24, color: '#333', textDecoration: 'none'}}><strong>X</strong></Link>
    <HotelInfo {...selectedHotel} />
    <HotelRooms toggleRoomsDetails={toggleRoomsDetails} checkIfHotelIsSelected={checkIfHotelIsSelected} selectRoomWithHotel={selectRoomWithHotel} id={selectedHotel.Id} code={code} hotel={selectedHotel} />
  </div>
};

// MAIN RENDER
const ViewDesktop = props => {
  const {
    status,
    hotels,
    initialPrices,
    loading,
    showDetails,
    code,
    selectedHotel,
    setListLoading,
    updateHotelList,
    currentFilters,
    updateSelectedHotel,
    handlePageChange,
    updateCurrentFilters,
    toggleRoomsDetails,
    checkIfHotelIsSelected,
    location: {
      hash
    }
  } = props;

  const COMPLETED_PROGRESS = status.progress === 100;

  return (
      status.startListing && status.progress > 0
        ?
          <div>
            {
              showDetails
                ?
                  <div className="col-sm-12">
                    {selectedHotel ? renderDetails(props) : null}
                  </div>
                :
              null
            }

            <div className="row" style={{display: `${showDetails ? 'none' : 'flex'}` }} >
              {
                COMPLETED_PROGRESS
                  ?
                    <div className="col-sm-3">
                      <HotelFilters
                        currentFilters={currentFilters}
                        updateHotelList={updateHotelList}
                        setListLoading={setListLoading}
                        updateCurrentFilters={updateCurrentFilters}
                        totalRes={status.totalRes}
                        hotels={hotels}
                        code={code}
                        loading={loading}
                      />
                    </div>
                  :
                  null
              }

              <div className={COMPLETED_PROGRESS ? "col-sm-9" : "col-sm-12"}>
                <h5>
                  We have found {COMPLETED_PROGRESS ? "a total of" : null} {status.totalRes} results {COMPLETED_PROGRESS ? null : `so far (${status.progress.toFixed(2)}%)`}
                </h5>
                {
                  loading
                    ?
                      <div className="col-sm-12 text-center">
                        <br/><br/><br/><br/>loading...
                        <br/><br/><br/><br/>
                      </div>
                    :
                    hotels.slice().map((hotel, hIdx) => {
                      return(
                        <HotelItem key={hIdx} hotel={hotel} code={code} toggleRoomsDetails={toggleRoomsDetails} checkIfHotelIsSelected={checkIfHotelIsSelected} updateSelectedHotel={updateSelectedHotel} isFinished={COMPLETED_PROGRESS} />
                      )
                    })
                }

                {
                  <div className="col-sm-12">
                    {
                      status.totalRes > 7
                        ?
                          <Pagination preventReload={!COMPLETED_PROGRESS} items={status.totalRes} onChangePage={handlePageChange} />
                        :
                        null
                    }
                  </div>
                }
              </div>
            </div>
          </div>
        :
        <div className="text-center"><br /><br />Loading hotels...</div>
  )
}

export default observer(ViewDesktop);
