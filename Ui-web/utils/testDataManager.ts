import fs from 'fs';
import path from 'path';

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

    // Create main test file
    const testFilePath = path.join(uploadDir, 'test-file.txt');
    if (!fs.existsSync(testFilePath)) {
      fs.writeFileSync(testFilePath, 'This is the main test file for upload testing.\nIt contains multiple lines of text.\nUsed for standard upload tests.');
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
   * Clean up test data files
   */
  cleanupTestData(): void {
    const uploadDir = path.join(this.testDataPath, 'upload');

    if (fs.existsSync(uploadDir)) {
      const files = fs.readdirSync(uploadDir);
      files.forEach(file => {
        if (file.startsWith('test-')) {
          try {
            fs.unlinkSync(path.join(uploadDir, file));
          } catch (error) {
            console.warn(`Failed to delete file ${file}:`, error);
          }
        }
      });
    }
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
    
    const uploadFiles = fs.existsSync(uploadDir) ? fs.readdirSync(uploadDir) : [];
    
    return {
      testDataPath: this.testDataPath,
      uploadFiles: uploadFiles.length,
      availableTestFiles: uploadFiles,
      fileUploadConfig: this.getFileUploadTestData()
    };
  }
}