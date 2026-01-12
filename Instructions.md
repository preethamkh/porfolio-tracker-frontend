# Instructions to create the entire project

# Create new folder

mkdir portfolio-tracker-frontend
cd portfolio-tracker-frontend

# Initialize git

git init

# Initialize npm (creates package.json)

npm init -y

# Copy the package.json, then:

npm install

# Install shadcn/ui CLI

npm install -D @shadcn/ui

# Copy these artifacts:

- vite.config.ts
- tsconfig.json
- tsconfig.node.json
- tailwind.config.js
- postcss.config.js
- .env.example

# Copy example to local

cp .env.example .env.local

# Edit .env.local with your values

# (During development, defaults should work)

# Create all folders

linux/mac:
mkdir -p src/{api/{endpoints,hooks},components/{ui,auth,holdings,layout,common},contexts,stores,pages/{auth,dashboard},types,utils,lib}

windows (powershell):
mkdir src/api/endpoints, src/api/hooks, src/components/ui, src/components/auth, src/components/holdings, src/components/layout, src/components/common, src/contexts, src/stores, src/pages/auth, src/pages/dashboard, src/types, src/utils, src/lib

# Create files

src/main.tsx
src/App.tsx
src/index.css
src/vite-env.d.ts

# Initialize shadcn (interactive - accept defaults)

npx shadcn@latest init

# When prompted:

# - TypeScript: Yes

# - Style: Default

# - Base color: Slate

# - CSS variables: Yes

# - Tailwind config: tailwind.config.js

# - Components path: @/components

# - Utils path: @/lib/utils

# Add the components we'll need:

npx shadcn@latest add button
npx shadcn@latest add input
npx shadcn@latest add table
npx shadcn@latest add dialog
npx shadcn@latest add dropdown-menu
npx shadcn@latest add select
npx shadcn@latest add tabs
npx shadcn@latest add label
npx shadcn@latest add toast

# Create Entry Point files

App.tsx
main.jsx
index.html
vite-end.d.ts
