# Backend Architecture

## Overview

The backend follows **Clean Architecture** principles with clear separation of concerns, dependency injection, and DTOs for validation and data transfer.

## Architecture Layers

```
src/
├── core/                    # Core infrastructure
│   ├── container.ts         # DI container setup
│   ├── errors/              # Custom error classes
│   ├── interfaces/          # Base interfaces
│   └── middleware/          # Global middleware
├── modules/                 # Feature modules
│   ├── auth/
│   ├── stores/
│   └── products/
└── app.ts                   # Express app setup
```

## Design Patterns & Principles

### 1. Dependency Injection (DI)

Using **tsyringe** for IoC container:

```typescript
// Services are injectable
@injectable()
export class AuthService {
  constructor(
    @inject(AuthRepository) private authRepository: AuthRepository
  ) {}
}

// Resolve dependencies from container
const authService = container.resolve(AuthService);
```

**Benefits:**
- Loose coupling
- Easier testing (mock dependencies)
- Single Responsibility Principle
- Better maintainability

### 2. Repository Pattern

Abstracts data access logic:

```typescript
// Interface defines contract
export interface IAuthRepository {
  findByEmail(email: string): Promise<User | null>;
  createUser(data: CreateUserData): Promise<User>;
}

// Implementation uses Prisma
@injectable()
export class AuthRepository implements IAuthRepository {
  constructor(@inject(PrismaClient) private prisma: PrismaClient) {}
  
  async findByEmail(email: string) {
    return this.prisma.user.findUnique({ where: { email } });
  }
}
```

**Benefits:**
- Easy to swap data sources (e.g., switch from Prisma to TypeORM)
- Testability (mock repositories)
- Centralized query logic

### 3. Data Transfer Objects (DTOs)

Using **class-validator** and **class-transformer**:

```typescript
export class RegisterDto {
  @IsEmail()
  @IsNotEmpty()
  email!: string;

  @IsString()
  @MinLength(6)
  password!: string;

  @IsString()
  @IsNotEmpty()
  fullName!: string;
}
```

**Benefits:**
- Type safety
- Automatic validation
- Clear API contracts
- Input sanitization

### 4. Custom Error Handling

Centralized error classes:

```typescript
// Throw semantic errors
throw new ConflictError('Email already registered');
throw new UnauthorizedError('Invalid credentials');
throw new NotFoundError('Store not found');

// Global error handler middleware
app.use(errorHandler);
```

**Benefits:**
- Consistent error responses
- HTTP status code mapping
- Better debugging
- Cleaner controller code

## Module Structure

Each feature module follows this structure:

```
module/
├── dtos/                    # DTOs for validation
│   └── module.dto.ts
├── interfaces/              # Repository interfaces
│   └── IModuleRepository.ts
├── repositories/            # Data access layer
│   └── ModuleRepository.ts
├── services/                # Business logic layer
│   └── ModuleService.ts
├── controllers/             # HTTP handlers
│   └── ModuleController.ts
└── module.routes.ts         # Route definitions
```

### Flow

```
Request → Route → DTO Validation → Controller → Service → Repository → Database
                                                    ↓
Response ← Error Handler ← Custom Error ← Service Logic
```

## Key Files

### `src/core/container.ts`

Sets up the DI container and registers Prisma:

```typescript
import 'reflect-metadata';
import { container } from 'tsyringe';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
container.registerInstance(PrismaClient, prisma);
```

### `src/core/middleware/validateDto.ts`

DTO validation middleware:

```typescript
export const validateDto = (dtoClass: any) => {
  return async (req, res, next) => {
    const dtoInstance = plainToInstance(dtoClass, req.body);
    const errors = await validate(dtoInstance);
    
    if (errors.length > 0) {
      throw new ValidationError('Validation failed', formattedErrors);
    }
    
    req.body = dtoInstance;
    next();
  };
};
```

### `src/core/middleware/errorHandler.ts`

Global error handler:

```typescript
export const errorHandler = (err, req, res, next) => {
  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      success: false,
      message: err.message
    });
  }
  
  // Unexpected errors
  console.error('Unexpected error:', err);
  return res.status(500).json({
    success: false,
    message: 'Internal server error'
  });
};
```

## Example: Auth Module

### 1. DTO (`dtos/auth.dto.ts`)

```typescript
export class RegisterDto {
  @IsEmail()
  email!: string;

  @MinLength(6)
  password!: string;

  @IsNotEmpty()
  fullName!: string;
}
```

