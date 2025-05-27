import { Button } from '@/components/ui/button';
import { Bold, Italic, Code, Link, FileCode } from 'lucide-react';

interface MarkdownToolbarProps {
  field: string;
  onAction: (action: string, selectedText: string) => void;
}

export function MarkdownToolbar({ field, onAction }: MarkdownToolbarProps) {
  const handleAction = (action: string) => {
    const textarea = document.querySelector(`textarea[name="${field}"]`) as HTMLTextAreaElement;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = textarea.value.substring(start, end);
    const beforeText = textarea.value.substring(0, start);
    const afterText = textarea.value.substring(end);

    let newText = '';
    switch (action) {
      case 'bold':
        newText = `**${selectedText}**`;
        break;
      case 'italic':
        newText = `*${selectedText}*`;
        break;
      case 'code':
        newText = `\`${selectedText}\``;
        break;
      case 'codeblock':
        newText = `\`\`\`\n${selectedText}\n\`\`\``;
        break;
      case 'link':
        newText = `[${selectedText}](url)`;
        break;
      default:
        newText = selectedText;
    }

    const newValue = beforeText + newText + afterText;
    onAction(action, newValue);
    
    // Restore focus and set cursor position after the inserted text
    setTimeout(() => {
      textarea.focus();
      const newCursorPos = start + newText.length;
      textarea.setSelectionRange(newCursorPos, newCursorPos);
    }, 0);
  };

  return (
    <div className="flex items-center gap-1 p-1 border rounded-md bg-muted/50">
      <Button
        variant="ghost"
        size="sm"
        onClick={() => handleAction('bold')}
        className="h-8 w-8 p-0"
      >
        <Bold className="h-4 w-4" />
      </Button>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => handleAction('italic')}
        className="h-8 w-8 p-0"
      >
        <Italic className="h-4 w-4" />
      </Button>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => handleAction('code')}
        className="h-8 w-8 p-0"
      >
        <Code className="h-4 w-4" />
      </Button>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => handleAction('codeblock')}
        className="h-8 w-8 p-0"
      >
        <FileCode className="h-4 w-4" />
      </Button>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => handleAction('link')}
        className="h-8 w-8 p-0"
      >
        <Link className="h-4 w-4" />
      </Button>
    </div>
  );
} 