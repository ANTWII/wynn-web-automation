import test from '../helper/baseTest';
import { expect } from '@playwright/test';
import { TestDataManager } from '../utils/testDataManager';

test.describe('Test Data Manager Tests', () => {
  let testDataManager: TestDataManager;

  test.beforeEach(() => {
    testDataManager = new TestDataManager();
    testDataManager.initialize();
  });

  test('should validate file formats correctly', async () => {
    // Valid formats
    expect(testDataManager.isValidFileFormat('test.txt')).toBe(true);
    expect(testDataManager.isValidFileFormat('document.pdf')).toBe(true);
    expect(testDataManager.isValidFileFormat('image.png')).toBe(true);
    
    // Invalid formats
    expect(testDataManager.isInvalidFileFormat('virus.exe')).toBe(true);
    expect(testDataManager.isInvalidFileFormat('script.bat')).toBe(true);
  });

  test('should create test files with different sizes', async () => {
    const testFilePath = testDataManager.getTestFilePath('test-file.txt');
    expect(testFilePath).toContain('test-data/upload/test-file.txt');
  });

  test('should provide file upload test data configuration', async () => {
    const config = testDataManager.getFileUploadTestData();
    
    expect(config.validFormats).toContain('txt');
    expect(config.validFormats).toContain('pdf');
    expect(config.invalidFormats).toContain('exe');
    expect(config.maxFileSize).toBe(5);
    expect(config.testFiles.small).toBe('test-small.txt');
  });

  test('should create files with specific size for testing', async () => {
    const fileName = 'test-size-file.txt';
    const sizeInMB = 1;
    
    const filePath = testDataManager.createFileWithSize(fileName, sizeInMB);
    expect(filePath).toContain(fileName);
    
    // Check that file was actually created
    const fs = require('fs');
    expect(fs.existsSync(filePath)).toBe(true);
    
    const actualSize = testDataManager.getFileSizeInMB(filePath);
    expect(actualSize).toBeCloseTo(sizeInMB, 1);
  });

  test('should get random valid test file', async () => {
    const randomFilePath = testDataManager.getRandomValidFile();
    expect(randomFilePath).toContain('test-data/upload/');
    expect(randomFilePath).not.toContain('.exe');
  });

  test('should provide test data summary', async () => {
    const summary = testDataManager.getTestDataSummary();
    
    expect(summary.testDataPath).toBeDefined();
    expect(summary.uploadFiles).toBeGreaterThanOrEqual(0);
    expect(summary.availableTestFiles).toBeDefined();
    expect(summary.fileUploadConfig).toBeDefined();
  });

  test.afterEach(() => {
    // Clean up test data after each test
    testDataManager.cleanupTestData();
  });
});
