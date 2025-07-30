# LeetCode Clone - Coding Problem Platform

A web-based coding platform similar to LeetCode with problem statements, code editor, and automated testing using JUnit.

## Features

- **Problem Statement**: Clear problem description with examples and constraints
- **Code Editor**: Syntax-highlighted code editor with multiple language support
- **Automated Testing**: JUnit-based test execution for Java solutions
- **Real-time Results**: Instant feedback on test case execution
- **Modern UI**: Beautiful, responsive interface inspired by LeetCode

## Prerequisites

- Node.js (version 14 or higher)
- Java Development Kit (JDK) 8 or higher
- Java compiler (`javac`) and runtime (`java`) must be available in PATH

## Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd DemoApp
```

2. Install dependencies:
```bash
npm install
```

3. Start the application:
```bash
npm start
```

4. Open your browser and navigate to:
```
http://localhost:3000/leetcode
```

## Usage

1. **Read the Problem**: Start by reading the problem statement, examples, and constraints
2. **Write Your Code**: Use the code editor to implement your solution
3. **Run Tests**: Click the "Run Code" button to execute your solution against test cases
4. **Review Results**: Check the test results to see which cases passed or failed

## Supported Languages

Currently, the platform supports:
- **Java** (with JUnit testing)
- Python (basic support)
- JavaScript (basic support)

## Problem: Two Sum

The current implementation includes the classic "Two Sum" problem:

**Problem**: Given an array of integers `nums` and an integer `target`, return indices of the two numbers such that they add up to `target`.

**Examples**:
- Input: nums = [2,7,11,15], target = 9 → Output: [0,1]
- Input: nums = [3,2,4], target = 6 → Output: [1,2]

## Technical Details

### Backend
- **Express.js**: Web server and API endpoints
- **Child Process**: Java code compilation and execution
- **File System**: Temporary file management for code execution

### Frontend
- **CodeMirror**: Advanced code editor with syntax highlighting
- **Vanilla JavaScript**: No framework dependencies
- **CSS Grid**: Responsive layout design

### Testing
- **JUnit**: Automated test execution for Java solutions
- **Fallback Testing**: Simple test runner when JUnit is unavailable
- **Real-time Feedback**: Immediate test results with execution times

## File Structure

```
DemoApp/
├── public/
│   ├── leetcode.html      # Main coding interface
│   ├── leetcode.js        # Frontend JavaScript
│   └── index.html         # Home page
├── index.js               # Express server
├── package.json           # Dependencies
└── README.md             # This file
```

## Security Considerations

- Code execution is sandboxed in temporary directories
- Timeout limits prevent infinite loops
- Input validation prevents malicious code injection
- Temporary files are automatically cleaned up

## Contributing

To add new problems:
1. Create new HTML files for problem statements
2. Add test cases to the JavaScript files
3. Update the navigation to include new problems

## License

ISC License - see package.json for details

## Troubleshooting

### Java Not Found
If you get "Java not found" errors:
1. Ensure Java is installed and in your PATH
2. Verify with `java -version` and `javac -version`

### JUnit Not Available
The system will automatically fall back to a simple test runner if JUnit is not available.

### Port Already in Use
If port 3000 is busy, change the port in `index.js`:
```javascript
const port = 3001; // or any available port
```

## Future Enhancements

- [ ] Support for more programming languages
- [ ] User authentication and progress tracking
- [ ] Multiple problem database
- [ ] Code submission history
- [ ] Performance analytics
- [ ] Discussion forums
```

## Summary

I've created a comprehensive LeetCode-like webpage with the following features:

### 🎯 **Key Features Implemented:**

1. **Problem Statement Section**:
   - Clear problem description for "Two Sum"
   - Multiple examples with inputs/outputs
   - Constraints and requirements
   - Professional styling similar to LeetCode

2. **Code Editor**:
   - Syntax-highlighted editor using CodeMirror
   - Support for Java, Python, and JavaScript
   - Auto-completion and bracket matching
   - Pre-filled code templates

3. **JUnit Integration**:
   - Automated test execution for Java code
   - Fallback simple test runner when JUnit unavailable
   - Real-time test results with execution times
   - Multiple test cases with detailed feedback

4. **Modern UI/UX**:
   - Responsive design that works on all devices
   - Beautiful gradient styling
   - Clear test result visualization
   - Loading states and error handling

### 🔧 **How to Use:**

1. **Install dependencies**: `npm install`
2. **Start the server**: `npm start`
3. **Visit**: `http://localhost:3000/leetcode`
4. **Write your solution** in the code editor
5. **Click "Run Code"** to test against all test cases
6. **Review results** with detailed feedback

### 🔧 **Technical Implementation:**

- **Backend**: Express.js server with Java code execution
- **Frontend**: Vanilla JavaScript with CodeMirror editor
- **Testing**: JUnit integration with fallback simple testing
- **Security**: Sandboxed execution with timeouts and cleanup

The platform is ready to use and can be easily extended with more problems, languages, and features. The JUnit integration provides robust testing capabilities, while the fallback system ensures it works even without JUnit installed. 