import { BrowserContext, expect, Locator, Page } from '@playwright/test';
import { _common } from '../helper/common';

export class _MainPage extends _common {
  // Locators
  readonly pageTitle: Locator;
  readonly pageHeading: Locator;
  readonly navigationLinks: Locator;
  readonly footerText: Locator;
  
  // Specific navigation links
  readonly fileUploadLink: Locator;
  readonly checkboxesLink: Locator;
  readonly contextMenuLink: Locator;
  readonly dragAndDropLink: Locator;
  readonly dropdownLink: Locator;
  readonly dynamicContentLink: Locator;
  readonly dynamicControlsLink: Locator;
  readonly dynamicLoadingLink: Locator;
  readonly entryAdLink: Locator;
  readonly exitIntentLink: Locator;
  readonly fileDownloadLink: Locator;
  readonly forgotPasswordLink: Locator;
  readonly hoversLink: Locator;
  readonly infiniteScrollLink: Locator;
  readonly inputsLink: Locator;
  readonly javaScriptAlertsLink: Locator;
  readonly javaScriptOnloadEventErrorLink: Locator;
  readonly keyPressesLink: Locator;
  readonly largeDeepDomLink: Locator;
  readonly multipleWindowsLink: Locator;
  readonly nestedFramesLink: Locator;
  readonly notificationMessagesLink: Locator;
  readonly redirectLinkLink: Locator;
  readonly secureFileDownloadLink: Locator;
  readonly shadowDomLink: Locator;
  readonly slowResourcesLink: Locator;
  readonly sortableDataTablesLink: Locator;
  readonly statusCodesLink: Locator;
  readonly typosLink: Locator;
  readonly wysiwygEditorLink: Locator;

  constructor(page: Page, context: BrowserContext) {
    super(page, context);
    
    // Initialize locators
    this.pageTitle = page.locator('title');
    this.pageHeading = page.locator('h1, h2').first();
    this.navigationLinks = page.locator('ul li a');
    this.footerText = page.locator('#page-footer');
    
    // Specific navigation links
    this.fileUploadLink = page.locator('a[href="/upload"]');
    this.checkboxesLink = page.locator('a[href="/checkboxes"]');
    this.contextMenuLink = page.locator('a[href="/context_menu"]');
    this.dragAndDropLink = page.locator('a[href="/drag_and_drop"]');
    this.dropdownLink = page.locator('a[href="/dropdown"]');
    this.dynamicContentLink = page.locator('a[href="/dynamic_content"]');
    this.dynamicControlsLink = page.locator('a[href="/dynamic_controls"]');
    this.dynamicLoadingLink = page.locator('a[href="/dynamic_loading"]');
    this.entryAdLink = page.locator('a[href="/entry_ad"]');
    this.exitIntentLink = page.locator('a[href="/exit_intent"]');
    this.fileDownloadLink = page.locator('a[href="/download"]');
    this.forgotPasswordLink = page.locator('a[href="/forgot_password"]');
    this.hoversLink = page.locator('a[href="/hovers"]');
    this.infiniteScrollLink = page.locator('a[href="/infinite_scroll"]');
    this.inputsLink = page.locator('a[href="/inputs"]');
    this.javaScriptAlertsLink = page.locator('a[href="/javascript_alerts"]');
    this.javaScriptOnloadEventErrorLink = page.locator('a[href="/javascript_error"]');
    this.keyPressesLink = page.locator('a[href="/key_presses"]');
    this.largeDeepDomLink = page.locator('a[href="/large"]');
    this.multipleWindowsLink = page.locator('a[href="/windows"]');
    this.nestedFramesLink = page.locator('a[href="/nested_frames"]');
    this.notificationMessagesLink = page.locator('a[href="/notification_message"]');
    this.redirectLinkLink = page.locator('a[href="/redirect"]');
    this.secureFileDownloadLink = page.locator('a[href="/download_secure"]');
    this.shadowDomLink = page.locator('a[href="/shadowdom"]');
    this.slowResourcesLink = page.locator('a[href="/slow"]');
    this.sortableDataTablesLink = page.locator('a[href="/tables"]');
    this.statusCodesLink = page.locator('a[href="/status_codes"]');
    this.typosLink = page.locator('a[href="/typos"]');
    this.wysiwygEditorLink = page.locator('a[href="/tinymce"]');
  }

