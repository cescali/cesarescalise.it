import defaultTheme from 'tailwindcss/defaultTheme';

/** @type {import('tailwindcss').Config} */
export default {
	content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
	theme: {
		extend: {
            colors: {
                canvas: 'rgb(var(--tone-page) / <alpha-value>)',
                paper: 'rgb(var(--tone-surface) / <alpha-value>)',
                copper: 'rgb(var(--tone-accent) / <alpha-value>)',
                brand: {
                    50: 'rgb(var(--tone-tint) / <alpha-value>)', 100: 'rgb(var(--tone-tint-strong) / <alpha-value>)', 200: 'rgb(var(--tone-accent-border) / <alpha-value>)',
                    300: 'rgb(var(--tone-accent-soft) / <alpha-value>)', 400: 'rgb(var(--tone-accent-mid) / <alpha-value>)', 500: 'rgb(var(--tone-accent-secondary) / <alpha-value>)',
                    600: 'rgb(var(--tone-accent) / <alpha-value>)', 700: 'rgb(var(--tone-accent-hover) / <alpha-value>)', 800: 'rgb(var(--tone-accent-deep) / <alpha-value>)',
                    900: 'rgb(var(--tone-deep) / <alpha-value>)', 950: 'rgb(var(--tone-page) / <alpha-value>)',
                },
                gray: {
                    50: 'rgb(var(--tone-surface) / <alpha-value>)', 100: 'rgb(var(--tone-raised) / <alpha-value>)', 200: 'rgb(var(--tone-line) / <alpha-value>)',
                    300: 'rgb(var(--tone-border) / <alpha-value>)', 400: 'rgb(var(--tone-muted-weak) / <alpha-value>)', 500: 'rgb(var(--tone-muted) / <alpha-value>)',
                    600: 'rgb(var(--tone-secondary) / <alpha-value>)', 700: 'rgb(var(--tone-light) / <alpha-value>)', 800: 'rgb(var(--tone-lighter) / <alpha-value>)',
                    900: 'rgb(var(--tone-text) / <alpha-value>)', 950: 'rgb(var(--tone-contrast-bg) / <alpha-value>)',
                },
            },
            fontFamily: {
				sans:    ['Inter',              ...defaultTheme.fontFamily.sans],
				display: ['"Playfair Display"', ...defaultTheme.fontFamily.serif],
			},
		},
	},
	plugins: [
		require('@tailwindcss/typography'),
	],
}
