import { Button } from "@/components/ui/button"
import { BookOpen, MessageSquare, ClipboardCheck, LineChart, FileSearch } from "lucide-react"

export function QuickLinks() {
  const links = [
    {
      title: "Test Questions",   
      icon: BookOpen,
      href: "#",
    },
    {
      title: "Test Results", 
      icon: ClipboardCheck,
      href: "#",
    },
    
  
    {
      title: "Code Submissions", 
      icon: FileSearch,
      href: "#",
    },
    {
      title: "Performance Report", 
      icon: LineChart,
      href: "#",
    },
  ]

  return (
    <div className="grid grid-cols-2 gap-4">
      {links.map((link) => (
        <Button key={link.title} variant="outline" className="h-auto justify-start gap-2 p-4 hover:bg-primary hover:text-muted" asChild>
          <a href={link.href}>
            <link.icon className="h-5 w-5" />
            <div className="text-sm font-medium">{link.title}</div>
          </a>
        </Button>
      ))}
    </div>
  )
}

