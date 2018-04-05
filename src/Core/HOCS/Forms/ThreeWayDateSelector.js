import React, {Component} from 'react';
import moment from 'moment';
import Formsy from 'formsy-react-2';
import PropTypes from 'prop-types';
import TranslateWrapper from 'react-translate-component';
import {range} from 'HelperMethods';

import {observable, extendObservable, observe} from "mobx";
import {observer} from "mobx-react";

const CLASSES = {
  parentWrapper: 'row no-gutters',
  selector: 'col form-control',
  option: ''
}

const generateYears = (start, end) => range(start, end);

@observer
class ThreeWayDateSelector extends Component {
  static propTypes = {
    startDate: PropTypes.object.isRequired,
    endDate: PropTypes.object.isRequired,
    name: PropTypes.string.isRequired,

    classes: PropTypes.shape({
      parentWrapper: PropTypes.string,
      selector: PropTypes.string,
      option: PropTypes.string
    }),

    initialValue: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.object
    ]),
    customChangeEvent: PropTypes.func
  }

  static defaultProps = {
    classes: {},
    customChangeEvent: () => {}
  }

  constructor(props) {
    super(props);

    extendObservable(this, {
      years: [],
      months: [],
      days: [],

      yearsSelector: '',
      monthsSelector: '',
      daysSelector: ''
    });

    console.log(props.startDate, props.endDate)

    observe(this, change => {
      const {name} = change;

      switch (name) {
        case 'yearsSelector':
          this.generateMonths();
          break;
        case 'monthsSelector':
          this.generateDays();
          break;
      }

      if (name === 'yearsSelector' || name === 'monthsSelector' || name === 'daysSelector') {
        this.handleDateFormat();
      }
    })
  }

  componentWillMount() {
    const {
      startDate,
      endDate,
      initialValue
    } = this.props;

    const startYear = startDate.year();
    const endYear = endDate.year() + 1; // take current year also for range

    let dates = {
      year: '',
      month: '',
      day: ''
    }

    this.years = generateYears(startYear, endYear).reverse();

    if (initialValue) {
      let formatted = '';

      if (typeof initialValue === 'object') {
        formatted = initialValue.format('YYYY-MM-DD');
      } else {
        formatted = initialValue;
      }

      const splitted = formatted.split('-');

      dates.year = splitted[0];
      dates.month = parseInt(splitted[1]).toString();
      dates.day = splitted[2];

      console.log(dates);

      this.yearsSelector = dates.year;
      this.monthsSelector = dates.month;
      this.daysSelector = dates.day;
    }
  }

  handleChange = ({target}) => this[target.name] = target.value;

  generateMonths = () => {
    const {
      startDate,
      endDate
    } = this.props;

    if (!this.yearsSelector.length) {
      this.months.length = 0;
      this.days.length = 0;

      return false;
    }

    const currentYear = moment().year();
    let startRange = 0;
    let endRange = 12;
    let months = [];

    if (startDate.year() == this.yearsSelector) {
      startRange = startDate.month();
    } else if (endDate.year() == this.yearsSelector) {
      endRange = endDate.month() + 1;
    }

    range(startRange, endRange).forEach((month, idx) => {
      months.push(moment(this.yearsSelector).add(startRange + idx, 'months').format("MMMM"));
    });

    this.monthsSelector = '';
    this.daysSelector = '';
    this.days.length = 0;

    return this.months = months.slice();
  }

  generateDays = () => {
    const {
      startDate,
      endDate
    } = this.props;

    let daysInMonth = moment(`${this.yearsSelector}-${this.monthsSelector}`).daysInMonth();
    let startRange = 0;

    if (!this.monthsSelector.length) {
      this.days.length = 0;
      return false;
    }

    if (startDate.year() == this.yearsSelector && (startDate.month() + 1) == this.monthsSelector) {
      const day = parseInt(startDate.format('YYYY-MM-DD').split('-')[2]);

      startRange = day - 1;
    } else if ((endDate.month() + 1) == this.monthsSelector) {
      const day = parseInt(endDate.format('YYYY-MM-DD').split('-')[2]);

      daysInMonth = day + 1;
    }

    let days = [];


    range(startRange, daysInMonth).forEach(day => days.push(day < 9 ? `0${day + 1}` : day + 1));

    this.daysSelector = '';

    return this.days = days.reverse().slice();
  }

  handleDateFormat = () => {
    const {
      yearsSelector,
      monthsSelector,
      daysSelector,
      props: {
        setValue,
        customChangeEvent
      }
    } = this;

    let value = '';

    if (yearsSelector.length && monthsSelector.length && daysSelector.length) {
      value = moment([yearsSelector, monthsSelector, daysSelector]).format('YYYY-MM-DD');
    } else {
      value = undefined;
    }

    customChangeEvent(value);

    return setValue(value);
  }

	render() {
    const {
      years,
      months,
      days,
      yearsSelector,
      monthsSelector,
      daysSelector,
      handleChange,
      props: {
        getValue,
        name,
        classes: initialClasses
      }
    } = this;

    const margedClasses = Object.assign({}, CLASSES, initialClasses);

    const {
      parentWrapper,
      selector,
      option
    } = margedClasses;

		return (
      <div className={parentWrapper}>
        <TranslateWrapper
          name="yearsSelector"
          component='select'
          className={selector}
          value={yearsSelector}
          onChange={handleChange}
        >
          <TranslateWrapper value="" component='option' className={option}>
            Year
          </TranslateWrapper>
          {years.map((year, idx) => <TranslateWrapper key={idx} component='option' value={year} className={option}>{year}</TranslateWrapper>)}
        </TranslateWrapper>

        <TranslateWrapper
          name="monthsSelector"
          component='select'
          className={selector}
          disabled={!months.length}
          value={monthsSelector}
          onChange={handleChange}
        >
          <TranslateWrapper value="" component='option' className={option}>
            Month
          </TranslateWrapper>
          {months.map((month, idx) => <TranslateWrapper key={idx} component='option' value={moment().month(month).format('M')} className={option}>{month}</TranslateWrapper>)}
        </TranslateWrapper>

        <TranslateWrapper
          name="daysSelector"
          component='select'
          className={selector}
          disabled={!days.length}
          value={daysSelector}
          onChange={handleChange}
        >
          <TranslateWrapper value="" component='option' className={option}>
            Day
          </TranslateWrapper>
          {days.map((day, idx) => <TranslateWrapper key={idx} component='option' value={day} className={option}>{day}</TranslateWrapper>)}
        </TranslateWrapper>
        <input type="hidden" name={name} value={getValue() || ''} />
      </div>
		)
	}
}

export default Formsy.HOC(ThreeWayDateSelector);
