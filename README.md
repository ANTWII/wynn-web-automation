# Wynn Web Automation Framework

A comprehensive web automation testing framework built with Playwright and TypeScript, featuring file upload testing, multi-browser support, and robust CI/CD integration.

## 🚀 Features

- **Multi-Browser Testing**: Chromium, Firefox, and WebKit support
- **File Upload Testing**: Comprehensive file upload functionality with multiple file types
- **Tagged Test Execution**: Organized test execution with @smoke, @regression, @sanity, @critical tags
- **Page Object Model**: Clean, maintainable test architecture
- **Comprehensive Logging**: Structured JSON logging with Winston for test execution tracking
- **CI/CD Integration**: GitHub Actions workflow for automated testing
- **Test Data Management**: Automated test file generation with PDF creation support
- **Comprehensive Reporting**: HTML reports with screenshots and videos
- **TypeScript Support**: Full type safety and modern JavaScript features
- **Error Handling**: Robust error handling with detailed logging and recovery mechanisms

## 📁 Project Structure

```
wynn-web-automation/
├── .github/
│   └── workflows/
│       └── playwright-tests.yml      # GitHub Actions CI/CD pipeline
├── logs/
│   ├── test-execution.log            # All test execution logs
│   └── error.log                     # Error-only logs
├── Ui-web/
│   ├── config/
│   │   └── configmanager.ts          # Environment configuration
│   ├── helper/
│   │   ├── baseTest.ts               # Base test fixtures
│   │   └── common.ts                 # Common utilities
│   ├── pageFactory/
│   │   ├── MainPage.ts               # Main page object
│   │   └── UploadPage.ts             # File upload page object
│   ├── test-data/
│   │   └── upload/                   # Test files for upload testing
│   ├── tests/
│   │   ├── mainPage.spec.ts          # Main page tests
│   │   └── upload.spec.ts            # File upload tests
│   ├── utils/
│   │   ├── testDataManager.ts        # Test data management
│   │   ├── fileHelper.ts             # File operations utility
│   │   └── logger.ts                 # Winston-based logging utility
│   └── playwright-report/            # Generated test reports
├── playwright.config.ts              # Playwright configuration
└── package.json                      # Dependencies and scripts
```

## 🛠️ Setup and Installation

### Prerequisites

- **Node.js** (v20 or higher)
- **Python 3** (for PDF file generation)
- **Git**

### Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/ANTWII/wynn-web-automation.git
   cd wynn-web-automation
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Install Playwright browsers**:
   ```bash
   npm run install:browsers
   ```

4. **Install Python dependencies** (for PDF generation):
   ```bash
   pip3 install reportlab
   ```

## 🚀 Running Tests

### NPM Scripts

```bash
# Run all tests
npm test

# Run specific test types
npm run test:smoke         # Smoke tests only
npm run test:regression    # Regression tests only
npm run test:sanity        # Sanity tests only
npm run test:critical      # Critical tests only

# Run with specific options
npm run test:headed        # Run in headed mode (browser visible)
npm run test:ui            # Run with Playwright UI
npm run test:debug         # Run in debug mode

# View test reports
npm run report
```

### Command Line Examples

```bash
# Run smoke tests in specific browser
npx playwright test --grep "@smoke" --project=chromium

# Run tests in headed mode
npx playwright test --headed

# Run specific test file
npx playwright test tests/upload.spec.ts

# Run tests with specific tag combination
npx playwright test --grep "@smoke|@critical"
```

## 🏷️ Test Tags

Tests are organized using tags for flexible execution:

- **@smoke**: Essential functionality tests
- **@regression**: Comprehensive feature testing
- **@sanity**: Basic functionality verification
- **@critical**: High-priority business logic tests
- **@ui**: User interface element tests
- **@navigation**: Page navigation tests
- **@performance**: Performance-related tests
- **@stability**: System stability tests
- **@comprehensive**: End-to-end workflow tests

## 📝 Test Categories

The test suite includes 27 comprehensive tests organized by functionality:

### Main Page Tests (`mainPage.spec.ts`)
- Page loading and element verification (7 tests)
- Navigation functionality
- Link availability and accessibility
- Error handling and graceful recovery

