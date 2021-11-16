export const USER_LANGUAGE_KEY = 'user_language';

export const locale_full = navigator.language;

let userLanguage = window.localStorage.getItem(USER_LANGUAGE_KEY)?.toUpperCase();

if ( !userLanguage ) {
  userLanguage = locale_full.split('-')[1]?.toUpperCase() || 'US';
  window.localStorage.setItem(USER_LANGUAGE_KEY, userLanguage);
}

export const locale = userLanguage;
