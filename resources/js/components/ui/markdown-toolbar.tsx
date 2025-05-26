import { Button } from '@/components/ui/button';
import { Bold, Italic, Code, Link, FileCode } from 'lucide-react';

interface MarkdownToolbarProps {
  field: string;
  onAction: (action: string) => void;
}

export function MarkdownToolbar({ field, onAction }: MarkdownToolbarProps) {
  return (
    <div className="flex items-center gap-1 p-1 border rounded-md bg-muted/50">
      <Button
        variant="ghost"
        size="sm"
        onClick={() => onAction('bold')}
        className="h-8 w-8 p-0"
      >
        <Bold className="h-4 w-4" />
      </Button>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => onAction('italic')}
        className="h-8 w-8 p-0"
      >
        <Italic className="h-4 w-4" />
      </Button>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => onAction('code')}
        className="h-8 w-8 p-0"
      >
        <Code className="h-4 w-4" />
      </Button>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => onAction('codeblock')}
        className="h-8 w-8 p-0"
      >
        <FileCode className="h-4 w-4" />
      </Button>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => onAction('link')}
        className="h-8 w-8 p-0"
      >
        <Link className="h-4 w-4" />
      </Button>
    </div>
  );
} 