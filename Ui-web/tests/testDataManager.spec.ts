import test from '../helper/baseTest';
import { expect } from '@playwright/test';
import { TestDataManager } from '../utils/testDataManager';

test.describe('Test Data Manager Tests', () => {
  let testDataManager: TestDataManager;

  test.beforeEach(() => {
    testDataManager = new TestDataManager();
    testDataManager.initialize();
  });

  test('should create and manage user credentials', async () => {
    // Get default credentials
    const credentials = testDataManager.getUserCredentials();
    expect(credentials.username).toBe('testuser');
    expect(credentials.password).toBe('TestPassword123!');
  });

  test('should generate random user data', async () => {
    const randomUser = testDataManager.generateRandomUser();
    
    expect(randomUser.firstName).toContain('TestUser');
    expect(randomUser.lastName).toContain('LastName');
    expect(randomUser.email).toContain('@example.com');
    expect(randomUser.phone).toMatch(/^\+1\d{10}$/);
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

  test('should save and retrieve user data', async () => {
    const testUser = testDataManager.generateRandomUser();
    
    // Save user data
    testDataManager.saveUserData(testUser, 'test-user.json');
    
    // Retrieve all users (should include the one we just saved)
    const allUsers = testDataManager.getAllUsers();
    expect(allUsers.length).toBeGreaterThan(0);
  });

  test.afterEach(() => {
    // Clean up test data after each test
    testDataManager.cleanupTestData();
  });
});
