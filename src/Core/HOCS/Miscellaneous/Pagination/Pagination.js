/* eslint-disable */
import React, {Component} from 'react';

import ApiService from 'ApiService';
import PropTypes from 'prop-types';

import {range} from 'HelperMethods';

import {observable, extendObservable, toJS} from "mobx";
import {observer, inject} from "mobx-react";

const PaginationCore = (View) => {
	return @observer class extends Component {
	  	static propTypes = {
            items: PropTypes.oneOfType([
              PropTypes.array.isRequired,
              PropTypes.number.isRequired,
              PropTypes.string.isRequired
            ]),
            local: PropTypes.bool,
            preventReload: PropTypes.bool,
            onChangePage: PropTypes.func.isRequired,
            initialPage: PropTypes.number,
	    }

	    static defaultProps = {
            local: false,
            preventReload: false,
            initialPage: 1
	    }

	    constructor(props) {
	      super(props);

            extendObservable(this, {
                pager: {},
                items: props.local ? props.items : range(0, props.items)
		    })
	}

    componentWillMount() {
        // set page if items array isn't empty
        if (this.items && this.items.length) {
            this.setPage(this.props.initialPage);
        }
    }

    componentDidUpdate(prevProps, prevState) {
        // reset page if items array has changed

        let checker = this.props.local ? this.props.items.length !== prevProps.items.length : this.props.items !== prevProps.items;

        if (checker) {
            if (this.props.preventReload) {
              let items = this.props.local ? this.props.items : range(0, this.props.items);

              this.pager = this.getPager(items.length, this.props.initialPage);
            } else {
              this.setPage(this.props.initialPage);
            }
        }
    }

    setPage = (page) => {
        let items = this.props.local ? this.props.items : range(0, this.props.items);
        let pager = this.pager;

        if (page < 1 || (page > pager.totalPages && pager.totalPages != 0)) {
            return;
        }

        // get new pager object for specified page
        pager = this.getPager(items.length, page);

        // get new page of items from items array
        var pageOfItems = items.slice(pager.startIndex, pager.endIndex + 1);

        // update state
        this.pager = pager;

        // call change page function in parent component

        let param = this.props.local ? pageOfItems : page;

        this.props.onChangePage(param);
    }

    getPager = (totalItems, currentPage, pageSize) => {
        // default to first page
        currentPage = currentPage || 1;

        // default page size is 10
        pageSize = pageSize || 10;

        // calculate total pages
        let totalPages = Math.ceil(totalItems / pageSize);

        let startPage, endPage;
        if (totalPages <= 10) {
            // less than 10 total pages so show all
            startPage = 1;
            endPage = totalPages;
        } else {
            // more than 10 total pages so calculate start and end pages
            if (currentPage <= 6) {
                startPage = 1;
                endPage = 10;
            } else if (currentPage + 4 >= totalPages) {
                startPage = totalPages - 9;
                endPage = totalPages;
            } else {
                startPage = currentPage - 5;
                endPage = currentPage + 4;
            }
        }

        // calculate start and end item indexes
        let startIndex = (currentPage - 1) * pageSize;
        let endIndex = Math.min(startIndex + pageSize - 1, totalItems - 1);

        // create an array of pages to ng-repeat in the pager control
        let pages = range(startPage, endPage + 1);

        // return object with all pager properties required by the view
        return {
            totalItems: totalItems,
            currentPage: currentPage,
            pageSize: pageSize,
            totalPages: totalPages,
            startPage: startPage,
            endPage: endPage,
            startIndex: startIndex,
            endIndex: endIndex,
            pages: pages
        };
    }

		render(){
			return (
		        <View
              pager={this.pager}
              setPage={this.setPage}
		        	{...this.props}
		        >
		          {this.props.children}
		        </View>
			)

		}
	}
}

export default PaginationCore;
