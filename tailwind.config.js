/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Your existing project colors - preserved exactly
        'project-bg': '#fafaff',
        'project-purple': '#e4d9ff', 
        'project-dark': '#30343f',
        'project-text': '#1e2749',
        'project-text-secondary': '#30343f',
        'project-primary': '#273469',
        'project-light': '#f2edff',
      },
      fontFamily: {
        sans: ['system-ui', 'Avenir', 'Helvetica', 'Arial', 'sans-serif'],
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
        'fadeInUp': 'fadeInUp 0.8s ease-out forwards',
        'fadeInLeft': 'fadeInLeft 0.8s ease-out forwards',
        'fadeInRight': 'fadeInRight 0.8s ease-out forwards',
        'scaleIn': 'scaleIn 0.6s ease-out forwards',
        'pulse-slow': 'pulse 2s ease-in-out infinite',
        'glow': 'glow 2s ease-in-out infinite',
        'bounce-slow': 'bounce 2s infinite',
        'wiggle': 'wiggle 1s ease-in-out',
        'slide-in-top': 'slideInFromTop 0.8s ease-out forwards',
        'slide-in-bottom': 'slideInFromBottom 0.8s ease-out forwards',
        'slide-in-left': 'slideInFromLeft 0.8s ease-out forwards',
        'slide-in-right': 'slideInFromRight 0.8s ease-out forwards',
        'rotate-in': 'rotateIn 0.8s ease-out forwards',
        'flip-in': 'flipIn 0.8s ease-out forwards',
        'zoom-in': 'zoomIn 0.8s ease-out forwards',
        'slide-up': 'slideUp 0.8s ease-out forwards',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-20px)' },
        },
        fadeInUp: {
          from: { opacity: '0', transform: 'translateY(30px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        fadeInLeft: {
          from: { opacity: '0', transform: 'translateX(-30px)' },
          to: { opacity: '1', transform: 'translateX(0)' },
        },
        fadeInRight: {
          from: { opacity: '0', transform: 'translateX(30px)' },
          to: { opacity: '1', transform: 'translateX(0)' },
        },
        scaleIn: {
          from: { opacity: '0', transform: 'scale(0.9)' },
          to: { opacity: '1', transform: 'scale(1)' },
        },
        glow: {
          '0%, 100%': { boxShadow: '0 0 20px rgba(39, 52, 105, 0.4)' },
          '50%': { boxShadow: '0 0 40px rgba(39, 52, 105, 0.8)' },
        },
        wiggle: {
          '0%, 7%': { transform: 'rotateZ(0)' },
          '15%': { transform: 'rotateZ(-15deg)' },
          '20%': { transform: 'rotateZ(10deg)' },
          '25%': { transform: 'rotateZ(-10deg)' },
          '30%': { transform: 'rotateZ(6deg)' },
          '35%': { transform: 'rotateZ(-4deg)' },
          '40%, 100%': { transform: 'rotateZ(0)' },
        },
        slideInFromTop: {
          from: { opacity: '0', transform: 'translateY(-50px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        slideInFromBottom: {
          from: { opacity: '0', transform: 'translateY(50px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        slideInFromLeft: {
          from: { opacity: '0', transform: 'translateX(-50px)' },
          to: { opacity: '1', transform: 'translateX(0)' },
        },
        slideInFromRight: {
          from: { opacity: '0', transform: 'translateX(50px)' },
          to: { opacity: '1', transform: 'translateX(0)' },
        },
        rotateIn: {
          from: { opacity: '0', transform: 'rotate(-180deg) scale(0.5)' },
          to: { opacity: '1', transform: 'rotate(0deg) scale(1)' },
        },
        flipIn: {
          from: { opacity: '0', transform: 'perspective(400px) rotateY(-90deg)' },
          to: { opacity: '1', transform: 'perspective(400px) rotateY(0deg)' },
        },
        zoomIn: {
          from: { opacity: '0', transform: 'scale(0.3)' },
          to: { opacity: '1', transform: 'scale(1)' },
        },
        slideUp: {
          from: { opacity: '0', transform: 'translateY(100px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
      },
    },
  },
  plugins: [],
}
