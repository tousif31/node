const express = require('express')
const path = require('path')
const { exec } = require('child_process')
const fs = require('fs').promises
const app = express()
const port = 3000

// Middleware
app.use(express.static('public'))
app.use(express.json())

// Route for the home page
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'))
})

// Route for the about page
app.get('/about', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'about.html'))
})

// Route for the LeetCode clone page
app.get('/leetcode', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'leetcode.html'))
})

// API endpoint for running code
app.post('/api/run-code', async (req, res) => {
  try {
    const { language, code, problemId, testCases } = req.body;
    
    if (language === 'java') {
      const results = await runJavaCode(code, testCases);
      res.json({ success: true, results });
    } else {
      res.json({ success: false, error: 'Only Java is currently supported for JUnit testing' });
    }
  } catch (error) {
    console.error('Error running code:', error);
    res.json({ success: false, error: error.message });
  }
})

// Function to run Java code with JUnit tests
async function runJavaCode(code, testCases) {
  const timestamp = Date.now();
  const tempDir = `temp_${timestamp}`;
  
  try {
    // Create temporary directory
    await fs.mkdir(tempDir);
    
    // Create Solution.java
    const solutionCode = code;
    await fs.writeFile(`${tempDir}/Solution.java`, solutionCode);
    
    // Create test file
    const testCode = generateJUnitTest(testCases);
    await fs.writeFile(`${tempDir}/SolutionTest.java`, testCode);
    
    // Compile the solution
    await executeCommand(`javac ${tempDir}/Solution.java`);
    
    // Compile the test (assuming JUnit is available)
    try {
      await executeCommand(`javac -cp ".;lib/junit-4.13.2.jar;lib/hamcrest-core-1.3.jar" ${tempDir}/SolutionTest.java`);
    } catch (error) {
      // If JUnit is not available, create a simple test runner
      const simpleTestCode = generateSimpleTest(testCases);
      await fs.writeFile(`${tempDir}/SimpleTest.java`, simpleTestCode);
      await executeCommand(`javac ${tempDir}/SimpleTest.java`);
      
      // Run simple test
      const output = await executeCommand(`java -cp ${tempDir} SimpleTest`);
      return parseSimpleTestOutput(output, testCases);
    }
    
    // Run JUnit tests
    const output = await executeCommand(`java -cp ".;${tempDir};lib/junit-4.13.2.jar;lib/hamcrest-core-1.3.jar" org.junit.runner.JUnitCore SolutionTest`);
    return parseJUnitOutput(output, testCases);
    
  } finally {
    // Clean up temporary directory
    try {
      await fs.rmdir(tempDir, { recursive: true });
    } catch (error) {
      console.error('Error cleaning up temp directory:', error);
    }
  }
}

// Generate JUnit test code for Even or Odd
function generateJUnitTest(testCases) {
  let testCode = `
import org.junit.Test;
import org.junit.Assert;

public class SolutionTest {
    private Solution solution = new Solution();
    
`;
  
  testCases.forEach((testCase, index) => {
    testCode += `
    @Test
    public void testCase${index + 1}() {
        int num = ${testCase.input.num};
        String expected = "${testCase.expected}";
        
        long startTime = System.currentTimeMillis();
        String result = solution.isEvenOrOdd(num);
        long endTime = System.currentTimeMillis();
        
        System.out.println("Test Case ${index + 1}:");
        System.out.println("Input: num = " + num);
        System.out.println("Expected: " + expected);
        System.out.println("Output: " + result);
        System.out.println("Execution Time: " + (endTime - startTime) + "ms");
        System.out.println("Passed: " + result.equals(expected));
        System.out.println();
        
        Assert.assertEquals("Test case ${index + 1} failed", expected, result);
    }
`;
  });
  
  testCode += `}`;
  return testCode;
}

