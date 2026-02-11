export function Button({ className = '', children, variant = 'default', size = 'default', ...props }) {
  const variantClass =
    variant === 'outline'
      ? 'btn btn-ghost'
      : 'btn btn-primary';

  return (
    <button className={`${variantClass} ${className}`.trim()} {...props}>
      {children}
    </button>
  );
}
