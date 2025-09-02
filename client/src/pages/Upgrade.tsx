import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Crown,
  Check,
  X,
  Star,
  Zap,
  BarChart3,
  Upload,
  Shield,
  Headphones,
  Smartphone,
  ArrowLeft,
} from "lucide-react";
import { upgradeToPremium } from "@/api/upgrade";
import { getUserProfile } from "@/api/profile";
import { useToast } from "@/hooks/useToast";

export function Upgrade() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<"monthly" | "yearly">(
    "monthly"
  );
  const [currentPlan, setCurrentPlan] = useState<string>("freemium");
  const [profileLoading, setProfileLoading] = useState(true);

  useEffect(() => {
    const fetchCurrentPlan = async () => {
      try {
        const data = await getUserProfile();
        console.log("Profile data received:", data);
        setCurrentPlan(data.data.plan);
      } catch (error: any) {
        console.error("Error fetching current plan:", error);
      } finally {
        setProfileLoading(false);
      }
    };

    fetchCurrentPlan();
  }, []);

  const features = {
    freemium: [
      { name: "5 quizzes per day", included: true },
      { name: "Basic progress tracking", included: true },
      { name: "Access to public notes", included: true },
      { name: "Community support", included: true },
      { name: "Unlimited quizzes", included: false },
      { name: "Advanced analytics", included: false },
      { name: "Upload your own notes", included: false },
      { name: "Priority support", included: false },
      { name: "Offline access", included: false },
      { name: "Custom study plans", included: false },
    ],
    premium: [
      { name: "5 quizzes per day", included: true },
      { name: "Basic progress tracking", included: true },
      { name: "Access to public notes", included: true },
      { name: "Community support", included: true },
      { name: "Unlimited quizzes", included: true },
      { name: "Advanced analytics", included: true },
      { name: "Upload your own notes", included: true },
      { name: "Priority support", included: true },
      { name: "Offline access", included: true },
      { name: "Custom study plans", included: true },
    ],
  };

  const premiumBenefits = [
    {
      icon: Zap,
      title: "Unlimited Quizzes",
      description: "Take as many quizzes as you want, whenever you want",
    },
    {
      icon: BarChart3,
      title: "Advanced Analytics",
      description: "Detailed insights into your learning progress and performance",
    },
    {
      icon: Upload,
      title: "Upload Notes",
      description: "Share your own study materials with the community",
    },
    {
      icon: Shield,
      title: "Priority Support",
      description: "Get help faster with dedicated premium support",
    },
    {
      icon: Smartphone,
      title: "Offline Access",
      description: "Download content and study even without internet",
    },
    {
      icon: Star,
      title: "Custom Study Plans",
      description: "Personalized learning paths based on your goals",
    },
  ];

  const handleUpgrade = async () => {
    setLoading(true);
    try {
      console.log("=== FRONTEND UPGRADE START ===");
      console.log(`Upgrading to premium - ${selectedPlan} plan`);
      console.log("Current plan before upgrade:", currentPlan);
      console.log("About to call upgradeToPremium API...");

      const response = await upgradeToPremium({ plan: selectedPlan });

      console.log("=== FRONTEND UPGRADE SUCCESS ===");
      console.log("Upgrade response received:", response);

      toast({
        title: "Upgrade successful!",
        description:
          response.message ||
          "Welcome to EduQuiz Premium! Enjoy unlimited learning.",
      });

      // Update current plan state
      setCurrentPlan("premium");
      console.log("Updated current plan state to premium");

      // Navigate back to profile after a short delay to show the success message
      setTimeout(() => {
        console.log("Navigating to profile page...");
        navigate("/profile");
      }, 2000);
    } catch (error: any) {
      console.error("=== FRONTEND UPGRADE ERROR ===");
      console.error("Error upgrading to premium:", error);
      console.error("Error message:", error.message);
      console.error("Error response:", error.response);
      toast({
        title: "Upgrade failed",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  if (profileLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading...</p>
        </div>
      </div>
    );
  }

  // If user is already premium, show different content
  if (currentPlan === "premium") {
    return (
      <div className="max-w-4xl mx-auto space-y-8 text-center">
        <Button
          variant="ghost"
          onClick={() => navigate(-1)}
          className="absolute left-6 top-6 flex items-center space-x-2"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back</span>
        </Button>

        <div className="w-16 h-16 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-6">
          <Crown className="w-8 h-8 text-white" />
        </div>

        <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-yellow-500 via-orange-500 to-red-500 bg-clip-text text-transparent">
          You're Already Premium!
        </h1>

        <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto mb-8">
          You're enjoying all the benefits of EduQuiz Premium. Keep learning and
          achieving your goals!
        </p>

        <Card className="bg-gradient-to-br from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20 border-2 border-yellow-300 dark:border-yellow-600 shadow-xl max-w-md mx-auto">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl flex items-center justify-center">
              <Crown className="w-6 h-6 mr-2 text-yellow-500" />
              Premium Active
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3 mb-6">
              {premiumBenefits.slice(0, 3).map((benefit, index) => (
                <li key={index} className="flex items-center">
                  <Check className="w-5 h-5 text-green-500 mr-3" />
                  <span className="text-gray-700 dark:text-gray-300 text-left">
                    {benefit.title}
                  </span>
                </li>
              ))}
            </ul>
            <Button
              onClick={() => navigate("/profile")}
              className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white"
            >
              View Profile
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Header */}
      <div className="text-center">
        <Button
          variant="ghost"
          onClick={() => navigate(-1)}
          className="absolute left-6 top-6 flex items-center space-x-2"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back</span>
        </Button>

        <div className="w-16 h-16 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-6">
          <Crown className="w-8 h-8 text-white" />
        </div>
        <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-yellow-500 via-orange-500 to-red-500 bg-clip-text text-transparent">
          Upgrade to Premium
        </h1>
        <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
          Unlock unlimited learning potential with advanced features and
          personalized insights
        </p>
      </div>

      {/* Premium Benefits */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {premiumBenefits.map((benefit, index) => (
          <Card
            key={index}
            className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
          >
            <CardHeader className="text-center">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center mx-auto mb-4">
                <benefit.icon className="w-6 h-6 text-white" />
              </div>
              <CardTitle className="text-lg">{benefit.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-center">
                {benefit.description}
              </CardDescription>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Pricing Plans */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-4xl mx-auto">
        {/* Freemium Plan */}
        <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-0 shadow-lg">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">Freemium</CardTitle>
            <div className="text-4xl font-bold text-gray-900 dark:text-white">
              Free
            </div>
            <CardDescription>Perfect for getting started</CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3 mb-6">
              {features.freemium.map((feature, index) => (
                <li key={index} className="flex items-center">
                  {feature.included ? (
                    <Check className="w-5 h-5 text-green-500 mr-3" />
                  ) : (
                    <X className="w-5 h-5 text-gray-400 mr-3" />
                  )}
                  <span
                    className={
                      feature.included
                        ? "text-gray-700 dark:text-gray-300"
                        : "text-gray-400"
                    }
                  >
                    {feature.name}
                  </span>
                </li>
              ))}
            </ul>
            <Button variant="outline" className="w-full" disabled>
              Current Plan
            </Button>
          </CardContent>
        </Card>

        {/* Premium Plan */}
        <Card className="relative bg-gradient-to-br from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-yellow-900/20 border-2 border-yellow-300 dark:border-yellow-600 shadow-xl">
          <Badge className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-yellow-500 to-orange-500 text-white">
            Most Popular
          </Badge>
          <CardHeader className="text-center">
            <CardTitle className="text-2xl flex items-center justify-center">
              <Crown className="w-6 h-6 mr-2 text-yellow-500" />
              Premium
            </CardTitle>
            <div className="space-y-2">
              <div className="flex items-center justify-center space-x-4">
                <Button
                  variant={selectedPlan === "monthly" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedPlan("monthly")}
                >
                  Monthly
                </Button>
                <Button
                  variant={selectedPlan === "yearly" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedPlan("yearly")}
                >
                  Yearly
                  <Badge className="ml-2 bg-green-500">Save 20%</Badge>
                </Button>
              </div>
              <div className="text-4xl font-bold text-gray-900 dark:text-white">
                ${selectedPlan === "monthly" ? "9.99" : "95.99"}
                <span className="text-lg text-gray-600 dark:text-gray-400">
                  /{selectedPlan === "monthly" ? "month" : "year"}
                </span>
              </div>
            </div>
            <CardDescription>Unlock your full potential</CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3 mb-6">
              {features.premium.map((feature, index) => (
                <li key={index} className="flex items-center">
                  <Check className="w-5 h-5 text-green-500 mr-3" />
                  <span className="text-gray-700 dark:text-gray-300">
                    {feature.name}
                  </span>
                </li>
              ))}
            </ul>
            <Button
              onClick={handleUpgrade}
              disabled={loading}
              className="w-full bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Processing...
                </>
              ) : (
                <>
                  <Crown className="w-4 h-4 mr-2" />
                  Upgrade Now
                </>
                )}
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* FAQ Section */}
      <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-0 shadow-lg">
        <CardHeader>
          <CardTitle className="text-center">Frequently Asked Questions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-semibold text-gray-900 dark:text-white mb-2">
                Can I cancel anytime?
              </h4>
              <p className="text-gray-600 dark:text-gray-400">
                Yes, you can cancel your subscription at any time. You'll continue
                to have access until the end of your billing period.
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 dark:text-white mb-2">
                Is there a free trial?
              </h4>
              <p className="text-gray-600 dark:text-gray-400">
                You can use our freemium plan indefinitely. Upgrade when you're
                ready for unlimited access.
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 dark:text-white mb-2">
                What payment methods do you accept?
              </h4>
              <p className="text-gray-600 dark:text-gray-400">
                We accept all major credit cards, PayPal, and other secure payment
                methods.
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 dark:text-white mb-2">
                Do you offer student discounts?
              </h4>
              <p className="text-gray-600 dark:text-gray-400">
                Yes! Contact our support team with your student ID for special
                pricing.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Money Back Guarantee */}
      <Card className="bg-gradient-to-r from-green-500 to-blue-500 text-white border-0">
        <CardContent className="text-center py-8">
          <Shield className="w-12 h-12 mx-auto mb-4" />
          <h3 className="text-2xl font-bold mb-2">30-Day Money Back Guarantee</h3>
          <p className="text-green-100">
            Not satisfied? Get a full refund within 30 days, no questions asked.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}