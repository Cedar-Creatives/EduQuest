/**
 * EduQuest Comprehensive Testing Script
 * Tests all API endpoints, routes, and functionality
 */

const axios = require('axios');
const fs = require('fs');

const API_BASE = 'http://localhost:5000';
const CLIENT_BASE = 'http://localhost:5173';

class EduQuestTester {
  constructor() {
    this.results = {
      timestamp: new Date().toISOString(),
      phases: {
        apiEndpoints: { status: 'pending', results: {}, summary: '' },
        frontendRoutes: { status: 'pending', results: {}, summary: '' },
        integration: { status: 'pending', results: {}, summary: '' },
        performance: { status: 'pending', results: {}, summary: '' }
      },
      overallStatus: 'pending',
      issuesFound: [],
      recommendations: []
    };
  }

  async testAPIEndpoints() {
    console.log('🔧 Testing API Endpoints...');
    const endpoints = [
      { name: 'health', method: 'GET', url: '/api/health' },
      { name: 'quizSubjects', method: 'GET', url: '/api/quiz/subjects' },
      { name: 'quizGeneration', method: 'GET', url: '/api/quiz/mathematics/basic' },
      { name: 'aiTeacherHealth', method: 'GET', url: '/api/ai-teacher/health' },
      { name: 'dashboardStats', method: 'GET', url: '/api/dashboard/stats' },
      { name: 'progressData', method: 'GET', url: '/api/progress' },
      { name: 'notesData', method: 'GET', url: '/api/notes' }
    ];

    const postEndpoints = [
      { 
        name: 'quizGenerate', 
        method: 'POST', 
        url: '/api/quiz/generate',
        data: { subject: 'Mathematics', difficulty: 'Basic', count: 3 }
      },
      { 
        name: 'quizSubmit', 
        method: 'POST', 
        url: '/api/quiz/submit',
        data: { quizId: 'test-123', answers: [2, 0, 2], timeTaken: 180 }
      },
      { 
        name: 'aiTeacherChat', 
        method: 'POST', 
        url: '/api/ai-teacher/chat',
        data: { message: 'Hello, test message' }
      }
    ];

    const results = {};

    // Test GET endpoints
    for (const endpoint of endpoints) {
      try {
        const startTime = Date.now();
        const response = await axios.get(`${API_BASE}${endpoint.url}`);
        const responseTime = Date.now() - startTime;
        
        results[endpoint.name] = {
          status: '✅ PASSED',
          responseCode: response.status,
          responseTime: `${responseTime}ms`,
          dataReceived: response.data ? 'Yes' : 'No',
          dataSize: JSON.stringify(response.data).length
        };
        console.log(`  ✅ ${endpoint.name}: ${response.status} (${responseTime}ms)`);
      } catch (error) {
        results[endpoint.name] = {
          status: '❌ FAILED',
          error: error.message,
          responseCode: error.response?.status || 'No response'
        };
        console.log(`  ❌ ${endpoint.name}: ${error.message}`);
        this.results.issuesFound.push(`API endpoint ${endpoint.name} failed: ${error.message}`);
      }
    }

    // Test POST endpoints
    for (const endpoint of postEndpoints) {
      try {
        const startTime = Date.now();
        const response = await axios.post(`${API_BASE}${endpoint.url}`, endpoint.data);
        const responseTime = Date.now() - startTime;
        
        results[endpoint.name] = {
          status: '✅ PASSED',
          responseCode: response.status,
          responseTime: `${responseTime}ms`,
          dataReceived: response.data ? 'Yes' : 'No',
          dataSize: JSON.stringify(response.data).length
        };
        console.log(`  ✅ ${endpoint.name}: ${response.status} (${responseTime}ms)`);
      } catch (error) {
        results[endpoint.name] = {
          status: '❌ FAILED',
          error: error.message,
          responseCode: error.response?.status || 'No response'
        };
        console.log(`  ❌ ${endpoint.name}: ${error.message}`);
        this.results.issuesFound.push(`API endpoint ${endpoint.name} failed: ${error.message}`);
      }
    }

    this.results.phases.apiEndpoints = {
      status: 'completed',
      results,
      summary: `${Object.values(results).filter(r => r.status.includes('PASSED')).length}/${Object.keys(results).length} endpoints working`
    };
  }

