import Cookies from 'universal-cookie';

const cookies = new Cookies();

const setCookie = (name, value) => cookies.set(name, JSON.stringify(value), {path: '/'});
const getCookie = name => cookies.get(name);
const removeCookie = name => cookies.remove(name, {path: '/'});

export {
  setCookie,
  getCookie,
  removeCookie
}
