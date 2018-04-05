import React, {Component} from 'react';

import {extendObservable, observable} from "mobx";
import {observer} from "mobx-react";

import ViewDesktop from './ViewDesktop';
import ViewMobile from './ViewMobile';

let typeTimeout = null;

const HotelBookFormTemplates = {
  DESKTOP: props => <ViewDesktop {...props} />,
  MOBILE: props => <ViewMobile {...props} />
}

@observer
class HotelBookForm extends Component {
  formatClient = client => client.owner ? client.clientType + ' - Main client' : client.clientType

  formatPreselectedUser = (client, key, value, index) => {
    clearTimeout(typeTimeout);

    typeTimeout = setTimeout(() => {
        client.fields[key] = value;

        if (client.fields.firstName.length && client.fields.lastName.length) {
          this.props.preselectedUsers.set(index, {
            label: `${client.fields.firstName} ${client.fields.lastName}`,
            fields: client.fields
          })
        }

    }, 600);
  }

	render(){
		const View = HotelBookFormTemplates['DESKTOP'];

		return <View
      formatClient={this.formatClient}
      formatPreselectedUser={this.formatPreselectedUser}
      {...this.props} />
	}
}

export default HotelBookForm;
