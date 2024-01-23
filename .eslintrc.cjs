module.exports = {
    root: true,
    env: {browser: true, es2020: true},
    extends: [
        'eslint:recommended',
        'plugin:@typescript-eslint/recommended',
        'plugin:react-hooks/recommended',
    ],
    ignorePatterns: ['dist', '.eslintrc.cjs'],
    parser: '@typescript-eslint/parser',
    plugins: ['react-refresh'],
    "rules": {
        // Add your own rules here to override ones from the extended configs.
        "semi": 2,
        "react/display-name": "off",
        "jsx-a11y/no-autofocus": [
            2,
            {
                "ignoreNonDOM": true
            }
        ],
        "react/jsx-uses-react": "off",
        "react/react-in-jsx-scope": "off",
        "import/no-named-as-default": 0,
        "import/no-named-as-default-member": 0,
        "import/named": 0,
        "react/prop-types": "off"
    }
}
