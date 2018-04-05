import moment from 'moment';
import {isNumber, isArray, isObject} from 'lodash';

const deepCopy = obj => JSON.parse(JSON.stringify(obj));

const range = (start, end) => Array.from({length: (end - start)}, (v, k) => k + start);

const initialFormatDate = date => typeof date === 'string' ? moment(date) : date;

const computeWeekends = (weekendData) => {
  let refDate = moment().add(parseInt(weekendData.data.month), 'month').startOf('month'),
      currentMonth = moment().add(parseInt(weekendData.data.month), 'month').month(),
      begin = moment(refDate.toDate()).startOf('week').isoWeekday(1),
      startDay = weekendData.data.startDay,
      endDay = weekendData.data.endDay,
      dates = [],
      str = "",
      prefixes = [1,2,3,4,5],
      startDate, endDate;

  let week_of_month = prefixes[0 | moment(refDate).date() / 7];

  for (let i=week_of_month-1; i<5; i++) {
      let newWeek = moment(refDate.toDate()).add(i, 'weeks');

      console.log(newWeek.format('L'))
      console.log(newWeek.month())

      startDate = newWeek.weekday(startDay).format("YYYY-MM-DD")
      endDate = newWeek.weekday(endDay).format("YYYY-MM-DD")

      if (newWeek.month() == currentMonth) dates.push([startDate, endDate]);
  }

  return dates;
}

const serializer = (obj, key, resultObj) => {
	if ( Array.isArray(obj) ) {

		obj.forEach((item, index) => {
			serializer(item, key + "[" + index + "]", resultObj);
		});

	}
	else if ( typeof obj == "object" ) {

		for ( var item in obj ) {
			serializer(obj[item], key + "[" + item + "]", resultObj);
		}

	}
	else {
		resultObj[key] = obj;
	}
}

const formatSelectedFlight = flightItem => {
  const {Routes: RoutesWithOptions, ...rest} = deepCopy(flightItem).flight;
  const flight = {
    Routes: [],
    ...rest
  }

  flightItem.selectedRefs.forEach( (selectedRef, rIdx) => {

    RoutesWithOptions[rIdx].Route.forEach( option => {
      if (option.Ref == selectedRef) flight.Routes[rIdx] = option;
    });
  })

  return flight
}

const formatSelectedHotel = hotelItem => {
  hotelItem.Price = hotelItem.room.roomData.Price.Amount;

  return hotelItem;
}

const createRoutesObject = routes => {
  var i = null;
	var n = 0;
	var processedRoutes = [];
	var t = [];

	for (i = 0; i < routes.length; i++) {
		if (n > routes[i].SegmentId) {
			processedRoutes.push(t);
			n = 0;
			t = [];
		}

		if (n <= routes[i].SegmentId) {
			t.push(routes[i]);
			n++;
		}

		if (i === routes.length - 1) processedRoutes.push(t);
	}

	return processedRoutes;
}

const transformToStandardFormat = routes => {
  var arr = [];

  routes.forEach(function(route, idx) {
      arr.push(
          {
              Segment: []
          }
      );
      route.forEach(function(segment) {
          arr[idx].Segment.push(
              {
                  Aircraft: {
                      Code: segment.AircraftCode,
                      _: segment.AircraftName
                  },
                  Carrier: {
                      Marketing: {
                          Code: segment.CarrierMarketingCode,
                          _: segment.CarrierMarketingName
                      },
                      Operating: {
                          Code: segment.CarrierOperatingCode,
                          _: segment.CarrierOperatingName
                      }
                  },
                  Destination: {
                      Airport: {
                          City: segment.DestinationCityName,
                          CityId: segment.DestinationCityId,
                          Code: segment.DestinationAirportCode,
                          _: segment.DestinationAirportName
                      },
                      Date: segment.DestinationDate,
                      Terminal: segment.DestinationTerminal,
                      Time: segment.DestinationTime
                  },
                  Flight: {
                      CabinType: segment.FlightCabinType,
                      Class: segment.FlightClass,
                      Duration: null,
                      Number: segment.FlightNumber,
                      StopTime: segment.FlightStopTime
                  },
                  Origin: {
                      Airport: {
                          City: segment.OriginCityName,
                          CityId: segment.OriginCityId,
                          Code: segment.OriginAirportCode,
                          _: segment.OriginAirportName
                      },
                      Date: segment.OriginDate,
                      Terminal: segment.OriginTerminal,
                      Time: segment.OriginTime
                  },
              }
          );
      });
  });

  return arr;
}

const formatFilters = ({filtered, sorted, page, limit}) => {
  let idx = 0;
  let filters = {};

  if (typeof filtered !== 'undefined') {
    filtered.forEach(filter => {
      let id = null;
      let type = null;

      if (filter.id.indexOf('|') > -1) {
        const splittedId = filter.id.split('|');

        id = splittedId[0];
        type = splittedId[1];
      } else {
        id = filter.id;
      }

      if (isArray(filter.value)) {
        filter.value.forEach((subFilter, sIdx) => filters[`filter[${idx}][term][${sIdx}]`] = subFilter);
      } else {
        filters[`filter[${idx}][name]`] = id;
        filters[`filter[${idx}][term]`] = type !== null && type === 'like' ? `%${filter.value}%` : filter.value;
      }

      if (type !== null) filters[`filter[${idx}][type]`] = type;

      idx++;
    });
  }

  if (typeof sorted !== 'undefined') {
    sorted.forEach(sort => {
      filters[`filter[${idx}][direction]`] = sort.desc ? 'desc' : 'asc';
      filters[`filter[${idx}][name]`] = sort.id.indexOf('|') > -1 ? sort.id.split('|')[0] : sort.id;

      idx++;
    });
  }

  filters['limit'] = limit;
  filters['page'] = page;

  return filters;
}

export {
  range,
  initialFormatDate,
  computeWeekends,
  serializer,
  deepCopy,
  formatSelectedFlight,
  formatSelectedHotel,
  createRoutesObject,
  transformToStandardFormat,
  formatFilters
}
