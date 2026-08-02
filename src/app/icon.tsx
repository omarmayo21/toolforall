import { ImageResponse } from 'next/og';

export const runtime = 'edge';
export const size = { width: 32, height: 32 };
export const contentType = 'image/png';

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <svg 
          viewBox="0 0 100 100" 
          fill="none" 
          xmlns="http://www.w3.org/2000/svg"
          style={{ width: '100%', height: '100%' }}
        >
          <path d="M45 85 L70 15 H90 L65 85 Z" fill="#0066FF" />
          <path d="M25 85 L40 45 H60 L45 85 Z" fill="#14B8A6" />
        </svg>
      </div>
    ),
    { ...size }
  );
}
