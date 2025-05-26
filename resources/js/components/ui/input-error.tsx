interface InputErrorProps {
  message?: string;
}

export function InputError({ message }: InputErrorProps) {
  return message ? (
    <p className="text-sm text-red-500">{message}</p>
  ) : null;
} 