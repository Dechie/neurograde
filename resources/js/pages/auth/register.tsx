import { Button } from '@/components/ui//button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui//card';
import { Checkbox } from '@/components/ui//checkbox';
import { Input } from '@/components/ui//input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui//tabs';
import { Label } from '@/components/ui/label';
import { Link } from '@inertiajs/react';
import { EyeIcon, EyeOffIcon } from 'lucide-react';
import { useState } from 'react';

export default function SignupForm() {
    const [showPassword, setShowPassword] = useState(false);
    const [isTeacher, setIsTeacher] = useState(false);
    const [activeTab, setActiveTab] = useState<keyof typeof images>('student');
    const [imageLoaded, setImageLoaded] = useState(false);

    const images = {
        student: '/student.jpg',
        teacher: '/teacher.jpg',
    };
    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        console.log(Object.fromEntries(formData.entries()));
    };

    return (
        <div className="from-background to-muted fixed inset-0 overflow-y-auto bg-gradient-to-br">
            <div className="flex min-h-screen w-full items-center justify-center p-4">
                <Card className="flex w-full max-w-4xl flex-col items-center justify-center overflow-hidden p-4 shadow-xl md:flex-row">
                    <div className="flex w-full md:w-1/2 ">
                        <img
                            src={images[activeTab]}
                            key={activeTab}
                            className={`h-60 w-full rounded-lg object-cover transition-opacity md:h-full ${
                                imageLoaded ? 'opacity-100' : 'opacity-0'
                            }`}
                            onLoad={() => setImageLoaded(true)}
                            onError={(e) => {
                                e.currentTarget.src = `https://via.placeholder.com/500x300?text=${activeTab}`;
                                setImageLoaded(true);
                            }}
                            alt={`${activeTab} illustration`}
                        />
                    </div>
                    <div className="flex w-full flex-col md:w-1/2">
                        <CardHeader className="space-y-2 px-8 pt-8 text-center">
                            <CardTitle className="!text-primary text-3xl font-bold">Create an account</CardTitle>
                            <CardDescription className="!text-muted-foreground">Enter your details to sign up</CardDescription>
                        </CardHeader>
                        <form onSubmit={handleSubmit}>
                            <CardContent className="flex-1 space-y-8 px-8 py-8">
                                <Tabs
                                    defaultValue="student"
                                    className="w-full"
                                    value={activeTab}
                                    onValueChange={(value) => {
                                        setActiveTab(value as keyof typeof images);
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

                                    {/* Student Form */}
                                    <TabsContent value="student" className="space-y-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="username">Username</Label>
                                            <Input id="username" name="username" type="text" required />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="email">Email</Label>
                                            <Input id="email" name="email" type="email" required />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="password">Password</Label>
                                            <div className="relative">
                                                <Input
                                                    id="password"
                                                    name="password"
                                                    type={showPassword ? 'text' : 'password'}
                                                    required
                                                    className="pr-10"
                                                />
                                                <button
                                                    type="button"
                                                    className="text-muted-foreground absolute top-1/2 right-3 -translate-y-1/2"
                                                    onClick={() => setShowPassword(!showPassword)}
                                                >
                                                    {showPassword ? <EyeOffIcon /> : <EyeIcon />}
                                                </button>
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="confirmPassword">Confirm Password</Label>
                                            <Input id="confirmPassword" name="confirmPassword" type={showPassword ? 'text' : 'password'} required />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="id_number">ID Number</Label>
                                            <Input id="id_number" name="id_number" type="text" required />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="academic_year">Academic Year</Label>
                                            <Input id="academic_year" name="academic_year" type="text" required />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="department_id">Department ID</Label>
                                            <Input id="department_id" name="department_id" type="text" required />
                                        </div>
                                    </TabsContent>

                                    {/* Teacher Form */}
                                    <TabsContent value="teacher" className="space-y-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="username">Username</Label>
                                            <Input id="username" name="username" type="text" required />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="email">Email</Label>
                                            <Input id="email" name="email" type="email" required />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="password">Password</Label>
                                            <div className="relative">
                                                <Input
                                                    id="password"
                                                    name="password"
                                                    type={showPassword ? 'text' : 'password'}
                                                    required
                                                    className="pr-10"
                                                />
                                                <button
                                                    type="button"
                                                    className="text-muted-foreground absolute top-1/2 right-3 -translate-y-1/2"
                                                    onClick={() => setShowPassword(!showPassword)}
                                                >
                                                    {showPassword ? <EyeOffIcon /> : <EyeIcon />}
                                                </button>
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="confirmPassword">Confirm Password</Label>
                                            <Input id="confirmPassword" name="confirmPassword" type={showPassword ? 'text' : 'password'} required />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="department_id">Department ID</Label>
                                            <Input id="department_id" name="department_id" type="text" required />
                                        </div>
                                    </TabsContent>
                                </Tabs>

                                <div className="flex items-center space-x-2 pt-4">
                                    <Checkbox id="terms" required />
                                    <label htmlFor="terms" className="text-muted-foreground text-sm leading-none">
                                        I agree to the{' '}
                                        <Link href="/terms" className="text-primary underline">
                                            Terms of Service
                                        </Link>{' '}
                                        and{' '}
                                        <Link href="/privacy" className="text-primary underline">
                                            Privacy Policy
                                        </Link>
                                    </label>
                                </div>
                            </CardContent>

                            <CardFooter className="flex flex-col space-y-4 px-8 pb-8">
                                <Button type="submit" className="!bg-primary hover:!bg-secondary !text-primary-foreground h-11 w-full font-medium">
                                    Create Account
                                </Button>
                                <div className="text-muted-foreground pt-2 text-center text-sm">
                                    Already have an account?{' '}
                                    <Link
                                        href={route('login')}
                                        className="text-primary hover:text-primary/80 font-medium underline transition-colors"
                                    >
                                        Sign in
                                    </Link>
                                </div>
                            </CardFooter>
                        </form>
                    </div>
                </Card>
            </div>
        </div>
    );
}