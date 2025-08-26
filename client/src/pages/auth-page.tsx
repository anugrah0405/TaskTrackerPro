import { useAuth } from "@/hooks/use-auth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertUserSchema } from "@shared/schema";
import { Redirect } from "wouter";
import { Loader2 } from "lucide-react";

export default function AuthPage() {
  const { user, loginMutation, registerMutation } = useAuth();

  const loginForm = useForm({
    resolver: zodResolver(insertUserSchema),
  });

  const registerForm = useForm({
    resolver: zodResolver(insertUserSchema),
  });

  if (user) {
    return <Redirect to="/" />;
  }

  return (
    <div className="min-h-screen flex bg-gradient-to-br from-primary/10 to-background">
      <div className="flex-1 flex items-center justify-center p-6 sm:p-12">
        <Card className="w-full max-w-md shadow-2xl border-0 bg-white/90 backdrop-blur-md">
          <CardHeader>
            <CardTitle className="text-3xl font-extrabold text-center text-primary mb-2 tracking-tight">
              Welcome to <span className="bg-gradient-to-r from-primary to-purple-500 bg-clip-text text-transparent">TaskTrackerPro</span>
            </CardTitle>
            <p className="text-center text-muted-foreground text-base font-medium">
              Sign in to continue or create a new account
            </p>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="login" className="mt-2">
              <TabsList className="grid w-full grid-cols-2 bg-muted/50 rounded-lg mb-6">
                <TabsTrigger value="login" className="rounded-l-lg">Login</TabsTrigger>
                <TabsTrigger value="register" className="rounded-r-lg">Register</TabsTrigger>
              </TabsList>

              <TabsContent value="login">
                <form
                  onSubmit={loginForm.handleSubmit((data) =>
                    loginMutation.mutate(data)
                  )}
                  className="space-y-5"
                >
                  <div className="space-y-1.5">
                    <Label htmlFor="username" className="font-semibold">Username</Label>
                    <Input
                      id="username"
                      autoComplete="username"
                      placeholder="Enter your username"
                      className="bg-muted/30"
                      {...loginForm.register("username")}
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="password" className="font-semibold">Password</Label>
                    <Input
                      id="password"
                      type="password"
                      autoComplete="current-password"
                      placeholder="Enter your password"
                      className="bg-muted/30"
                      {...loginForm.register("password")}
                    />
                  </div>
                  <Button
                    type="submit"
                    className="w-full font-semibold py-2"
                    disabled={loginMutation.isPending}
                  >
                    {loginMutation.isPending && (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    )}
                    Login
                  </Button>
                </form>
              </TabsContent>

              <TabsContent value="register">
                <form
                  onSubmit={registerForm.handleSubmit((data) =>
                    registerMutation.mutate(data)
                  )}
                  className="space-y-5"
                >
                  <div className="space-y-1.5">
                    <Label htmlFor="reg-username" className="font-semibold">Username</Label>
                    <Input
                      id="reg-username"
                      autoComplete="username"
                      placeholder="Choose a username"
                      className="bg-muted/30"
                      {...registerForm.register("username")}
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="reg-password" className="font-semibold">Password</Label>
                    <Input
                      id="reg-password"
                      type="password"
                      autoComplete="new-password"
                      placeholder="Create a password"
                      className="bg-muted/30"
                      {...registerForm.register("password")}
                    />
                  </div>
                  <Button
                    type="submit"
                    className="w-full font-semibold py-2"
                    disabled={registerMutation.isPending}
                  >
                    {registerMutation.isPending && (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    )}
                    Register
                  </Button>
                </form>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
      <div className="hidden lg:flex flex-1 bg-primary items-center justify-center p-8 rounded-l-[10rem]">
        <div className="max-w-md text-primary-foreground">
          <h1 className="text-4xl font-bold mb-4 pb-2 bg-gradient-to-r from-purple-400 via-purple-500 to-purple-600 text-transparent bg-clip-text drop-shadow-[0_0_10px_rgba(168,85,247,0.7)]">
            Organize your tasks
          </h1>
          <p className="text-lg opacity-90 bg-gradient-to-r from-purple-300 via-purple-400 to-purple-500 text-transparent bg-clip-text drop-shadow-[0_0_6px_rgba(168,85,247,0.5)]">
            Create, manage and track your todos with deadlines. Stay organized and
            never miss important tasks.
          </p>
        </div>
      </div>
    </div>
  );
}
