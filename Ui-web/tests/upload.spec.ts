import test from '../helper/baseTest';
import { expect } from '@playwright/test';

test.describe('File Upload via Main Page Navigation', () => {
  test.beforeEach(async ({ MainPage }) => {
    await MainPage.navigate();
  });

  test('Verify navigation from main page to upload page works correctly', { tag: ["@smoke", "@regression"] }, async ({ MainPage, UploadPage }) => {
    const pageTitle = await MainPage.getPageTitle();
    expect(pageTitle).toContain('The Internet');
    
    const isLinkVisible = await MainPage.isLinkVisible('File Upload');
    expect(isLinkVisible).toBeTruthy();
    
    await MainPage.clickFileUpload();
    
    const uploadPageTitle = await UploadPage.getPageTitle();
    expect(uploadPageTitle).toBe('File Uploader');
  });

  test('Verify file upload functionality after navigating from main page', { tag: ["@smoke", "@regression", "@critical"] }, async ({ MainPage, UploadPage, testDataManager }) => {
    await MainPage.clickFileUpload();
    
    const testFilePath = testDataManager.getTestFilePath('test-file.txt');
    
    await UploadPage.uploadFile(testFilePath);
    
    const isSuccess = await UploadPage.isUploadSuccessful();
    expect(isSuccess).toBeTruthy();
    
    const uploadedFileName = await UploadPage.getUploadedFileName();
    expect(uploadedFileName).toContain('test-file.txt');
  });
});

test.describe('File Upload Functionality - Core Tests', () => {
  test.beforeEach(async ({ MainPage }) => {
    await MainPage.navigate();
    await MainPage.clickFileUpload();
  });

  test('Verify successful upload of text file', { tag: ["@smoke", "@regression", "@critical"] }, async ({ UploadPage, testDataManager }) => {
    const testFilePath = testDataManager.getTestFilePath('test-file.txt');

    await UploadPage.uploadFile(testFilePath);

    const isSuccess = await UploadPage.isUploadSuccessful();
    expect(isSuccess).toBeTruthy();
    
    const uploadedFileName = await UploadPage.getUploadedFileName();
    expect(uploadedFileName).toContain('test-file.txt');
  });

  test('Verify successful upload of PDF file', { tag: ["@regression", "@sanity"] }, async ({ UploadPage, testDataManager }) => {
    const testFilePath = testDataManager.getTestFilePath('test-document.pdf');

    await UploadPage.uploadFile(testFilePath);

    const isSuccess = await UploadPage.isUploadSuccessful();
    expect(isSuccess).toBeTruthy();
    
    const uploadedFileName = await UploadPage.getUploadedFileName();
    expect(uploadedFileName).toContain('test-document.pdf');
  });

  test('Verify upload page displays correct title', { tag: ["@sanity", "@ui"] }, async ({ UploadPage }) => {
    const title = await UploadPage.getPageTitle();
    expect(title).toBe('File Uploader');
  });

  test('Verify all page elements are present on upload page', { tag: ["@sanity", "@ui", "@regression"] }, async ({ UploadPage }) => {
    const elementsPresent = await UploadPage.verifyPageElements();
    expect(elementsPresent).toBeTruthy();
  });

  test('Verify upload button is enabled by default', { tag: ["@sanity", "@ui"] }, async ({ UploadPage }) => {
    const isEnabled = await UploadPage.isUploadButtonEnabled();
    expect(isEnabled).toBeTruthy();
  });
});

test.describe('File Upload Functionality - Navigation Tests', () => {
  test.beforeEach(async ({ MainPage }) => {
    await MainPage.navigate();
    await MainPage.clickFileUpload();
  });

  test('Verify navigation back to main page after file upload', { tag: ["@regression", "@navigation"] }, async ({ MainPage, UploadPage, testDataManager, page }) => {
    const testFilePath = testDataManager.getTestFilePath('test-file.txt');
    await UploadPage.uploadFile(testFilePath);
    
    await page.goBack();
    await page.goBack();
    
    const isMainPageLoaded = await MainPage.isPageLoaded();
    expect(isMainPageLoaded).toBeTruthy();
    
    const pageTitle = await MainPage.getPageTitle();
    expect(pageTitle).toContain('The Internet');
  });
});

test.describe('File Upload Functionality - Advanced Tests', () => {
  test.beforeEach(async ({ MainPage }) => {
    await MainPage.navigate();
    await MainPage.clickFileUpload();
  });

  test('Verify multiple file uploads work consecutively', { tag: ["@regression", "@performance"] }, async ({ MainPage, UploadPage, testDataManager }) => {
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
  });

  test('Verify page refresh behavior maintains functionality', { tag: ["@regression", "@stability"] }, async ({ UploadPage, testDataManager, page }) => {
    const testFilePath = testDataManager.getTestFilePath('test-file.txt');
    await UploadPage.uploadFile(testFilePath);
    
    const isSuccess = await UploadPage.isUploadSuccessful();
    expect(isSuccess).toBeTruthy();
    
    await page.goBack();
    await page.reload();
    
    const pageTitle = await UploadPage.getPageTitle();
    expect(pageTitle).toBe('File Uploader');
  });

  test('Verify file input clearing maintains button state', { tag: ["@regression", "@ui"] }, async ({ MainPage, UploadPage, testDataManager }) => {
    const testFilePath = testDataManager.getTestFilePath('test-file.txt');
    await UploadPage.uploadFile(testFilePath);
    
    await MainPage.navigate();
    await MainPage.clickFileUpload();
    await UploadPage.clearFileInput();

    const isEnabled = await UploadPage.isUploadButtonEnabled();
    expect(isEnabled).toBeTruthy();
  });
});

test.describe('File Upload Functionality - Edge Cases', () => {
  test.beforeEach(async ({ MainPage }) => {
    await MainPage.navigate();
    await MainPage.clickFileUpload();
  });

  test('Verify upload functionality with different file types from test data', { tag: ["@regression", "@comprehensive"] }, async ({ UploadPage, testDataManager }) => {
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
  });

  test('Verify upload button is enabled by default on page load', { tag: ["@sanity", "@ui"] }, async ({ UploadPage }) => {
    const isInitiallyEnabled = await UploadPage.isUploadButtonEnabled();
    expect(isInitiallyEnabled).toBeTruthy();
  });

  test('Verify all page elements are present after navigation', { tag: ["@sanity", "@ui", "@regression"] }, async ({ UploadPage }) => {
    const elementsPresent = await UploadPage.verifyPageElements();
    expect(elementsPresent).toBeTruthy();
    
    const isFileInputVisible = await UploadPage.isFileInputVisible();
    expect(isFileInputVisible).toBeTruthy();
    
    const pageTitle = await UploadPage.getPageTitle();
    expect(pageTitle).toBe('File Uploader');
  });
});
