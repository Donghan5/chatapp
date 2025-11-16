// app/frontend/tailwind.config.ts

export default {
	content: [
		"./index.html",
		"./**/*.{js,ts,jsx,tsx}",
	],
	theme: {
		extend: {
			colors: {
        		'crimson': '#DC143C',
				'whatsapp-green': '#25D366',
				'bg-whatsapp-green': '#25D366',
				'whatsapp-dark-green': '#075E54',
				'whatsapp-light-green': '#D9FDD3',
				'whatsapp-bg': '#e4e1de',
				'whatsapp-chat-bg': '#f0f2f5',
				'ring-whatsapp-blue': '#00ffff'
			}
		},
	},
	plugins: [],
}