### 2. Repository Interface (`interfaces/IAuthRepository.ts`)

```typescript
export interface IAuthRepository {
  findByEmail(email: string): Promise<User | null>;
  createUser(data: CreateUserData): Promise<User>;
}
```

### 3. Repository (`repositories/AuthRepository.ts`)

```typescript
@injectable()
export class AuthRepository implements IAuthRepository {
  constructor(@inject(PrismaClient) private prisma: PrismaClient) {}

  async findByEmail(email: string) {
    return this.prisma.user.findUnique({ where: { email } });
  }
}
```

### 4. Service (`services/AuthService.ts`)

```typescript
@injectable()
export class AuthService {
  constructor(@inject(AuthRepository) private authRepository: AuthRepository) {}

  async register(dto: RegisterDto) {
    const existing = await this.authRepository.findByEmail(dto.email);
    if (existing) throw new ConflictError('Email already registered');
    
    const passwordHash = await bcrypt.hash(dto.password, 10);
    const user = await this.authRepository.createUser({ ...dto, passwordHash });
    
    return { user, token: this.generateToken(user) };
  }
}
```

### 5. Controller (`controllers/AuthController.ts`)

```typescript
export class AuthController {
  async register(req, res, next) {
    try {
      const authService = container.resolve(AuthService);
      const result = await authService.register(req.body);
      res.status(201).json({ success: true, data: result });
    } catch (error) {
      next(error);
    }
  }
}
```

### 6. Routes (`auth.routes.ts`)

```typescript
const router = Router();
const authController = new AuthController();

router.post('/register', 
  validateDto(RegisterDto), 
  (req, res, next) => authController.register(req, res, next)
);
```

## Testing Strategy

### Unit Tests

Mock dependencies using DI:

```typescript
const mockRepository = {
  findByEmail: jest.fn(),
  createUser: jest.fn()
};

container.registerInstance(AuthRepository, mockRepository);
const service = container.resolve(AuthService);

// Test service in isolation
await service.register(mockDto);
expect(mockRepository.findByEmail).toHaveBeenCalled();
```

### Integration Tests

Use test database with Prisma:

```typescript
beforeAll(async () => {
  await prisma.$connect();
  await prisma.$executeRaw`TRUNCATE TABLE users CASCADE`;
});

afterAll(async () => {
  await prisma.$disconnect();
});
```

## Best Practices

### ✅ DO

- Use DTOs for all input validation
- Throw semantic custom errors (ConflictError, NotFoundError)
- Inject dependencies through constructor
- Keep services focused on business logic
- Use repositories for all database access
- Return consistent response format: `{ success: true, data: ... }`

### ❌ DON'T

- Access Prisma directly in controllers
- Use `any` type
- Catch errors in controllers (let middleware handle)
- Mix business logic with HTTP concerns
- Hardcode status codes (use custom errors)

## Migration Guide (Old → New)

### Before (Old Code)

```typescript
// Controller directly using service instance
const authService = new AuthService();

export async function register(req, res) {
  try {
    const result = await authService.register(req.body);
    res.status(201).json(result);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}
```

### After (New Code)

```typescript
// Controller resolves from DI container
export class AuthController {
  async register(req, res, next) {
    try {
      const authService = container.resolve(AuthService);
      const result = await authService.register(req.body);
      res.status(201).json({ success: true, data: result });
    } catch (error) {
      next(error); // Let error handler middleware handle it
    }
  }
}

// Route with DTO validation
router.post('/register', 
  validateDto(RegisterDto),
  (req, res, next) => controller.register(req, res, next)
);
```

## Future Improvements

1. **Authentication Middleware**: Extract JWT verification to reusable middleware
2. **CQRS Pattern**: Separate read/write operations for complex domains
3. **Event-Driven**: Use event emitters for cross-module communication
4. **API Versioning**: Support `/api/v1/`, `/api/v2/`
5. **Request Logging**: Structured logging with Winston/Pino
6. **Rate Limiting**: Add rate limiting middleware
7. **API Documentation**: Auto-generate OpenAPI/Swagger docs from DTOs

## Resources

- [Clean Architecture](https://blog.cleancoder.com/uncle-bob/2012/08/13/the-clean-architecture.html)
- [tsyringe Documentation](https://github.com/microsoft/tsyringe)
- [class-validator](https://github.com/typestack/class-validator)
- [Repository Pattern](https://martinfowler.com/eaaCatalog/repository.html)
