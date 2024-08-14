# 🚀 MBNNT TypeScript Backend

## 🛠️ Getting Started

### Step 1: ⚙️ Environment Configuration

- 📄 **Create `.env.development`:** Copy `.env.example` to `.env.development`.
- 🔧 **Update `.env.development`:** Fill in necessary environment variables.
- 🛠️ **Node Version Setup:**
  - Run `bin/pre-install` in a bash terminal (e.g., Git Bash) to automatically install the recommended Node version.
  - If the script doesn't work, manually install the Node version specified in the `.nvmrc` file.
- 📦 **Install Dependencies:** Run `npm install` to install all required packages.

---

### Step 2: 🏃‍♂️ Running the Project

#### Without Docker

- 🌱 **Seed Roles and Permissions:**
  - For development: `npm run seed:dev`
  - For production: `npm run seed:prod`
- 🛠️ **Development Mode:** Start the project in development mode with `npm run dev`.
- 🏗️ **Building:** Build the project using `npm run build`.
- 🚀 **Production Mode:**
  - Set up `.env.production` according to `.env.example`.
  - Run the following commands to build and start the project:
    ```bash
    npm run build && npm run start
    ```

#### Using Docker

- 🐳 **Prerequisites:**
  - Ensure `docker` and `docker-compose` are installed.
  - Start the Docker engine using the **Docker Desktop App** (which installs both Docker and Docker Compose automatically).
- 🛠️ **Development Workflow:**

  - **Create `.env.development.docker`:** Copy `.env.example` to `.env.development.docker`.
  - **Start Application:** To start the Docker container in development mode:
    ```bash
    npm run start-docker:dev
    ```
  - **Install Dependencies:** If dependencies aren’t installed automatically, run:
    ```bash
    npm run install-dependencies-docker:dev
    ```
  - **Seed Database:** To seed the Dockerized database in development:
    ```bash
    npm run seed-docker:dev
    ```
  - **Stopping Containers Without Removal:** To stop containers without removing them, use:

    - **Windows/Linux:** `Ctrl + C`
    - **Mac:** `CMD + C`

  - **Stop Application (remove the container as well):** To stop the Docker container in development
    ```bash
    npm run stop-docker:dev
    ```

- 🚀 **Production Workflow:**

  - **Create `.env.production.docker`:** Copy `.env.example` to `.env.production.docker`.
  - **Start Application:** To start the Docker container in production mode:
    ```bash
    npm run start-docker:prod
    ```
  - **Install Dependencies:** If dependencies aren’t installed automatically, run:
    ```bash
    npm run install-dependencies-docker:prod
    ```
  - **Seed Database:** To seed the Dockerized database in production:
    ```bash
    npm run seed-docker:prod
    ```
  - **Stopping Containers Without Removal:** To stop containers without removing them, use:

    - **Windows/Linux:** `Ctrl + C`
    - **Mac:** `CMD + C`

  - **Stop Application (remove the container as well):** To stop the Docker container in development
    ```bash
    npm run stop-docker:prod
    ```

---

## 🔄 Additional Commands

- 🚧 **Rebuild & Restart Containers:** `docker-compose up --build`
- 🗑️ **Remove Containers & Volumes:** `docker-compose down -v`

## 💡 Tips

- 🛑 **Stopping Containers:** You can stop containers without removing them using `Ctrl + C` or `CMD + C` in the terminal.

## 📄 License

This project is licensed under the [MIT License](LICENSE).

## 📁 Project Structure

