import test from '../helper/baseTest';
import { expect } from '@playwright/test';
import { Logger } from '../utils/logger';

test.describe('File Upload via Main Page Navigation', () => {
  const logger = Logger.getInstance();

  test.beforeEach(async ({ MainPage }) => {
    await MainPage.navigate();
  });

  test('Verify navigation from main page to upload page works correctly', { tag: ["@smoke", "@regression"] }, async ({ MainPage, UploadPage }) => {
    logger.info('Starting test: Verify navigation from main page to upload page works correctly');
    
    try {
      const pageTitle = await MainPage.getPageTitle();
      expect(pageTitle).toContain('The Internet');
      
      const isLinkVisible = await MainPage.isLinkVisible('File Upload');
      expect(isLinkVisible).toBeTruthy();
      
      await MainPage.clickFileUpload();
      
      const uploadPageTitle = await UploadPage.getPageTitle();
      expect(uploadPageTitle).toBe('File Uploader');
    } catch (error) {
      logger.error('Test failed: Verify navigation from main page to upload page works correctly', error as Error);
      throw error;
    }
  });

  test('Verify file upload functionality after navigating from main page', { tag: ["@smoke", "@regression", "@critical"] }, async ({ MainPage, UploadPage, testDataManager }) => {
    logger.info('Starting test: Verify file upload functionality after navigating from main page');
    
    try {
      await MainPage.clickFileUpload();
      
      const testFilePath = testDataManager.getTestFilePath('test-file.txt');
      
      await UploadPage.uploadFile(testFilePath);
      
      const isSuccess = await UploadPage.isUploadSuccessful();
      expect(isSuccess).toBeTruthy();
    } catch (error) {
      logger.error('Test failed: Verify file upload functionality after navigating from main page', error as Error);
      throw error;
    }
  });
});

test.describe('File Upload Functionality - Core Tests', () => {
  const logger = Logger.getInstance();

  test.beforeEach(async ({ MainPage }) => {
    await MainPage.navigate();
    await MainPage.clickFileUpload();
  });

  test('Verify successful upload of text file', { tag: ["@smoke", "@regression", "@critical"] }, async ({ UploadPage, testDataManager }) => {
    logger.info('Starting test: Verify successful upload of text file');
    
    try {
      const testFilePath = testDataManager.getTestFilePath('test-file.txt');

      await UploadPage.uploadFile(testFilePath);

      const isSuccess = await UploadPage.isUploadSuccessful();
      expect(isSuccess).toBeTruthy();
      
      const uploadedFileName = await UploadPage.getUploadedFileName();
      expect(uploadedFileName).toContain('test-file.txt');
    } catch (error) {
      logger.error('Test failed: Verify successful upload of text file', error as Error);
      throw error;
    }
  });

  test('Verify successful upload of PDF file', { tag: ["@regression", "@sanity"] }, async ({ UploadPage, testDataManager }) => {
    logger.info('Starting test: Verify successful upload of PDF file');
    
    try {
      const testFilePath = testDataManager.getTestFilePath('test-document.pdf');

      await UploadPage.uploadFile(testFilePath);

      const isSuccess = await UploadPage.isUploadSuccessful();
      expect(isSuccess).toBeTruthy();
      
      const uploadedFileName = await UploadPage.getUploadedFileName();
      expect(uploadedFileName).toContain('test-document.pdf');
    } catch (error) {
      logger.error('Test failed: Verify successful upload of PDF file', error as Error);
      throw error;
    }
  });

  test('Verify upload page displays correct title', { tag: ["@sanity", "@ui"] }, async ({ UploadPage }) => {
    logger.info('Starting test: Verify upload page displays correct title');
    
    try {
      const title = await UploadPage.getPageTitle();
      expect(title).toBe('File Uploader');
    } catch (error) {
      logger.error('Test failed: Verify upload page displays correct title', error as Error);
      throw error;
    }
  });

  test('Verify all page elements are present on upload page', { tag: ["@sanity", "@ui", "@regression"] }, async ({ UploadPage }) => {
    logger.info('Starting test: Verify all page elements are present on upload page');
    
    try {
      const elementsPresent = await UploadPage.verifyPageElements();
      expect(elementsPresent).toBeTruthy();
    } catch (error) {
      logger.error('Test failed: Verify all page elements are present on upload page', error as Error);
      throw error;
    }
  });

  test('Verify upload button is enabled by default', { tag: ["@sanity", "@ui"] }, async ({ UploadPage }) => {
    logger.info('Starting test: Verify upload button is enabled by default');
    
    try {
      const isEnabled = await UploadPage.isUploadButtonEnabled();
      expect(isEnabled).toBeTruthy();
    } catch (error) {
      logger.error('Test failed: Verify upload button is enabled by default', error as Error);
      throw error;
    }
  });
});

test.describe('File Upload Functionality - Navigation Tests', () => {
  const logger = Logger.getInstance();

  test.beforeEach(async ({ MainPage }) => {
    await MainPage.navigate();
    await MainPage.clickFileUpload();
  });

  test('Verify navigation back to main page after file upload', { tag: ["@regression", "@navigation"] }, async ({ MainPage, UploadPage, testDataManager, page }) => {
    logger.info('Starting test: Verify navigation back to main page after file upload');
    
    try {
      const testFilePath = testDataManager.getTestFilePath('test-file.txt');
      await UploadPage.uploadFile(testFilePath);
      
      await page.goBack();
      await page.goBack();
      
      const isMainPageLoaded = await MainPage.isPageLoaded();
      expect(isMainPageLoaded).toBeTruthy();
      
      const pageTitle = await MainPage.getPageTitle();
      expect(pageTitle).toContain('The Internet');
    } catch (error) {
      logger.error('Test failed: Verify navigation back to main page after file upload', error as Error);
      throw error;
    }
  });
});

