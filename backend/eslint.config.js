import globals from "globals";
import js from "@eslint/js";
import tseslintParser from "@typescript-eslint/parser";
import tseslintPlugin from "@typescript-eslint/eslint-plugin";
import eslintConfigPrettier from "eslint-config-prettier";

export default [
    js.configs.recommended,

    {
        files: ["src/**/*.ts"],
        plugins: {
            "@typescript-eslint": tseslintPlugin,
        },
        languageOptions: {
            parser: tseslintParser,
            globals: {
                ...globals.node,
            },
        },
        rules: {
            ...tseslintPlugin.configs.recommended.rules,
            "no-unused-vars": "off",
            "@typescript-eslint/no-unused-vars": "warn",
            "@typescript-eslint/no-explicit-any": "warn",
        },
    },
    eslintConfigPrettier,
];