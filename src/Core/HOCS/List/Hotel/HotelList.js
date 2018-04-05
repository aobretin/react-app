/* eslint-disable */
import React, {Component} from 'react';

import ApiService from 'ApiService';
import PropTypes from 'prop-types';

import {withRouter} from 'react-router-dom';

import {deepCopy, formatSelectedHotel} from 'HelperMethods';
import Popup from 'react-popup';

import {observable, extendObservable, toJS, action} from "mobx";
import {observer, inject} from "mobx-react";

const MSG = {
  LIMIT_REACHED: 'You have reached your limit for hotels, if you continue the last added hotel will be replaced by this one',
  REPLACE: 'Are you sure you want to replace this hotel ?',
  CANCEL_BTN: 'No, I am sorry!',
  OK_BTN: 'Yes, please!'
}

// MAIN RENDER
const HotelListCore = (View) => {
	  return @inject("cartData") @withRouter @observer class extends Component {
	  	static propTypes = {
        SID: PropTypes.string.isRequired,
				serviceSearchData: PropTypes.object.isRequired,
        selectedId: PropTypes.object,
        selectRoomWithHotel: PropTypes.func
      }

	    static defaultProps = {
        selectedId: undefined
      }

	    constructor(props) {
	      super(props);

	      extendObservable(this, {
          selectedHotelId: props.selectedId ? props.selectedId.hotel.Id : null,
          status: {
    				startListing: false,
    				progress:  0,
    				summary: '',
    				lastCount: 0,
    				page: 1,
    				totalRes: 0,
    				pagination: {
    					total_items: 0,
    					page: 1,
    					page_count: 1,
    					page_size: "7"
    				}
    			},
          code: null,
          selectedHotel: null,
					initialPrices: [],
          loading: true,
    			hotels: [],
					currentFilters: {},
          page: 1,
          initialListRequest: action(() => {
            const {
              location: {
                hash
              }
            } = this.props;

            let url = 'en/dynamic-package/sid/' + this.props.SID;

      		    ApiService.req(url, 'get', null, []).then((res) => {
                if (this.props.history.location.pathname.indexOf("list") < 0) return false;

            		if (res.data.hasOwnProperty('code')) {
            			this.code = res.data.code;
            			if (res.data.code == null) {
            				this.status.progress = 100;
            				this.status.startListing = true;
            				return false;
            			}else{
                    if (hash.length) {
                      const hotelID = hash.split('#')[1];

                      console.log(hotelID)

                      ApiService.req(`/v2/hotels/${hotelID}`).then(res => {
                        this.selectedHotel = res.data;
                      });
                    }

            				// this.filters.code = res.data.code;
                    this.initListing(res.data.code);
            			}
            		}else{
            			setTimeout(this.initialListRequest, 1000);
            		}
      	    })
          }),
          selectRoomWithHotel: typeof props.selectRoomWithHotel != 'undefined' ? props.selectRoomWithHotel : action((room, {hotel, code, compileRefsCombinations}) => {
            hotel.Price = room.Price.Amount;
            let hotelWithRoom = {
              hotel: hotel,
              code: code,
              packagecode: room.PackageCode,
              roomCode: compileRefsCombinations(room['refs']['Rooms']),
              room: {
                roomData: room,
                roomCode: room['refs']['PaxCode']
              }
            }

            this.selectNewService(hotelWithRoom, () => this.selectedHotelId = hotel.Id);
          })
		   })
		}

    componentWillMount(){
      this.initialListRequest();
  	}

    initListing = code => {
        this.code = code;
    		let params = this.currentFilters = {
          code: this.code,
          page: this.status.page,
          summary: this.status.summary
        }

    		ApiService.req('/v2/hotels', 'get', null, params).then((res) => {
    			let results = res.data;
    	    let status = results.status;

          if (this.props.history.location.pathname.indexOf("list") < 0) return false;

    			if(this.status.summary.length != undefined){
    				if (status == 2 ) {
    				// 	//in progress
    					this.status.summary = true;
    	        this.loading = false;
    					setTimeout(() => this.initListing(code), 1000);
    				} else {
    				// 	//completed
    					if (results._embedded.hotels.length == 0 ) {
                console.log('no results');
                this.status.progress = 100;
                this.status.summary = '';
              	return false;
              }

              this.status.summary = '';
              results.summary = {};
              this.status.progress = 100;
    					this.status.startListing = true;
              this.loading = false;
              this.hotels = results._embedded.hotels;

    					this.status.totalRes = results.total_items;
    				}
    			} else {
    				if(results.summary.count != this.status.lastCount){
    					this.hotels = results._embedded.hotels;
    					this.status.startListing = true;
    	        this.loading = false;

    					if(results.summary.count > 1){
    						this.status.lastCount = this.status.totalRes = results.summary.count;
    						this.status.progress = results.summary.progress;
    					}
    				}

    				if (results.summary.progress == 100) {
    					this.status.summary = '';
    					this.status.startListing = true;
    					results.summary = {};
    					 if ( results._embedded.hotels.length == 0 ) {
                console.log('status COMPLETE - no res');
                this.status.progress = 100;
                this.status.summary = '';
                this.loading = false;
                return false;
              }
    				}

    				setTimeout(() => this.initListing(code), 500);
    			}
    	  })
    	}

    selectNewService = (value = {}, callback) => {
      const SERVICE_NAME = 'hotel';

      const {
        addToBucket,
        updateTimestampAndCount,
        computeTotal
      } = this.props.cartData.methods;

      const clone = deepCopy(this.props.cartData);
      const {items, itemsCount, limits} = clone;
      const {empty, services} = items[SERVICE_NAME];

      const {SID} = this.props;

      let formattedValue = formatSelectedHotel(value);

      let data = {
        items: items,
        itemsCount: parseInt(itemsCount)
      }

      if (services[`${SERVICE_NAME}-${SID}`] || limits[SERVICE_NAME] === Object.keys(services).length) {
        let limitReached = !services[`${SERVICE_NAME}-${SID}`] && limits[SERVICE_NAME] === Object.keys(services).length;

        Popup.create({
          title: null,
          content: limitReached ? MSG.LIMIT_REACHED : MSG.REPLACE,
          buttons: {
            right: [
              {
                text: MSG.OK_BTN,
                action: () => {

                  if (limitReached) {
                    let newItems = {};
                    let {empty, services} = data.items[SERVICE_NAME];

                    Object.keys(services).forEach((item, idx) => {
                      if (Object.keys(services).length - 1 == idx) {
                          newItems.services[`${SERVICE_NAME}-${SID}`] = {
                            data: value,
                            searchData: this.props.serviceSearchData,
                            SID: SID
                          }
                      } else {
                        newItems.services[item] = services[item];
                      }
                    });

                    data.items[SERVICE_NAME] = {empty};
                    data.items[SERVICE_NAME].services = {...newItems};
                  } else {
                    data.items[SERVICE_NAME].services[`${SERVICE_NAME}-${SID}`] = {
                      data: value,
                      searchData: this.props.serviceSearchData,
                      SID: SID
                    }
                  }

                  addToBucket(data).then(res => {
                    this.props.cartData.items = data.items;
                    this.props.cartData.itemsCount = data.itemsCount;
                    updateTimestampAndCount(data.itemsCount);
                    computeTotal();
                    Popup.close()
                    callback()
                  })
                }
              },
              {
                text: MSG.CANCEL_BTN,
                action: () => Popup.close()
              }
            ]
          }
        })
      } else {
        data.itemsCount += 1;
        data.items[SERVICE_NAME].empty = 'false';

        data.items[SERVICE_NAME].services[`${SERVICE_NAME}-${SID}`] = {
          data: value,
          searchData: this.props.serviceSearchData,
          SID: SID
        }

        addToBucket(data).then(res => {
          this.props.cartData.items = data.items;
          this.props.cartData.itemsCount = data.itemsCount;
          updateTimestampAndCount(data.itemsCount);
          computeTotal();
          callback()
        })
      }
    }

    checkIfHotelIsSelected = (hotelId) => {
      if (this.selectedHotelId == null) return false;

      return this.selectedHotelId == hotelId;
    }

		handlePageChange = page => {
			this.status.page = this.currentFilters.page = page;
			this.selectedHotel = this.props.location.hash.length ? this.selectedHotel : null;

	    this.loading = true;

			ApiService.req('/v2/hotels', 'get', null, this.currentFilters).then(res => {
				this.hotels = res.data._embedded.hotels;
				this.loading = false;
			}).catch(res => {
	      this.loading = false;
			});
		}

		setListLoading = flag => this.loading = flag;
		updateHotelList = hotels => this.hotels = hotels;
		updateSelectedHotel = hotel => this.selectedHotel = hotel;
		updateCurrentFilters = (filters, results) => {
			this.currentFilters = Object.assign({}, this.currentFilters, filters);
			this.status.totalRes = results;
		}

    componentWillReceiveProps(nextProps) {
			this.selectedHotelId = nextProps.selectedId ? nextProps.selectedId.hotel.Id : undefined;
		}

		render(){
			return (
		        <View
              status={this.status}
              hotels={this.hotels}
							initialPrices={toJS(this.initialPrices)}
              loading={this.loading}
							code={this.code}
							selectedHotel={this.selectedHotel}
							currentFilters={this.currentFilters}
							setListLoading={this.setListLoading}
							updateHotelList={this.updateHotelList}
							updateSelectedHotel={this.updateSelectedHotel}
              selectRoomWithHotel={this.selectRoomWithHotel}
              checkIfHotelIsSelected={this.checkIfHotelIsSelected}
							handlePageChange={this.handlePageChange}
							updateCurrentFilters={this.updateCurrentFilters}
		        	{...this.props}
           >
		          {this.props.children}
		        </View>
			)

		}
	}
}

export default HotelListCore;
