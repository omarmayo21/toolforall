export function LogoIcon({ className }: { className?: string }) {
  return (
    <svg 
      className={className}
      viewBox="0 0 100 100" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
    >
      <path 
        d="M45 85 L70 15 H90 L65 85 Z" 
        className="fill-primary-500" 
      />
      <path 
        d="M25 85 L40 45 H60 L45 85 Z" 
        className="fill-accent-500" 
      />
    </svg>
  );
}
