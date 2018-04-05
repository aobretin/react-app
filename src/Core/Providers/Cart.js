import ApiService from 'ApiService';
import {serializer, deepCopy} from 'HelperMethods';

import {observable} from "mobx";

class CartProvider {
  static cartData = observable({
    EXPIRY_TIME: 1800000,
    ALLOW_CART: true,

    cartId: 0,
    itemsCount: 0,
    timestamp: 0,
    limits: {
      flight: 5,
      hotel: 5,
      flight_hotel: 1
    },
    items: {
      flight: {
        empty: 'true'
      },
      hotel: {
        empty: 'true'
      },
      flight_hotel: {
        empty: 'true'
      }
    },
    fh_cart: observable.map({}),
    showCart: false,
    total: observable(0),
    methods: {
      addToBucket: value => {
        let data = {};

        serializer(deepCopy(value), `Object`, data);
        CartProvider.cartData.methods.computeTotal();
        return ApiService.req('/container/' + CartProvider.cartData.cartId, 'POST', data, {replace: true});
      },
      updateTimestampAndCount: count => {
        let data = localStorage.getItem('userCart');
        data = JSON.parse(data);

        data.timestamp = Date.now();
        data.itemsCount = count;

        return localStorage.setItem('userCart', JSON.stringify(data));
      },
      computeTotal: () => {
    		CartProvider.cartData.total = 0;

    		Object.keys(CartProvider.cartData.items).forEach( (serviceType,cIdx) => {
    			let {empty, services} = CartProvider.cartData.items[serviceType];

          if (typeof services != 'undefined') {
            Object.keys(services).forEach( serviceKey => {
              let prefix = serviceKey.split('-')[0];
              console.log(services[serviceKey].data, serviceKey)

              if (empty == 'false') CartProvider.cartData.total += parseFloat(services[serviceKey].data[prefix].Price, 10);
            })
          }
    		});

    		return CartProvider.cartData.total.toFixed(2)
    	},
      remakeSearch: (serviceKey, isFlightAndHotel, callback) => {
        let data = {}

  			if (isFlightAndHotel) {
  				const {empty, services} = CartProvider.cartData.items['flight_hotel'];
  				data = {
  					flight: '',
  					hotel: ''
  				};

  				Object.keys(services).forEach(item => {
  					let splitted = item.split('-');
  					let type = splitted[0];
  					let SID = splitted[1];

  					console.log(item);

  					if (type == 'flight') data.flight = `f=${SID}`;
  					if (type == 'hotel') data.hotel = `h=${SID}`;
  				});
  				//if (callback) callback(data); //this.goTo = `/list/${data.flight}-${data.hotel}/flight_hotel`;
  			} else {
  				let splitted = serviceKey.split('-');
  				let type = splitted[0];
  				let SID = splitted[1];

  				let shortHandType = type == 'flight' ? 'f' : 'h';

          data = {shortHandType, SID, type};
  	      //this.goTo = `/list/${shortHandType}=${SID}/${type}`;
  			}

        if (callback) callback(data);
  		},
      removeCartItem: (serviceType, key) => {
  			let {items, itemsCount} = CartProvider.cartData;
  			let itemsToRemove = 0;

  			let data = {
  				items: items,
  				itemsCount: itemsCount
  			};

  			if (key) {
  				delete data.items[serviceType].services[key];
  				itemsToRemove = 1;

  				if (Object.keys(data.items[serviceType].services).length == 0) data.items[serviceType] = {empty: 'true', services: {}};
  			} else {
          if (serviceType == 'flight_hotel') {
            CartProvider.cartData.fh_cart = observable.map({});

            Object.keys(data.items[serviceType].services).some(service => {
              let prefix = service.split('-')[0];

              if (prefix == 'flight') return CartProvider.cartData.fh_cart.set(service, data.items[serviceType].services[service]);
            })
          }

  				itemsToRemove = serviceType == 'flight_hotel' ? 1 : Object.keys(data.items[serviceType].services).length;
  				data.items[serviceType] = {empty: 'true', services: {}};
  			}

  			data.itemsCount = parseInt(data.itemsCount) - itemsToRemove;

  			CartProvider.cartData.methods.removeFromBucket(data).then(() => {
  				CartProvider.cartData.items = data.items;
  				CartProvider.cartData.itemsCount = data.itemsCount;
  				CartProvider.cartData.methods.updateTimestampAndCount(data.itemsCount);
  			})
  		},
      getFromBucket: () => ApiService.req('/container/' + CartProvider.cartData.cartId, 'GET'),
      removeFromBucket: value => CartProvider.cartData.methods.addToBucket(value),
      toggleCart: () => CartProvider.cartData.showCart = !CartProvider.cartData.showCart
    }
  })
}

export default CartProvider;
