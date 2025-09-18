import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import {
  User,
  Mail,
  Calendar,
  Trophy,
  Target,
  BookOpen,
  Settings,
  Crown,
  Edit,
  Save,
  X,
  Shield,
  CreditCard,
  AlertTriangle,
} from "lucide-react";
import { getUserProfile, updateProfile } from "@/api/profile";
import { cancelSubscription } from "@/api/subscription";
import { useToast } from "@/hooks/useToast";

export function Profile() {
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [updating, setUpdating] = useState(false);
  const [usernameExists, setUsernameExists] = useState(false);
  const [emailExists, setEmailExists] = useState(false);
  const [showCancelDialog, setShowCancelDialog] = useState(false);
  const [cancelling, setCancelling] = useState(false);
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    bio: "",
    plan: "",
  });

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        // Fetching user profile
        const data = await getUserProfile();
        setProfile(data.data);
        setFormData({
          username: data.data.username,
          email: data.data.email,
          bio: data.data.bio || "",
          plan: data.data.plan,
        });
      } catch (error: any) {
        // Error handled by toast notification
        toast({
          title: "Error",
          description: error.message,
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [toast]);

  // Debounced uniqueness checks for profile edits
  useEffect(() => {
    if (!editing) return;
    const value = (formData.username || "").trim();
    if (value.length < 3) {
      setUsernameExists(false);
      return;
    }
    const id = setTimeout(async () => {
      try {
        const res = await fetch(
          `/api/auth/check-username?username=${encodeURIComponent(value)}`
        );
        const data = await res.json();
        setUsernameExists(
          Boolean(data?.exists) && value !== (profile?.username || "")
        );
      } catch {
        // ignore
      }
    }, 350);
    return () => clearTimeout(id);
  }, [editing, formData.username, profile?.username]);

  useEffect(() => {
    if (!editing) return;
    const value = (formData.email || "").trim();
    if (!value || !value.includes("@")) {
      setEmailExists(false);
      return;
    }
    const id = setTimeout(async () => {
      try {
        const res = await fetch(
          `/api/auth/check-email?email=${encodeURIComponent(value)}`
        );
        const data = await res.json();
        setEmailExists(
          Boolean(data?.exists) && value !== (profile?.email || "")
        );
      } catch {
        // ignore
      }
    }, 350);
    return () => clearTimeout(id);
  }, [editing, formData.email, profile?.email]);

  const handleSave = async () => {
    try {
      setUpdating(true);
      // Starting profile update

      const updateData: any = {
        username: formData.username,
        email: formData.email,
        bio: formData.bio,
      };

      // Only include plan if it changed
      if (formData.plan !== profile.plan) {
        updateData.plan = formData.plan;
        // Plan updated
      } else {
        // Plan unchanged
      }

      const response = await updateProfile(updateData);

      // Update local profile data
      setProfile({
        ...profile,
        username: formData.username,
        email: formData.email,
        bio: formData.bio,
        plan: formData.plan,
      });

      setEditing(false);
      toast({
        title: "Profile updated",
        description:
          response.message || "Your profile has been updated successfully",
      });
    } catch (error: any) {
      // Error handled by toast notification
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setUpdating(false);
    }
  };

  const handleCancel = () => {
    setFormData({
      username: profile.username,
      email: profile.email,
      bio: profile.bio || "",
      plan: profile.plan,
    });
    setEditing(false);
  };

  const handleCancelSubscription = async () => {
    setCancelling(true);
    try {
      // Cancelling subscription
      const response = await cancelSubscription();

      // Update local profile data
      setProfile({
        ...profile,
        plan: "freemium",
        nextBilling: null,
      });

      setShowCancelDialog(false);
      toast({
        title: "Subscription cancelled",
        description:
          response.message ||
          "Your subscription has been cancelled successfully",
      });

      // Subscription cancelled successfully
    } catch (error: any) {
      // Error handled by toast notification
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setCancelling(false);
    }
  };

  const handleManageSubscription = () => {
    // Manage subscription clicked
    console.log("Current user plan:", profile?.plan);
    console.log("User subscription details:", {
      subscriptionStatus: profile?.plan,
      nextBilling: profile?.nextBilling,
      subscriptionStartDate: profile?.subscriptionStartDate,
      subscriptionEndDate: profile?.subscriptionEndDate,
    });

    // For now, show options to change plan or cancel
    toast({
      title: "Subscription Management",
      description: "Use the options below to manage your subscription",
      variant: "default",
    });
  };

  if (loading || !profile) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          My Profile
        </h1>
        <p className="text-xl text-gray-600 dark:text-gray-300">
          Manage your account and track your progress
        </p>
      </div>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="stats">Statistics</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* Profile Card */}
          <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-0 shadow-lg">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center">
                  <User className="w-5 h-5 mr-2 text-blue-500" />
                  Profile Information
                </CardTitle>
                {!editing ? (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setEditing(true)}
                  >
                    <Edit className="w-4 h-4 mr-2" />
                    Edit
                  </Button>
                ) : (
                  <div className="flex space-x-2">
                    <Button
                      size="sm"
                      onClick={handleSave}
                      disabled={updating || usernameExists || emailExists}
                    >
                      <Save className="w-4 h-4 mr-2" />
                      {updating ? "Saving..." : "Save"}
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleCancel}
                      disabled={updating}
                    >
                      <X className="w-4 h-4 mr-2" />
                      Cancel
                    </Button>
                  </div>
                )}
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex items-start space-x-6">
                <Avatar className="w-24 h-24">
                  <AvatarImage src={profile?.avatar} />
                  <AvatarFallback className="text-2xl bg-gradient-to-r from-blue-500 to-purple-600 text-white">
                    {profile?.username?.charAt(0).toUpperCase() || "U"}
                  </AvatarFallback>
                </Avatar>

                <div className="flex-1 space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="username">Username</Label>
                      {editing ? (
                        <Input
                          id="username"
                          value={formData.username}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              username: e.target.value,
                            })
                          }
                          disabled={updating}
                        />
                      ) : (
                        <p className="text-lg font-medium text-gray-900 dark:text-white">
                          {profile?.username}
                        </p>
                      )}
                      {editing && usernameExists && (
                        <p className="text-sm text-red-600 mt-1">
                          Username already exists
                        </p>
                      )}
                    </div>

                    <div>
                      <Label htmlFor="email">Email</Label>
                      {editing ? (
                        <Input
                          id="email"
                          type="email"
                          value={formData.email}
                          onChange={(e) =>
                            setFormData({ ...formData, email: e.target.value })
                          }
                          disabled={updating}
                        />
                      ) : (
                        <p className="text-lg text-gray-700 dark:text-gray-300">
                          {profile?.email}
                        </p>
                      )}
                      {editing && emailExists && (
                        <p className="text-sm text-red-600 mt-1">
                          Email already exists
                        </p>
                      )}
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="bio">Bio</Label>
                    {editing ? (
                      <Input
                        id="bio"
                        placeholder="Tell us about yourself..."
                        value={formData.bio}
                        onChange={(e) =>
                          setFormData({ ...formData, bio: e.target.value })
                        }
                        disabled={updating}
                      />
                    ) : (
                      <p className="text-gray-700 dark:text-gray-300">
                        {profile?.bio || "No bio added yet"}
                      </p>
                    )}
                  </div>

                  {editing && (
                    <div>
                      <Label htmlFor="subscription">Subscription Status</Label>
                      <Select
                        value={formData.plan}
                        onValueChange={(value) =>
                          setFormData({ ...formData, plan: value })
                        }
                        disabled={updating}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select subscription status" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="freemium">Freemium</SelectItem>
                          <SelectItem value="premium">Premium</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  )}

                  <div className="flex items-center space-x-4">
                    <Badge
                      variant={
                        profile?.plan === "premium" ? "default" : "secondary"
                      }
                      className="flex items-center"
                    >
                      {profile?.plan === "premium" && (
                        <Crown className="w-4 h-4 mr-1" />
                      )}
                      {profile?.plan === "premium" ? "Premium" : "Freemium"}
                    </Badge>
                    {profile?.role === "admin" && (
                      <Badge
                        variant="destructive"
                        className="flex items-center"
                      >
                        <Shield className="w-4 h-4 mr-1" />
                        Admin
                      </Badge>
                    )}
                    <span className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                      <Calendar className="w-4 h-4 mr-1" />
                      Joined {profile?.joinedDate}
                    </span>
                  </div>

                  {/* Daily Quiz Status */}
                  {profile?.plan === "freemium" && (
                    <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                      <p className="text-sm text-blue-700 dark:text-blue-300">
                        Daily Quizzes: {profile?.dailyQuizzesTaken || 0} /{" "}
                        {profile?.dailyQuizLimit || 3}
                        {!profile?.canTakeMoreQuizzes && (
                          <span className="ml-2 text-red-600 dark:text-red-400 font-medium">
                            (Limit reached)
                          </span>
                        )}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Recent Activity */}
          <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-0 shadow-lg">
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {profile?.recentActivity &&
                profile.recentActivity.length > 0 ? (
                  profile.recentActivity.map((activity: any, index: number) => (
                    <div
                      key={index}
                      className="flex items-center space-x-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg"
                    >
                      <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                        <BookOpen className="w-4 h-4 text-white" />
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-gray-900 dark:text-white">
                          {activity.action}
                        </p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {activity.date}
                        </p>
                      </div>
                      <Badge variant="outline">{activity.score}%</Badge>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-500 text-center py-4">
                    No recent activity
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="stats" className="space-y-6">
          {/* Statistics Overview */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                title: "Total Quizzes",
                value: profile?.stats?.totalQuizzes || 0,
                icon: BookOpen,
                color: "from-blue-500 to-blue-600",
              },
              {
                title: "Average Score",
                value: `${profile?.stats?.averageScore || 0}%`,
                icon: Target,
                color: "from-green-500 to-green-600",
              },
              {
                title: "Study Streak",
                value: `${profile?.stats?.studyStreak || 0} days`,
                icon: Calendar,
                color: "from-orange-500 to-orange-600",
              },
              {
                title: "Achievements",
                value: profile?.stats?.achievements || 0,
                icon: Trophy,
                color: "from-purple-500 to-purple-600",
              },
            ].map((stat, index) => (
              <Card
                key={index}
                className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-0 shadow-lg"
              >
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    {stat.title}
                  </CardTitle>
                  <div
                    className={`w-8 h-8 bg-gradient-to-r ${stat.color} rounded-lg flex items-center justify-center`}
                  >
                    <stat.icon className="w-4 h-4 text-white" />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-gray-900 dark:text-white">
                    {stat.value}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Subject Performance */}
          <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-0 shadow-lg">
            <CardHeader>
              <CardTitle>Subject Performance</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {profile?.subjectStats && profile.subjectStats.length > 0 ? (
                  profile.subjectStats.map((subject: any, index: number) => (
                    <div key={index} className="space-y-2">
                      <div className="flex justify-between">
                        <span className="font-medium text-gray-900 dark:text-white">
                          {subject.name}
                        </span>
                        <span className="text-sm text-gray-600 dark:text-gray-400">
                          {subject.score}%
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                        <div
                          className="bg-gradient-to-r from-blue-500 to-purple-600 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${subject.score}%` }}
                        ></div>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-500 text-center py-4">
                    No subject data available
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="settings" className="space-y-6">
          {/* Account Settings */}
          <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Settings className="w-5 h-5 mr-2 text-gray-500" />
                Account Settings
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button variant="outline" className="w-full justify-start">
                Change Password
              </Button>
              <Button variant="outline" className="w-full justify-start">
                Download Data
              </Button>
              <Button
                variant="outline"
                className="w-full justify-start text-red-600 hover:text-red-700"
              >
                Delete Account
              </Button>
            </CardContent>
          </Card>

          {/* Subscription */}
          <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center">
                <CreditCard className="w-5 h-5 mr-2 text-gray-500" />
                Subscription Management
              </CardTitle>
              <CardDescription>
                Manage your subscription and billing
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <div>
                  <p className="font-medium text-gray-900 dark:text-white">
                    Current Plan:{" "}
                    {profile?.plan === "premium" ? "Premium" : "Freemium"}
                  </p>
                  {profile?.plan === "premium" && profile?.nextBilling && (
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Next billing: {profile.nextBilling}
                    </p>
                  )}
                </div>
                <Badge
                  variant={
                    profile?.plan === "premium" ? "default" : "secondary"
                  }
                  className="flex items-center"
                >
                  {profile?.plan === "premium" && (
                    <Crown className="w-4 h-4 mr-1" />
                  )}
                  {profile?.plan === "premium" ? "Premium" : "Freemium"}
                </Badge>
              </div>

              <div className="flex flex-col space-y-3">
                {profile?.plan === "freemium" ? (
                  <Button
                    onClick={() => navigate("/app/upgrade")}
                    className="w-full"
                  >
                    <Crown className="w-4 h-4 mr-2" />
                    Upgrade to Premium
                  </Button>
                ) : (
                  <>
                    <Button
                      variant="outline"
                      onClick={handleManageSubscription}
                      className="w-full"
                    >
                      <CreditCard className="w-4 h-4 mr-2" />
                      View Subscription Details
                    </Button>
                    <Button
                      onClick={() => navigate("/app/upgrade")}
                      className="w-full"
                    >
                      <Crown className="w-4 h-4 mr-2" />
                      Change Plan
                    </Button>
                    <Dialog
                      open={showCancelDialog}
                      onOpenChange={setShowCancelDialog}
                    >
                      <DialogTrigger asChild>
                        <Button
                          variant="outline"
                          className="w-full text-red-600 hover:text-red-700 hover:bg-red-50"
                        >
                          <AlertTriangle className="w-4 h-4 mr-2" />
                          Cancel Subscription
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Cancel Subscription</DialogTitle>
                          <DialogDescription>
                            Are you sure you want to cancel your premium
                            subscription? You'll lose access to premium features
                            at the end of your current billing period.
                          </DialogDescription>
                        </DialogHeader>
                        <div className="py-4">
                          <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
                            <h4 className="font-medium text-yellow-800 dark:text-yellow-200 mb-2">
                              What you'll lose:
                            </h4>
                            <ul className="text-sm text-yellow-700 dark:text-yellow-300 space-y-1">
                              <li>• Unlimited quizzes</li>
                              <li>• Advanced analytics</li>
                              <li>• Upload your own notes</li>
                              <li>• Priority support</li>
                              <li>• Offline access</li>
                            </ul>
                          </div>
                        </div>
                        <DialogFooter>
                          <Button
                            variant="outline"
                            onClick={() => setShowCancelDialog(false)}
                          >
                            Keep Subscription
                          </Button>
                          <Button
                            variant="destructive"
                            onClick={handleCancelSubscription}
                            disabled={cancelling}
                          >
                            {cancelling ? (
                              <>
                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                                Cancelling...
                              </>
                            ) : (
                              "Cancel Subscription"
                            )}
                          </Button>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
                  </>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
