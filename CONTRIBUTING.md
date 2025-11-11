# Contributing to Fluent Schedule

Thank you for your interest in contributing to Fluent Schedule! This document provides guidelines and information for contributors.

## Development Setup

### Prerequisites

- Node.js 16 or later (LTS version recommended)
- npm (comes with Node.js)
- Git

### Getting Started

1. Fork the repository on GitHub
2. Clone your fork locally:
   ```bash
   git clone https://github.com/your-username/fluent_schedule_js.git
   cd fluent_schedule_js
   ```

3. Add the upstream remote:
   ```bash
   git remote add upstream https://github.com/Jacques-Murray/fluent_schedule_js.git
   ```

4. Install dependencies:
   ```bash
   npm install
   ```

5. Create a development branch:
   ```bash
   git checkout -b feature/your-feature-name
   ```

### Building and Testing

Build the project:
```bash
npm run build
```

Run tests:
```bash
npm test
```

Run tests with coverage:
```bash
npm test -- --coverage
```

Run a specific example with TypeScript directly (using tsx):
```bash
npx tsx examples/simple.ts
```

## Code Style

This project follows standard TypeScript conventions:

- Use TypeScript's strict mode
- Follow consistent naming conventions (camelCase for variables/functions, PascalCase for classes)
- Write clear, self-documenting code
- Add JSDoc comments for public APIs

The project uses:
- **TypeScript** for type safety
- **Jest** for testing
- **ESLint/Prettier** (if configured) for code formatting

## Testing

- All new features must include comprehensive tests
- Tests should cover both happy path and error cases
- Use `npm test` to run the full test suite
- Tests are written using Jest

### Test Coverage

Aim for high test coverage. Key areas to test:
- Job builder methods and validation
- Scheduler functionality
- Error handling
- Time calculations
- Edge cases (invalid times, missing tasks, etc.)

## Pull Request Process

1. Ensure all tests pass (`npm test`)
2. Build the project successfully (`npm run build`)
3. Update documentation if needed
4. Write clear commit messages
5. Create a pull request with a descriptive title
6. Wait for review and address feedback

### Commit Messages

Use conventional commit format:
- `feat:` for new features
- `fix:` for bug fixes
- `docs:` for documentation changes
- `test:` for test additions/changes
- `refactor:` for code refactoring
- `chore:` for maintenance tasks

Example: `feat: add support for monthly scheduling`

## Architecture Overview

### Core Components

- **`Job`**: Builder pattern for creating scheduled tasks
- **`Scheduler`**: Runtime that executes jobs at their scheduled times
- **Time Unit Helpers**: Functions (`seconds`, `minutes`, `hours`) for human-readable time durations
- **Error Types**: Typed errors for configuration issues (`InvalidTimeFormatError`, `TaskNotSetError`)

### Key Design Decisions

- **Builder Pattern**: Jobs use a fluent builder for readable configuration
- **Single Threaded**: Scheduler runs using Node.js event loop and timers
- **Error Collection**: Invalid configurations are caught early with clear error messages
- **Type Safety**: Full TypeScript support with strict typing
- **Async Support**: Jobs can be synchronous or asynchronous functions

## Adding New Features

### Scheduling Features

When adding new scheduling capabilities:

1. Extend the `ScheduleRules` type in `job.ts`
2. Add builder methods to `Job` class
3. Implement time calculation logic in `calculateNextRun`
4. Add comprehensive tests
5. Update documentation and examples

### Error Types

New error conditions should:
- Extend the base `SchedulerError` class in `errors.ts`
- Include descriptive error messages
- Have appropriate error type checking
- Be tested for proper error propagation

## Documentation

- All public APIs should have JSDoc comments
- Include code examples where helpful
- Keep the README updated with new features
- Update TypeScript type definitions when APIs change

## Performance Considerations

- Keep the scheduler loop efficient
- Avoid blocking operations in job callbacks
- Consider memory usage for long-running applications
- Profile performance-critical sections with Node.js profiling tools

## Code Review Checklist

Before submitting a PR, ensure:

- [ ] Code compiles without errors (`npm run build`)
- [ ] All tests pass (`npm test`)
- [ ] Code follows TypeScript best practices
- [ ] Documentation is updated
- [ ] New features include tests
- [ ] Commit messages follow conventions
- [ ] Breaking changes are clearly documented

## Getting Help

- Open an issue for bugs or feature requests
- Join discussions in existing issues
- Check the documentation for API details

Thank you for contributing to Fluent Schedule! 🎉
