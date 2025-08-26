module.exports = {
  env: {
    browser: true,
    es2021: true,
  },
  extends: [
    "react-app", 
    "react-app/jest",
    "plugin:react-hooks/recommended" // ✅ enables exhaustive-deps
  ],
  plugins: ["react-hooks"],
  rules: {
    // optional: customize rules here
    // "react-hooks/exhaustive-deps": "warn", 
  },
};
