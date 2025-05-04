export interface Test {
  id: number;
  title: string;
  due_date?: string;
  dueDate?: string; // For backward compatibility
  status: string;
  submitted?: string;
}

export interface TestListProps {
  tests: Test[];
}