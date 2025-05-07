import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "@inertiajs/react";
import { EyeIcon, EyeOffIcon } from "lucide-react";
import { useState } from "react";
import { PageProps } from "@/types";
import { usePage } from "@inertiajs/react";
import { Checkbox } from "@/components/ui/checkbox";

// Define form schema
const formSchema = z.object({
  first_name: z.string().min(2, "First name must be at least 2 characters"),
  last_name: z.string().min(2, "Last name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  department_id: z.number().min(1, "Please select a department"),
});

interface Department {
  id: number;
  name: string;
}

interface Props extends PageProps {
  departments?: Department[];
}

export  function TeacherSignupForm() {
  const { departments } = usePage<Props>().props;
  const [imageLoaded, setImageLoaded] = useState(false);
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      first_name: "",
      last_name: "",
      email: "",
      department_id: undefined,
    },
  });

  const teacherImage = `/teacher.jpg?t=${Date.now()}`;

  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values);
    // post(route('teacher.register'), values);
  }

  return (
      <div className="flex min-h-screen w-full items-center justify-center p-2 sm:p-4">
        <Card className="w-full max-w-[90%] sm:max-w-3xl md:max-w-4xl flex flex-col md:flex-row items-center justify-center overflow-hidden shadow-xl">
          <div className="flex w-full md:w-1/2">
            <img
              src={teacherImage}
              className={`h-60 w-full rounded-lg object-contain transition-opacity md:h-full ${
                imageLoaded ? 'opacity-100' : 'opacity-0'
              }`}
              onLoad={() => setImageLoaded(true)}
              onError={(e) => {
                e.currentTarget.src = 'https://via.placeholder.com/1350x900?text=Teacher+Image+Not+Found';
                setImageLoaded(true);
              }}
              alt="Teacher illustration"
            />
          </div>
          <div className="w-full md:w-1/2 flex flex-col">
            <CardHeader className="space-y-2 px-6 sm:px-8 pt-6 sm:pt-8 text-center">
              <CardTitle className="text-primary text-2xl sm:text-3xl font-bold">Create a Teacher Account</CardTitle>
              <CardDescription className="text-muted-foreground text-sm sm:text-base">
                Enter teacher details to register as a teacher
              </CardDescription>
            </CardHeader>
            
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)}>
                <CardContent className="flex-1 space-y-6 sm:space-y-8 px-6 sm:px-8 py-6 sm:py-8">
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="first_name"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>First Name</FormLabel>
                            <FormControl>
                              <Input placeholder="First Name" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="last_name"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Last Name</FormLabel>
                            <FormControl>
                              <Input placeholder="Last Name" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email</FormLabel>
                          <FormControl>
                            <Input placeholder="teacher@gmail.com" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="department_id"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Department</FormLabel>
                          <Select
                            onValueChange={(value) => field.onChange(Number(value))}
                            defaultValue={field.value?.toString()}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select a department" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {departments?.map((dept) => (
                                <SelectItem key={dept.id} value={dept.id.toString()}>
                                  {dept.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                  </div>
                </CardContent>
                <CardFooter className="flex flex-col space-y-4 px-6 sm:px-8 pb-6 sm:pb-8">
                  <Button type="submit" className="w-full">
                    Create Account
                  </Button>
                </CardFooter>
              </form>
            </Form>
          </div>
        </Card>
      </div>
  );
}