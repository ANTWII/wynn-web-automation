import { test as baseTest } from '@playwright/test';
import { _common } from './common';
import { _UploadPage } from '../pageFactory/UploadPage';
import { _MainPage } from '../pageFactory/MainPage';
import { TestDataManager } from '../utils/testDataManager';

const test = baseTest.extend<{
  common: _common;
  UploadPage: _UploadPage;
  MainPage: _MainPage;
  testDataManager: TestDataManager;
}>({
  common: async ({ page, context }, use) => {
    await use(new _common(page, context));
  },

  UploadPage: async ({ page, context }, use) => {
    await use(new _UploadPage(page, context));
  },

  MainPage: async ({ page, context }, use) => {
    await use(new _MainPage(page, context));
  },

  testDataManager: async ({}, use) => {
    const manager = new TestDataManager();
    manager.initialize();
    await use(manager);
    // Cleanup after test if needed
    // manager.cleanupTestData();
  }
});

export default test;
