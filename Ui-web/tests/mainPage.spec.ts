import test from '../helper/baseTest';
import { expect } from '@playwright/test';

test.describe('Main Page Tests', () => {
  test.beforeEach(async ({ MainPage }) => {
    await MainPage.navigate();
  });

  test('Verify main page loads and all elements are present', { tag: ["@smoke", "@sanity"] }, async ({ MainPage }) => {
    const title = await MainPage.getPageTitle();
    expect(title).toContain('The Internet');
    
    const isLoaded = await MainPage.verifyMainPageElements();
    expect(isLoaded).toBe(true);
    
    const isFileUploadVisible = await MainPage.isLinkVisible('File Upload');
    expect(isFileUploadVisible).toBe(true);
  });

  test('Verify all main page elements are present before navigation', { tag: ["@smoke", "@sanity"] }, async ({ MainPage }) => {
    const elementsPresent = await MainPage.verifyMainPageElements();
    expect(elementsPresent).toBeTruthy();
    
    const links = await MainPage.getAllNavigationLinks();
    expect(links).toContain('File Upload');
    
    const isFileUploadVisible = await MainPage.isLinkVisible('File Upload');
    expect(isFileUploadVisible).toBe(true);
  });

  test('Verify navigation from main page to upload page', { tag: ["@smoke", "@regression"] }, async ({ MainPage, UploadPage }) => {
    await MainPage.clickFileUpload();
    
    await expect(UploadPage.fileInput).toBeVisible();
    await expect(UploadPage.uploadButton).toBeVisible();
    
    const pageTitle = await UploadPage.getPageTitle();
    expect(pageTitle).toBe('File Uploader');
  });

  test('Verify all navigation links are available on main page', { tag: ["@sanity", "@regression"] }, async ({ MainPage }) => {
    const links = await MainPage.getAllNavigationLinks();
    expect(links.length).toBeGreaterThan(0);
    
    expect(links).toContain('File Upload');
    expect(links).toContain('Checkboxes');
    
    const count = await MainPage.getNavigationLinksCount();
    expect(count).toBeGreaterThan(10);
  });

  test('Verify navigation to different test pages works correctly', { tag: ["@regression", "@navigation"] }, async ({ MainPage }) => {
    await MainPage.navigateToTestPage('file upload');
    expect(await MainPage.page.url()).toContain('/upload');
    
    await MainPage.navigate();
    
    await MainPage.navigateToTestPage('checkboxes');
    expect(await MainPage.page.url()).toContain('/checkboxes');
  });

  test('Verify main page is fully loaded and responsive', { tag: ["@sanity", "@performance"] }, async ({ MainPage }) => {
    const isLoaded = await MainPage.isPageLoaded();
    expect(isLoaded).toBe(true);
    
    await MainPage.waitForLink('File Upload');
    
    const isVisible = await MainPage.isLinkVisible('File Upload');
    expect(isVisible).toBe(true);
  });

  test('Verify navigation error handling works gracefully', { tag: ["@regression", "@stability"] }, async ({ MainPage }) => {
    await expect(async () => {
      await MainPage.navigateToTestPage('non-existent-page');
    }).rejects.toThrow('Unknown page: non-existent-page');
  });
});
