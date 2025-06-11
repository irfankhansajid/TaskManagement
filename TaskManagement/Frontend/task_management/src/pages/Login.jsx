import { useAuth } from '@/contexts/useAuth';
import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'

import { Tabs, TabsList, TabsContent, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';




function Login () {

 const navigate                           = useNavigate();
 const {login, register, error, loading, setError } = useAuth();
 const [activeTab, setActiveTab]          = useState("login");
    


    const [loginData, setLoginData] = useState({
        username: "",
        password: "",
    });

    const [registerData, setRegisterData] = useState({
        username: "",
        password: "",
        email   : "",
        name: "",
    });

    const handleLoginChange = (e) => {
        const {name, value } = e.target;
        setLoginData({
            ...loginData,
            [name]: value,
        });
    }

    const handleRegisterChange = (e) => {
        const {name, value} = e.target;
        setRegisterData({
            ...registerData,
            [name]: value,
        });
    }

    const handleLoginSubmit = async (e) => {
        e.preventDefault();
        const success = await login(loginData.username, loginData.password);
        if (success) {
            navigate('/');
        }
    }

    const handleRegisterSubmit = async (e) => {
        e.preventDefault();

          // validate register data
        if (registerData.password.length < 6) {
          setError("Password must be at least 6 characters")
          return;
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(registerData.email)) {
          setError("Please enter a valid email address");
          return;
        }



        const success = await register(registerData);
        if (success) {
            // switch to login after successful registration
            setActiveTab("login");
              // clear register form
            setRegisterData({
                username: "",
                password: "",
                email   : "",
                name: "",
            })
        }
    }

  return (
    <div className="flex items-center justify-center min-h-[80vh] bg-slate-50">
      <div className="w-full max-w-md px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold">TaskFlow</h1>
          <p className="text-gray-500 mt-2">Manage your tasks</p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid grid-cols-2 w-full mb-6">
            <TabsTrigger
              value="login"
              className="data-[state=active]:bg-black data-[state=active]:text-white rounded-3xl py-1.5">
              Login
            </TabsTrigger>
            <TabsTrigger
              value="register"
              className="data-[state=active]:bg-black data-[state=active]:text-white rounded-3xl py-1.5">
              Register
            </TabsTrigger>
          </TabsList>

          {/* Login  */}
          <TabsContent value="login">
            <Card className="w-full max-w-sm">
              <CardHeader>
                <CardTitle>Login to your account</CardTitle>
                <CardDescription>
                  Enter your email below to login to your account
                </CardDescription>
                
              </CardHeader>

              <CardContent>
                {error && (
                  <Alert variant="destructive" className="mb-4">
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}

                <form onSubmit={handleLoginSubmit}>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="username">Username</Label>
                      <Input
                        id="username"
                        name="username"
                        value={loginData.username}
                        onChange={handleLoginChange}
                        placeholder="sajidkhan"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <Label htmlFor="password">Password</Label>
                      </div>
                    </div>
                    <Input
                      id="password"
                      name="password"
                      type="password"
                      value={loginData.password}
                      onChange={handleLoginChange}
                      placeholder="••••••••"
                      required
                    />
                    <div className="flex justify-end mb-2 font-light text-sm">
                      <Link to="/forgot-password">Forgot password?</Link>
                    </div>
                  </div>
                  <CardFooter className="flex-col gap-2">

                  <Button type="submit" className="w-full" disabled={loading}>
                    {loading ? "Signing in..." : "Sign in "}
                  </Button>
                  </ CardFooter >
                </form>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="register">
            <Card>
              <CardHeader>
                Enter your details to create a new account
              </CardHeader>
              <CardContent>
                {error && (
                  <Alert variant="destructive" className="mb-4">
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}

                <form onSubmit={handleRegisterSubmit}>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="register-name">Full Name</Label>
                      <Input
                        id="register-name"
                        name="name"
                        value={registerData.name}
                        onChange={handleRegisterChange}
                        placeholder="Sajid Khan"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="register-email">Email</Label>
                      <Input
                        id="register-email"
                        name="email"
                        type="email"
                        value={registerData.email}
                        onChange={handleRegisterChange}
                        placeholder="sajidkhan@example.com"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="register-username">Username</Label>
                      <Input
                        id="register-username"
                        name="username"
                        value={registerData.username}
                        onChange={handleRegisterChange}
                        placeholder="sajidkhan"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="register-password">Password</Label>
                      <Input
                        id="register-password"
                        name="password"
                        type="password"
                        value={registerData.password}
                        onChange={handleRegisterChange}
                        placeholder="••••••••"
                        required
                      />
                    </div>
                    <Button type="submit" className="w-full" disabled={loading}>
                      {loading ? "Creating account..." : "Create account"}
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

export default Login