"use client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import type { Test } from "@/types/index"
import { Link } from "@inertiajs/react"
import { Filter } from "lucide-react"
import { useState } from "react"

// Format date to a more readable format
const formatDate = (dateString: string) => {
  const date = new Date(dateString)
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  })
}

// Determine test status based on due date
const getTestStatus = (dueDate: string) => {
  const now = new Date()
  const due = new Date(dueDate)

  if (due < now) {
    return "Past Due"
  } else if (due.getTime() - now.getTime() < 24 * 60 * 60 * 1000) {
    return "Due Soon"
  } else {
    return "Upcoming"
  }
}

export function TestList({ tests = [] }: { tests: Test[] }) {
  const [page, setPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(10)
  const totalPages = Math.ceil(tests.length / itemsPerPage)

  if (tests.length === 0) {
    return (
      <div className="rounded-lg border p-6 text-center">
        <p className="text-muted-foreground">No tests available</p>
      </div>
    )
  }

  const startIndex = (page - 1) * itemsPerPage
  const displayedTests = tests.slice(startIndex, startIndex + itemsPerPage)

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
              <TableHead>Class</TableHead>
              <TableHead>Due Date</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {displayedTests.map((test) => {
              const status = test.status || getTestStatus(test.due_date)

              return (
                <TableRow key={test.id}>
                  <TableCell>
                    <Link href={`/dashboard/tests/${test.id}`} className="font-medium hover:underline">
                      {test.title}
                    </Link>
                  </TableCell>
                  <TableCell>{test.class?.name || "N/A"}</TableCell>
                  <TableCell>{formatDate(test.due_date)}</TableCell>
                  <TableCell>
                    <Badge
                      variant="outline"
                      className={`${
                        status === "Upcoming"
                          ? "bg-yellow-100 text-yellow-800"
                          : status === "Due Soon"
                            ? "bg-orange-100 text-orange-800"
                            : status === "Past Due"
                              ? "bg-red-100 text-red-800"
                              : "bg-green-100 text-green-800"
                      }`}
                    >
                      <span
                        className={`mr-1 h-1.5 w-1.5 rounded-full ${
                          status === "Upcoming"
                            ? "bg-yellow-500"
                            : status === "Due Soon"
                              ? "bg-orange-500"
                              : status === "Past Due"
                                ? "bg-red-500"
                                : "bg-green-500"
                        }`}
                      ></span>
                      {status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Link href={`/student/tests/${test.id}`} className="text-blue-500">
                      View Test
                    </Link>
                  </TableCell>
                </TableRow>
              )
            })}
          </TableBody>
        </Table>
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-muted-foreground text-sm">Show</span>
            <select
              className="border-input bg-background h-8 rounded-md border px-2 py-1 text-sm"
              value={itemsPerPage}
              onChange={(e) => {
                setItemsPerPage(Number(e.target.value))
                setPage(1) // Reset to first page when changing items per page
              }}
            >
              <option value={10}>10</option>
              <option value={20}>20</option>
              <option value={50}>50</option>
              <option value={100}>100</option>
            </select>
            <span className="text-muted-foreground text-sm">Rows</span>
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
      )}
    </div>
  )
}
 