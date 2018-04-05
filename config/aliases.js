var path = require('path');

module.exports = {
  // PATHS
  Source: path.resolve(__dirname, '../src'),

  // GENERAL
  App: path.resolve(__dirname, '../src/App'),
  Config: path.resolve(__dirname, '../src/Config'),

  // HOCS
  SearchCore: path.resolve(__dirname, '../src/Core/HOCS/Search/Search'),
  FormElement: path.resolve(__dirname, '../src/Core/HOCS/Forms/FormElement'),
  ThreeWayDateSelector: path.resolve(__dirname, '../src/Core/HOCS/Forms/ThreeWayDateSelector'),
  Datepicker: path.resolve(__dirname, '../src/Core/HOCS/Forms/Datepicker'),
  TypeaheadElement: path.resolve(__dirname, '../src/Core/HOCS/Forms/Typeahead'),
  ListCore: path.resolve(__dirname, '../src/Core/HOCS/List/List'),
  FlightListCore: path.resolve(__dirname, '../src/Core/HOCS/List/Flight/FlightList'),
  FlightFiltersCore: path.resolve(__dirname, '../src/Core/HOCS/List/Flight/Filters'),
  HotelListCore: path.resolve(__dirname, '../src/Core/HOCS/List/Hotel/HotelList'),
  HotelFiltersCore: path.resolve(__dirname, '../src/Core/HOCS/List/Hotel/HotelFilters'),
  HotelRoomsCore: path.resolve(__dirname, '../src/Core/HOCS/List/Hotel/HotelRooms'),
  HotelPackagesCore: path.resolve(__dirname, '../src/Core/HOCS/List/Hotel/HotelPackages'),
  PaginationCore: path.resolve(__dirname, '../src/Core/HOCS/Miscellaneous/Pagination/Pagination'),
  CurrencyCore: path.resolve(__dirname, '../src/Core/HOCS/Miscellaneous/Currency/Currency'),
  LanguagesCore: path.resolve(__dirname, '../src/Core/HOCS/Miscellaneous/Languages/Languages'),
  CartCore: path.resolve(__dirname, '../src/Core/HOCS/Cart/Cart'),
  CheckoutCore: path.resolve(__dirname, '../src/Core/HOCS/Cart/CheckoutCore'),
  Flight_HotelListCore: path.resolve(__dirname, '../src/Core/HOCS/List/Flight_Hotel/Flight_HotelList'),
  BookCore: path.resolve(__dirname, '../src/Core/HOCS/Book/Book'),
  BookFormCore: path.resolve(__dirname, '../src/Core/HOCS/Book/BookForm'),
  AccountCore: path.resolve(__dirname, '../src/Core/HOCS/User/Account/Account'),
  UserAccountCore: path.resolve(__dirname, '../src/Core/HOCS/User/Account/UserAccount'),
  MyReservationsCore: path.resolve(__dirname, '../src/Core/HOCS/User/Account/MyReservations'),
  HotelDetailsCore: path.resolve(__dirname, '../src/Core/HOCS/Details/Hotel/HotelDetails'),

  // SERVICES
  SearchService: path.resolve(__dirname, '../src/Core/Services/SearchService'),
  ApiService: path.resolve(__dirname, '../src/Core/Services/ApiService'),
  HelperMethods: path.resolve(__dirname, '../src/Core/Services/HelperMethods'),
  BookHelperMethods: path.resolve(__dirname, '../src/Core/Services/BookHelperMethods'),
  Cookies: path.resolve(__dirname, '../src/Core/Services/Cookies'),

  // PROVIDERS
  CartProvider: path.resolve(__dirname, '../src/Core/Providers/Cart'),
  CurrencyProvider: path.resolve(__dirname, '../src/Core/Providers/Currency'),
  LanguagesProvider: path.resolve(__dirname, '../src/Core/Providers/Languages'),
  IsMobileProvider: path.resolve(__dirname, '../src/Core/Providers/IsMobile'),
  UserProvider: path.resolve(__dirname, '../src/Core/Providers/User'),

  // HELPERS
  AirlineLogos: path.resolve(__dirname, '../src/assets/img/airline-logos'),
  BirthdatePlugin: path.resolve(__dirname, '../src/Core/Miscellaneous/BirthdatePlugin'),
  AirlinesJson: path.resolve(__dirname, '../src/Core/Miscellaneous/Airlines'),
  CountriesJson: path.resolve(__dirname, '../src/Core/Miscellaneous/Countries'),
  TranslateWrapper: path.resolve(__dirname, '../src/Core/Miscellaneous/Translate'),
  ModalWrapper: path.resolve(__dirname, '../src/Core/Miscellaneous/Modal/Modal'),
  AsyncComponent: path.resolve(__dirname, '../src/Core/Miscellaneous/AsyncComponent'),

  //CMS
  DynamicTemplateConstructor: path.resolve(__dirname, '../src/Core/Miscellaneous/CMS/DynamicTemplateConstructor'),
  ReplaceSnippetWithTwig: path.resolve(__dirname, '../src/Core/Miscellaneous/CMS/ReplaceSnippetWithTwig'),
  ReplaceSnippetWithHtml: path.resolve(__dirname, '../src/Core/Miscellaneous/CMS/ReplaceSnippetWithHtml'),
  CMSMethods: path.resolve(__dirname, '../src/Core/Miscellaneous/CMS/CMSMethods'),
  PlaceholderConstructor: path.resolve(__dirname, '../src/Core/Miscellaneous/CMS/PlaceholderConstructor')
}
