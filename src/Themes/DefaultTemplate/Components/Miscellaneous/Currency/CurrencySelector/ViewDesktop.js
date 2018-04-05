import React from 'react';
import {observer} from "mobx-react";

const ViewDesktop = props => {
	const {
		showCurrencySelector,
		toggleCurrencyConverter,
		currentCurrency,
		handleChange,
		currencies
	} = props;

	return (
		<div className="col dropdown" id="currDrop">
			<a href="javascript:;" onClick={toggleCurrencyConverter} className={`dropdown-toggle ${showCurrencySelector ? ' show' : ''}`} data-toggle="dropdown"><span className="icon-curr mr5 ver-sub"></span>{currentCurrency}</a>
			<div className={`dropdown-menu align-right ${showCurrencySelector ? ' show' : ''}`} aria-labelledby="currDrop">
				{
					currencies.map((curr, idx) => {
						return (
							<a href="javascript:;" key={idx} onClick={() => {handleChange(curr.Code); toggleCurrencyConverter()}} className="dropdown-item">{curr.Name}</a>
						)
					})
				}
			</div>
		</div>
	)
}

export default observer(ViewDesktop);
