/* eslint-disable */
import React, {Component} from 'react';

function importAll(r) {
  let images = {};
  r.keys().map((item, index) => { images[item.replace('./', '')] = r(item); });
  return images;
}
const images = importAll(require.context('AirlineLogos', false, /\.(png|jpe?g|svg)$/));

export default class AirlineLogo extends Component {
	constructor(props) {
		super();
	}

	render() {
		const { code, name } = this.props


		return (
			<img src={images[code + ".png"]} alt={name} />
		)
	}
}
