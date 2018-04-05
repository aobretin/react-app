import React, {Component} from 'react';

import {extendObservable} from "mobx";
import {observer} from "mobx-react";

import ViewDesktop from './ViewDesktop';
import ViewMobile from './ViewMobile';

const BookFormContactTemplates = {
  DESKTOP: props => <ViewDesktop {...props} />,
  MOBILE: props => <ViewMobile {...props} />
}

@observer
class BookFormContact extends Component {

	render(){
		const View = BookFormContactTemplates['DESKTOP'];

    return (
      <View
        {...this.props} />
    )
	}
}

export default BookFormContact;
