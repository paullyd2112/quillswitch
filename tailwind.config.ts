
import type { Config } from "tailwindcss";

export default {
	darkMode: ["class"],
	content: [
		"./pages/**/*.{ts,tsx}",
		"./components/**/*.{ts,tsx}",
		"./app/**/*.{ts,tsx}",
		"./src/**/*.{ts,tsx}",
	],
	prefix: "",
	theme: {
		container: {
			center: true,
			padding: '2rem',
			screens: {
				'2xl': '1400px'
			}
		},
		extend: {
			fontFamily: {
				sans: ['Inter', 'system-ui', 'sans-serif'],
				display: ['Sora', 'Inter', 'system-ui', 'sans-serif'],
				mono: ['SF Mono', 'Monaco', 'Inconsolata', 'Roboto Mono', 'monospace'],
			},
			colors: {
				border: 'hsl(var(--border))',
				input: 'hsl(var(--input))',
				ring: 'hsl(var(--ring))',
				background: 'hsl(var(--background))',
				foreground: 'hsl(var(--foreground))',
				primary: {
					DEFAULT: 'hsl(216 100% 55%)', // Premium blue #1e5eff
					foreground: 'hsl(0 0% 100%)',
					50: 'hsl(217 100% 97%)',
					100: 'hsl(217 100% 94%)',
					200: 'hsl(217 100% 87%)',
					300: 'hsl(217 100% 78%)',
					400: 'hsl(217 100% 67%)',
					500: 'hsl(216 100% 55%)',
					600: 'hsl(215 100% 47%)',
					700: 'hsl(214 100% 38%)',
					800: 'hsl(213 100% 30%)',
					900: 'hsl(212 100% 23%)',
					950: 'hsl(210 100% 15%)',
				},
				secondary: {
					DEFAULT: 'hsl(var(--secondary))',
					foreground: 'hsl(var(--secondary-foreground))'
				},
				destructive: {
					DEFAULT: 'hsl(var(--destructive))',
					foreground: 'hsl(var(--destructive-foreground))'
				},
				muted: {
					DEFAULT: 'hsl(var(--muted))',
					foreground: 'hsl(var(--muted-foreground))'
				},
				accent: {
					DEFAULT: 'hsl(var(--accent))',
					foreground: 'hsl(var(--accent-foreground))'
				},
				popover: {
					DEFAULT: 'hsl(var(--popover))',
					foreground: 'hsl(var(--popover-foreground))'
				},
				card: {
					DEFAULT: 'hsl(var(--card))',
					foreground: 'hsl(var(--card-foreground))'
				},
				sidebar: {
					DEFAULT: 'hsl(var(--sidebar-background))',
					foreground: 'hsl(var(--sidebar-foreground))',
					primary: 'hsl(var(--sidebar-primary))',
					'primary-foreground': 'hsl(var(--sidebar-primary-foreground))',
					accent: 'hsl(var(--sidebar-accent))',
					'accent-foreground': 'hsl(var(--sidebar-accent-foreground))',
					border: 'hsl(var(--sidebar-border))',
					ring: 'hsl(var(--sidebar-ring))'
				},
				brand: {
					50: '#e6f1ff',
					100: '#cce3ff',
					200: '#99c7ff',
					300: '#66aaff',
					400: '#338eff',
					500: '#0070f3', // Primary blue
					600: '#0062cc',
					700: '#004a99',
					800: '#003166',
					900: '#001933',
					950: '#000c19',
				},
				// Dark theme colors
				friendly: {
					bg: '#0a0f1f',         // Dark background
					card: '#111a33',       // Card background
					text: {
						primary: '#e0e0e0',  // Light grey text
						secondary: '#a0a0b0' // Secondary text
					},
					accent: '#0070f3',      // Bright blue accent
					icon: '#1a2a4d',        // Icon background
					border: '#2a3a6b'       // Border color
				}
			},
			borderRadius: {
				lg: 'var(--radius)',
				md: 'calc(var(--radius) - 2px)',
				sm: 'calc(var(--radius) - 4px)'
			},
			boxShadow: {
				'glow-primary': '0 0 30px hsl(216 100% 55% / 0.4)',
				'glow-intense': '0 0 60px hsl(216 100% 55% / 0.6)',
				'premium': '0 8px 32px hsl(220 13% 9% / 0.7)',
				'premium-hover': '0 16px 48px hsl(220 13% 9% / 0.8)',
				'glass': '0 8px 32px hsl(220 13% 9% / 0.37)',
				'glass-lg': '0 12px 40px hsl(220 13% 9% / 0.15)',
			},
			keyframes: {
				'accordion-down': {
					from: { height: '0' },
					to: { height: 'var(--radix-accordion-content-height)' },
				},
				'accordion-up': {
					from: { height: 'var(--radix-accordion-content-height)' },
					to: { height: '0' },
				},
				'fade-in': {
					'0%': { opacity: '0', transform: 'translateY(10px)' },
					'100%': { opacity: '1', transform: 'translateY(0)' },
				},
				'fade-up': {
					'0%': { opacity: '0', transform: 'translateY(30px)' },
					'100%': { opacity: '1', transform: 'translateY(0)' },
				},
				'scale-up': {
					'0%': { opacity: '0', transform: 'scale(0.95)' },
					'100%': { opacity: '1', transform: 'scale(1)' },
				},
				'slide-up': {
					'0%': { opacity: '0', transform: 'translateY(40px)' },
					'100%': { opacity: '1', transform: 'translateY(0)' },
				},
				'glow-pulse': {
					'0%, 100%': { boxShadow: '0 0 30px hsl(216 100% 55% / 0.4)' },
					'50%': { boxShadow: '0 0 60px hsl(216 100% 55% / 0.8)' },
				},
				'shimmer': {
					'0%': { backgroundPosition: '-200% 0' },
					'100%': { backgroundPosition: '200% 0' },
				},
				'float': {
					'0%, 100%': { transform: 'translateY(0px)' },
					'50%': { transform: 'translateY(-10px)' },
				},
				'premium-glow': {
					'0%, 100%': { 
						boxShadow: '0 0 30px hsl(216 100% 55% / 0.3), inset 0 1px 0 hsl(0 0% 100% / 0.1)' 
					},
					'50%': { 
						boxShadow: '0 0 60px hsl(216 100% 55% / 0.6), inset 0 1px 0 hsl(0 0% 100% / 0.2)' 
					},
				},
			},
			animation: {
				'accordion-down': 'accordion-down 0.2s ease-out',
				'accordion-up': 'accordion-up 0.2s ease-out',
				'fade-in': 'fade-in 0.6s cubic-bezier(0.4, 0, 0.2, 1) forwards',
				'fade-up': 'fade-up 0.8s cubic-bezier(0.4, 0, 0.2, 1) forwards',
				'scale-up': 'scale-up 0.6s cubic-bezier(0.4, 0, 0.2, 1) forwards',
				'slide-up': 'slide-up 0.8s cubic-bezier(0.4, 0, 0.2, 1) forwards',
				'glow-pulse': 'glow-pulse 3s ease-in-out infinite',
				'shimmer': 'shimmer 2.5s infinite linear',
				'float': 'float 3s ease-in-out infinite',
				'premium-glow': 'premium-glow 4s ease-in-out infinite',
			},
		},
	},
	plugins: [require("tailwindcss-animate")],
} satisfies Config;