  /**
   * Navigate to main page
   */
  async navigate(): Promise<void> {
    try {
      await this.page.goto('/', { waitUntil: 'domcontentloaded', timeout: 30000 });
      await this.waitForElementWithRetry(this.pageHeading);
    } catch (error) {
      console.log('Navigation failed, retrying with fallback...');
      await this.page.goto('https://the-internet.herokuapp.com/', { waitUntil: 'domcontentloaded', timeout: 30000 });
      await this.waitForElementWithRetry(this.pageHeading);
    }
  }

  /**
   * Get page title text
   */
  async getPageTitle(): Promise<string> {
    return await this.page.title();
  }

  /**
   * Get main heading text
   */
  async getPageHeading(): Promise<string> {
    return await this.getElementText(this.pageHeading);
  }

  /**
   * Click on File Upload link to navigate to upload page
   */
  async clickFileUpload(): Promise<void> {
    await this.fileUploadLink.click();
    await this.waitForNetworkIdle();
  }

  /**
   * Click on any navigation link by text
   */
  async clickNavigationLink(linkText: string): Promise<void> {
    await this.page.locator(`a:has-text("${linkText}")`).click();
    await this.waitForNetworkIdle();
  }

  /**
   * Check if specific link is visible
   */
  async isLinkVisible(linkText: string): Promise<boolean> {
    return await this.page.locator(`a:has-text("${linkText}")`).isVisible();
  }

  /**
   * Get all navigation link texts
   */
  async getAllNavigationLinks(): Promise<string[]> {
    const links = await this.navigationLinks.allTextContents();
    return links.filter(link => link.trim().length > 0);
  }

  /**
   * Verify main page elements are present
   */
  async verifyMainPageElements(): Promise<boolean> {
    try {
      // Check if heading is visible
      if (!await this.pageHeading.isVisible()) {
        return false;
      }
      
      // Check if at least one navigation link is visible
      if (await this.navigationLinks.count() === 0) {
        return false;
      }
      
      // Check if file upload link is visible (this is what we need for our tests)
      if (!await this.fileUploadLink.isVisible()) {
        return false;
      }
      
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Navigate to a specific test page by name
   */
  async navigateToTestPage(pageName: string): Promise<void> {
    const linkMap: { [key: string]: Locator } = {
      'file upload': this.fileUploadLink,
      'upload': this.fileUploadLink,
      'checkboxes': this.checkboxesLink,
      'context menu': this.contextMenuLink,
      'drag and drop': this.dragAndDropLink,
      'dropdown': this.dropdownLink,
      'dynamic content': this.dynamicContentLink,
      'dynamic controls': this.dynamicControlsLink,
      'dynamic loading': this.dynamicLoadingLink,
      'entry ad': this.entryAdLink,
      'exit intent': this.exitIntentLink,
      'file download': this.fileDownloadLink,
      'forgot password': this.forgotPasswordLink,
      'hovers': this.hoversLink,
      'infinite scroll': this.infiniteScrollLink,
      'inputs': this.inputsLink,
      'javascript alerts': this.javaScriptAlertsLink,
      'javascript error': this.javaScriptOnloadEventErrorLink,
      'key presses': this.keyPressesLink,
      'large dom': this.largeDeepDomLink,
      'multiple windows': this.multipleWindowsLink,
      'nested frames': this.nestedFramesLink,
      'notification messages': this.notificationMessagesLink,
      'redirect': this.redirectLinkLink,
      'secure download': this.secureFileDownloadLink,
      'shadow dom': this.shadowDomLink,
      'slow resources': this.slowResourcesLink,
      'tables': this.sortableDataTablesLink,
      'status codes': this.statusCodesLink,
      'typos': this.typosLink,
      'wysiwyg editor': this.wysiwygEditorLink
    };

    const link = linkMap[pageName.toLowerCase()];
    if (link) {
      await link.click();
      await this.waitForNetworkIdle();
    } else {
      throw new Error(`Unknown page: ${pageName}. Available pages: ${Object.keys(linkMap).join(', ')}`);
    }
  }

  /**
   * Get footer text
   */
  async getFooterText(): Promise<string> {
    return await this.getElementText(this.footerText);
  }

  /**
   * Check if page is fully loaded
   */
  async isPageLoaded(): Promise<boolean> {
    try {
      await this.waitForElementWithRetry(this.pageHeading, 10000);
      await this.waitForElementWithRetry(this.navigationLinks.first(), 10000);
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Wait for specific link to be available
   */
  async waitForLink(linkText: string, timeout: number = 30000): Promise<void> {
    await this.page.locator(`a:has-text("${linkText}")`).waitFor({ 
      state: 'visible', 
      timeout 
    });
  }

  /**
   * Get count of available navigation links
   */
  async getNavigationLinksCount(): Promise<number> {
    return await this.navigationLinks.count();
  }
}