test.describe('File Upload Functionality - Advanced Tests', () => {
  const logger = Logger.getInstance();

  test.beforeEach(async ({ MainPage }) => {
    await MainPage.navigate();
    await MainPage.clickFileUpload();
  });

  test('Verify multiple file uploads work consecutively', { tag: ["@regression", "@performance"] }, async ({ MainPage, UploadPage, testDataManager }) => {
    logger.info('Starting test: Verify multiple file uploads work consecutively');
    
    try {
      const numberOfUploads = 3;
      
      for (let i = 0; i < numberOfUploads; i++) {
        if (i > 0) {
          await MainPage.navigate();
          await MainPage.clickFileUpload();
        }
        
        const testFilePath = testDataManager.getTestFilePath('test-file.txt');
        await UploadPage.uploadFile(testFilePath);

        const isSuccess = await UploadPage.isUploadSuccessful();
        expect(isSuccess, `Upload ${i + 1} failed`).toBeTruthy();
      }
    } catch (error) {
      logger.error('Test failed: Verify multiple file uploads work consecutively', error as Error);
      throw error;
    }
  });

  test('Verify page refresh behavior maintains functionality', { tag: ["@regression", "@stability"] }, async ({ UploadPage, testDataManager, page }) => {
    logger.info('Starting test: Verify page refresh behavior maintains functionality');
    
    try {
      const testFilePath = testDataManager.getTestFilePath('test-file.txt');
      await UploadPage.uploadFile(testFilePath);
      
      const isSuccess = await UploadPage.isUploadSuccessful();
      expect(isSuccess).toBeTruthy();
      
      await page.goBack();
      await page.reload();
      
      const pageTitle = await UploadPage.getPageTitle();
      expect(pageTitle).toBe('File Uploader');
    } catch (error) {
      logger.error('Test failed: Verify page refresh behavior maintains functionality', error as Error);
      throw error;
    }
  });

  test('Verify file input clearing maintains button state', { tag: ["@regression", "@ui"] }, async ({ MainPage, UploadPage, testDataManager }) => {
    logger.info('Starting test: Verify file input clearing maintains button state');
    
    try {
      const testFilePath = testDataManager.getTestFilePath('test-file.txt');
      await UploadPage.uploadFile(testFilePath);
      
      await MainPage.navigate();
      await MainPage.clickFileUpload();
      await UploadPage.clearFileInput();

      const isEnabled = await UploadPage.isUploadButtonEnabled();
      expect(isEnabled).toBeTruthy();
    } catch (error) {
      logger.error('Test failed: Verify file input clearing maintains button state', error as Error);
      throw error;
    }
  });
});

test.describe('File Upload Functionality - Edge Cases', () => {
  const logger = Logger.getInstance();

  test.beforeEach(async ({ MainPage }) => {
    await MainPage.navigate();
    await MainPage.clickFileUpload();
  });

  test('Verify upload functionality with different file types from test data', { tag: ["@regression", "@comprehensive"] }, async ({ UploadPage, testDataManager }) => {
    logger.info('Starting test: Verify upload functionality with different file types from test data');
    
    try {
      const fileTypes = ['test-file.txt', 'test-document.pdf', 'test-data.csv', 'test-data.json'];
      
      for (const fileName of fileTypes) {
        if (fileName !== fileTypes[0]) {
          await UploadPage.navigate();
        }
        
        const testFilePath = testDataManager.getTestFilePath(fileName);
        await UploadPage.uploadFile(testFilePath);

        const isSuccess = await UploadPage.isUploadSuccessful();
        expect(isSuccess, `Failed to upload ${fileName}`).toBeTruthy();
        
        const uploadedFileName = await UploadPage.getUploadedFileName();
        expect(uploadedFileName).toContain(fileName);
      }
    } catch (error) {
      logger.error('Test failed: Verify upload functionality with different file types from test data', error as Error);
      throw error;
    }
  });

  test('Verify upload button is enabled by default on page load', { tag: ["@sanity", "@ui"] }, async ({ UploadPage }) => {
    logger.info('Starting test: Verify upload button is enabled by default on page load');
    
    try {
      const isInitiallyEnabled = await UploadPage.isUploadButtonEnabled();
      expect(isInitiallyEnabled).toBeTruthy();
    } catch (error) {
      logger.error('Test failed: Verify upload button is enabled by default on page load', error as Error);
      throw error;
    }
  });

  test('Verify all page elements are present after navigation', { tag: ["@sanity", "@ui", "@regression"] }, async ({ UploadPage }) => {
    logger.info('Starting test: Verify all page elements are present after navigation');
    
    try {
      const elementsPresent = await UploadPage.verifyPageElements();
      expect(elementsPresent).toBeTruthy();
    } catch (error) {
      logger.error('Test failed: Verify all page elements are present after navigation', error as Error);
      throw error;
    }
  });
});
