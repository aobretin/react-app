import {observable} from "mobx";
import Config from 'Config';

const MOBILE_BREAK = Config.MobileBreakpoint;

class IsMobileProvider {
  static provider = observable({
  	device: window.innerWidth <= MOBILE_BREAK ? 'MOBILE' : 'DESKTOP'
  })
}

export default IsMobileProvider;
