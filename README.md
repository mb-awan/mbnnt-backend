# 🚀 MBNNT TypeScript backend

## 🛠️ Getting Started

### Step 1: ⚙️ Environment Configuration

- Create `.env`: Copy `.env.template` to `.env`
- Update `.env`: Fill in necessary environment variables
- Install the dependencies `npm install`

### Step 2: 🏃‍♂️ Running the Project

- Development Mode: `npm run dev`
- Building: `npm run build`
- Production Mode: Set `.env` to `NODE_ENV="production"` then `npm run build && npm run start`

## 📁 Project Structure

```
.
├── api
│   ├── healthCheck
│      ├── __tests__
│      │   └── healthCheckRouter.test.ts
│      └── healthCheckRouter.ts
│   ├── admin
|      |── adminRoute.ts
|   ├── user
|       |── userRoute.ts
|   ├── auth
├       |── authRoute.ts
│   ├── __tests__
│   │   └── openAPIRouter.test.ts
│   ├── openAPIDocumentGenerator.ts
│   ├── openAPIResponseBuilders.ts
│   └── openAPIRouter.ts
├── common
│   ├── __tests__
│   │   ├── errorHandler.test.ts
│   │   └── requestLogger.test.ts
│   ├── middleware
│   │   ├── admin
│   │   |   ├── index.ts
│   │   ├── auth
│   │   |   ├── index.ts
│   │   └── user
│   │       ├── index.ts
│   │   ├── errorHandler.ts
│   │   ├── rateLimiter.ts
│   │   └── requestLogger.ts
│   ├── constrollers
│   │   ├── admin
│   │   |   ├── index.ts
│   │   ├── auth
│   │   |   ├── index.ts
│   │   └── user
│   │       ├── index.ts
│   ├── models
│   │   └── serviceResponse.ts
│   │   └── user.ts
│   |── utils
│   |    ├── commonValidation.ts
│   |    ├── envConfig.ts
│   |    └── httpHandlers.ts
│   |    └── db.ts
│   |    └── auth.ts
│   ├── constants
│   │   └── common.ts
│   │   └── enum.ts
├── index.ts
└── server.ts
```
