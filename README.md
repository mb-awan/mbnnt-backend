# 🚀 MBNNT TypeScript backend

## 🛠️ Getting Started

### Step 1: ⚙️ Environment Configuration

- Create `.env`: Copy `.env.template` to `.env`
- Update `.env`: Fill in necessary environment variables
- Install the dependencies `npm install`

### Step 2: 🏃‍♂️ Running the Project

- Seed Roles and Permissions (for development): `npm run seed:dev`
- Seed Roles and Permissions (for production): `npm run seed:prod`
- Development Mode: `npm run dev`
- Building: `npm run build`
- Production Mode: Set `.env` to `NODE_ENV="production"` then `npm run build && npm run start`

## 📁 Project Structure

```
└── 📁mbbnt-backend
    └── .env
    └── .env.development
    └── .env.example
    └── .env.test
    └── .eslintignore
    └── .eslintrc.json
    └── .gitignore
    └── 📁.husky
        └── commit-msg
        └── pre-commit
        └── pre-push
        └── 📁_
            └── .gitignore
            └── applypatch-msg
            └── commit-msg
            └── h
            └── husky.sh
            └── post-applypatch
            └── post-checkout
            └── post-commit
            └── post-merge
            └── post-rewrite
            └── pre-applypatch
            └── pre-auto-gc
            └── pre-commit
            └── pre-push
            └── pre-rebase
            └── prepare-commit-msg
    └── .nvmrc
    └── .prettierignore
    └── .prettierrc
    └── 📁bin
        └── pre-install
    └── CHANGELOG.md
    └── CODE_OF_CONDUCT.md
    └── commitlint.config.ts
    └── Dockerfile
    └── LICENSE
    └── package-lock.json
    └── package.json
    └── README.md
    └── release.config.cjs
    └── renovate.json
    └── 📁src
        └── 📁api
            └── 📁admin
                └── adminRoute.ts
            └── 📁auth
                └── authRouter.ts
                └── 📁__test__
                    └── .gitkeep
            └── 📁healthCheck
                └── healthCheckRouter.ts
                └── 📁__tests__
                    └── healthCheckRouter.test.ts
            └── 📁user
                └── userRoutes.ts
        └── 📁api-docs
            └── openAPIDocumentGenerator.ts
            └── openAPIResponseBuilders.ts
            └── openAPIRouter.ts
            └── 📁__tests__
                └── openAPIRouter.test.ts
        └── 📁common
            └── 📁constants
                └── common.ts
                └── enums.ts
            └── 📁controllers
                └── 📁admin
                    └── index.ts
                └── 📁auth
                    └── index.ts
                └── 📁user
                    └── index.ts
            └── 📁middleware
                └── 📁admin
                    └── index.ts
                └── 📁auth
                    └── index.ts
                └── errorHandler.ts
                └── rateLimiter.ts
                └── requestLogger.ts
                └── 📁user
                    └── index.ts
                    └── uploadProfilePic.ts
                    └── verification.ts
            └── 📁models
                └── permissions.ts
                └── roles.ts
                └── serviceResponse.ts
                └── user.ts
            └── 📁types
                └── users.ts
            └── 📁utils
                └── auth.ts
                └── commonValidation.ts
                └── db.ts
                └── envConfig.ts
                └── generateOTP.ts
                └── httpHandlers.ts
            └── 📁__tests__
                └── errorHandler.test.ts
                └── requestLogger.test.ts
        └── index.ts
        └── 📁seeders
            └── data.ts
            └── index.ts
            └── seedPermissions.ts
            └── seedRoles.ts
            └── seedUsers.ts
        └── server.ts
    └── tsconfig.json
    └── tsup.config.ts
    └── vite.config.mts
```
