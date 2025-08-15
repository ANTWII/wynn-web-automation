import test from '../helper/baseTest';
import { Logger } from '../utils/logger';

test.describe('Logger Usage Examples', () => {
  const logger = Logger.getInstance();

  test('Example: Basic navigation with logging', async ({ page }) => {
    logger.startTestLog('Basic navigation with logging');
    
    try {
      logger.info('Starting navigation test');
      
      await page.goto('https://the-internet.herokuapp.com/');
      logger.info('Successfully navigated to main page');
      
      const title = await page.title();
      logger.info('Page title retrieved', { title });
      
      logger.endTestLog('Basic navigation with logging', 'PASSED');
    } catch (error) {
      logger.error('Test failed during execution', error as Error);
      logger.endTestLog('Basic navigation with logging', 'FAILED');
      throw error;
    }
  });

  test('Example: Error handling with logging', async ({ page }) => {
    logger.startTestLog('Error handling with logging');
    
    try {
      logger.info('Attempting to navigate to invalid URL');
      await page.goto('https://invalid-url-that-does-not-exist.com');
      
      logger.endTestLog('Error handling with logging', 'PASSED');
    } catch (error) {
      logger.warn('Expected error occurred', { error: (error as Error).message });
      logger.endTestLog('Error handling with logging', 'PASSED');
    }
  });

  test('Example: Different log levels', async () => {
    logger.startTestLog('Different log levels');
    
    logger.debug('This is debug information');
    logger.info('This is an info message');
    logger.warn('This is a warning message');
    
    try {
      throw new Error('Sample error for demonstration');
    } catch (error) {
      logger.error('This is an error message', error as Error);
    }
    
    logger.endTestLog('Different log levels', 'PASSED');
  });
});
