// Initialize CodeMirror editor
let editor;
let currentLanguage = 'java';

// Default code templates for Even or Odd problem
const codeTemplates = {
    java: `public class Solution {
    public String isEvenOrOdd(int num) {
        // Your code here
        // Write a function that returns "Even" if the number is even, "Odd" if it's odd
        // Example solution:
        if (num % 2 == 0) {
            return "Even";
        } else {
            return "Odd";
        }
    }
}`,
    python: `class Solution:
    def isEvenOrOdd(self, num: int) -> str:
        # Your code here
        # Write a function that returns "Even" if the number is even, "Odd" if it's odd
        # Example solution:
        if num % 2 == 0:
            return "Even"
        else:
            return "Odd"`,
    javascript: `/**
 * @param {number} num
 * @return {string}
 */
var isEvenOrOdd = function(num) {
    // Your code here
    // Write a function that returns "Even" if the number is even, "Odd" if it's odd
    // Example solution:
    if (num % 2 === 0) {
        return "Even";
    } else {
        return "Odd";
    }
};`
};

// Test cases for the Even or Odd problem
const testCases = [
    {
        input: { num: 2 },
        expected: "Even",
        description: "Even number: 2"
    },
    {
        input: { num: 3 },
        expected: "Odd",
        description: "Odd number: 3"
    },
    {
        input: { num: 0 },
        expected: "Even",
        description: "Zero is even: 0"
    },
    {
        input: { num: -4 },
        expected: "Even",
        description: "Negative even number: -4"
    },
    {
        input: { num: -7 },
        expected: "Odd",
        description: "Negative odd number: -7"
    },
    {
        input: { num: 100 },
        expected: "Even",
        description: "Large even number: 100"
    },
    {
        input: { num: 99 },
        expected: "Odd",
        description: "Large odd number: 99"
    }
];

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    initializeEditor();
    setupEventListeners();
});

function initializeEditor() {
    // Create CodeMirror instance
    editor = CodeMirror.fromTextArea(document.getElementById('codeEditor'), {
        mode: 'text/x-java',
        theme: 'monokai',
        lineNumbers: true,
        autoCloseBrackets: true,
        matchBrackets: true,
        indentUnit: 4,
        tabSize: 4,
        lineWrapping: true,
        extraKeys: {
            "Tab": function(cm) {
                cm.replaceSelection("    ", "end");
            }
        }
    });

    // Set initial code
    editor.setValue(codeTemplates.java);
    editor.refresh();
}

function setupEventListeners() {
    const languageSelector = document.getElementById('languageSelector');
    const runButton = document.getElementById('runButton');

    languageSelector.addEventListener('change', function() {
        currentLanguage = this.value;
        updateEditorMode();
        updateCodeTemplate();
    });

    runButton.addEventListener('click', function() {
        runCode();
    });
}

function updateEditorMode() {
    const modeMap = {
        'java': 'text/x-java',
        'python': 'text/x-python',
        'javascript': 'text/javascript'
    };
    
    editor.setOption('mode', modeMap[currentLanguage]);
}

function updateCodeTemplate() {
    editor.setValue(codeTemplates[currentLanguage]);
    editor.refresh();
}

async function runCode() {
    const runButton = document.getElementById('runButton');
    const resultsContainer = document.getElementById('resultsContainer');
    
    // Disable button and show loading
    runButton.disabled = true;
    runButton.textContent = '⏳ Running...';
    resultsContainer.innerHTML = '<p class="loading">Running test cases...</p>';

    try {
        const code = editor.getValue();
        
        // Send code to backend for execution
        const response = await fetch('/api/run-code', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                language: currentLanguage,
                code: code,
                problemId: 'even-or-odd',
                testCases: testCases
            })
        });

        const result = await response.json();
        
        if (result.success) {
            displayResults(result.results);
        } else {
            displayError(result.error);
        }
    } catch (error) {
        displayError('Failed to connect to server. Please try again.');
    } finally {
        // Re-enable button
        runButton.disabled = false;
        runButton.textContent = '▶ Run Code';
    }
}

function displayResults(results) {
    const resultsContainer = document.getElementById('resultsContainer');
    let html = '<h4>Test Results:</h4>';
    
    let passedCount = 0;
    let totalCount = results.length;

    results.forEach((result, index) => {
        const testCase = testCases[index];
        const isPassed = result.passed;
        
        if (isPassed) passedCount++;

        // Ensure output is always a string
        const output = result.output || "No output";

        html += `
            <div class="test-case ${isPassed ? 'passed' : 'failed'}">
                <div class="test-case-header">
                    <span class="test-case-status ${isPassed ? 'passed' : 'failed'}">
                        ${isPassed ? '✓ PASSED' : '✗ FAILED'}
                    </span>
                    <span>Test Case ${index + 1}</span>
                </div>
                <p><strong>Input:</strong> num = ${testCase.input.num}</p>
                <p><strong>Expected:</strong> "${testCase.expected}"</p>
                <p><strong>Output:</strong> "${output}"</p>
                ${result.executionTime ? `<p><strong>Execution Time:</strong> ${result.executionTime}ms</p>` : ''}
            </div>
        `;
    });

    // Add summary
    const successRate = ((passedCount / totalCount) * 100).toFixed(1);
    html += `
        <div class="test-case ${passedCount === totalCount ? 'passed' : 'failed'}">
            <div class="test-case-header">
                <span class="test-case-status ${passedCount === totalCount ? 'passed' : 'failed'}">
                    ${passedCount === totalCount ? ' All Tests Passed!' : '❌ Some Tests Failed'}
                </span>
            </div>
            <p><strong>Summary:</strong> ${passedCount}/${totalCount} test cases passed (${successRate}%)</p>
        </div>
    `;

    resultsContainer.innerHTML = html;
}

function displayError(error) {
    const resultsContainer = document.getElementById('resultsContainer');
    resultsContainer.innerHTML = `
        <div class="error">
            <h4>Error:</h4>
            <p>${error}</p>
        </div>
    `;
} 