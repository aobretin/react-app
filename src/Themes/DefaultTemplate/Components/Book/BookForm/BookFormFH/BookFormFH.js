import React, {Component} from 'react';

import {extendObservable, observable} from "mobx";
import {observer} from "mobx-react";

import ViewDesktop from './ViewDesktop';
import ViewMobile from './ViewMobile';

let typeTimeout = null;

const FHBookFormTemplates = {
  DESKTOP: props => <ViewDesktop {...props} />,
  MOBILE: props => <ViewMobile {...props} />
}

@observer
class FHBookForm extends Component {
  constructor() {
    super();

    extendObservable(this, {
      FFWatcher: observable.map({})
    })
  }

  formatClient = client => client.owner ? client.clientType + ' - Main client' : client.clientType;

  handleSpecialCase = (target, flightEquivalent) => this.props.syncs[flightEquivalent] = target.value;

  handleSpecialCaseDatepicker = (val, flightEquivalent) => this.props.syncs[flightEquivalent] = val;

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

  watchFFValue = (target, name) => this.FFWatcher.set(name, typeof target.value != 'undefined' && target.value.length > 0);

	render(){
		const View = FHBookFormTemplates['DESKTOP'];

		return <View
      formatClient={this.formatClient}
      formatPreselectedUser={this.formatPreselectedUser}
      handleSpecialCase={this.handleSpecialCase}
      handleSpecialCaseDatepicker={this.handleSpecialCaseDatepicker}
      watchFFValue={this.watchFFValue}
      FFWatcher={this.FFWatcher}
      {...this.props} />
	}
}

export default FHBookForm;
