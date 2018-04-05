import React, {Component} from 'react';
import BookCore from 'BookCore';

import {extendObservable} from "mobx";
import {observer} from "mobx-react";

import ViewDesktop from './ViewDesktop';
import ViewMobile from './ViewMobile';

const BookTemplates = {
  DESKTOP: props => <ViewDesktop {...props} />,
  MOBILE: props => <ViewMobile {...props} />
}

@observer
class Book extends Component {
	render(){
		const View = BookTemplates['DESKTOP'];

		return <View
      		{...this.props} 
  		/>
	}
}

export default BookCore(Book);
