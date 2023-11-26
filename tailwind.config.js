import { fontFamily, fontSize } from 'tailwindcss/defaultTheme';

/** @type {import('tailwindcss').Config} */
export default {
	content: ['./src/**/*.{html,js,svelte,ts}'],
	theme: {
		fontFamily: {
			sans: ['Inter', 'sans-serif', ...fontFamily.sans]
		},
		fontSize: {
			...fontSize,
			'3xl': '32px',
			'6xl': '64px'
		},
		colors: {
			inherit: 'inherit',
			transparent: 'transparent',
			current: 'currentColor',
			black: 'rgb(0 0 0)',
			white: 'rgb(255 255 255)',
			green: {
				50: '#F7FEE7',
				100: '#ECFDCA',
				200: '#E1FBAF',
				300: '#BFF462',
				400: '#A4E833',
				500: '#85CE14',
				600: '#66A50B',
				700: '#4E7D0E',
				800: '#3F6311',
				900: '#365413',
				950: '#1A2E05'
			},
			gray: {
				50: '#F6F7F9',
				100: '#ECEEF2',
				200: '#D5DAE2',
				300: '#B0BAC9',
				400: '#8594AB',
				500: '#667891',
				600: '#516078',
				700: '#424E62',
				800: '#394353',
				900: '#343B48',
				950: '#22262F'
			},
			orange: {
				50: '#FEFAE8',
				100: '#FDF1BA',
				200: '#FDE48B',
				300: '#FBCD49',
				400: '#F7B518',
				500: '#E79D0B',
				600: '#C87706',
				700: '#9F5409',
				800: '#84420F',
				900: '#703613',
				950: '#411B07'
			},
			blue: {
				50: '#F5F8FF',
				100: '#DFE6FF',
				200: '#C5D0FF',
				300: '#A2B1FF',
				400: '#7E88FC',
				500: '#5E5FF6',
				600: '#4C41EA',
				700: '#4133CF',
				800: '#362CA7',
				900: '#2F2B84',
				950: '#1E194D'
			},
			red: {
				50: '#FFF4ED',
				100: '#FFE7D4',
				200: '#FFCAA8',
				300: '#FFA571',
				400: '#FF7538',
				500: '#FE4F11',
				600: '#EF3407',
				700: '#C62308',
				800: '#9D1E0F',
				900: '#7E1C10',
				950: '#440A06'
			}
		}
	},
	plugins: []
};
