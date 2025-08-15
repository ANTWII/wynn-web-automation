import test from '../helper/baseTest';
import { expect } from '@playwright/test';

test.describe('File Upload via Main Page Navigation', () => {
  test.beforeEach(async ({ MainPage }) => {
    // Navigate to main page before each test
    await MainPage.navigate();
  });

  test('Verify navigation from main page to upload page works correctly', { tag: ["@smoke", "@regression"] }, async ({ MainPage, UploadPage }) => {
    // Main page is already loaded in beforeEach
    
    // Verify main page loaded
    const pageTitle = await MainPage.getPageTitle();
    expect(pageTitle).toContain('The Internet');
    
    // Verify File Upload link is visible
    const isLinkVisible = await MainPage.isLinkVisible('File Upload');
    expect(isLinkVisible).toBeTruthy();
    
    // Click on File Upload link
    await MainPage.clickFileUpload();
    
    // Verify navigation to upload page
    const uploadPageTitle = await UploadPage.getPageTitle();
    expect(uploadPageTitle).toBe('File Uploader');
  });

  test('Verify all main page elements are present before navigation', { tag: ["@smoke", "@sanity"] }, async ({ MainPage }) => {
    // Main page is already loaded in beforeEach
    
    // Verify all elements are present
    const elementsPresent = await MainPage.verifyMainPageElements();
    expect(elementsPresent).toBeTruthy();
    
    // Get all available links
    const links = await MainPage.getAllNavigationLinks();
    expect(links).toContain('File Upload');
    
    // Verify File Upload link is visible
    const isFileUploadVisible = await MainPage.isLinkVisible('File Upload');
    expect(isFileUploadVisible).toBe(true);
  });

  test('Verify file upload functionality after navigating from main page', { tag: ["@smoke", "@regression", "@critical"] }, async ({ MainPage, UploadPage, testDataManager }) => {
    // Main page is already loaded in beforeEach
    await MainPage.clickFileUpload();
    
    // Get test file path from test data manager
    const testFilePath = testDataManager.getTestFilePath('test-file.txt');
    
    // Upload file
    await UploadPage.uploadFile(testFilePath);
    
    // Assert upload success
    const isSuccess = await UploadPage.isUploadSuccessful();
    expect(isSuccess).toBeTruthy();
    
    const uploadedFileName = await UploadPage.getUploadedFileName();
    expect(uploadedFileName).toContain('test-file.txt');
  });
});

test.describe('File Upload Functionality - Core Tests', () => {
  test.beforeEach(async ({ MainPage }) => {
    // Navigate through main page
    await MainPage.navigate();
    await MainPage.clickFileUpload();
  });

  test('Verify successful upload of text file', { tag: ["@smoke", "@regression", "@critical"] }, async ({ UploadPage, testDataManager }) => {
    // Get test file path from test data manager
    const testFilePath = testDataManager.getTestFilePath('test-file.txt');

    // Act
    await UploadPage.uploadFile(testFilePath);

    // Assert
    const isSuccess = await UploadPage.isUploadSuccessful();
    expect(isSuccess).toBeTruthy();
    
    const uploadedFileName = await UploadPage.getUploadedFileName();
    expect(uploadedFileName).toContain('test-file.txt');
  });

  test('Verify successful upload of PDF file', { tag: ["@regression", "@sanity"] }, async ({ UploadPage, testDataManager }) => {
    // Get test file path from test data manager  
    const testFilePath = testDataManager.getTestFilePath('test-document.pdf');

    // Act
    await UploadPage.uploadFile(testFilePath);

    // Assert
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
    // Navigate to main page before each navigation test
    await MainPage.navigate();
    await MainPage.clickFileUpload();
  });

  test('Verify navigation back to main page after file upload', { tag: ["@regression", "@navigation"] }, async ({ MainPage, UploadPage, testDataManager, page }) => {
    // Upload page is already loaded in beforeEach
    
    const testFilePath = testDataManager.getTestFilePath('test-file.txt');
    await UploadPage.uploadFile(testFilePath);
    
    // Navigate back to main page
    await page.goBack();
    await page.goBack(); // Go back twice (from success page to upload, then to main)
    
    // Assert we're back on main page
    const isMainPageLoaded = await MainPage.isPageLoaded();
    expect(isMainPageLoaded).toBeTruthy();
    
    const pageTitle = await MainPage.getPageTitle();
    expect(pageTitle).toContain('The Internet');
  });
});

