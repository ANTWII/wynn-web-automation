import { test as baseTest } from '@playwright/test';
import { _common } from './common';
import { _UploadPage } from '../pageFactory/UploadPage';


const test = baseTest.extend<{
  common: _common;
  UploadPage: _UploadPage;
 
}>({
  common: async ({ page, context }, use) => {
    await use(new _common(page, context));
  },

  UploadPage: async ({ page, context }, use) => {
    await use(new _UploadPage(page, context));
  }


});

export default test;
