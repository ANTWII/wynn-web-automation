import fs from 'fs';
import path from 'path';
import crypto from 'crypto';

export class FileHelper {
  private createdFiles: string[] = [];
  private uploadDir: string;

  constructor() {
    this.uploadDir = path.join(process.cwd(), 'test-data', 'upload-files');
    this.ensureDirectoryExists();
  }

  /**
   * Ensure upload directory exists
   */
  private ensureDirectoryExists(): void {
    if (!fs.existsSync(this.uploadDir)) {
      fs.mkdirSync(this.uploadDir, { recursive: true });
    }
  }

  /**
   * Create a test file with specified content
   */
  createTestFile(fileName: string, content: string = 'Test content'): string {
    const filePath = path.join(this.uploadDir, fileName);
    fs.writeFileSync(filePath, content);
    this.createdFiles.push(filePath);
    return filePath;
  }

  /**
   * Create a binary file (for image/pdf simulation)
   */
  createBinaryFile(fileName: string, sizeInBytes: number = 1024): string {
    const filePath = path.join(this.uploadDir, fileName);
    const buffer = Buffer.alloc(sizeInBytes);
    
    // Fill with random data
    for (let i = 0; i < sizeInBytes; i++) {
      buffer[i] = Math.floor(Math.random() * 256);
    }
    
    fs.writeFileSync(filePath, buffer);
    this.createdFiles.push(filePath);
    return filePath;
  }

  /**
   * Generate unique filename
   */
  generateUniqueFileName(extension: string = 'txt'): string {
    const timestamp = Date.now();
    const randomString = crypto.randomBytes(4).toString('hex');
    return `test-file-${timestamp}-${randomString}.${extension}`;
  }

  /**
   * Create multiple test files
   */
  createMultipleFiles(count: number, extension: string = 'txt'): string[] {
    const filePaths: string[] = [];
    
    for (let i = 0; i < count; i++) {
      const fileName = this.generateUniqueFileName(extension);
      const content = `Test file ${i + 1} content`;
      const filePath = this.createTestFile(fileName, content);
      filePaths.push(filePath);
    }
    
    return filePaths;
  }

  /**
   * Create file with specific size
   */
  createFileWithSize(fileName: string, sizeInMB: number): string {
    const sizeInBytes = sizeInMB * 1024 * 1024;
    const filePath = path.join(this.uploadDir, fileName);
    const content = 'x'.repeat(sizeInBytes);
    fs.writeFileSync(filePath, content);
    this.createdFiles.push(filePath);
    return filePath;
  }

  /**
   * Delete a specific file
   */
  deleteFile(filePath: string): void {
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
      const index = this.createdFiles.indexOf(filePath);
      if (index > -1) {
        this.createdFiles.splice(index, 1);
      }
    }
  }

  /**
   * Cleanup all created files
   */
  cleanup(): void {
    for (const filePath of this.createdFiles) {
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    }
    this.createdFiles = [];
  }

  /**
   * Check if file exists
   */
  fileExists(filePath: string): boolean {
    return fs.existsSync(filePath);
  }

  /**
   * Get file size in bytes
   */
  getFileSize(filePath: string): number {
    const stats = fs.statSync(filePath);
    return stats.size;
  }

  /**
   * Create CSV file
   */
  createCSVFile(fileName: string, rows: string[][]): string {
    const filePath = path.join(this.uploadDir, fileName);
    const csvContent = rows.map(row => row.join(',')).join('\n');
    fs.writeFileSync(filePath, csvContent);
    this.createdFiles.push(filePath);
    return filePath;
  }

  /**
   * Create JSON file
   */
  createJSONFile(fileName: string, data: object): string {
    const filePath = path.join(this.uploadDir, fileName);
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
    this.createdFiles.push(filePath);
    return filePath;
  }
}