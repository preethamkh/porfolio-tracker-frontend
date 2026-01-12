// PostCSS processes the CSS (Tailwind is a PostCSS plugin)
export default {
  plugins: {
    tailwindcss: {},
    autoprefixer: {}, // Adds vendor prefixes automatically (-webkit-, -moz-, etc.)
  },
};
