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

  test('should upload a file successfully', async ({ page, UploadPage }) => {
    await UploadPage.navigate();
    
    // Create a test file
    const testFilePath = './Ui-web/test-data/upload/test-file.txt';
    
    // Upload the file
    await UploadPage.uploadFile(testFilePath);
    
    // Verify upload success
    await expect(UploadPage.uploadedFileInfo).toBeVisible();
  });
});
