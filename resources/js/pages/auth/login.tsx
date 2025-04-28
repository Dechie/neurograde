import InputError from '@/components/input-error';
import TextLink from '@/components/text-link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardFooter } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Label } from '@/components/ui/label';
import { Link, useForm } from '@inertiajs/react';
import { EyeIcon, EyeOffIcon, LoaderCircle } from 'lucide-react';
import { FormEventHandler, useState } from 'react';

type LoginForm = {
    email?: string;
    name?: string;
    password: string;
    remember: boolean;
};

interface LoginProps {
    status?: string;
    canResetPassword: boolean;
}

export default function Login({ status, canResetPassword }: LoginProps) {
    const [showPassword, setShowPassword] = useState(false);
    const [activeTab, setActiveTab] = useState<'student' | 'teacher'>('student');
    const [imageLoaded, setImageLoaded] = useState(false);

    const images = {
        student: `/student.jpg?t=${Date.now()}`,
        teacher: `/teacher.jpg?t=${Date.now()}`,
    };

    const { data, setData, post, processing, errors, reset } = useForm<LoginForm>({
        email: '',
        name: '',
        password: '',
        remember: false,
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route('login'), {
            onFinish: () => reset('password'),
        });
    };

    return (
        <div className="fixed inset-0 bg-gradient-to-br from-background to-muted overflow-y-auto">
            <div className="flex min-h-screen w-full items-center justify-center p-2 sm:p-4">
                <Card className="w-full max-w-[90%] sm:max-w-3xl md:max-w-4xl flex flex-col md:flex-row items-center justify-center overflow-hidden shadow-xl">
                    <div className="w-full md:w-1/2 hidden sm:flex">
                        <img
                            src={images[activeTab]}
                            key={activeTab}
                            className={`h-120 w-full rounded-lg object-contain transition-opacity md:h-full${
                                imageLoaded ? 'opacity-100' : 'opacity-0'
                            }`}
                            onLoad={() => {
                                setImageLoaded(true);
                                console.log(`Loaded image: ${images[activeTab]}`);
                            }}
                            onError={(e) => {
                                console.error(`Failed to load image: ${images[activeTab]}`);
                                e.currentTarget.src = `https://via.placeholder.com/1350x900?text=${activeTab}+Image+Not+Found`;
                                setImageLoaded(true);
                            }}
                            alt={`${activeTab} illustration`}
                        />
                    </div>
                    <div className="w-full md:w-1/2 flex flex-col p-6 sm:p-8">
                        <CardHeader className="space-y-2 text-center">
                            <h2 className="text-primary text-2xl sm:text-3xl font-bold">Log in to Your Account</h2>
                            <p className="text-muted-foreground text-sm sm:text-base">
                                Enter your details to access your dashboard
                            </p>
                        </CardHeader>
                        <form onSubmit={submit}>
                            <CardContent className="flex flex-col gap-4 sm:gap-6">
                                <Tabs
                                    defaultValue="student"
                                    className="w-full"
                                    value={activeTab}
                                    onValueChange={(value) => {
                                        setActiveTab(value as 'student' | 'teacher');
                                        setImageLoaded(false);
                                        console.log(`Switched to ${value} tab`);
                                    }}
                                >
                                    <TabsList className="mb-4 grid w-full grid-cols-2 gap-4 bg-white p-2">
                                        <TabsTrigger
                                            value="student"
                                            className="text-foreground data-[state=active]:!bg-primary data-[state=active]:!text-primary-foreground rounded-md py-2 text-sm font-medium"
                                        >
                                            Student
                                        </TabsTrigger>
                                        <TabsTrigger
                                            value="teacher"
                                            className="text-foreground data-[state=active]:!bg-primary data-[state=active]:!text-primary-foreground rounded-md py-2 text-sm font-medium"
                                        >
                                            Teacher
                                        </TabsTrigger>
                                    </TabsList>

                                    {/* Student Login Form */}
                                    <TabsContent value="student" className="space-y-4 sm:space-y-6">
                                        {status && (
                                            <div className="mb-4 text-center text-sm font-medium text-green-600">
                                                {status}
                                            </div>
                                        )}
                                        <div className="space-y-2">
                                            <Label htmlFor="email">Email Address</Label>
                                            <Input
                                                id="email"
                                                type="email"
                                                required
                                                autoFocus
                                                tabIndex={1}
                                                autoComplete="email"
                                                value={data.email || ''}
                                                onChange={(e) => setData('email', e.target.value)}
                                                placeholder="email@example.com"
                                            />
                                            <InputError message={errors.email} />
                                        </div>
                                        <div className="space-y-2">
                                            <div className="flex items-center">
                                                <Label htmlFor="password">Password</Label>
                                                {canResetPassword && (
                                                    <TextLink
                                                        href={route('password.request')}
                                                        className="ml-auto text-sm"
                                                        tabIndex={5}
                                                    >
                                                        Forgot Password?
                                                    </TextLink>
                                                )}
                                            </div>
                                            <div className="relative">
                                                <Input
                                                    id="password"
                                                    type={showPassword ? 'text' : 'password'}
                                                    required
                                                    tabIndex={2}
                                                    autoComplete="current-password"
                                                    value={data.password}
                                                    onChange={(e) => setData('password', e.target.value)}
                                                    placeholder="Password"
                                                    className="pr-10"
                                                />
                                                <button
                                                    type="button"
                                                    className="text-muted-foreground absolute right-3 top-1/2 -translate-y-1/2"
                                                    onClick={() => setShowPassword(!showPassword)}
                                                >
                                                    {showPassword ? <EyeOffIcon /> : <EyeIcon />}
                                                </button>
                                            </div>
                                            <InputError message={errors.password} />
                                        </div>
                                        <div className="flex items-center space-x-3">
                                            <Checkbox
                                                id="remember"
                                                name="remember"
                                                checked={data.remember}
                                                onClick={() => setData('remember', !data.remember)}
                                                tabIndex={3}
                                            />
                                            <Label htmlFor="remember">Remember me</Label>
                                        </div>
                                    </TabsContent>

                                    {/* Teacher Login Form */}
                                    <TabsContent value="teacher" className="space-y-4 sm:space-y-6">
                                        {status && (
                                            <div className="mb-4 text-center text-sm font-medium text-green-600">
                                                {status}
                                            </div>
                                        )}
                                        <div className="space-y-2">
                                            <Label htmlFor="name">Name</Label>
                                            <Input
                                                id="name"
                                                type="text"
                                                required
                                                autoFocus
                                                tabIndex={1}
                                                autoComplete="username"
                                                value={data.name || ''}
                                                onChange={(e) => setData('name', e.target.value)}
                                                placeholder="Your Name"
                                            />
                                            <InputError message={errors.name} />
                                        </div>
                                        <div className="space-y-2">
                                            <div className="flex items-center">
                                                <Label htmlFor="password">Password</Label>
                                                {canResetPassword && (
                                                    <TextLink
                                                        href={route('password.request')}
                                                        className="ml-auto text-sm"
                                                        tabIndex={5}
                                                    >
                                                        Forgot Password?
                                                    </TextLink>
                                                )}
                                            </div>
                                            <div className="relative">
                                                <Input
                                                    id="password"
                                                    type={showPassword ? 'text' : 'password'}
                                                    required
                                                    tabIndex={2}
                                                    autoComplete="current-password"
                                                    value={data.password}
                                                    onChange={(e) => setData('password', e.target.value)}
                                                    placeholder="Password"
                                                    className="pr-10"
                                                />
                                                <button
                                                    type="button"
                                                    className="text-muted-foreground absolute right-3 top-1/2 -translate-y-1/2"
                                                    onClick={() => setShowPassword(!showPassword)}
                                                >
                                                    {showPassword ? <EyeOffIcon /> : <EyeIcon />}
                                                </button>
                                            </div>
                                            <InputError message={errors.password} />
                                        </div>
                                        <div className="flex items-center space-x-3">
                                            <Checkbox
                                                id="remember"
                                                name="remember"
                                                checked={data.remember}
                                                onClick={() => setData('remember', !data.remember)}
                                                tabIndex={3}
                                            />
                                            <Label htmlFor="remember">Remember me</Label>
                                        </div>
                                    </TabsContent>
                                </Tabs>
                            </CardContent>
                            <CardFooter className="flex flex-col space-y-4 mt-4">
                                <Button
                                    type="submit"
                                    className="w-full !bg-primary hover:!bg-secondary !text-primary-foreground"
                                    tabIndex={4}
                                    disabled={processing}
                                >
                                    {processing && <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />}
                                    Log in
                                </Button>
                                <div className="text-muted-foreground text-center text-sm">
                                    Don't have an account?{' '}
                                    <TextLink href={route('register')} tabIndex={5}>
                                        Sign up
                                    </TextLink>
                                </div>
                            </CardFooter>
                        </form>
                    </div>
                </Card>
            </div>
        </div>
    );
}