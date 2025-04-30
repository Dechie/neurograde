import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Upload } from "lucide-react"
import { AppLayout } from "@/layouts/dashboard/studentDashboard/studentDashboardLayout"
import { CodeEditor } from "@/components/dashboard/studentDashboard/CodeEditor"

export default function TestDetail({ id }: { id: string }) {
  return (
    <AppLayout title="Test">
      <div className="grid gap-2 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>1.Palindrome</CardTitle>
          </CardHeader>
          <CardContent className="prose max-w-none">
            <p className="text-blue-600 underline">
              A phrase is a palindrome if, after converting all uppercase letters into lowercase letters and removing
              all non-alphanumeric characters, it reads the same forward and backward. Alphanumeric characters include
              letters and numbers.
            </p>
          </CardContent>
          <CardFooter className="border-t">
            <p className="text-sm text-muted-foreground">Due Date: May 9, 2025</p>
          </CardFooter>
        </Card>

        <div>
          <CodeEditor />
          <div className="mt-4 flex justify-between">
            <Button variant="outline" className="gap-2">
              <Upload className="h-4 w-4" />
              Upload code as file
            </Button>
            <Button>Submit Code</Button>
          </div>
        </div>
      </div>
    </AppLayout>
  )
}
