import React, {Component} from 'react';
import ViewDesktop from './ViewDesktop';
import ViewMobile from './ViewMobile';

import {extendObservable} from "mobx";
import {observer} from "mobx-react";
import noPicture from '../../../../Assets/img/no-picture.png';

const HotelItemTemplates = {
	DESKTOP: props => <ViewDesktop {...props} />,
	MOBILE: props => <ViewMobile {...props} />
}

@observer
class HotelItem extends Component {
	constructor(props) {
		super(props);

    extendObservable(this, {
      imgSrc: `http://192.168.0.30/dynapack/clients/csb/public/FeCompany/image.php?id=${props.hotel.Id}`
		})
	}

  validateImage = e => this.imgSrc = noPicture;

	render() {
		const View = HotelItemTemplates['DESKTOP'];

		return (
				<View validateImage={this.validateImage} imgSrc={this.imgSrc} id={this.props.id} {...this.props} />
		)
	}
}

export default HotelItem;
