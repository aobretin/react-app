import React, {Component} from 'react';

import Formsy from 'formsy-react-2';
import Autocomplete from 'react-autocomplete';

import TranslateWrapper from 'TranslateWrapper';

class TypeaheadElement extends Component {
	// updateValue = (res) => {
  //   console.log(res);
	//
	//     this.props.setValue(res.text);
	// 		if (this.props.callback) this.props.callback(res);
	// }

	render() {
		const {getErrorMessage} = this.props;

		return (
			<div>
				<Autocomplete
					renderMenu={function(items, value, style) {
						return <div children={items} className={`dropdown-menu typeahead ${items.length ? ' show' : ''}`}></div>
					}}
					renderItem={(item, highlighted) =>
						<a className="dropdown-item" href="javascript:;">{item.value.LocationCode ? [<span key='0' className="icon-airport-on"></span>,<span key='1' className="icon-airport-off"></span>] : null} {item.text}</a>
					}
					wrapperProps={{
						style: {display: 'block'},
						className: 'dropdown'
					}}
					{...this.props} />
					{/*<div>{getErrorMessage()}</div>*/}
			</div>
		)
	}
}

export default Formsy.HOC(TypeaheadElement);
