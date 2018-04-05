import React, {Component} from 'react';
import Translate from 'react-translate-component';
import Formsy from 'formsy-react-2';

class FormElement extends Component {
	componentWillMount(){
		if (this.props.defaultValue) this.props.setValue(this.props.defaultValue || '')
	}

	updateValue = (event) => {
	    this.props.setValue(event.target.value);
			if (this.props.onChange) this.props.onChange(event.target);
	}

	render() {
		const {
			getErrorMessage,
			getErrorMessages,
			getValue,
			setValue,
			hasValue,
			isFormDisabled,
			isFormSubmitted,
			isPristine,
			isRequired,
			isValid,
			isValidValue,
			resetValue,
			setValidations,
			showError,
			showRequired,
			validationError,
			validationErrors,
			...rest
		} = this.props;

		return (
			<Translate {...rest} value={getValue() || ''} onChange={this.updateValue}>
				{this.props.children}
			</Translate>
		)
	}
}

export default Formsy.HOC(FormElement);
