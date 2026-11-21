# Run `just` to list tasks. Everything also works with plain npm.
default:
    @just --list

# Install dependencies from the lockfile
install:
    npm ci

# Regenerate tokens/tokens.css from tokens/tokens.json
tokens:
    npm run tokens

# Dev server with hot reload
dev:
    npm run dev

# Production build into dist/
build:
    npm run build

# Everything CI runs
check: build
    npm run check

# Serve the production build
preview: build
    npm run preview

# Create the Cloudflare Pages project (one-time, needs the founder's account)
pages-create:
    npx wrangler pages project create brand --production-branch=main
