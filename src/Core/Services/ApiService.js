import Axios, {CancelToken} from 'axios';
import Qs from 'qs';


const PUBLIC_URL = 'http://192.168.0.30/dynapack/clients/csb/public';
const BASE_URL = 'http://192.168.0.30/dynapack/clients/bitusi/public/api.php';

let activeReq = {};

export default class ApiService {
	static req(url, type = 'get', data = null, params = null) {
		const source = CancelToken.source();

		return Axios.request({
			url: url,
			method: type,
			baseURL: BASE_URL,
			withCredentials: true,
			headers: {'Content-Type': 'application/x-www-form-urlencoded'},
      params: params,
      cancelToken: source.token,
      paramsSerializer: params => Qs.stringify(params, {arrayFormat: 'brackets'}),
			data: data && Object.keys(data).length > 0 ? Qs.stringify(data, {arrayFormat: 'brackets'}) : null
		}).then(res => {
			return res;
		});
	}

	static getCmsPages(name = ''){
		return Axios.request({
			url: `http://192.168.0.30/dynapack/clients/bitusi/public/api.php/cms/pages${name}`,
			method: 'GET',
			headers: {'Content-Type': 'application/x-www-form-urlencoded'} 
		});
	}

	static getCmsSnippets(name = ''){
		return Axios.request({
			url: `http://192.168.0.30/dynapack/clients/bitusi/public/api.php/cms/snippets${name}`,
			method: 'GET',
			headers: {'Content-Type': 'application/x-www-form-urlencoded'} 
		});
	}

	static getDataSource(url) {
		return Axios.request({
			url: url,
			method: 'GET',
			headers: {'Content-Type': 'application/x-www-form-urlencoded'}
		});
	}

	static getLocations(url) {
		return Axios.request({
			url: url,
			method: 'GET',
			baseURL: PUBLIC_URL
		});
	}

	static q(urls = {}, type = 'get', data = [], params = []) {
		return Axios.all(Object.keys(urls).map((key, idx) => {
			return this.req(urls[key], type, data[idx], params[idx])
		})).then(resp => {
			let processedResp = {};

			Object.keys(urls).forEach((res, index) => {
				processedResp[res] = resp[index];
				// delete this.activeReq[res];
			});

			return processedResp;
		});
	}

	static cancelReq(url) {
		return activeReq[url]();
	}
}
