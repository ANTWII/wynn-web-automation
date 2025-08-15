import { test as baseTest } from '@playwright/test';
import { _common } from './common';
import { _UploadPage } from '../pageFactory/UploadPage';
import { TestDataManager } from '../utils/testDataManager';

const test = baseTest.extend<{
  common: _common;
  UploadPage: _UploadPage;
  testDataManager: TestDataManager;
}>({
  common: async ({ page, context }, use) => {
    await use(new _common(page, context));
  },

  UploadPage: async ({ page, context }, use) => {
    await use(new _UploadPage(page, context));
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