test.describe('File Upload Functionality - Advanced Tests', () => {
  test.beforeEach(async ({ MainPage }) => {
    // Navigate through main page to upload page before each advanced test
    await MainPage.navigate();
    await MainPage.clickFileUpload();
  });

  test('Verify multiple file uploads work consecutively', { tag: ["@regression", "@performance"] }, async ({ MainPage, UploadPage, testDataManager }) => {
    // Upload page is already loaded in beforeEach
    const numberOfUploads = 3;
    
    for (let i = 0; i < numberOfUploads; i++) {
      // Navigate back to upload page for subsequent uploads
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
    // Upload page is already loaded in beforeEach
    
    const testFilePath = testDataManager.getTestFilePath('test-file.txt');
    await UploadPage.uploadFile(testFilePath);
    
    // Verify upload was successful before refresh
    const isSuccess = await UploadPage.isUploadSuccessful();
    expect(isSuccess).toBeTruthy();
    
    // Go back to upload page and then refresh
    await page.goBack();
    await page.reload();
    
    // Verify we can still see the upload page after refresh
    const pageTitle = await UploadPage.getPageTitle();
    expect(pageTitle).toBe('File Uploader');
  });

  test('Verify file input clearing maintains button state', { tag: ["@regression", "@ui"] }, async ({ MainPage, UploadPage, testDataManager }) => {
    // Upload page is already loaded in beforeEach
    
    const testFilePath = testDataManager.getTestFilePath('test-file.txt');
    await UploadPage.uploadFile(testFilePath);
    
    // Navigate back and clear input
    await MainPage.navigate();
    await MainPage.clickFileUpload();
    await UploadPage.clearFileInput();

    // Button should still be enabled
    const isEnabled = await UploadPage.isUploadButtonEnabled();
    expect(isEnabled).toBeTruthy();
  });
});

test.describe('File Upload Functionality - Edge Cases', () => {
  test.beforeEach(async ({ MainPage }) => {
    // Navigate to upload page before each edge case test
    await MainPage.navigate();
    await MainPage.clickFileUpload();
  });

  test('Verify upload functionality with different file types from test data', { tag: ["@regression", "@comprehensive"] }, async ({ UploadPage, testDataManager }) => {
    // Upload page is already loaded in beforeEach
    const fileTypes = ['test-file.txt', 'test-document.pdf', 'test-data.csv', 'test-data.json'];
    
    for (const fileName of fileTypes) {
      // For multiple files in loop, we need to navigate back
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
    // Upload page is already loaded in beforeEach
    
    // Button should be enabled by default
    const isInitiallyEnabled = await UploadPage.isUploadButtonEnabled();
    expect(isInitiallyEnabled).toBeTruthy();
  });

  test('Verify all page elements are present after navigation', { tag: ["@sanity", "@ui", "@regression"] }, async ({ UploadPage }) => {
    // Upload page is already loaded in beforeEach
    
    // Verify all required elements are present
    const elementsPresent = await UploadPage.verifyPageElements();
    expect(elementsPresent).toBeTruthy();
    
    // Verify file input is visible
    const isFileInputVisible = await UploadPage.isFileInputVisible();
    expect(isFileInputVisible).toBeTruthy();
    
    // Verify page title is correct
    const pageTitle = await UploadPage.getPageTitle();
    expect(pageTitle).toBe('File Uploader');
  });
});
