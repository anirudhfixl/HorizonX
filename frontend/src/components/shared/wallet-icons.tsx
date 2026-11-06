import React from 'react';

interface WalletIconProps extends React.SVGProps<SVGSVGElement> {
  className?: string;
  size?: number;
}

/**
 * Official MetaMask Fox Brand Logo
 */
export function MetaMaskLogo({ className = 'h-6 w-6', size, ...props }: WalletIconProps) {
  return (
    <svg
      viewBox="0 0 318.6 318.6"
      width={size}
      height={size}
      className={className}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        d="M274.1 35.5L174.6 109.4 193 65.8z"
        fill="#E2761B"
        stroke="#E2761B"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M44.4 35.5l98.7 74.6-17.6-44.3z"
        fill="#E4761B"
        stroke="#E4761B"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M238.3 206.8l-28.5 43.1 56.4 15.6 16.3-58.3z"
        fill="#E4761B"
        stroke="#E4761B"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M36 207.2l16.3 58.3 56.3-15.6-28.4-43.1z"
        fill="#E4761B"
        stroke="#E4761B"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M103.7 138.2l-15.8 23.9 56.3 2.5-2-40.5z"
        fill="#E4761B"
        stroke="#E4761B"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M214.9 138.2l-38.6-14.1-1.9 40.5 56.3-2.5z"
        fill="#E4761B"
        stroke="#E4761B"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M108.6 249.9l33.8-16.2-29.4-22.9z"
        fill="#E4761B"
        stroke="#E4761B"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M176.2 233.7l33.8 16.2-4.4-39.1z"
        fill="#E4761B"
        stroke="#E4761B"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M174.6 109.4l99.5-73.9-8.4 83.2-52.5-7.3z"
        fill="#D7C1B3"
        stroke="#D7C1B3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M44.4 35.5l98.7 73.9-38.6 2-52.5 7.3z"
        fill="#D7C1B3"
        stroke="#D7C1B3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M87.9 162.1l24.7 48.1-24.7-3.4z"
        fill="#233447"
        stroke="#233447"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M230.7 162.1l-24.7 44.7 24.7 3.4z"
        fill="#233447"
        stroke="#233447"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M112.6 210.2l29.8 45.4-29.8-5.7z"
        fill="#CD6116"
        stroke="#CD6116"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M206 210.2l-29.8 39.7 29.8 5.7z"
        fill="#CD6116"
        stroke="#CD6116"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M142.4 255.6l16.9 22.8 16.9-22.8-16.9-5.7z"
        fill="#E4751F"
        stroke="#E4751F"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M159.3 226.7l-16.9 28.9 16.9 5.7 16.9-5.7z"
        fill="#F6851B"
        stroke="#F6851B"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M142.4 124.1l-2-40.5-17.6-44.3 36.5 144.5z"
        fill="#F6851B"
        stroke="#F6851B"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M176.2 124.1l-16.9 59.7 36.5-144.5-17.6 44.3z"
        fill="#F6851B"
        stroke="#F6851B"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M142.4 124.1l16.9 59.7 16.9-59.7-16.9-10.4z"
        fill="#C0AD9E"
        stroke="#C0AD9E"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M159.3 183.8l-16.9 42.9 16.9 5.7 16.9-5.7z"
        fill="#161616"
        stroke="#161616"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/**
 * Official Phantom Ghost Brand Logo
 */
export function PhantomLogo({ className = 'h-6 w-6', size, ...props }: WalletIconProps) {
  return (
    <svg
      viewBox="0 0 128 128"
      width={size}
      height={size}
      className={className}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <rect width="128" height="128" rx="28" fill="#534bb1" />
      <path
        d="M100.5 75.2C96.3 89.4 82.2 99.6 65.8 99.6c-18.7 0-34.4-13.2-37.4-30.8C24.3 45.4 41.5 28 62.7 28c21.8 0 39.5 17.7 39.5 39.5 0 2.6-.3 5.2-1.7 7.7z"
        fill="#FFF"
      />
      <path
        d="M74.8 62.8a6.4 6.4 0 100-12.8 6.4 6.4 0 000 12.8zm-22.4 0a6.4 6.4 0 100-12.8 6.4 6.4 0 000 12.8z"
        fill="#534bb1"
      />
      <path
        d="M33 73.5c1.8 11.2 10.4 19.8 21.2 21.8-1.5-1.5-2.7-3.4-3.5-5.5-2.2-6.1-8.2-10.8-14.8-12.2-1-.2-2-.4-2.9-.6v-3.5z"
        fill="#e6e4ff"
        opacity="0.4"
      />
    </svg>
  );
}

/**
 * Official Gram Wallet Brand Logo
 * Official TON Gram Faceted Gemstone Crystal Mark
 */
export function GramWalletLogo({ className = 'h-6 w-6', size, ...props }: WalletIconProps) {
  return (
    <svg
      viewBox="0 0 56 56"
      width={size}
      height={size}
      className={className}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-label="Gram Wallet Logo"
      {...props}
    >
      <circle cx="28" cy="28" r="28" fill="#0098EA" />
      <path
        d="M37.5603 15.6277H18.4386C14.9228 15.6277 12.6944 19.4202 14.4632 22.4861L26.2644 42.9409C27.0345 44.2765 28.9644 44.2765 29.7345 42.9409L41.5381 22.4861C43.3045 19.4251 41.0761 15.6277 37.5627 15.6277H37.5603ZM26.2548 36.8068L23.6847 31.8327L17.4833 20.7414C17.0742 20.0315 17.5795 19.1218 18.4362 19.1218H26.2524V36.8092L26.2548 36.8068ZM38.5108 20.739L32.3118 31.8351L29.7417 36.8068V19.1194H37.5579C38.4146 19.1194 38.9199 20.0291 38.5108 20.739Z"
        fill="white"
      />
    </svg>
  );
}

/**
 * Official Tonkeeper Diamond Brand Logo
 */
export function TonkeeperLogo({ className = 'h-6 w-6', size, ...props }: WalletIconProps) {
  return (
    <svg
      viewBox="0 0 128 128"
      width={size}
      height={size}
      className={className}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <rect width="128" height="128" rx="28" fill="#0098EA" />
      {/* TON Gem Geometry */}
      <path
        d="M64 26L34 50l30 52 30-52-30-24z"
        fill="#FFFFFF"
      />
      <path
        d="M64 26L34 50h60L64 26z"
        fill="#FFFFFF"
        opacity="0.9"
      />
      <path
        d="M64 50L34 50l30 52V50z"
        fill="#26A8F0"
        opacity="0.35"
      />
      <path
        d="M64 50l30 0-30 52V50z"
        fill="#0077B5"
        opacity="0.2"
      />
    </svg>
  );
}

/**
 * Official TronLink Brand Logo
 */
export function TronLinkLogo({ className = 'h-6 w-6', size, ...props }: WalletIconProps) {
  return (
    <svg
      viewBox="0 0 128 128"
      width={size}
      height={size}
      className={className}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <rect width="128" height="128" rx="28" fill="#FF0613" />
      {/* Tron Geometric Diamond & T */}
      <path
        d="M64 24L30 54l34 50 34-50-34-50z"
        fill="#FFFFFF"
      />
      <path
        d="M64 36l-20 20h40L64 36z"
        fill="#FF0613"
      />
      <path
        d="M60 56h8v32h-8z"
        fill="#FF0613"
      />
      <path
        d="M64 24L30 54h68L64 24z"
        fill="#FFFFFF"
        opacity="0.92"
      />
    </svg>
  );
}