### File Upload Tests (`upload.spec.ts`)
- Single and multiple file uploads (14 tests)
- Different file types (TXT, PDF, CSV, JSON)
- File validation and error handling
- Upload progress and success verification
- Navigation and state management
- **Negative test cases (6 tests)**:
  - Special characters in filenames
  - Empty file handling
  - Invalid file types (security testing)
  - No file selected scenarios
  - Oversized file handling
  - Edge case validation

## 🔧 Configuration

### Playwright Configuration

The framework supports multiple browsers and environments:

```typescript
// playwright.config.ts
export default defineConfig({
  testDir: './Ui-web/tests',
  fullyParallel: true,
  use: {
    baseURL: 'https://the-internet.herokuapp.com',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
  },
  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
    { name: 'firefox', use: { ...devices['Desktop Firefox'] } },
    { name: 'webkit', use: { ...devices['Desktop Safari'] } },
  ],
});
```

### Environment Configuration

```typescript
// Ui-web/config/configmanager.ts
const config = {
  url: process.env.URL || 'https://the-internet.herokuapp.com',
  // Additional configuration options
};
```

## 🤖 CI/CD Pipeline

### GitHub Actions Workflow

The project includes a comprehensive GitHub Actions workflow (`playwright-tests.yml`) that:

- **Triggers**: Automatically runs on pushes, PRs, daily schedule, and manual dispatch
- **Multi-browser testing**: Parallel execution across Chromium, Firefox, and WebKit
- **Python dependency installation**: Automatic setup for PDF generation
- **Artifact management**: Stores test reports and failure videos
- **Smart execution**: Separate jobs for smoke tests and regression tests

### Manual Workflow Dispatch

You can manually trigger tests from GitHub Actions with options for:
- **Test Type**: smoke, regression, sanity, critical, or all
- **Browser**: chromium, firefox, webkit, or all

## 📊 Test Data Management

### Automatic File Generation

The framework automatically creates test files:

```typescript
// Test files created automatically:
- test-file.txt           # Main test file
- test-document.pdf       # PDF file (with fallback creation)
- test-data.csv          # CSV data file
- test-data.json         # JSON data file
- test-small.txt         # Small size file
- test-medium.txt        # Medium size file
- test-large.txt         # Large size file
```

### PDF File Generation

Robust PDF creation with multiple fallback mechanisms:
1. **Primary**: Python reportlab library
2. **Fallback**: Minimal PDF structure
3. **Emergency**: Text file with .pdf extension

## 📋 Logging and Monitoring

### Comprehensive Test Logging

The framework includes Winston-based structured logging for complete test execution visibility:

#### Log Files
- **`logs/test-execution.log`**: All test execution logs with timestamps
- **`logs/error.log`**: Error-only logs for debugging failures

#### Log Format
```json
{
  "level": "info",
  "message": "Starting test: Verify successful upload of text file",
  "service": "playwright-tests",
  "timestamp": "2025-08-15 12:13:37"
}
```

#### Logging Pattern in Tests
```typescript
test('Test Name', async ({ fixtures }) => {
  logger.info('Starting test: Test Name');
  
  try {
    // Test logic here
  } catch (error) {
    logger.error('Test failed: Test Name', error as Error);
    throw error;
  }
});
```

#### Features
- **Console Output**: Colorized logs during test execution
- **File Rotation**: Automatic log file rotation (5MB max, 5 files kept)
- **Structured Format**: JSON formatting for easy parsing and analysis
- **Error Tracking**: Detailed error logging with stack traces
- **Test Lifecycle**: Start/end logging for complete test visibility

## 📈 Reporting

### Test Reports

- **HTML Reports**: Comprehensive test execution reports with screenshots
- **Videos**: Failure recordings for debugging
- **Screenshots**: Automatic capture on test failures
- **Artifacts**: Stored in GitHub Actions for 30 days

### Viewing Reports

```bash
# Local report viewing
npm run report

# Or directly
npx playwright show-report Ui-web/playwright-report
```

## 🔍 Debugging

### Debug Mode

```bash
# Run in debug mode
npm run test:debug

# Debug specific test
npx playwright test --debug tests/upload.spec.ts
```

