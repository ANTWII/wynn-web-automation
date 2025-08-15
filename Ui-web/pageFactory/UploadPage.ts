import { BrowserContext, expect, Locator, FrameLocator, Page } from '@playwright/test';
import * as path from 'path';
import { _common } from '../helper/common';

export class _UploadPage extends _common {
  // Locators
   readonly fileInput: Locator;
   readonly uploadButton: Locator;
   readonly uploadedFileInfo: Locator;
   readonly pageTitle: Locator;
   readonly dragDropArea: Locator;
   readonly uploadSuccessMessage: Locator;
   readonly fileUploadForm: Locator;
   readonly uploadedFileName: Locator;



 constructor(page: Page, context: BrowserContext) {
    super(page, context);
    
    // Initialize locators
    this.fileInput = page.locator('#file-upload');
    this.uploadButton = page.locator('#file-submit');
    this.uploadedFileInfo = page.locator('#uploaded-files');
    this.pageTitle = page.locator('h3').first();
    this.dragDropArea = page.locator('#drag-drop-upload');
    this.uploadSuccessMessage = page.locator('h3:has-text("File Uploaded!")');
    this.fileUploadForm = page.locator('form#file-upload-form');
    // Locator for the uploaded file name in the gray box
    this.uploadedFileName = page.locator('div#uploaded-files');
  }

  /**
   * Navigate to upload page
   */
  async navigate(): Promise<void> {
    await this.page.goto('/upload');
    await this.waitForNetworkIdle();
    await this.waitForElementWithRetry(this.fileInput);
  }

  /**
   * Upload single file
   */
  async uploadFile(filePath: string): Promise<void> {
    const absolutePath = path.isAbsolute(filePath) ? filePath : path.join(process.cwd(), filePath);
    await this.fileInput.setInputFiles(absolutePath);
    await this.uploadButton.click();
    await this.waitForUploadComplete();
  }

  /**
   * Upload multiple files
   */
  async uploadMultipleFiles(filePaths: string[]): Promise<void> {
    const absolutePaths = filePaths.map(fp => 
      path.isAbsolute(fp) ? fp : path.join(process.cwd(), fp)
    );
    await this.fileInput.setInputFiles(absolutePaths);
    await this.uploadButton.click();
    await this.waitForUploadComplete();
  }

  /**
   * Wait for upload to complete
   */
  private async waitForUploadComplete(): Promise<void> {
    await this.page.waitForLoadState('networkidle');
    await this.uploadSuccessMessage.waitFor({ state: 'visible', timeout: 10000 });
  }

  /**
   * Get uploaded file name
   */
  async getUploadedFileName(): Promise<string> {
    await this.uploadedFileInfo.waitFor({ state: 'visible', timeout: 5000 });
    return await this.getElementText(this.uploadedFileInfo);
  }

  /**
   * Check if upload was successful
   */
  async isUploadSuccessful(): Promise<boolean> {
    try {
      await this.uploadSuccessMessage.waitFor({ state: 'visible', timeout: 5000 });
      const text = await this.getElementText(this.uploadSuccessMessage);
      return text === 'File Uploaded!';
    } catch {
      return false;
    }
  }

  /**
   * Get page title text
   */
  async getPageTitle(): Promise<string> {
    return await this.getElementText(this.pageTitle);
  }

  /**
   * Clear selected file
   */
  async clearFileInput(): Promise<void> {
    await this.fileInput.setInputFiles([]);
  }

  /**
   * Check if upload button is enabled
   */
  async isUploadButtonEnabled(): Promise<boolean> {
    return await this.uploadButton.isEnabled();
  }

  /**
   * Get upload button text
   */
  async getUploadButtonText(): Promise<string> {
    return await this.getElementText(this.uploadButton);
  }

  /**
   * Check if file input is visible
   */
  async isFileInputVisible(): Promise<boolean> {
    return await this.fileInput.isVisible();
  }

  /**
   * Upload file using drag and drop
   */
  async uploadFileWithDragAndDrop(filePath: string): Promise<void> {
    const absolutePath = path.isAbsolute(filePath) ? filePath : path.join(process.cwd(), filePath);
    
    // Create a DataTransfer to hold the file
    const dataTransfer = await this.page.evaluateHandle(() => new DataTransfer());
    
    // Add the file to the DataTransfer
    await this.page.evaluate(
      ({ dataTransfer, filePath }: { dataTransfer: any, filePath: string }) => {
        const file = new File([''], filePath);
        dataTransfer.items.add(file);
      },
      { dataTransfer, filePath: absolutePath }
    );
    
    // Dispatch the drop event
    await this.dragDropArea.dispatchEvent('drop', { dataTransfer });
    await this.waitForUploadComplete();
  }

  /**
   * Get error message if present
   */
  async getErrorMessage(): Promise<string | null> {
    const errorLocator = this.page.locator('.error-message, .alert-danger');
    if (await errorLocator.isVisible()) {
      return await this.getElementText(errorLocator);
    }
    return null;
  }

  /**
   * Verify page elements are present
   */
  async verifyPageElements(): Promise<boolean> {
    const elements = [
      this.fileInput,
      this.uploadButton,
      this.pageTitle
    ];

    for (const element of elements) {
      if (!await element.isVisible()) {
        return false;
      }
    }
    return true;
  }
}