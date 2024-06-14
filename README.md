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
│
├── api-docs
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
│   │   ├── errorHandler.ts
│   │   ├── rateLimiter.ts
│   │   └── requestLogger.ts
│   ├── models
│   │   └── serviceResponse.ts
│   └── utils
│       ├── commonValidation.ts
│       ├── envConfig.ts
│       └── httpHandlers.ts
├── index.ts
└── server.ts
```
