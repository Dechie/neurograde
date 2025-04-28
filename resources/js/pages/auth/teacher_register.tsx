import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Link } from '@inertiajs/react';
import { useState } from 'react';

export default function SignupForm() {
    const [imageLoaded, setImageLoaded] = useState(false);

    const studentImage = `/student.jpg?t=${Date.now()}`;

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        console.log(Object.fromEntries(formData.entries()));
    };

    return (
        <div className="fixed inset-0 bg-gradient-to-br from-background to-muted overflow-y-auto">
            <div className="flex min-h-screen w-full items-center justify-center p-2 sm:p-4">
                <Card className="w-full max-w-[90%] sm:max-w-3xl md:max-w-4xl flex flex-col md:flex-row items-center justify-center overflow-hidden shadow-xl">
                    <div className="flex w-full md:w-1/2">
                        <img
                            src={studentImage}
                            className={`h-60 w-full rounded-lg object-contain transition-opacity md:h-full ${
                                imageLoaded ? 'opacity-100' : 'opacity-0'
                            }`}
                            onLoad={() => {
                                setImageLoaded(true);
                                console.log(`Loaded image: ${studentImage}`);
                            }}
                            onError={(e) => {
                                console.error(`Failed to load image: ${studentImage}`);
                                e.currentTarget.src = 'https://via.placeholder.com/1350x900?text=Student+Image+Not+Found';
                                setImageLoaded(true);
                            }}
                            alt="Student illustration"
                        />
                    </div>
                    <div className="w-full md:w-1/2 flex flex-col">
                        <CardHeader className="space-y-2 px-6 sm:px-8 pt-6 sm:pt-8 text-center">
                            <CardTitle className="text-primary text-2xl sm:text-3xl font-bold">Create a Teacher Account</CardTitle>
                            <CardDescription className="text-muted-foreground text-sm sm:text-base">
                                Enter The Teacher's information. There is no need for password, a default of "12345678" will be assigned automatically.
                            </CardDescription>
                        </CardHeader>
                        <form onSubmit={handleSubmit}>
                            <CardContent className="flex-1 space-y-6 sm:space-y-8 px-6 sm:px-8 py-6 sm:py-8">
                                <div className="space-y-3 sm:space-y-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="username">Username</Label>
                                        <Input id="username" name="username" type="text" required />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="email">Email</Label>
                                        <Input id="email" name="email" type="email" required />
                                    </div>
                                    
                                    <div className="space-y-2">
                                        <Label htmlFor="department_id">Department ID</Label>
                                        <Input id="department_id" name="department_id" type="text" required />
                                    </div>
                                </div>
                            </CardContent>
                            <CardFooter className="flex flex-col space-y-4 px-6 sm:px-8 pb-6 sm:pb-8">
                                <Button
                                    type="submit"
                                    className="h-11 w-full !bg-primary hover:!bg-secondary !text-primary-foreground font-medium"
                                >
                                    Create Account
                                </Button>
                                
                            </CardFooter>
                        </form>
                    </div>
                </Card>
            </div>
        </div>
    );
}