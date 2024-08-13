# 🚀 MBNNT TypeScript backend

## 🛠️ Getting Started

### Step 1: ⚙️ Environment Configuration

- Create `.env.development`: Copy `.env.example` to `.env.development`
- Update `.env.development`: Fill in necessary environment variables
- Run `bin/pre-install` in a bash terminal like git bash, to install the recommended node version automatically, if it not work properly then make sure to install the node version mentioned in .nvmrc file
- Install the dependencies `npm install`

### Step 2: 🏃‍♂️ Running the Project

#### Without Docker

- Seed Roles and Permissions (for development): `npm run seed:dev`
- Seed Roles and Permissions (for production): `npm run seed:prod`
- Development Mode: `npm run dev`
- Building: `npm run build`
- Production Mode: Set `.env.production` according to env.example and run `npm run build && npm run start`

#### Using Docker

- You must have `docker` and `docker-compose` installed and your docker engine must be started. `Docker Desktop App` install both automatically and if you start it, it automatically starts the docker engine.
- development: Create `.env.development.docker`: Copy `.env.example` to `.env.development.docker`
- development: `npm run seed-docker:dev` to seed data into dockerized db in development.
- development: `npm run start-docker:dev` to stop application docker container in development.
- development: `npm run stop-docker:dev` to stop application docker container in development.
- production: Create `.env.production.docker`: Copy `.env.example` to `.env.production.docker`
- production: `npm run seed-docker:prod` to seed data into dockerized db in production.
- production: `npm run start-docker:prod` to stop application docker container in production.
- production: `npm run stop-docker:prod` to stop application docker container in production.

## 📁 Project Structure

```
└── 📁mbbnt-backend
    └── .dockerignore
    └── .env.development
    └── .env.development.docker
    └── .env.example
    └── .env.production
    └── .env.production.docker
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
    └── docker-compose.dev.yml
    └── Dockerfile.dev
    └── LICENSE
    └── package-lock.json
    └── package.json
    └── 📁public
        ├── images
    └── README.md
    └── release.config.cjs
    └── renovate.json
    └── 📁src
        └── 📁api
            └── 📁admin
                └── adminDocs.ts
                └── adminRoute.ts
                └── adminSchemas.ts
            └── 📁auth
                └── authDocs.ts
                └── authRouter.ts
                └── authSchemas.ts
                └── 📁__test__
                    └── index.test.ts
                    └── payload.ts
            └── 📁blogCategory
                └── blogCategory.ts
                └── blogCategoryDocs.ts
                └── blogCategorySchemas.ts
            └── 📁blogs
                └── blogs.ts
                └── blogSchemas.ts
                └── blogsDocs.ts
            └── 📁contactUs
                └── contactUs.ts
                └── contactUsDocs.ts
                └── contactUsSchemas.ts
            └── 📁faq
                └── faq.ts
                └── faqDocs.ts
                └── faqSchema.ts
            └── 📁feedback
                └── feedback.ts
                └── feedbackDocs.ts
                └── feedbackSchema.ts
            └── 📁healthCheck
                └── healthCheckRouter.ts
            └── 📁newsLetter
                └── newsLetterDocs.ts
                └── newsLetterRoutes.ts
                └── newsLetterSchemas.ts
                └── 📁__test__
                    └── index.test.ts
                    └── payload.ts
            └── 📁notification
                └── notificationDocs.ts
                └── notificationRoutes.ts
                └── notificationSchema.ts
            └── 📁permission
                └── permissionDocs.ts
                └── permissionSchema.ts
                └── premissionroute.ts
            └── 📁role
                └── roleDocs.ts
                └── roleroute.ts
                └── roleSchemas.ts
            └── 📁user
                └── userDocs.ts
                └── userRoutes.ts
                └── userSchemas.ts
        └── 📁api-docs
            └── openAPIDocumentGenerator.ts
            └── openAPIResponseBuilders.ts
            └── openAPIRouter.ts
        └── 📁common
            └── 📁constants
                └── common.ts
                └── enums.ts
            └── 📁controllers
                └── 📁admin
                    └── index.ts
                └── 📁auth
                    └── index.ts
                └── 📁blogCategory
                    └── index.ts
                └── 📁blogs
                    └── index.ts
                └── 📁contactUs
                    └── index.ts
                └── 📁faq
                    └── index.ts
                └── 📁feedback
                    └── index.ts
                └── 📁newsLetter
                    └── index.ts
                └── 📁notification
                    └── index.ts
                └── 📁permission
                    └── index.ts
                └── 📁role
                    └── index.ts
                └── 📁user
                    └── index.ts
            └── 📁middleware
                └── 📁admin
                    └── index.ts
                └── 📁auth
                    └── index.ts
                └── 📁blogCategory
                    └── index.ts
                └── 📁blogs
                    └── index.ts
                └── 📁contactUs
                    └── index.ts
                └── errorHandler.ts
                └── 📁faq
                    └── index.ts
                └── 📁feedback
                    └── index.ts
                └── 📁newsLetter
                    └── index.ts
                └── 📁permission
                    └── index.ts
                └── rateLimiter.ts
                └── requestLogger.ts
                └── 📁role
                    └── index.ts
                └── 📁user
                    └── index.ts
                    └── uploadProfilePic.ts
                    └── verification.ts
            └── 📁models
                └── blogCategory.ts
                └── blogs.ts
                └── contactUs.ts
                └── faq.ts
                └── feedback.ts
                └── newsLetter.ts
                └── notification.ts
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
                └── response.ts
                └── uploadFile.ts
        └── custom.d.ts
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
