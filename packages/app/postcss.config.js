export default {
  plugins: {
    "tailwindcss/nesting": {},
    tailwindcss: {
      config: `${import.meta.dirname}/tailwind.config.ts`
    },
    autoprefixer: {}
  }
};