### Headed Mode

```bash
# Run with browser visible
npm run test:headed

# Or specific browser
npx playwright test --headed --project=chromium
```

## 🧪 Adding New Tests

### Test Structure

```typescript
import test from '../helper/baseTest';
import { expect } from '@playwright/test';

test.describe('Feature Name', () => {
  test.beforeEach(async ({ MainPage }) => {
    await MainPage.navigate();
  });

  test('Test description', { tag: ["@smoke", "@regression"] }, async ({ MainPage, UploadPage }) => {
    // Test implementation
  });
});
```

### Page Object Pattern

```typescript
export class NewPage extends _common {
  readonly element = this.page.locator('[data-testid="element"]');

  async performAction(): Promise<void> {
    await this.element.click();
  }

  async verifyState(): Promise<boolean> {
    return await this.element.isVisible();
  }
}
```

## 🔧 Troubleshooting

### Common Issues

1. **PDF File Missing**: Framework automatically creates missing PDF files
2. **Browser Installation**: Run `npm run install:browsers`
3. **Python Dependencies**: Install reportlab with `pip3 install reportlab`
4. **Test Failures**: Check HTML report for screenshots and error details

### Debug Commands

```bash
# Check Playwright installation
npx playwright --version

# Verify browser installation
npx playwright install --dry-run

# Test configuration
npx playwright test --list
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Make your changes and add tests
4. Ensure all tests pass: `npm test`
5. Commit your changes: `git commit -m "Description"`
6. Push to the branch: `git push origin feature-name`
7. Submit a pull request

## 📋 Scripts Reference

| Script | Description |
|--------|-------------|
| `npm test` | Run all tests |
| `npm run test:smoke` | Run smoke tests only |
| `npm run test:regression` | Run regression tests only |
| `npm run test:sanity` | Run sanity tests only |
| `npm run test:critical` | Run critical tests only |
| `npm run test:headed` | Run tests in headed mode |
| `npm run test:ui` | Run with Playwright UI |
| `npm run test:debug` | Run in debug mode |
| `npm run report` | View test reports |
| `npm run install:browsers` | Install Playwright browsers |

## 📊 Test Statistics & Coverage

- **Total Tests**: 75+ comprehensive test cases with full logging integration
- **Test Categories**: Main page (7), File upload (20 including 6 negative tests)
- **Browser Coverage**: Chromium, Firefox, WebKit
- **File Type Support**: TXT, PDF, CSV, JSON
- **Tag Coverage**: @smoke, @regression, @sanity, @critical, @ui, @navigation, @performance, @stability
- **Logging Coverage**: 100% of tests include structured logging
- **CI/CD Integration**: Automated testing on all pull requests and pushes

## 🚀 Recent Improvements

### ✅ Logging Integration (Latest)
- Comprehensive Winston-based logging across all test files
- Structured JSON logs with timestamps and error tracking
- Console output with colorized formatting
- Automatic log file rotation and management

### ✅ Enhanced Error Handling
- Improved MainPage navigation with timeout handling
- Robust PDF file creation with multiple fallback mechanisms
- Better error recovery and retry mechanisms

### ✅ Code Quality
- Removed all comments from test files for cleaner code
- Eliminated duplicate workflow files
- Optimized project structure and organization

### ✅ Test Optimization
- Implemented beforeEach hooks to reduce redundant navigation
- Tagged test format for flexible test execution
- Cleaned up unused files and dependencies
- **Coverage**: Main page navigation, file uploads, error handling
- **Browsers**: Chromium, Firefox, WebKit support
- **File Types**: TXT, PDF, CSV, JSON upload testing
- **Execution Time**: ~30 seconds for full regression suite

## 📄 License

This project is licensed under the ISC License.

## 🔗 Links

- **Repository**: [https://github.com/ANTWII/wynn-web-automation](https://github.com/ANTWII/wynn-web-automation)
- **Playwright Documentation**: [https://playwright.dev/](https://playwright.dev/)
- **Test Site**: [https://the-internet.herokuapp.com](https://the-internet.herokuapp.com)

---

**Built with ❤️ using Playwright and TypeScript**