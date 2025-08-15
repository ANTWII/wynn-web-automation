import test from '../helper/baseTest';
import { expect } from '@playwright/test';
import { Logger } from '../utils/logger';

test.describe('Main Page Tests', () => {
  const logger = Logger.getInstance();

  test.beforeEach(async ({ MainPage }) => {
    await MainPage.navigate();
  });

  test('Verify main page loads and all elements are present', { tag: ["@smoke", "@sanity"] }, async ({ MainPage }) => {
    logger.info('Starting test: Verify main page loads and all elements are present');
    
    try {
      const title = await MainPage.getPageTitle();
      expect(title).toContain('The Internet');
      
      const isLoaded = await MainPage.verifyMainPageElements();
      expect(isLoaded).toBe(true);
      
      const isFileUploadVisible = await MainPage.isLinkVisible('File Upload');
      expect(isFileUploadVisible).toBe(true);
    } catch (error) {
      logger.error('Test failed: Verify main page loads and all elements are present', error as Error);
      throw error;
    }
  });

  test('Verify all main page elements are present before navigation', { tag: ["@smoke", "@sanity"] }, async ({ MainPage }) => {
    logger.info('Starting test: Verify all main page elements are present before navigation');
    
    try {
      const elementsPresent = await MainPage.verifyMainPageElements();
      expect(elementsPresent).toBeTruthy();
      
      const links = await MainPage.getAllNavigationLinks();
      expect(links).toContain('File Upload');
      
      const isFileUploadVisible = await MainPage.isLinkVisible('File Upload');
      expect(isFileUploadVisible).toBe(true);
    } catch (error) {
      logger.error('Test failed: Verify all main page elements are present before navigation', error as Error);
      throw error;
    }
  });

  test('Verify navigation from main page to upload page', { tag: ["@smoke", "@regression"] }, async ({ MainPage, UploadPage }) => {
    logger.info('Starting test: Verify navigation from main page to upload page');
    
    try {
      await MainPage.clickFileUpload();
      
      await expect(UploadPage.fileInput).toBeVisible();
      await expect(UploadPage.uploadButton).toBeVisible();
      
      const pageTitle = await UploadPage.getPageTitle();
      expect(pageTitle).toBe('File Uploader');
    } catch (error) {
      logger.error('Test failed: Verify navigation from main page to upload page', error as Error);
      throw error;
    }
  });

  test('Verify all navigation links are available on main page', { tag: ["@sanity", "@regression"] }, async ({ MainPage }) => {
    logger.info('Starting test: Verify all navigation links are available on main page');
    
    try {
      const links = await MainPage.getAllNavigationLinks();
      expect(links.length).toBeGreaterThan(0);
      
      expect(links).toContain('File Upload');
      expect(links).toContain('Checkboxes');
      
      const count = await MainPage.getNavigationLinksCount();
      expect(count).toBeGreaterThan(10);
    } catch (error) {
      logger.error('Test failed: Verify all navigation links are available on main page', error as Error);
      throw error;
    }
  });

  test('Verify navigation to different test pages works correctly', { tag: ["@regression", "@navigation"] }, async ({ MainPage }) => {
    logger.info('Starting test: Verify navigation to different test pages works correctly');
    
    try {
      await MainPage.navigateToTestPage('file upload');
      expect(await MainPage.page.url()).toContain('/upload');
      
      await MainPage.navigate();
      
      await MainPage.navigateToTestPage('checkboxes');
      expect(await MainPage.page.url()).toContain('/checkboxes');
    } catch (error) {
      logger.error('Test failed: Verify navigation to different test pages works correctly', error as Error);
      throw error;
    }
  });

  test('Verify main page is fully loaded and responsive', { tag: ["@sanity", "@performance"] }, async ({ MainPage }) => {
    logger.info('Starting test: Verify main page is fully loaded and responsive');
    
    try {
      const isLoaded = await MainPage.isPageLoaded();
      expect(isLoaded).toBe(true);
      
      await MainPage.waitForLink('File Upload');
      
      const isVisible = await MainPage.isLinkVisible('File Upload');
      expect(isVisible).toBe(true);
    } catch (error) {
      logger.error('Test failed: Verify main page is fully loaded and responsive', error as Error);
      throw error;
    }
  });

  test('Verify navigation error handling works gracefully', { tag: ["@regression", "@stability"] }, async ({ MainPage }) => {
    logger.info('Starting test: Verify navigation error handling works gracefully');
    
    try {
      await expect(async () => {
        await MainPage.navigateToTestPage('non-existent-page');
      }).rejects.toThrow('Unknown page: non-existent-page');
    } catch (error) {
      logger.error('Test failed: Verify navigation error handling works gracefully', error as Error);
      throw error;
    }
  });
});