```
└── 📁mbbnt-backend
    └── 📁.husky
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
        └── commit-msg
        └── pre-commit
        └── pre-push
    └── 📁bin
        └── pre-install
    └── 📁public
        ├── images
    └── 📁src
        └── 📁api
            └── 📁admin
                └── adminDocs.ts
                └── adminRoute.ts
                └── adminSchemas.ts
            └── 📁auth
                └── 📁__test__
                    └── index.test.ts
                    └── payload.ts
                └── authDocs.ts
                └── authRouter.ts
                └── authSchemas.ts
            └── 📁blogCategory
                └── blogCategoryDocs.ts
                └── blogCategoryRoute.ts
                └── blogCategorySchemas.ts
            └── 📁blogs
                └── blogSchemas.ts
                └── blogsDocs.ts
                └── blogsRoute.ts
            └── 📁contactUs
                └── contactUsDocs.ts
                └── contactUsRoute.ts
                └── contactUsSchemas.ts
            └── 📁email
                └── emailDocs.ts
                └── emailRoute.ts
                └── emailSchema.ts
            └── 📁faq
                └── faqDocs.ts
                └── faqRoute.ts
                └── faqSchema.ts
            └── 📁feedback
                └── feedbackDocs.ts
                └── feedbackRoute.ts
                └── feedbackSchema.ts
            └── 📁healthCheck
                └── healthCheckRouter.ts
            └── 📁newsLetter
                └── 📁__test__
                    └── index.test.ts
                    └── payload.ts
                └── newsLetterDocs.ts
                └── newsLetterRoutes.ts
                └── newsLetterSchemas.ts
            └── 📁notification
                └── notificationDocs.ts
                └── notificationRoutes.ts
                └── notificationSchema.ts
            └── 📁permission
                └── permissionDocs.ts
                └── permissionSchema.ts
                └── premissionRoute.ts
            └── 📁plans
                └── plansDocs.ts
                └── plansRoutes.ts
                └── plansSchema.ts
            └── 📁role
                └── roleDocs.ts
                └── roleRoute.ts
                └── roleSchemas.ts
            └── 📁siteInfo
                └── siteInfoDocs.ts
                └── siteInfoRoute.ts
                └── siteInfoSchema.ts
            └── 📁subscription
                └── subscriptionDocs.ts
                └── subscriptionRoute.ts
                └── subscriptionSchema.ts
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
                └── 📁email
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
                └── 📁plans
                    └── index.ts
                └── 📁role
                    └── index.ts
                └── 📁siteInfo
                    └── index.ts
                └── 📁subscription
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
                └── 📁email
                    └── index.ts
                └── 📁faq
                    └── index.ts
                └── 📁feedback
                    └── index.ts
                └── 📁newsLetter
                    └── index.ts
                └── 📁permission
                    └── index.ts
                └── 📁plans
                    └── index.ts
                └── 📁role
                    └── index.ts
                └── 📁siteInfo
                    └── index.ts
                └── 📁subscription
                    └── index.ts
                └── 📁user
                    └── index.ts
                └── errorHandler.ts
                └── rateLimiter.ts
                └── requestLogger.ts
            └── 📁models
                └── blogCategory.ts
                └── blogs.ts
                └── contactUs.ts
                └── email.ts
                └── faq.ts
                └── feedback.ts
                └── newsLetter.ts
                └── notification.ts
                └── permissions.ts
                └── plans.ts
                └── roles.ts
                └── serviceResponse.ts
                └── siteInfo.ts
                └── subscription.ts
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
                └── redis.ts
                └── response.ts
                └── uploadFile.ts
        └── 📁seeders
            └── data.ts
            └── index.ts
            └── planData.ts
            └── seedPermissions.ts
            └── seedPlan.ts
            └── seedRoles.ts
            └── seedSubscriptions.ts
            └── seedUsers.ts
            └── subscriptionData.ts
        └── custom.d.ts
        └── index.ts
        └── server.ts
    └── .dockerignore
    └── .env.development
    └── .env.development.docker
    └── .env.example
    └── .env.production
    └── .env.production.docker
    └── .env.staging
    └── .env.test
    └── .eslintignore
    └── .eslintrc.json
    └── .gitignore
    └── .nvmrc
    └── .prettierignore
    └── .prettierrc
    └── CHANGELOG.md
    └── CODE_OF_CONDUCT.md
    └── commitlint.config.ts
    └── docker-compose.dev.yml
    └── Dockerfile.dev
    └── Dockerfile.prod
    └── LICENSE
    └── package-lock.json
    └── package.json
    └── README.md
    └── release.config.cjs
    └── renovate.json
    └── tsconfig.json
    └── tsup.config.ts
    └── vite.config.mts
```
