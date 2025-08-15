import test from '../helper/baseTest';
import { expect } from '@playwright/test';

test.describe('Main Page Tests', () => {
  test.beforeEach(async ({ MainPage }) => {
    // Navigate to main page before each test to avoid redundant calls
    await MainPage.navigate();
  });

  test('Verify main page loads and all elements are present', { tag: ["@smoke", "@sanity"] }, async ({ MainPage }) => {
    // Main page is already loaded in beforeEach
    
    // Verify page title
    const title = await MainPage.getPageTitle();
    expect(title).toContain('The Internet');
    
    // Verify main page elements are present
    const isLoaded = await MainPage.verifyMainPageElements();
    expect(isLoaded).toBe(true);
    
    // Verify file upload link is visible
    const isFileUploadVisible = await MainPage.isLinkVisible('File Upload');
    expect(isFileUploadVisible).toBe(true);
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

  test('Verify navigation from main page to upload page', { tag: ["@smoke", "@regression"] }, async ({ MainPage, UploadPage }) => {
    // Main page is already loaded in beforeEach
    
    // Click on File Upload link
    await MainPage.clickFileUpload();
    
    // Verify we're on the upload page
    await expect(UploadPage.fileInput).toBeVisible();
    await expect(UploadPage.uploadButton).toBeVisible();
    
    // Verify upload page title
    const pageTitle = await UploadPage.getPageTitle();
    expect(pageTitle).toBe('File Uploader');
  });

  test('Verify all navigation links are available on main page', { tag: ["@sanity", "@regression"] }, async ({ MainPage }) => {
    // Main page is already loaded in beforeEach
    
    // Get all navigation links
    const links = await MainPage.getAllNavigationLinks();
    expect(links.length).toBeGreaterThan(0);
    
    // Verify some expected links are present
    expect(links).toContain('File Upload');
    expect(links).toContain('Checkboxes');
    
    // Get navigation links count
    const count = await MainPage.getNavigationLinksCount();
    expect(count).toBeGreaterThan(10);
  });

  test('Verify navigation to different test pages works correctly', { tag: ["@regression", "@navigation"] }, async ({ MainPage }) => {
    // Main page is already loaded in beforeEach
    
    // Test navigation to upload page using the helper method
    await MainPage.navigateToTestPage('file upload');
    expect(await MainPage.page.url()).toContain('/upload');
    
    // Go back to main page
    await MainPage.navigate();
    
    // Test navigation to checkboxes page
    await MainPage.navigateToTestPage('checkboxes');
    expect(await MainPage.page.url()).toContain('/checkboxes');
  });

  test('Verify main page is fully loaded and responsive', { tag: ["@sanity", "@performance"] }, async ({ MainPage }) => {
    // Main page is already loaded in beforeEach
    
    // Check if page is fully loaded
    const isLoaded = await MainPage.isPageLoaded();
    expect(isLoaded).toBe(true);
    
    // Wait for specific link to be available
    await MainPage.waitForLink('File Upload');
    
    // Verify the link is now visible
    const isVisible = await MainPage.isLinkVisible('File Upload');
    expect(isVisible).toBe(true);
  });

  test('Verify navigation error handling works gracefully', { tag: ["@regression", "@stability"] }, async ({ MainPage }) => {
    // Main page is already loaded in beforeEach
    
    // Try to navigate to a non-existent page
    await expect(async () => {
      await MainPage.navigateToTestPage('non-existent-page');
    }).rejects.toThrow('Unknown page: non-existent-page');
  });
});
