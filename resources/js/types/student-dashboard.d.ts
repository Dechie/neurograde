export interface Test {
  id: number;
  title: string;
  dueDate?: string; // For backward compatibility
  problemStatement: String;
  status: string;
  submitted?: string;
}

export interface TestListProps {
  tests: Test[];
}
