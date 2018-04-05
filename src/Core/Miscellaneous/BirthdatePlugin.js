/* eslint-disable */
import $ from "jquery";
import moment from "moment";

export default class BirthdatePlugin {
  static translator = {
      'Months': {
          'FullMonths': {
              "01": "January",
              "02": "February",
              "03": "March",
              "04": "April",
              "05": "May",
              "06": "June",
              "07": "July",
              "08": "August",
              "09": "September",
              "10": "October",
              "11": "November",
              "12": "December"
          },
          'ShortMonths': {
              "01": "Jan",
              "02": "Feb",
              "03": "Mar",
              "04": "Apr",
              "05": "May",
              "06": "Jun",
              "07": "Jul",
              "08": "Aug",
              "09": "Sep",
              "10": "Oct",
              "11": "Nov",
              "12": "Dec"
          }
      }
  };

  static birthdatePlugin = {
      //Attention!! -- as the MinValue and MaxValue injecting in JavaScript from php are inversed
      //And they get inverted in javascript.
      birthDatepicker: {  /* using datepicker */
          passengers : [],
          initIndexes : function()
          {
              var self = this;
              var passengers = this.passengers;
              for(var i = 0; i < passengers.length ; i++)
              {
                  $('#birthdate-datepicker-selector-'+ passengers[i].type + '-' + passengers[i].index).datepicker({
                      minDate: passengers[i].minDate,
                      maxDate: passengers[i].maxDate,
                      dateFormat: 'yy-mm-dd',
                      onSelect: function(SelectedValue) {
                          self.updatePassengerHiddenValue(this, SelectedValue);
                      }
                  });
              }
          },
          pushPassengerData : function(Index, MaxDate, MinDate, Type)
          {
              var passenger = {
                      index : Index,
                      minDate : MinDate,
                      maxDate : MaxDate,
                      type: Type
                  }
              this.passengers.push(passenger)
          },
          updatePassengerHiddenValue : function(DatepickerSelector, SelectedValue)
          {
              var $parent = $(DatepickerSelector).closest('.birthdate-container');
              $parent.find('input[type="hidden"]').each(function()
              {
                  if($(this).hasClass('birthdate'))
                  {
                     $(this).val(SelectedValue);
                  }
              });
          }
      },

      selector: {  /* using separate SELECTOR elements for year, month & day */
          processDaySelector: function(YearValue, MonthValue, DaysSelector)
          {
              var daysInMonth = {'01': 31, '02': 28, '03': 31, '04': 30, '05': 31, '06': 30, '07': 31, '08': 31, '09': 30, '10': 31, '11': 30, '12': 31};
              if (!MonthValue || MonthValue == undefined)
              {
                  MonthValue = '01';
              }
              if (YearValue != undefined && YearValue)
              {
                  YearValue % 4 == 0 ? daysInMonth['02'] = 29 : 28;
              }
              /* Processing the number of days in month. */

              /* Removing all elements */
              $(DaysSelector).children().each(function() {
                  $(this).remove();
              });
              var firstOptionText = DaysSelector.data('first-text') ? DaysSelector.data('first-text') : 'day' ;
              /* Putting elements back */
              $(DaysSelector).append('<option value="">' + firstOptionText + '</option>');
              for (var i = 1; i <= daysInMonth[MonthValue]; i++)
              {
                  var value = i < 10 ? '0' + i : i;
                  $(DaysSelector).append('<option value="' + value + '">' + i + '</option>');
              }
          },
          processMonthSelector: function(monthSelector) {
              monthSelector.children().each(function(){
                  $(this).remove();
              });
              var firstOption = monthSelector.data('first-text') ? monthSelector.data('first-text') : 'month';
              monthSelector.append('<option value="">' + firstOption + '</option>');
              var months = this.translator.Months.FullMonths;
              for (var i=1;i<=12;i++) {
                  var index = i<10 ? '0'+i : i;
                  monthSelector.append('<option value="' + index + '">' + months[index] + '</option>');
              }
          },
          processYearSelector: function(yearSelector, minYear, maxYear){
              yearSelector.children().each(function(){
                  $(this).remove();
              });
              var firstOption = yearSelector.data('first-text') ? yearSelector.data('first-text') : 'year';
              yearSelector.append('<option value="">' + firstOption + '</option>');
              for (var i = parseInt(minYear); i <= parseInt(maxYear); i++) {
                  yearSelector.append('<option value="' + i + '">' + i + '</option>');
              }
          },
          yearChanged: function(YearSelector, MinBirthdate, MaxBirthdate)
          {
              var $parent = $(YearSelector).closest('.birthdate-container');

              var $yearSelector = $(YearSelector);
              var $monthSelector = $parent.find('.birth-month');
              var $daySelector = $parent.find('.birth-day');

              var minBirthdate = new Date(MinBirthdate);
              var maxBirthdate = new Date(MaxBirthdate);
              var minYear, minMonth, maxYear, maxMonth;
              if (!maxBirthdate || maxBirthdate == 'Invalid Date') {
                  maxBirthdate = moment(MaxBirthdate, 'YYYY-MM-DD');
                  maxYear = maxBirthdate.get('year');
                  maxMonth = maxBirthdate.get('month') + 1;
              }else {
                  maxYear = maxBirthdate.getFullYear();
                  maxMonth = maxBirthdate.getMonth() + 1;
              }
              if (!minBirthdate || minBirthdate == 'Invalid Date') {
                  minBirthdate = moment(MinBirthdate, 'YYYY-MM-DD');
                  minYear = minBirthdate.get('year');
                  minMonth = minBirthdate.get('month') + 1;
              }else {
                  minYear = minBirthdate.getFullYear();
                  minMonth = minBirthdate.getMonth() + 1;
              }
              var selectedYear = $yearSelector.val();
              var selectedMonth = $daySelector.val();
              var selectedDay = $monthSelector.val();

              /* Reset month selector and day selector */

              this.resetMonthSelector($monthSelector);
              this.resetDaySelector($daySelector);
              this.processDaySelector($yearSelector.val(), $monthSelector.val(), $daySelector);
              this.processMonthSelector($monthSelector);
              if (selectedYear == minYear)
              {
                  $monthSelector.children().each(function()
                  {
                      if (this.value && this.value < minMonth)
                      {
                          $(this).remove();
                      }
                  });
              }
              else if (selectedYear == maxYear)
              {
                  $monthSelector.children().each(function()
                  {
                      if (this.value && this.value > maxMonth)
                      {
                          $(this).remove();
                      }
                  });
              }

              this.updatePassengerHiddenValue(selectedYear, selectedMonth, selectedDay, MinBirthdate, MaxBirthdate, $parent);
          },
          monthChanged: function(MonthSelector, MinBirthdate, MaxBirthdate)
          {
              var $parent = $(MonthSelector).closest('.birthdate-container');

              var $monthSelector = $(MonthSelector);
              var $yearSelector = $parent.find('.birth-year');
              var $daySelector = $parent.find('.birth-day');

              var minBirthdate = new Date(MinBirthdate);
              var maxBirthdate = new Date(MaxBirthdate);
              var minYear, maxYear, minMonth, maxMonth, minDay, maxDay;
              if (!minBirthdate || minBirthdate == 'Invalid Date') {
                  minBirthdate = moment(MinBirthdate, 'YYYY-MM-DD');
                  maxYear = minBirthdate.get('year');
                  maxMonth = minBirthdate.get('month') + 1;
                  maxDay = minBirthdate.get('date');
              }else {
                  maxYear = minBirthdate.getFullYear();
                  maxMonth = minBirthdate.getMonth() + 1;
                  maxDay = minBirthdate.getDate();
              }
              if (!maxBirthdate || maxBirthdate == 'Invalid Date') {
                  maxBirthdate = moment(MaxBirthdate, 'YYYY-MM-DD');
                  minYear = maxBirthdate.get('year');
                  minMonth = maxBirthdate.get('month') + 1;
                  minDay = maxBirthdate.get('date');
              }else {
                  var minYear = maxBirthdate.getFullYear();
                  var minMonth = maxBirthdate.getMonth() + 1;
                  var minDay = maxBirthdate.getDate();
              }

              var selectedYear = $yearSelector.val();
              var selectedMonth = $monthSelector.val();
              var selectedDay = $daySelector.val();


              this.resetDaySelector($daySelector);

              /* process day in month first. */
              this.processDaySelector(selectedYear, selectedMonth, $daySelector);

              if (selectedYear == minYear && selectedMonth == minMonth)
              {
                  $daySelector.children().each(function() {
                      if (this.value < minDay && this.value != '')
                      {
                          $(this).remove();
                      }
                  });
              }
              if (selectedYear == maxYear && selectedMonth == maxMonth)
              {
                  $daySelector.children().each(function() {
                      if (this.value > maxDay && this.value != '')
                      {
                          $(this).remove();
                      }
                  });
              }
              this.updatePassengerHiddenValue(selectedYear, selectedMonth, selectedDay, MinBirthdate, MaxBirthdate, $parent);
          },
          dayChanged: function(DaySelector, MinBirthdate, MaxBirthdate)
          {
              var $parent = $(DaySelector).closest('.birthdate-container');

              var $daySelector = $(DaySelector);
              var $yearSelector = $parent.find('.birth-year');
              var $monthSelector = $parent.find('.birth-month');

              var selectedDay = $daySelector.val();
              var selectedMonth = $monthSelector.val();
              var selectedYear = $yearSelector.val();

              this.updatePassengerHiddenValue(selectedYear, selectedMonth, selectedDay, MinBirthdate, MaxBirthdate, $parent);
          },
          resetMonthSelector: function(MonthSelector)
          {
              $(MonthSelector).children().each(function()
              {
                  $(this).removeAttr('style');
              });
              $(MonthSelector).val('');
          },
          resetDaySelector: function(DaySelector)
          {
              $(DaySelector).children().each(function()
              {
                  $(this).removeAttr('style');
              });
              $(DaySelector).val('');
          },
          updatePassengerHiddenValue: function(SelectedYear, SelectedMonth, SelectedDay, MaxValue, MinValue, Parent)
          {
              var invalidDate = false;
              var encounteredError = '';
              if (!SelectedDay)
              {
                  invalidDate = true;
                  encounteredError = 'Day not selected';
                  /* throw 'Day is not selected'; */
              }
              if (!SelectedMonth)
              {
                  invalidDate = true;
                  encounteredError = 'Month not selected';
                  /* throw 'Month is not selected'; */
              }
              if (!SelectedYear)
              {
                  invalidDate = true;
                  encounteredError = 'Year not selected';
                  /* throw 'Year is not selected'; */
              }

              var composedDate = SelectedYear + '-' + SelectedMonth + '-' + SelectedDay;
              var selectedDate = new Date(composedDate);
              var maxDatePossible = new Date(MaxValue);
              var minDatePossible = new Date(MinValue);

              if (selectedDate < minDatePossible && selectedDate.getTime() >= maxDatePossible.getTime())
              {
                  encounteredError = 'Selected date is out of range';
                  invalidDate = true;
              }
              if (invalidDate)
              {
                  var invalidValue = '';
                  this.updateHiddenValue(Parent, invalidValue);
                  //console.info(encounteredError);
              }
              else
              {
                  this.updateHiddenValue(Parent, composedDate);
              }
          },
          updateHiddenValue : function(Container, Value)
          {
              $(Container).find('input[type="hidden"]').each(function()
              {
                  if($(this).hasClass('birthdate'))
                  {
                      $(this).val(Value);
                  }
              });
          }
      },
      calcBDMinMax: function(params){

          var limitDate = moment(params.limitDate);

          var returnYear = limitDate.year();
          var returnMonth = limitDate.month() + 1;
          var returnDay = limitDate.date();

          var minAge = 12;
          var maxAge = 65;
          switch(params.type) {
              case 'ADT':
                  minAge = 12;
                  maxAge = 116;
                  break;
              case 'CHD':
                  minAge = 2;
                  maxAge = 12;
                  break;
  //            case 'SEN':
  //                minAge = 65;
  //                maxAge = 120;
  //                break;
              case 'INF':
                  minAge = 0;
                  maxAge = 2;
                  break;
              case 'INS':
                  minAge = 0;
                  maxAge = 2;
                  break;
          }
          if (params.age) {
              minAge = parseInt( parseInt(params.age) );
              maxAge = parseInt( parseInt(params.age) + 1 );
          }

          var $minBirthdate = moment(params.limitDate).subtract(maxAge, 'years').add(1,'days');
          var $maxBirthdate = moment(params.limitDate).subtract(minAge, 'years');

          var result = {
              minBd: $minBirthdate.format('YYYY-MM-DD'),
              maxBd: $maxBirthdate.format('YYYY-MM-DD'),
              minYear: $minBirthdate.format('Y'),
              maxYear: $maxBirthdate.format('Y')
          }

          return result;

      }
  }
}
