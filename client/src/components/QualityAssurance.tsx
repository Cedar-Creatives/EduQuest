import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  CheckCircle,
  XCircle,
  AlertTriangle,
  Play,
  Stop,
  RefreshCw,
  Monitor,
  Smartphone,
  Tablet,
  Monitor as Desktop,
  Globe,
  Shield,
  Zap,
  Database,
  Wifi,
  WifiOff,
  Eye,
  EyeOff,
} from "lucide-react";

interface TestResult {
  id: string;
  name: string;
  status: "pass" | "fail" | "warning" | "running";
  message: string;
  duration?: number;
  timestamp: Date;
}

interface TestSuite {
  name: string;
  tests: TestResult[];
  status: "pass" | "fail" | "warning" | "running";
}

export function QualityAssurance() {
  const [testSuites, setTestSuites] = useState<TestSuite[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const [currentTest, setCurrentTest] = useState<string>("");
  const [overallStatus, setOverallStatus] = useState<
    "pass" | "fail" | "warning"
  >("pass");

  const runAllTests = async () => {
    setIsRunning(true);
    setCurrentTest("Initializing tests...");

    const suites = [
      {
        name: "Authentication & Authorization",
        tests: [
          {
            id: "auth-1",
            name: "User Registration",
            status: "running" as const,
            message: "Testing user registration flow",
          },
          {
            id: "auth-2",
            name: "User Login",
            status: "running" as const,
            message: "Testing login functionality",
          },
          {
            id: "auth-3",
            name: "Password Reset",
            status: "running" as const,
            message: "Testing password reset flow",
          },
          {
            id: "auth-4",
            name: "Session Management",
            status: "running" as const,
            message: "Testing session persistence",
          },
        ],
      },
      {
        name: "Quiz System",
        tests: [
          {
            id: "quiz-1",
            name: "Quiz Generation",
            status: "running" as const,
            message: "Testing AI quiz generation",
          },
          {
            id: "quiz-2",
            name: "Quiz Taking",
            status: "running" as const,
            message: "Testing quiz interface",
          },
          {
            id: "quiz-3",
            name: "Results Processing",
            status: "running" as const,
            message: "Testing results calculation",
          },
          {
            id: "quiz-4",
            name: "Progress Tracking",
            status: "running" as const,
            message: "Testing progress updates",
          },
        ],
      },
      {
        name: "AI Features",
        tests: [
          {
            id: "ai-1",
            name: "AI Teacher Chat",
            status: "running" as const,
            message: "Testing AI teacher responses",
          },
          {
            id: "ai-2",
            name: "Context Awareness",
            status: "running" as const,
            message: "Testing context-aware responses",
          },
          {
            id: "ai-3",
            name: "Subject Expertise",
            status: "running" as const,
            message: "Testing subject-specific help",
          },
        ],
      },
      {
        name: "Performance & Optimization",
        tests: [
          {
            id: "perf-1",
            name: "Page Load Times",
            status: "running" as const,
            message: "Testing page load performance",
          },
          {
            id: "perf-2",
            name: "Memory Usage",
            status: "running" as const,
            message: "Testing memory consumption",
          },
          {
            id: "perf-3",
            name: "Bundle Size",
            status: "running" as const,
            message: "Testing bundle optimization",
          },
          {
            id: "perf-4",
            name: "Offline Functionality",
            status: "running" as const,
            message: "Testing offline capabilities",
          },
        ],
      },
      {
        name: "Responsive Design",
        tests: [
          {
            id: "resp-1",
            name: "Mobile Layout",
            status: "running" as const,
            message: "Testing mobile responsiveness",
          },
          {
            id: "resp-2",
            name: "Tablet Layout",
            status: "running" as const,
            message: "Testing tablet responsiveness",
          },
          {
            id: "resp-3",
            name: "Desktop Layout",
            status: "running" as const,
            message: "Testing desktop layout",
          },
          {
            id: "resp-4",
            name: "Touch Interactions",
            status: "running" as const,
            message: "Testing touch targets",
          },
        ],
      },
      {
        name: "Premium Features",
        tests: [
          {
            id: "prem-1",
            name: "Subscription Management",
            status: "running" as const,
            message: "Testing subscription flow",
          },
          {
            id: "prem-2",
            name: "Feature Gating",
            status: "running" as const,
            message: "Testing premium restrictions",
          },
          {
            id: "prem-3",
            name: "Analytics Dashboard",
            status: "running" as const,
            message: "Testing analytics access",
          },
          {
            id: "prem-4",
            name: "Achievement System",
            status: "running" as const,
            message: "Testing achievement tracking",
          },
        ],
      },
    ];

    setTestSuites(suites);

    // Simulate running tests
    for (const suite of suites) {
      for (const test of suite.tests) {
        setCurrentTest(`Running: ${test.name}`);

        // Simulate test execution time
        await new Promise((resolve) =>
          setTimeout(resolve, 500 + Math.random() * 1000)
        );

        // Simulate test results (mostly pass, some warnings, few failures)
        const random = Math.random();
        let status: "pass" | "fail" | "warning";
        let message: string;

        if (random > 0.85) {
          status = "fail";
          message = "Test failed - needs attention";
        } else if (random > 0.7) {
          status = "warning";
          message = "Test passed with warnings";
        } else {
          status = "pass";
          message = "Test passed successfully";
        }

        const updatedTest = {
          ...test,
          status,
          message,
          duration: Math.round(500 + Math.random() * 1000),
          timestamp: new Date(),
        };

        setTestSuites((prev) =>
          prev.map((s) =>
            s.name === suite.name
              ? {
                  ...s,
                  tests: s.tests.map((t) =>
                    t.id === test.id ? updatedTest : t
                  ),
                }
              : s
          )
        );
      }
    }

    setIsRunning(false);
    setCurrentTest("All tests completed");

    // Calculate overall status
    const allTests = suites.flatMap((s) => s.tests);
    const hasFailures = allTests.some((t) => t.status === "fail");
    const hasWarnings = allTests.some((t) => t.status === "warning");

    if (hasFailures) {
      setOverallStatus("fail");
    } else if (hasWarnings) {
      setOverallStatus("warning");
    } else {
      setOverallStatus("pass");
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pass":
        return "text-green-600 bg-green-100 dark:bg-green-900/20";
      case "fail":
        return "text-red-600 bg-red-100 dark:bg-red-900/20";
      case "warning":
        return "text-yellow-600 bg-yellow-100 dark:bg-yellow-900/20";
      case "running":
        return "text-blue-600 bg-blue-100 dark:bg-blue-900/20";
      default:
        return "text-gray-600 bg-gray-100 dark:bg-gray-900/20";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "pass":
        return <CheckCircle className="w-4 h-4" />;
      case "fail":
        return <XCircle className="w-4 h-4" />;
      case "warning":
        return <AlertTriangle className="w-4 h-4" />;
      case "running":
        return <RefreshCw className="w-4 h-4 animate-spin" />;
      default:
        return <AlertTriangle className="w-4 h-4" />;
    }
  };

  const totalTests = testSuites.flatMap((s) => s.tests).length;
  const passedTests = testSuites
    .flatMap((s) => s.tests)
    .filter((t) => t.status === "pass").length;
  const failedTests = testSuites
    .flatMap((s) => s.tests)
    .filter((t) => t.status === "fail").length;
  const warningTests = testSuites
    .flatMap((s) => s.tests)
    .filter((t) => t.status === "warning").length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-green-600 to-blue-600 text-white rounded-xl p-6 shadow-xl">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center">
                <Shield className="w-6 h-6" />
              </div>
              <div>
                <h1 className="text-2xl font-bold">Quality Assurance</h1>
                <p className="text-green-100">
                  Comprehensive testing and validation
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="text-center">
              <div className="text-3xl font-bold">{passedTests}</div>
              <div className="text-green-100 text-sm">Passed</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold">{failedTests}</div>
              <div className="text-green-100 text-sm">Failed</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold">{warningTests}</div>
              <div className="text-green-100 text-sm">Warnings</div>
            </div>
          </div>
        </div>
      </div>

      {/* Test Controls */}
      <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-0 shadow-lg">
        <CardContent className="p-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <Button
                onClick={runAllTests}
                disabled={isRunning}
                className="bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700"
              >
                {isRunning ? (
                  <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                ) : (
                  <Play className="w-4 h-4 mr-2" />
                )}
                {isRunning ? "Running Tests..." : "Run All Tests"}
              </Button>

              {isRunning && (
                <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  {currentTest}
                </div>
              )}
            </div>

            <div className="flex items-center gap-2">
              <Badge className={getStatusColor(overallStatus)}>
                {getStatusIcon(overallStatus)}
                <span className="ml-1 capitalize">{overallStatus}</span>
              </Badge>
              <span className="text-sm text-gray-600 dark:text-gray-400">
                {passedTests}/{totalTests} tests passed
              </span>
            </div>
          </div>

          {totalTests > 0 && (
            <div className="mt-4 space-y-2">
              <div className="flex justify-between text-sm">
                <span>Test Progress</span>
                <span>{Math.round((passedTests / totalTests) * 100)}%</span>
              </div>
              <Progress
                value={(passedTests / totalTests) * 100}
                className="h-2"
              />
            </div>
          )}
        </CardContent>
      </Card>

      {/* Test Results */}
      <Tabs defaultValue="all" className="space-y-6">
        <TabsList className="grid w-full grid-cols-7 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
          <TabsTrigger
            value="all"
            className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-green-500 data-[state=active]:to-blue-600 data-[state=active]:text-white"
          >
            All Tests
          </TabsTrigger>
          <TabsTrigger
            value="auth"
            className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-green-500 data-[state=active]:to-blue-600 data-[state=active]:text-white"
          >
            Auth
          </TabsTrigger>
          <TabsTrigger
            value="quiz"
            className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-green-500 data-[state=active]:to-blue-600 data-[state=active]:text-white"
          >
            Quiz
          </TabsTrigger>
          <TabsTrigger
            value="ai"
            className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-green-500 data-[state=active]:to-blue-600 data-[state=active]:text-white"
          >
            AI
          </TabsTrigger>
          <TabsTrigger
            value="perf"
            className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-green-500 data-[state=active]:to-blue-600 data-[state=active]:text-white"
          >
            Performance
          </TabsTrigger>
          <TabsTrigger
            value="resp"
            className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-green-500 data-[state=active]:to-blue-600 data-[state=active]:text-white"
          >
            Responsive
          </TabsTrigger>
          <TabsTrigger
            value="prem"
            className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-green-500 data-[state=active]:to-blue-600 data-[state=active]:text-white"
          >
            Premium
          </TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-4">
          {testSuites.map((suite) => (
            <Card
              key={suite.name}
              className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-0 shadow-lg"
            >
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>{suite.name}</span>
                  <Badge className={getStatusColor(suite.status)}>
                    {getStatusIcon(suite.status)}
                    <span className="ml-1 capitalize">{suite.status}</span>
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {suite.tests.map((test) => (
                    <div
                      key={test.id}
                      className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg"
                    >
                      <div className="flex items-center gap-3">
                        <Badge className={getStatusColor(test.status)}>
                          {getStatusIcon(test.status)}
                        </Badge>
                        <div>
                          <div className="font-medium">{test.name}</div>
                          <div className="text-sm text-gray-600 dark:text-gray-400">
                            {test.message}
                          </div>
                        </div>
                      </div>
                      <div className="text-right text-sm text-gray-600 dark:text-gray-400">
                        {test.duration && `${test.duration}ms`}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        {/* Individual suite tabs */}
        {testSuites.map((suite) => (
          <TabsContent
            key={suite.name}
            value={suite.name
              .toLowerCase()
              .replace(/\s+/g, "")
              .replace(/&/g, "")}
            className="space-y-4"
          >
            <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>{suite.name}</span>
                  <Badge className={getStatusColor(suite.status)}>
                    {getStatusIcon(suite.status)}
                    <span className="ml-1 capitalize">{suite.status}</span>
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {suite.tests.map((test) => (
                    <div
                      key={test.id}
                      className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg"
                    >
                      <div className="flex items-center gap-3">
                        <Badge className={getStatusColor(test.status)}>
                          {getStatusIcon(test.status)}
                        </Badge>
                        <div>
                          <div className="font-medium">{test.name}</div>
                          <div className="text-sm text-gray-600 dark:text-gray-400">
                            {test.message}
                          </div>
                        </div>
                      </div>
                      <div className="text-right text-sm text-gray-600 dark:text-gray-400">
                        {test.duration && `${test.duration}ms`}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        ))}
      </Tabs>

      {/* Summary */}
      {totalTests > 0 && (
        <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-0 shadow-lg">
          <CardHeader>
            <CardTitle>Test Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                <div className="text-2xl font-bold text-green-600">
                  {passedTests}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  Passed
                </div>
              </div>
              <div className="text-center p-4 bg-red-50 dark:bg-red-900/20 rounded-lg">
                <div className="text-2xl font-bold text-red-600">
                  {failedTests}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  Failed
                </div>
              </div>
              <div className="text-center p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
                <div className="text-2xl font-bold text-yellow-600">
                  {warningTests}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  Warnings
                </div>
              </div>
              <div className="text-center p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                <div className="text-2xl font-bold text-blue-600">
                  {totalTests}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  Total
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
