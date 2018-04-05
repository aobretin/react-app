import React from 'react';
import {observer} from "mobx-react";

const ViewDesktop = props => {
  const {
    amount,
    currencyValues,
    ...rest
  } = props;

  return (
    <span {...rest}>
			{(amount * currencyValues.value).toFixed(2)} {currencyValues.currency}
		</span>
  )
}

export default observer(ViewDesktop);
