#!/bin/bash
# setup_monorepo.sh
echo "===== 1. Workspaces setting ====="

echo "Creating -> app/backend/package.json ..."
(cd app/backend && npm init -y)

echo "Creating -> app/frontend/package.json ..."
(cd app/frontend && npm init -y)

echo "-> packages/common-types/package.json is already exists."


echo "\n===== 2. tsconfig.json config ====="

echo "-> Creating root tsconfig.base.json ..."
cat << EOF > tsconfig.base.json
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "CommonJS",
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "esModuleInterop": true,
    "forceConsistentCasingInFileNames": true,
    "strict": true,
    "skipLibCheck": true,
    "moduleResolution": "node",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "baseUrl": "."
  }
}
EOF


echo "Creating -> packages/common-types/tsconfig.json ..."
cat << EOF > packages/common-types/tsconfig.json
{
  "extends": "../../tsconfig.base.json",
  "compilerOptions": {
    "module": "CommonJS",
    "outDir": "dist",
    "rootDir": "src",
    "composite": true,
    "declaration": true,
    "declarationMap": true
  },
  "include": ["src"]
}
EOF

echo "Creating -> app/backend/tsconfig.json ..."
cat << EOF > app/backend/tsconfig.json
{
  "extends": "../../tsconfig.base.json",
  "compilerOptions": {
    "module": "CommonJS",
    "outDir": "dist",
    "rootDir": ".",
    "composite": true
  },
  "include": ["**/*.ts"],
  "exclude": ["node_modules", "dist"],
  "references": [
    { "path": "../../packages/common-types" }
  ]
}
EOF

echo "Creating -> app/frontend/tsconfig.json ..."
cat << EOF > app/frontend/tsconfig.json
{
  "extends": "../../tsconfig.base.json",
  "compilerOptions": {
    "module": "ESNext",
    "target": "ES5",
    "jsx": "react-jsx",
    "lib": ["DOM", "DOM.Iterable", "ESNext"],
    "allowJs": true,
    "noEmit": true,
    "composite": true
  },
  "include": ["**/*.ts", "**/*.tsx"],
  "exclude": ["node_modules"],
  "references": [
    { "path": "../../packages/common-types" }
  ]
}
EOF

echo "\n===== Setting complete ====="
echo "Please manually add/verify 'private: true' and 'workspaces' fields in the root chatapp/package.json."
echo "For example: \"workspaces\": [\"app/frontend\", \"app/backend\", \"packages/*\"]"