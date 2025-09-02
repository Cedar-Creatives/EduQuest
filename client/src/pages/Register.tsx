import { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { useToast } from "@/hooks/useToast";
import { UserPlus } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

type RegisterForm = {
  email: string;
  password: string;
  username: string;
};

export function Register() {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const { register: registerUser } = useAuth();
  const navigate = useNavigate();
  const { register, handleSubmit, watch } = useForm<RegisterForm>();
  const [usernameExists, setUsernameExists] = useState(false);
  const [emailExists, setEmailExists] = useState(false);

  const watchedUsername = watch("username");
  const watchedEmail = watch("email");

  // Debounced uniqueness checks
  useEffect(() => {
    const value = (watchedUsername || "").trim();
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
        setUsernameExists(Boolean(data?.exists));
      } catch {}
    }, 350);
    return () => clearTimeout(id);
  }, [watchedUsername]);

  useEffect(() => {
    const value = (watchedEmail || "").trim();
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
        setEmailExists(Boolean(data?.exists));
      } catch {}
    }, 350);
    return () => clearTimeout(id);
  }, [watchedEmail]);

  const onSubmit = async (data: RegisterForm) => {
    try {
      setLoading(true);
      await registerUser(data.email, data.password, data.username);
      toast({
        title: "Success",
        description: "Account created successfully",
      });
      navigate("/app");
    } catch (error) {
      console.log("Register error:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: error?.message,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background to-secondary p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Create an account</CardTitle>
          <CardDescription>Enter your details to get started</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                placeholder="Choose a username"
                {...register("username", { required: true })}
              />
              {usernameExists && (
                <p className="text-sm text-red-600">Username already exists</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="Enter your email"
                {...register("email", { required: true })}
              />
              {emailExists && (
                <p className="text-sm text-red-600">Email already exists</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="Choose a password"
                {...register("password", { required: true })}
              />
            </div>
            <Button
              type="submit"
              className="w-full"
              disabled={loading || usernameExists || emailExists}
            >
              {loading ? (
                "Loading..."
              ) : (
                <>
                  <UserPlus className="mr-2 h-4 w-4" />
                  Create Account
                </>
              )}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex justify-center">
          <Button
            variant="link"
            className="text-sm text-muted-foreground"
            onClick={() => navigate("/login")}
          >
            Already have an account? Sign in
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
