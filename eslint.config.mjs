import nextCoreWebVitals from "eslint-config-next/core-web-vitals";
import nextTypescript from "eslint-config-next/typescript";
import { dirname } from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// H20: Re-enabled critical ESLint rules (previously all disabled).
// Remaining `off` switches are intentional (project uses `any` in legacy
// spots and `console` for logging).
const eslintConfig = [...nextCoreWebVitals, ...nextTypescript, {
  rules: {
    // TypeScript rules — re-enabled
    "@typescript-eslint/no-explicit-any": "warn",
    "@typescript-eslint/no-unused-vars": ["warn", { argsIgnorePattern: "^_", varsIgnorePattern: "^_" }],
    "@typescript-eslint/no-non-null-assertion": "off", // common in our codebase
    "@typescript-eslint/ban-ts-comment": "warn",

    // React rules — re-enabled
    "react-hooks/exhaustive-deps": "warn",
    "react/no-unescaped-entities": "warn",
    "react/display-name": "off",
    "react/prop-types": "off",

    // Next.js rules — re-enabled
    "@next/next/no-img-element": "warn",
    "@next/next/no-html-link-for-pages": "warn",

    // General JavaScript rules — re-enabled
    "prefer-const": "warn",
    "no-unused-vars": "off", // handled by @typescript-eslint/no-unused-vars
    "no-console": ["warn", { allow: ["warn", "error"] }],
    "no-debugger": "error",
    "no-empty": "warn",
    "no-irregular-whitespace": "warn",
    "no-fallthrough": "error",
    "no-mixed-spaces-and-tabs": "error",
    "no-redeclare": "error",
    "no-undef": "error",
    "no-unreachable": "error",
    "no-useless-escape": "warn",
    "no-case-declarations": "off",
  },
}, {
  ignores: [
    "node_modules/**",
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
    "examples/**",
    "skills/**",
    "mini-services/**",
    "tool-results/**",
    "scripts/**",
  ],
}];

export default eslintConfig;
