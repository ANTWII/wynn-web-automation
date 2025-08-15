import test from '../helper/baseTest';
import { expect } from '@playwright/test';

test.describe('Upload Page Tests', () => {
  test('should navigate to upload page and verify page elements', async ({ page, UploadPage }) => {
    await UploadPage.navigate();
    
    // Verify page title
    await expect(page).toHaveTitle(/File Uploader/);
    
    // Verify upload elements are visible
    await expect(UploadPage.fileInput).toBeVisible();
    await expect(UploadPage.uploadButton).toBeVisible();
  });

  test('should upload a file successfully using test data manager', async ({ page, UploadPage, testDataManager }) => {
    await UploadPage.navigate();
    
    // Get test file path from test data manager
    const testFilePath = testDataManager.getTestFilePath('test-file.txt');
    
    // Upload the file
    await UploadPage.uploadFile(testFilePath);
    
    // Verify upload success
    await expect(UploadPage.uploadedFileInfo).toBeVisible();
  });

  test('should validate file format using test data manager', async ({ testDataManager }) => {
    // Test valid file formats
    const validFormats = testDataManager.getFileUploadTestData().validFormats;
    expect(validFormats).toContain('txt');
    expect(validFormats).toContain('pdf');
    
    // Test file format validation
    expect(testDataManager.isValidFileFormat('document.pdf')).toBe(true);
    expect(testDataManager.isValidFileFormat('script.exe')).toBe(false);
  });

  test('should handle different file sizes', async ({ page, UploadPage, testDataManager }) => {
    await UploadPage.navigate();
    
    // Test with small file
    const smallFilePath = testDataManager.getTestFilePath('test-small.txt');
    await UploadPage.uploadFile(smallFilePath);
    
    // Verify upload success
    const isSuccessful = await UploadPage.isUploadSuccessful();
    expect(isSuccessful).toBe(true);
  });
});
