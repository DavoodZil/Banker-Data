/** @type {import('tailwindcss').Config} */
module.exports = {
    darkMode: ["class"],
    content: ["./index.html", "./src/**/*.{ts,tsx,js,jsx}"],
  theme: {
  	extend: {
  		borderRadius: {
  			lg: 'var(--radius)',
  			md: 'calc(var(--radius) - 2px)',
  			sm: 'calc(var(--radius) - 4px)'
  		},
		colors: {
			background: 'hsl(var(--background))',
			foreground: 'hsl(var(--foreground))',
			card: {
				DEFAULT: 'hsl(var(--card))',
				foreground: 'hsl(var(--card-foreground))'
			},
			popover: {
				DEFAULT: 'hsl(var(--popover))',
				foreground: 'hsl(var(--popover-foreground))'
			},
			primary: {
				DEFAULT: 'hsl(var(--primary))',
				foreground: 'hsl(var(--primary-foreground))'
			},
			secondary: {
				DEFAULT: 'hsl(var(--secondary))',
				foreground: 'hsl(var(--secondary-foreground))'
			},
			muted: {
				DEFAULT: 'hsl(var(--muted))',
				foreground: 'hsl(var(--muted-foreground))'
			},
			accent: {
				DEFAULT: 'hsl(var(--accent))',
				foreground: 'hsl(var(--accent-foreground))'
			},
			destructive: {
				DEFAULT: 'hsl(var(--destructive))',
				foreground: 'hsl(var(--destructive-foreground))'
			},
			border: 'hsl(var(--border))',
			input: 'hsl(var(--input))',
			ring: 'hsl(var(--ring))',
			chart: {
				'1': 'hsl(var(--chart-1))',
				'2': 'hsl(var(--chart-2))',
				'3': 'hsl(var(--chart-3))',
				'4': 'hsl(var(--chart-4))',
				'5': 'hsl(var(--chart-5))'
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
			// Common color system
			common: {
				green: {
					DEFAULT: 'hsl(var(--common-green))',
					foreground: 'hsl(var(--common-green-foreground))',
					secondary: 'hsl(var(--common-green-secondary))',
					'secondary-foreground': 'hsl(var(--common-green-secondary-foreground))',
					light: 'hsl(var(--common-green-light))',
					dark: 'hsl(var(--common-green-dark))'
				},
				red: {
					DEFAULT: 'hsl(var(--common-red))',
					foreground: 'hsl(var(--common-red-foreground))',
					secondary: 'hsl(var(--common-red-secondary))',
					'secondary-foreground': 'hsl(var(--common-red-secondary-foreground))',
					light: 'hsl(var(--common-red-light))',
					dark: 'hsl(var(--common-red-dark))'
				},
				yellow: {
					DEFAULT: 'hsl(var(--common-yellow))',
					foreground: 'hsl(var(--common-yellow-foreground))',
					secondary: 'hsl(var(--common-yellow-secondary))',
					'secondary-foreground': 'hsl(var(--common-yellow-secondary-foreground))',
					light: 'hsl(var(--common-yellow-light))',
					dark: 'hsl(var(--common-yellow-dark))'
				},
				blue: {
					DEFAULT: 'hsl(var(--common-blue))',
					foreground: 'hsl(var(--common-blue-foreground))',
					secondary: 'hsl(var(--common-blue-secondary))',
					'secondary-foreground': 'hsl(var(--common-blue-secondary-foreground))',
					light: 'hsl(var(--common-blue-light))',
					dark: 'hsl(var(--common-blue-dark))'
				},
				orange: {
					DEFAULT: 'hsl(var(--common-orange))',
					foreground: 'hsl(var(--common-orange-foreground))',
					secondary: 'hsl(var(--common-orange-secondary))',
					'secondary-foreground': 'hsl(var(--common-orange-secondary-foreground))',
					light: 'hsl(var(--common-orange-light))',
					dark: 'hsl(var(--common-orange-dark))'
				},
				violet: {
					DEFAULT: 'hsl(var(--common-violet))',
					foreground: 'hsl(var(--common-violet-foreground))',
					secondary: 'hsl(var(--common-violet-secondary))',
					'secondary-foreground': 'hsl(var(--common-violet-secondary-foreground))',
					light: 'hsl(var(--common-violet-light))',
					dark: 'hsl(var(--common-violet-dark))'
				},
				background: {
					main: 'hsl(var(--common-background-main))',
					secondary: 'hsl(var(--common-background-secondary))'
				},
				text: {
					main: 'hsl(var(--common-text-main))',
					secondary: 'hsl(var(--common-text-secondary))'
				},
				border: {
					main: 'hsl(var(--common-border-main))',
					secondary: 'hsl(var(--common-border-secondary))'
				},
				gray: {
					light: 'hsl(var(--common-gray-light))',
					dark: 'hsl(var(--common-gray-dark))'
				}
			}
		},
  		keyframes: {
  			'accordion-down': {
  				from: {
  					height: '0'
  				},
  				to: {
  					height: 'var(--radix-accordion-content-height)'
  				}
  			},
  			'accordion-up': {
  				from: {
  					height: 'var(--radix-accordion-content-height)'
  				},
  				to: {
  					height: '0'
  				}
  			}
  		},
  		animation: {
  			'accordion-down': 'accordion-down 0.2s ease-out',
  			'accordion-up': 'accordion-up 0.2s ease-out'
  		}
  	}
  },
  plugins: [require("tailwindcss-animate")],
}