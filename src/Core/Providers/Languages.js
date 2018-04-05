import {observable} from "mobx";

import * as TranslateFiles from '../../translations'; 

import Counterpart from 'counterpart';

import moment from 'moment';

import ar from 'moment/locale/ar';
import fr from 'moment/locale/fr';
import ro from 'moment/locale/ro';

// const getLanguages 
Object.keys(TranslateFiles).forEach(lang => Counterpart.registerTranslations(lang.toLowerCase(), TranslateFiles[lang]));

moment.locale('en');

class LanguagesProvider {

	static data = observable({
		languages: [
			{
				code: 'en',
				isoCode: 'en_EN',
			    name: 'English',
			    isRtl: false,
				isDefault: true
			},
			{
				code: 'ro',
			    name: 'Româna',
			    isRtl: false,
				isDefault: false
			},
			{
				code: 'fr',
			    name: 'Frenchoi',
			    isRtl: false,
				isDefault: false
			},
			{
				code: 'ar',
			    name: 'Araba',
			    isRtl: true,
				isDefault: false
			}
		],
		locale: observable('en'),
		activeLanguage: observable({
			code: 'en',
			name: 'English',
			isRtl: false,
			isDefault: true
		}),
		methods: {
			changeLanguage: langObj => {
				LanguagesProvider.data.activeLanguage = langObj;
     			Counterpart.setLocale(langObj.code);
     			LanguagesProvider.data.locale = langObj.code;

     			moment.locale(langObj.code);
			}	
		}
	})
}

export default LanguagesProvider;
