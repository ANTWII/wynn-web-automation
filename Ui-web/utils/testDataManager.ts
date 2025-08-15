import fs from 'fs';
import path from 'path';

interface UserCredentials {
  username: string;
  password: string;
}

interface TestUser {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
}

interface FileUploadTestData {
  validFormats: string[];
  invalidFormats: string[];
  maxFileSize: number;
  specialCharacters: string[];
  testFiles: {
    small: string;
    medium: string;
    large: string;
    invalid: string;
  };
}

export class TestDataManager {
  private testDataPath: string;

  constructor() {
    this.testDataPath = path.join(process.cwd(), 'Ui-web', 'test-data');
    this.ensureTestDataStructure();
  }

  /**
   * Ensure test data directory structure exists
   */
  private ensureTestDataStructure(): void {
    const directories = [
      this.testDataPath,
      path.join(this.testDataPath, 'register'),
      path.join(this.testDataPath, 'upload'),
      path.join(this.testDataPath, 'downloads')
    ];

    directories.forEach(dir => {
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
    });
  }

  /**
   * Get user credentials
   */
  getUserCredentials(): UserCredentials {
    const credentialsPath = path.join(this.testDataPath, 'register', 'credentials.json');
    
    if (!fs.existsSync(credentialsPath)) {
      const defaultCredentials = {
        username: 'testuser',
        password: 'TestPassword123!'
      };
      fs.writeFileSync(credentialsPath, JSON.stringify(defaultCredentials, null, 2));
      return defaultCredentials;
    }

    try {
      const data = fs.readFileSync(credentialsPath, 'utf-8');
      return JSON.parse(data);
    } catch (error) {
      console.error('Error reading credentials file:', error);
      throw new Error('Failed to load user credentials');
    }
  }

  /**
   * Get test user data
   */
  getTestUser(): TestUser {
    const userPath = path.join(this.testDataPath, 'register', 'user.json');
    
    if (!fs.existsSync(userPath)) {
      const defaultUser = {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@example.com',
        phone: '+1234567890'
      };
      fs.writeFileSync(userPath, JSON.stringify(defaultUser, null, 2));
      return defaultUser;
    }

    try {
      const data = fs.readFileSync(userPath, 'utf-8');
      return JSON.parse(data);
    } catch (error) {
      console.error('Error reading user file:', error);
      throw new Error('Failed to load test user data');
    }
  }

  /**
   * Get file upload test data
   */
  getFileUploadTestData(): FileUploadTestData {
    return {
      validFormats: ['txt', 'pdf', 'png', 'jpg', 'jpeg', 'csv', 'json', 'xml', 'doc', 'docx'],
      invalidFormats: ['exe', 'bat', 'sh', 'cmd', 'msi'],
      maxFileSize: 5, // MB
      specialCharacters: ['@', '#', '$', '%', '&', '(', ')', '-', '_', '+', '='],
      testFiles: {
        small: 'test-small.txt',
        medium: 'test-medium.txt',
        large: 'test-large.txt',
        invalid: 'test.exe'
      }
    };
  }

  /**
   * Create test files for upload testing
   */
  createTestFiles(): void {
    const uploadDir = path.join(this.testDataPath, 'upload');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    const testData = this.getFileUploadTestData();

    // Create small text file
    const smallFilePath = path.join(uploadDir, testData.testFiles.small);
    if (!fs.existsSync(smallFilePath)) {
      fs.writeFileSync(smallFilePath, 'This is a small test file for upload testing.');
    }

    // Create medium text file
    const mediumFilePath = path.join(uploadDir, testData.testFiles.medium);
    if (!fs.existsSync(mediumFilePath)) {
      const content = 'This is a medium test file.\n'.repeat(100);
      fs.writeFileSync(mediumFilePath, content);
    }

    // Create large text file (for size testing)
    const largeFilePath = path.join(uploadDir, testData.testFiles.large);
    if (!fs.existsSync(largeFilePath)) {
      const content = 'This is a large test file for testing file size limits.\n'.repeat(1000);
      fs.writeFileSync(largeFilePath, content);
    }

    // Create CSV test file
    const csvFilePath = path.join(uploadDir, 'test-data.csv');
    if (!fs.existsSync(csvFilePath)) {
      const csvContent = 'Name,Age,City,Email\nJohn Doe,25,New York,john@example.com\nJane Smith,30,Los Angeles,jane@example.com\nBob Johnson,35,Chicago,bob@example.com';
      fs.writeFileSync(csvFilePath, csvContent);
    }

    // Create JSON test file
    const jsonFilePath = path.join(uploadDir, 'test-data.json');
    if (!fs.existsSync(jsonFilePath)) {
      const jsonContent = {
        users: [
          { id: 1, name: 'John Doe', email: 'john@example.com' },
          { id: 2, name: 'Jane Smith', email: 'jane@example.com' }
        ],
        timestamp: new Date().toISOString()
      };
      fs.writeFileSync(jsonFilePath, JSON.stringify(jsonContent, null, 2));
    }
  }

  /**
   * Get path to a specific test file
   */
  getTestFilePath(fileName: string): string {
    return path.join(this.testDataPath, 'upload', fileName);
  }

