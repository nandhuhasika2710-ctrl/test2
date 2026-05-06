/* Copyright (c) 2024, Oracle and/or its affiliates */

define([], () => {
  'use strict';
  
  class PageModule {
    setAppLanguage(selectedLocale){
        if (selectedLocale)  {
          window.localStorage.setItem('translationApplication.locale',selectedLocale);
        }
      }
  }
    
  return PageModule;
});
  