type SpinnerProps = {
  label: string;
};

export function Spinner({ label }: SpinnerProps) {
  return (
    <span aria-label={label} className="auth-spinner" role="status">
      <span className="auth-spinner__circle" />
    </span>
  );
}