  async testFrontendRoutes() {
    console.log('🌐 Testing Frontend Routes...');
    const routes = [
      { name: 'landingPage', url: '/' },
      { name: 'loginPage', url: '/login' },
      { name: 'registerPage', url: '/register' },
      { name: 'onboardingPage', url: '/onboarding' },
      { name: 'blankPage', url: '/blankpage' }
    ];

    const results = {};

    for (const route of routes) {
      try {
        const startTime = Date.now();
        const response = await axios.get(`${CLIENT_BASE}${route.url}`);
        const responseTime = Date.now() - startTime;
        
        // Check if it's a valid HTML response
        const isHTML = response.data.includes('<!doctype html>') || response.data.includes('<html');
        const hasReactApp = response.data.includes('root') || response.data.includes('react');
        
        results[route.name] = {
          status: isHTML ? '✅ PASSED' : '⚠️ WARNING',
          responseCode: response.status,
          responseTime: `${responseTime}ms`,
          isHTML: isHTML ? 'Yes' : 'No',
          hasReactApp: hasReactApp ? 'Yes' : 'No',
          contentLength: response.data.length
        };
        console.log(`  ✅ ${route.name}: ${response.status} (${responseTime}ms)`);
      } catch (error) {
        results[route.name] = {
          status: '❌ FAILED',
          error: error.message,
          responseCode: error.response?.status || 'No response'
        };
        console.log(`  ❌ ${route.name}: ${error.message}`);
        this.results.issuesFound.push(`Frontend route ${route.name} failed: ${error.message}`);
      }
    }

    this.results.phases.frontendRoutes = {
      status: 'completed',
      results,
      summary: `${Object.values(results).filter(r => r.status.includes('PASSED')).length}/${Object.keys(results).length} routes accessible`
    };
  }

  async testIntegration() {
    console.log('🔄 Testing Integration...');
    const integrationTests = [
      {
        name: 'quizFlow',
        description: 'Complete quiz flow from selection to results',
        steps: [
          { action: 'getSubjects', endpoint: '/api/quiz/subjects' },
          { action: 'generateQuiz', endpoint: '/api/quiz/generate', data: { subject: 'Mathematics', difficulty: 'Basic', count: 5 } },
          { action: 'submitQuiz', endpoint: '/api/quiz/submit', data: { quizId: 'test-integration', answers: [1, 2, 0, 1, 2], timeTaken: 300 } }
        ]
      },
      {
        name: 'aiTeacherFlow',
        description: 'AI teacher interaction flow',
        steps: [
          { action: 'healthCheck', endpoint: '/api/ai-teacher/health' },
          { action: 'sendMessage', endpoint: '/api/ai-teacher/chat', data: { message: 'Explain algebra basics' } }
        ]
      }
    ];

    const results = {};

    for (const test of integrationTests) {
      console.log(`  Testing ${test.name}...`);
      const testResults = [];
      let allPassed = true;

      for (const step of test.steps) {
        try {
          const startTime = Date.now();
          let response;
          
          if (step.data) {
            response = await axios.post(`${API_BASE}${step.endpoint}`, step.data);
          } else {
            response = await axios.get(`${API_BASE}${step.endpoint}`);
          }
          
          const responseTime = Date.now() - startTime;
          
          testResults.push({
            action: step.action,
            status: '✅ PASSED',
            responseTime: `${responseTime}ms`,
            responseCode: response.status
          });
          console.log(`    ✅ ${step.action}: ${response.status}`);
        } catch (error) {
          testResults.push({
            action: step.action,
            status: '❌ FAILED',
            error: error.message
          });
          console.log(`    ❌ ${step.action}: ${error.message}`);
          allPassed = false;
          this.results.issuesFound.push(`Integration test ${test.name} - ${step.action} failed: ${error.message}`);
        }
      }

      results[test.name] = {
        status: allPassed ? '✅ PASSED' : '❌ FAILED',
        description: test.description,
        steps: testResults,
        summary: `${testResults.filter(r => r.status.includes('PASSED')).length}/${testResults.length} steps passed`
      };
    }

    this.results.phases.integration = {
      status: 'completed',
      results,
      summary: `${Object.values(results).filter(r => r.status.includes('PASSED')).length}/${Object.keys(results).length} integration flows working`
    };
  }

