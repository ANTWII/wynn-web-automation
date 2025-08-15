import { Browser, BrowserContext, expect, Locator, Page, } from '@playwright/test';
import _config from '../config/configmanager';
import {  Download } from '@playwright/test';
import path from 'path';
import fs from 'fs';

export class _common {
  readonly page: Page;
  readonly context: BrowserContext;

  constructor(page: Page, context: BrowserContext) {
    this.page = page;
    this.context = context;
  }

  async loadSite(url?: string) {

          await this.page.goto(_config.url ); 

    
    await this.page.waitForLoadState('domcontentloaded');
  }





  /**
   * Wait for element to be visible with retry mechanism
   */
  async waitForElementWithRetry(
    locator: Locator,
    timeout: number = 30000,
    retries: number = 3,
  ): Promise<void> {
    let lastError: Error | null = null;
    
    for (let i = 0; i < retries; i++) {
      try {
        await locator.waitFor({ state: 'visible', timeout });
        return;
      } catch (error) {
        lastError = error as Error;
        if (i < retries - 1) {
          await this.page.waitForTimeout(1000);
        }
      }
    }
    
    throw lastError;
  }

  /**
   * Take screenshot with timestamp
   */
  async takeScreenshot(name: string): Promise<string> {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const screenshotDir = path.join(process.cwd(), 'screenshots');
    
    if (!fs.existsSync(screenshotDir)) {
      fs.mkdirSync(screenshotDir, { recursive: true });
    }
    
    const screenshotPath = path.join(screenshotDir, `${name}-${timestamp}.png`);
    await this.page.screenshot({ path: screenshotPath, fullPage: true });
    return screenshotPath;
  }

  /**
   * Wait for network idle state
   */
  async waitForNetworkIdle(timeout: number = 30000): Promise<void> {
    await this.page.waitForLoadState('networkidle', { timeout });
  }

  /**
   * Check if element is enabled
   */
  async isElementEnabled(locator: Locator): Promise<boolean> {
    try {
      return await locator.isEnabled({ timeout: 5000 });
    } catch {
      return false;
    }
  }

  /**
   * Get element text safely
   */
  async getElementText(locator: Locator): Promise<string> {
    try {
      await locator.waitFor({ state: 'visible', timeout: 5000 });
      const text = await locator.textContent();
      return text || '';
    } catch {
      return '';
    }
  }

  /**
   * Scroll to element
   */
  async scrollToElement(locator: Locator): Promise<void> {
    await locator.scrollIntoViewIfNeeded();
    await this.page.waitForTimeout(500); // Small delay after scrolling
  }

  /**
   * Handle file download
   */
  async handleDownload(triggerDownload: () => Promise<void>): Promise<string> {
    const downloadPromise = this.page.waitForEvent('download');
    await triggerDownload();
    const download: Download = await downloadPromise;
    
    const downloadsDir = path.join(process.cwd(), 'downloads');
    if (!fs.existsSync(downloadsDir)) {
      fs.mkdirSync(downloadsDir, { recursive: true });
    }
    
    const filePath = path.join(downloadsDir, download.suggestedFilename());
    await download.saveAs(filePath);
    return filePath;
  }

  /**
   * Wait for specific text to appear
   */
  async waitForText(text: string, timeout: number = 30000): Promise<void> {
    await this.page.waitForSelector(`text="${text}"`, { timeout });
  }

  /**
   * Check if element exists
   */
  async elementExists(selector: string): Promise<boolean> {
    return (await this.page.$(selector)) !== null;
  }

  /**
   * Get all matching elements count
   */
  async getElementsCount(selector: string): Promise<number> {
    return await this.page.locator(selector).count();
  }

  /**
   * Wait for URL to contain specific text
   */
  async waitForUrlContains(text: string, timeout: number = 30000): Promise<void> {
    await this.page.waitForURL(`**/*${text}*`, { timeout });
  }
}


