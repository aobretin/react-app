import React from 'react';

import {toJS} from "mobx";
import {observer} from "mobx-react";

import moment from 'moment';

import ReactTable from 'react-table';
import CurrencyConverter from 'CurrencyConverter';

const columns = [
  {
    Header: 'Owner',
    id: 'Owner.FirstName|like',
    accessor: row => row.Owner ? `${row.Owner.FirstName} ${row.Owner.LastName}` : 'Unkown'
  },
  {
    Header: 'Service',
    id: 'Service|like',
    accessor: row => row.Services ? Object.keys(row.Services).join(' &nbsp; ') : ''
  },
  {
    Header: 'Destination',
    id: 'Destination',
    filterable: false,
    sortable: false,
    accessor: row => {
      let template = null;

      if (typeof row.Services === 'undefined') return '';

      Object.keys(row.Services).map( (serviceType, index) => {
				const serviceObj = row.Services[serviceType][0];
				if (serviceType == "hotel") {
					template =	<div key={index}>
						Check-in: 	{moment(serviceObj.Checkin).format('DD MMM YYYY')}<br/>
						Check-out: 	{moment(serviceObj.Checkout).format('DD MMM YYYY')}
					</div>
				} else if (serviceType == "flight") {
					template =	<div key={index}>
						Departure: 	{moment(serviceObj.Routes[0].OriginDate).format('DD MMM YYYY')}<br />
						Return: 	{moment(serviceObj.Routes[serviceObj.Routes.length - 1].OriginDate).format('DD MMM YYYY')}
					</div>
				}
			})

      return template;
    }
  },
  {
    Header: 'Price',
    id: 'Amount|greaterThan',
    accessor: row => <CurrencyConverter amount={row.Amount} />
  },
  {
    Header: 'Book date',
    id: 'a',
    accessor: row => moment(row.Date).format('DD MMM YYYY HH:mm')
  },
  {
    Header: 'Status',
    id: 'StatusMessage',
    accessor: row => row.StatusMessage
  }
]

// MAIN RENDER
const ViewDesktop = props => {
  const {
    data,
    orders,
    ordersDetails,
    resultsReady,
    getOrders
  } = props;

  return (
    <ReactTable
      columns={columns}
      manual
      data={orders}
      pages={data.page_count}
      loading={!resultsReady}
      onFetchData={getOrders}
      filterable
      defaultPageSize={10}
      pageSizeOptions={[5, 10]}
      defaultSorted={[{id: 'Timestamp', desc: true}]}
    />
  )
}

export default observer(ViewDesktop);
