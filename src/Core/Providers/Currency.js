import {observable} from "mobx";

class CurrencyProvider {
  static values = observable({
    value: '1',
    currency: ''
  })
}

export default CurrencyProvider;
