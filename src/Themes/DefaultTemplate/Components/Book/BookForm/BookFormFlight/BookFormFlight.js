import React, {Component} from 'react';

import {extendObservable, observable} from "mobx";
import {observer} from "mobx-react";

import ViewDesktop from './ViewDesktop';
import ViewMobile from './ViewMobile';

let typeTimeout = null;

const FlightBookFormTemplates = {
  DESKTOP: props => <ViewDesktop {...props} />,
  MOBILE: props => <ViewMobile {...props} />
}

@observer
class FlightBookForm extends Component {
  constructor() {
    super();

    extendObservable(this, {
      FFWatcher: observable.map({})
    })
  }

  formatTaveller = passenger => passenger.owner ? (passenger.passIndex + 1) + '. ' + passenger.passType + ' - Main traveller' : (passenger.passIndex + 1) + '. ' + passenger.passType;

  formatPreselectedUser = (passenger, key, value, index) => {
    clearTimeout(typeTimeout);

    typeTimeout = setTimeout(() => {
        passenger.fields[key] = value;

        if (passenger.fields.firstName.length && passenger.fields.lastName.length) {
          this.props.preselectedUsers.set(index, {
            label: `${passenger.fields.firstName} ${passenger.fields.lastName}`,
            fields: passenger.fields
          })
        }

    }, 600);
  }

  watchFFValue = (target, name) => this.FFWatcher.set(name, typeof target.value != 'undefined' && target.value.length > 0);

	render(){
		const View = FlightBookFormTemplates['DESKTOP'];

		return <View
      formatTaveller={this.formatTaveller}
      formatPreselectedUser={this.formatPreselectedUser}
      watchFFValue={this.watchFFValue}
      FFWatcher={this.FFWatcher}
      {...this.props} />
	}
}

export default FlightBookForm;
