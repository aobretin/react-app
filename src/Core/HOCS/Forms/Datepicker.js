/* eslint-disable */
import React, {Component} from 'react';

import { DateRangePicker, SingleDatePicker } from 'react-dates';
import moment from 'moment';

import {extendObservable, toJS} from "mobx";
import {observer} from "mobx-react";

import Formsy from 'formsy-react-2';

@observer class Datepicker extends Component {
	constructor() {
		super();

		extendObservable(this, {
			focusedDateRange: null,
			focusedDateSingle: false
		})
	}

	render() {
		const {
			range,
			startDate,
			endDate,
			setValue,
			getValue,
			onDatesChange,
			onDateChange,
			numberOfMonths,
			date,
			isRTL,
			anchorDirection,
			isOutsideRange,
			showDefaultInputIcon
		} = this.props;

		return (
				range
					?
						<DateRangePicker
							startDate={startDate}
		          			endDate={endDate}
							focusedInput={this.focusedDateRange}
							onFocusChange={focusedDateRange => this.focusedDateRange = focusedDateRange}
							onDatesChange={date => {
								setValue(date);
								onDatesChange(date);
							}}
							isRTL={isRTL}
							anchorDirection={anchorDirection}
							numberOfMonths={numberOfMonths}
							customArrowIcon=" "
							showDefaultInputIcon={showDefaultInputIcon}
						/>
					:
					<SingleDatePicker
						date={getValue()}
						focused={this.focusedDateSingle}
						isOutsideRange={isOutsideRange}
						onDateChange={date => {
							setValue(date);
							onDateChange(date);
							if (this.props.callback) this.props.callback(date);
						}}
						onFocusChange={({ focused }) => this.focusedDateSingle = focused}
						numberOfMonths={numberOfMonths}
					/>
		)
	}
}

Datepicker.defaultProps = {
	range: true
}

export default Formsy.HOC(Datepicker);