// Generate simple test code for Even or Odd (fallback when JUnit is not available)
function generateSimpleTest(testCases) {
  let testCode = `
public class SimpleTest {
    public static void main(String[] args) {
        Solution solution = new Solution();
        int totalTests = ${testCases.length};
        int passedTests = 0;
        
`;
  
  testCases.forEach((testCase, index) => {
    testCode += `
        // Test Case ${index + 1}
        try {
            int num = ${testCase.input.num};
            String expected = "${testCase.expected}";
            
            long startTime = System.currentTimeMillis();
            String result = solution.isEvenOrOdd(num);
            long endTime = System.currentTimeMillis();
            
            boolean passed = result.equals(expected);
            if (passed) passedTests++;
            
            System.out.println("TEST_CASE_${index + 1}:");
            System.out.println("INPUT: " + num);
            System.out.println("EXPECTED: " + expected);
            System.out.println("OUTPUT: " + result);
            System.out.println("EXECUTION_TIME: " + (endTime - startTime));
            System.out.println("PASSED: " + passed);
            System.out.println("---");
        } catch (Exception e) {
            System.out.println("TEST_CASE_${index + 1}:");
            System.out.println("ERROR: " + e.getMessage());
            System.out.println("PASSED: false");
            System.out.println("---");
        }
`;
  });
  
  testCode += `
        System.out.println("SUMMARY: " + passedTests + "/" + totalTests + " tests passed");
    }
}`;
  return testCode;
}

// Parse JUnit test output for Even or Odd
function parseJUnitOutput(output, testCases) {
  const results = [];
  const lines = output.split('\n');
  
  for (let i = 0; i < testCases.length; i++) {
    const testCase = testCases[i];
    let passed = false;
    let output = "";
    let executionTime = 0;
    
    // Look for test case output in the console output
    const testCaseLines = lines.filter(line => line.includes(`Test Case ${i + 1}:`));
    if (testCaseLines.length > 0) {
      const outputIndex = lines.indexOf(testCaseLines[0]);
      if (outputIndex !== -1) {
        // Parse the output lines
        let j = outputIndex + 1;
        while (j < lines.length && !lines[j].includes('Test Case') && !lines[j].includes('---')) {
          if (lines[j].includes('Output:')) {
            const outputMatch = lines[j].match(/Output: (.+)/);
            if (outputMatch) {
              output = outputMatch[1];
            }
          }
          if (lines[j].includes('Execution Time:')) {
            const timeMatch = lines[j].match(/Execution Time: (\d+)ms/);
            if (timeMatch) {
              executionTime = parseInt(timeMatch[1]);
            }
          }
          if (lines[j].includes('Passed:')) {
            passed = lines[j].includes('true');
          }
          j++;
        }
      }
    }
    
    // Ensure output is always a string, not undefined
    if (output === undefined || output === null) {
      output = "No output";
    }
    
    results.push({
      passed,
      output,
      executionTime
    });
  }
  
  return results;
}

// Parse simple test output for Even or Odd
function parseSimpleTestOutput(output, testCases) {
  const results = [];
  const lines = output.split('\n');
  
  for (let i = 0; i < testCases.length; i++) {
    const testCase = testCases[i];
    let passed = false;
    let output = "";
    let executionTime = 0;
    
    // Find test case output
    const testCaseStart = lines.findIndex(line => line.includes(`TEST_CASE_${i + 1}:`));
    if (testCaseStart !== -1) {
      let j = testCaseStart + 1;
      while (j < lines.length && !lines[j].includes('TEST_CASE_') && !lines[j].includes('---')) {
        if (lines[j].includes('OUTPUT:')) {
          const outputMatch = lines[j].match(/OUTPUT: (.+)/);
          if (outputMatch) {
            output = outputMatch[1];
          }
        }
        if (lines[j].includes('EXECUTION_TIME:')) {
          const timeMatch = lines[j].match(/EXECUTION_TIME: (\d+)/);
          if (timeMatch) {
            executionTime = parseInt(timeMatch[1]);
          }
        }
        if (lines[j].includes('PASSED:')) {
          passed = lines[j].includes('true');
        }
        j++;
      }
    }
    
    // Ensure output is always a string, not undefined
    if (output === undefined || output === null) {
      output = "No output";
    }
    
    results.push({
      passed,
      output,
      executionTime
    });
  }
  
  return results;
}

// Helper function to execute shell commands
function executeCommand(command) {
  return new Promise((resolve, reject) => {
    exec(command, { timeout: 10000 }, (error, stdout, stderr) => {
      if (error) {
        reject(new Error(`Execution failed: ${error.message}`));
      } else {
        resolve(stdout);
      }
    });
  });
}

// Start the server
app.listen(port, () => {
  console.log(`LeetCode Clone app listening at http://localhost:${port}`)
  console.log(`Visit http://localhost:${port}/leetcode to start coding!`)
})