  /**
   * Generate random test data
   */
  generateRandomUser(): TestUser {
    const randomId = Math.random().toString(36).substring(2, 8);
    const timestamp = Date.now();
    return {
      firstName: `TestUser${randomId}`,
      lastName: `LastName${randomId}`,
      email: `test${randomId}${timestamp}@example.com`,
      phone: `+1${Math.floor(Math.random() * 9000000000) + 1000000000}`
    };
  }

  /**
   * Save user data to file
   */
  saveUserData(user: TestUser, fileName?: string): void {
    const userFileName = fileName || `user-${Date.now()}.json`;
    const userPath = path.join(this.testDataPath, 'register', userFileName);
    
    try {
      fs.writeFileSync(userPath, JSON.stringify(user, null, 2));
    } catch (error) {
      console.error('Error saving user data:', error);
      throw new Error('Failed to save user data');
    }
  }

  /**
   * Get all saved users
   */
  getAllUsers(): TestUser[] {
    const registerDir = path.join(this.testDataPath, 'register');
    const users: TestUser[] = [];

    if (fs.existsSync(registerDir)) {
      const files = fs.readdirSync(registerDir).filter(file => 
        file.startsWith('user-') && file.endsWith('.json')
      );

      files.forEach(file => {
        try {
          const filePath = path.join(registerDir, file);
          const data = fs.readFileSync(filePath, 'utf-8');
          users.push(JSON.parse(data));
        } catch (error) {
          console.warn(`Failed to read user file ${file}:`, error);
        }
      });
    }

    return users;
  }

  /**
   * Clean up test data files
   */
  cleanupTestData(): void {
    const uploadDir = path.join(this.testDataPath, 'upload');
    const registerDir = path.join(this.testDataPath, 'register');

    [uploadDir, registerDir].forEach(dir => {
      if (fs.existsSync(dir)) {
        const files = fs.readdirSync(dir);
        files.forEach(file => {
          if (file.startsWith('test-') || file.startsWith('user-')) {
            try {
              fs.unlinkSync(path.join(dir, file));
            } catch (error) {
              console.warn(`Failed to delete file ${file}:`, error);
            }
          }
        });
      }
    });
  }

  /**
   * Validate file format
   */
  isValidFileFormat(fileName: string): boolean {
    const extension = path.extname(fileName).toLowerCase().substring(1);
    const { validFormats } = this.getFileUploadTestData();
    return validFormats.includes(extension);
  }

  /**
   * Check if file format is invalid
   */
  isInvalidFileFormat(fileName: string): boolean {
    const extension = path.extname(fileName).toLowerCase().substring(1);
    const { invalidFormats } = this.getFileUploadTestData();
    return invalidFormats.includes(extension);
  }

  /**
   * Get file size in MB
   */
  getFileSizeInMB(filePath: string): number {
    if (!fs.existsSync(filePath)) {
      throw new Error(`File not found: ${filePath}`);
    }
    const stats = fs.statSync(filePath);
    return stats.size / (1024 * 1024);
  }

  /**
   * Check if file size is within limits
   */
  isFileSizeValid(filePath: string): boolean {
    try {
      const sizeInMB = this.getFileSizeInMB(filePath);
      const { maxFileSize } = this.getFileUploadTestData();
      return sizeInMB <= maxFileSize;
    } catch (error) {
      console.error('Error checking file size:', error);
      return false;
    }
  }

  /**
   * Create a file with specific size (for testing file size limits)
   */
  createFileWithSize(fileName: string, sizeInMB: number): string {
    const uploadDir = path.join(this.testDataPath, 'upload');
    const filePath = path.join(uploadDir, fileName);
    
    const sizeInBytes = sizeInMB * 1024 * 1024;
    const content = 'A'.repeat(sizeInBytes);
    
    try {
      fs.writeFileSync(filePath, content);
      return filePath;
    } catch (error) {
      console.error('Error creating file with specific size:', error);
      throw new Error(`Failed to create file with size ${sizeInMB}MB`);
    }
  }

  /**
   * Get random valid file from test data
   */
  getRandomValidFile(): string {
    const { testFiles } = this.getFileUploadTestData();
    const files = Object.values(testFiles).filter(file => file !== testFiles.invalid);
    const randomIndex = Math.floor(Math.random() * files.length);
    return this.getTestFilePath(files[randomIndex]);
  }

  /**
   * Initialize test data (create all necessary files and directories)
   */
  initialize(): void {
    this.ensureTestDataStructure();
    this.createTestFiles();
    console.log('Test data manager initialized successfully');
  }

  /**
   * Get test data summary
   */
  getTestDataSummary(): any {
    const uploadDir = path.join(this.testDataPath, 'upload');
    const registerDir = path.join(this.testDataPath, 'register');
    
    const uploadFiles = fs.existsSync(uploadDir) ? fs.readdirSync(uploadDir) : [];
    const registerFiles = fs.existsSync(registerDir) ? fs.readdirSync(registerDir) : [];
    
    return {
      testDataPath: this.testDataPath,
      uploadFiles: uploadFiles.length,
      registerFiles: registerFiles.length,
      availableTestFiles: uploadFiles,
      fileUploadConfig: this.getFileUploadTestData()
    };
  }
}