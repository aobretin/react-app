/* eslint-disable */
import BirthdatePlugin from 'BirthdatePlugin';

const buildClientObj = (clients, lastDate) => {
	let arr = [];
	let adultsGoing = 0;
	let childrenGoing = 0;
	let firstClient = true;
	let anotherRoom = 1;

  	//console.log(lastDate);

	clients.forEach((client, index) => {
		let roomIndex = index;
		let el = null;
		let clientType = '';
		let roomData = {};

		adultsGoing += client.Occupancy.Adults;
		childrenGoing += client.Occupancy.Children;

    	client.RoomRefs.RoomRef.some(room => {
			if (room.Selected) {
				roomData = room;
				roomData['packageRoomCode'] = client.PackageRoomCode;
				return roomData;
			}
		});

		for (el in client.Occupancy) {
      let n = 0;

			switch(el) {

				case 'Adults':
					clientType = 'Adult';

					while (n <= client.Occupancy[el] - 1) {
						arr.push(
							{
								roomIndex: roomIndex,
								clientType: clientType,
								clientCategory: el.toLowerCase(),
								clientIndex: n,
								roomData: roomIndex !== anotherRoom ? roomData : null,
								anotherRoom: roomIndex !== anotherRoom ? true : false,
								owner: firstClient ? true : false,
								fields: {
									title: 'Mr',
									firstName: '',
									lastName:  '',
									birthdate:  '',
									phone:  '',
									email:  '',
									ffAirline:  '',
									ffNumber:  ''
								}
							}
						)
						firstClient = false;
						anotherRoom = roomIndex;
						n++;
					}
					break;

		        case 'Children':
		          let childAge = 0;
		          clientType = 'Child';

        	while (n <= client.Occupancy[el] - 1) {
            childAge = client.Occupancy.ChildAge[n];
            arr.push(
    		{
          roomIndex: roomIndex,
          clientType: clientType,
          clientCategory: el.toLowerCase(),
          clientIndex: n,
          dates: BirthdatePlugin.birthdatePlugin.calcBDMinMax({
            limitDate: lastDate,
            age: childAge
          }),
					fields: {
						title: 'Mr',
						firstName: '',
						lastName:  '',
						birthdate:  '',
						phone:  '',
						email:  '',
						ffAirline:  '',
						ffNumber:  ''
					}
              	}
            )

            //console.log(arr);
            n++;
        	}
        	break;
			}
		}
	});

	return arr;
}

const buildDestinations = (routes) => {
  let originCity = routes[0].Segment[0].Origin.Airport.City;
  let destinationCity = routes[0].Segment[routes[0].Segment.length-1].Destination.Airport.City;

  console.log(routes, originCity, destinationCity);

  return `from ${originCity} to ${destinationCity}`;
}

const checkIfSecured = (routes) => {
  let i, y = null;

  for (i = 0; i < routes.length; i++) {
    for (y = 0; y < routes[i].Segment.length; y++) {
      if (routes[i].Segment[y].Secured) return true;
    }
  }

  return false;
}

const buildPassengers = (passengers, routes) => {
  console.log(routes);

  let lastRoute = routes[routes.length - 1];
  let lastDate = lastRoute.Segment[lastRoute.Segment.length - 1].Destination.Date;

  let arr = [];

  passengers.forEach((pass, index) => {
    let passengerDates = null;
    let passType = '';
    let n = 0;

    while(n <= parseInt(pass.Count) - 1) {
      switch(pass.PTC) {
        case 'ADT':
        case 'SEN':
          passType = 'Adult';
          passengerDates = BirthdatePlugin.birthdatePlugin.calcBDMinMax({
            limitDate: lastDate,
            type: 'ADT'
          });
          break;
      case 'CHD':
          passType = 'Child';
          passengerDates = BirthdatePlugin.birthdatePlugin.calcBDMinMax({
            limitDate: lastDate,
            type: 'CHD'
          });
          break;
      case 'INS':
          passType = 'Infant';
          passengerDates = BirthdatePlugin.birthdatePlugin.calcBDMinMax({
            limitDate: lastDate,
            type: 'INS'
          });
          break;
      }

      arr.push(
        {
          passType: passType,
          dates: passengerDates,
          passIndex: n,
          passCode: pass.PTC,
          secured: checkIfSecured(routes),
          owner: (index == 0 && n == 0),
          fields: {
            title: 'Mr',
            firstName: '',
            lastName:  '',
            birthDate:  '',
            phone:  '',
            email:  '',
            idDocNumber:  '',
            idDocExpiryDate:  '',
            idDocPaxNationality:  '',
            idDocIssuingCountry:  '',
            FqTvAirlineCode:  '',
            FqTvNumber:  ''
          }
        }
      );

      n++;
    }
  });

  return arr;
}


export {buildClientObj, buildDestinations, checkIfSecured, buildPassengers};
