
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Filter } from "lucide-react"
import { Link } from '@inertiajs/react';

const tests = [
  {
    id: 1,
    title: "Palindrome",
    dueDate: "May 9, 2025",
    status: "Done",
    submitted: "Submitted",
  },
  {
    id: 2,
    title: "Palindrome",
    dueDate: "May 9, 2025",
    status: "Done",
    submitted: "Submitted",
  },
  {
    id: 3,
    title: "Palindrome",
    dueDate: "May 9, 2025",
    status: "Done",
    submitted: "Submitted",
  },
  {
    id: 4,
    title: "Palindrome",
    dueDate: "May 9, 2025",
    status: "Done",
    submitted: "Submitted",
  },
  {
    id: 5,
    title: "Palindrome",
    dueDate: "May 9, 2025",
    status: "Done",
    submitted: "Submitted",
  },
  {
    id: 6,
    title: "Palindrome",
    dueDate: "May 9, 2025",
    status: "Done",
    submitted: "Submitted",
  },
  {
    id: 7,
    title: "Palindrome",
    dueDate: "May 9, 2025",
    status: "Done",
    submitted: "Submitted",
  },
  {
    id: 8,
    title: "Palindrome",
    dueDate: "May 9, 2025",
    status: "Done",
    submitted: "Submitted",
  },
]

export function TestList() {
  const [page, setPage] = useState(1)
  const itemsPerPage = 10
  const totalPages = Math.ceil(tests.length / itemsPerPage)

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="h-8 gap-1">
            <Filter className="h-3.5 w-3.5" />
            <span>Filter by dates | Status</span>
          </Button>
        </div>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Test Title</TableHead>
              <TableHead>Due Date</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Submit</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {tests.map((test) => (
              <TableRow key={test.id}>
                <TableCell>
                  <Link href={`/tests/${test.id}`} className="font-medium hover:underline">
                    {test.title}
                  </Link>
                </TableCell>
                <TableCell>{test.dueDate}</TableCell>
                <TableCell>
                  <Badge variant="outline" className="bg-green-light text-green">
                    <span className="mr-1 h-1.5 w-1.5 rounded-full bg-green"></span>
                    {test.status}
                  </Badge>
                </TableCell>
                <TableCell>{test.submitted}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">Show</span>
          <select className="h-8 rounded-md border border-input bg-background px-2 py-1 text-sm">
            <option>10</option>
            <option>20</option>
            <option>50</option>
            <option>100</option>
          </select>
          <span className="text-sm text-muted-foreground">Rows</span>
        </div>

        <div className="flex items-center gap-1">
          <Button
            variant="outline"
            size="icon"
            className="h-8 w-8"
            disabled={page === 1}
            onClick={() => setPage(page - 1)}
          >
            &lt;
          </Button>
          {Array.from({ length: Math.min(5, totalPages) }, (_, i) => (
            <Button
              key={i + 1}
              variant={page === i + 1 ? "default" : "outline"}
              size="icon"
              className="h-8 w-8"
              onClick={() => setPage(i + 1)}
            >
              {i + 1}
            </Button>
          ))}
          {totalPages > 5 && <span className="px-2">...</span>}
          <Button
            variant="outline"
            size="icon"
            className="h-8 w-8"
            disabled={page === totalPages}
            onClick={() => setPage(page + 1)}
          >
            &gt;
          </Button>
        </div>
      </div>
    </div>
  )
}
