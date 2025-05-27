import { WaitingLayout } from '@/layouts/WaitingLayout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useForm } from '@inertiajs/react';
import { useToast } from '@/components/ui/use-toast';
import { useEffect, useState, useCallback } from 'react';
import { router } from '@inertiajs/react';

interface Props {
    status: 'info' | 'success';
    message: string;
    [key: string]: any;
}

export default function WaitingScreen({ status, message }: Props) {
    const { get, processing } = useForm();
    const { toast } = useToast();
    const [isChecking, setIsChecking] = useState(false);

    // Show initial status message
    useEffect(() => {
        if (status === 'success') {
            toast({
                title: "Success!",
                description: message,
            });
            const timer = setTimeout(() => {
                router.visit(route('student.dashboard'));
            }, 2000);
            return () => clearTimeout(timer);
        } else {
            toast({
                title: "Status Update",
                description: message,
                variant: "destructive",
            });
        }
    }, [status, message, toast]);

    const checkStatus = useCallback(() => {
        if (isChecking) return;
        
        setIsChecking(true);
        router.get(route('student.check-status'), {}, {
            preserveScroll: true,
            preserveState: true,
            onSuccess: (response) => {
                const data = response as unknown as Props;
                if (data.status === 'success') {
                    toast({
                        title: "Success!",
                        description: data.message,
                    });
                    const timer = setTimeout(() => {
                        router.visit(route('student.dashboard'));
                    }, 2000);
                    return () => clearTimeout(timer);
                } else {
                    toast({
                        title: "Status Update",
                        description: data.message,
                        variant: "destructive",
                    });
                }
            },
            onError: () => {
                toast({
                    title: "Error",
                    description: "Failed to check status. Please try again.",
                    variant: "destructive",
                });
            },
            onFinish: () => {
                setIsChecking(false);
            }
        });
    }, [isChecking, toast]);

    // Poll for status updates every 30 seconds
    useEffect(() => {
        const interval = setInterval(checkStatus, 30000);
        return () => clearInterval(interval);
    }, [checkStatus]);

    return (
        <WaitingLayout>
            <div className="container mx-auto py-6">
                <Card className="max-w-2xl mx-auto">
                    <CardHeader>
                        <CardTitle>Welcome to NeuroGrade!</CardTitle>
                        <CardDescription>
                            Your account is being set up. Please wait while an administrator assigns you to a class.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex items-center justify-center p-8">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                        </div>
                        <p className="text-center text-muted-foreground">
                            This page will automatically refresh when you are assigned to a class.
                            You will then be redirected to your dashboard.
                        </p>
                        <div className="flex justify-center gap-4">
                            <Button
                                variant="outline"
                                onClick={checkStatus}
                                disabled={isChecking}
                            >
                                {isChecking ? 'Checking...' : 'Check Status'}
                            </Button>
                            <Button
                                variant="secondary"
                                onClick={() => {
                                    router.post(route('logout'));
                                }}
                            >
                                Logout
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </WaitingLayout>
    );
} 