  async testPerformance() {
    console.log('⚡ Testing Performance...');
    const performanceTests = [
      { name: 'apiResponseTime', endpoint: '/api/health', threshold: 100 },
      { name: 'quizGeneration', endpoint: '/api/quiz/generate', data: { subject: 'Mathematics', difficulty: 'Basic', count: 10 }, threshold: 2000 },
      { name: 'frontendLoad', url: `${CLIENT_BASE}/`, threshold: 1000 }
    ];

    const results = {};

    for (const test of performanceTests) {
      try {
        const startTime = Date.now();
        
        if (test.endpoint) {
          if (test.data) {
            await axios.post(`${API_BASE}${test.endpoint}`, test.data);
          } else {
            await axios.get(`${API_BASE}${test.endpoint}`);
          }
        } else if (test.url) {
          await axios.get(test.url);
        }
        
        const responseTime = Date.now() - startTime;
        const passed = responseTime <= test.threshold;
        
        results[test.name] = {
          status: passed ? '✅ PASSED' : '⚠️ SLOW',
          responseTime: `${responseTime}ms`,
          threshold: `${test.threshold}ms`,
          performance: passed ? 'Good' : 'Needs optimization'
        };
        
        console.log(`  ${passed ? '✅' : '⚠️'} ${test.name}: ${responseTime}ms (threshold: ${test.threshold}ms)`);
        
        if (!passed) {
          this.results.recommendations.push(`${test.name} is slower than expected (${responseTime}ms > ${test.threshold}ms)`);
        }
      } catch (error) {
        results[test.name] = {
          status: '❌ FAILED',
          error: error.message
        };
        console.log(`  ❌ ${test.name}: ${error.message}`);
      }
    }

    this.results.phases.performance = {
      status: 'completed',
      results,
      summary: `${Object.values(results).filter(r => r.status.includes('PASSED')).length}/${Object.keys(results).length} performance tests passed`
    };
  }

  generateReport() {
    const totalTests = Object.values(this.results.phases).reduce((acc, phase) => {
      return acc + Object.keys(phase.results || {}).length;
    }, 0);

    const passedTests = Object.values(this.results.phases).reduce((acc, phase) => {
      return acc + Object.values(phase.results || {}).filter(r => r.status && r.status.includes('PASSED')).length;
    }, 0);

    this.results.overallStatus = this.results.issuesFound.length === 0 ? 'PASSED' : 'ISSUES_FOUND';
    
    const report = `
# 🧪 EduQuest Comprehensive Test Report

**Test Date:** ${this.results.timestamp}
**Overall Status:** ${this.results.overallStatus === 'PASSED' ? '✅ PASSED' : '⚠️ ISSUES FOUND'}
**Tests Passed:** ${passedTests}/${totalTests}

## Phase Results

### 🔧 API Endpoints Testing
**Status:** ${this.results.phases.apiEndpoints.status}
**Summary:** ${this.results.phases.apiEndpoints.summary}

### 🌐 Frontend Routes Testing
**Status:** ${this.results.phases.frontendRoutes.status}
**Summary:** ${this.results.phases.frontendRoutes.summary}

### 🔄 Integration Testing
**Status:** ${this.results.phases.integration.status}
**Summary:** ${this.results.phases.integration.summary}

### ⚡ Performance Testing
**Status:** ${this.results.phases.performance.status}
**Summary:** ${this.results.phases.performance.summary}

## Issues Found (${this.results.issuesFound.length})
${this.results.issuesFound.length > 0 ? this.results.issuesFound.map(issue => `- ${issue}`).join('\n') : 'None'}

## Recommendations (${this.results.recommendations.length})
${this.results.recommendations.length > 0 ? this.results.recommendations.map(rec => `- ${rec}`).join('\n') : 'None'}

## Detailed Results
${JSON.stringify(this.results, null, 2)}
`;

    return report;
  }

  async runAllTests() {
    console.log('🚀 Starting EduQuest Comprehensive Testing...\n');
    
    try {
      await this.testAPIEndpoints();
      console.log('');
      
      await this.testFrontendRoutes();
      console.log('');
      
      await this.testIntegration();
      console.log('');
      
      await this.testPerformance();
      console.log('');
      
      const report = this.generateReport();
      
      // Save results
      fs.writeFileSync('test-results-detailed.json', JSON.stringify(this.results, null, 2));
      fs.writeFileSync('TEST_REPORT.md', report);
      
      console.log('📊 Testing Complete!');
      console.log(`📄 Detailed results saved to: test-results-detailed.json`);
      console.log(`📋 Report saved to: TEST_REPORT.md`);
      console.log(`\n${this.results.overallStatus === 'PASSED' ? '✅ ALL TESTS PASSED!' : '⚠️ SOME ISSUES FOUND - CHECK REPORT'}`);
      
      return this.results;
    } catch (error) {
      console.error('❌ Testing failed:', error.message);
      throw error;
    }
  }
}

// Run tests if called directly
if (require.main === module) {
  const tester = new EduQuestTester();
  tester.runAllTests().catch(console.error);
}

module.exports = EduQuestTester;