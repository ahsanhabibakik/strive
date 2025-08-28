# Testing Guide

This guide explains how to write and run tests in this project. We use Jest as our testing framework along with React Testing Library for component testing and Playwright for end-to-end testing.

## Table of Contents

- [Setup](#setup)
- [Running Tests](#running-tests)
- [Writing Tests](#writing-tests)
- [Test Types](#test-types)
- [Best Practices](#best-practices)
- [Mocking](#mocking)

## Setup

The project is already configured with:

- Jest for unit and integration testing
- React Testing Library for component testing
- Playwright for end-to-end testing
- MSW (Mock Service Worker) for API mocking

## Running Tests

```bash
# Run all tests
pnpm test

# Run tests in watch mode (recommended during development)
pnpm test:watch

# Run tests with coverage report
pnpm test:coverage

# Run end-to-end tests
pnpm test:e2e

# Run end-to-end tests with UI
pnpm test:e2e:ui
```

## Writing Tests

### Component Tests

Here's an example of a component test:

```typescript
import { render, screen, fireEvent } from '@testing-library/react';
import { Button } from './Button';

describe('Button Component', () => {
  it('renders button with text', () => {
    render(<Button>Click me</Button>);
    expect(screen.getByText('Click me')).toBeInTheDocument();
  });

  it('calls onClick handler when clicked', () => {
    const handleClick = jest.fn();
    render(<Button onClick={handleClick}>Click me</Button>);
    
    fireEvent.click(screen.getByText('Click me'));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });
});
```

### API Tests

For testing API routes, use MSW to mock the responses:

```typescript
import { http } from 'msw';
import { server } from '@/mocks/server';

describe('API Tests', () => {
  it('handles successful response', async () => {
    server.use(
      http.get('/api/example', () => {
        return HttpResponse.json({ data: 'test' });
      })
    );

    const response = await fetch('/api/example');
    const data = await response.json();
    
    expect(data).toEqual({ data: 'test' });
  });
});
```

## Test Types

### 1. Unit Tests

- Test individual functions and components in isolation
- Located next to the code they test (e.g., `Button.test.tsx` next to `Button.tsx`)
- Focus on single piece of functionality

### 2. Integration Tests

- Test multiple components or functions working together
- Located in `__tests__` directories
- Test features end-to-end within the frontend

### 3. E2E Tests

- Test complete user flows
- Located in `e2e` directory
- Use Playwright to simulate real user interactions

## Best Practices

1. **Naming Tests**
   - Use descriptive test names
   - Follow the pattern: "should [expected behavior] when [condition]"

2. **File Organization**
   - Keep test files next to the code they test
   - Use `.test.ts` or `.test.tsx` extension
   - Group related tests using `describe` blocks

3. **Testing Principles**
   - Test behavior, not implementation
   - Write tests that resemble how users use your software
   - Don't test implementation details
   - Keep tests simple and focused

4. **Component Testing**
   - Use React Testing Library queries in this order:
     1. getByRole
     2. getByLabelText
     3. getByPlaceholderText
     4. getByText
     5. getByDisplayValue
   - Avoid using `getByTestId` unless necessary

5. **Coverage**
   - Aim for 80% coverage
   - Focus on critical paths
   - Don't chase 100% coverage

## Mocking

### 1. API Mocking

Use MSW to mock API calls:

```typescript
import { http } from 'msw';

const handlers = [
  http.get('/api/users', () => {
    return HttpResponse.json([
      { id: 1, name: 'User 1' },
      { id: 2, name: 'User 2' },
    ]);
  }),
];
```

### 2. Module Mocking

Use Jest to mock modules:

```typescript
jest.mock('next/router', () => ({
  useRouter() {
    return {
      push: jest.fn(),
      // ... other router methods
    };
  },
}));
```

### 3. Component Mocking

Create mock components when needed:

```typescript
jest.mock('@/components/ComplexComponent', () => ({
  ComplexComponent: () => <div>Mocked Component</div>,
}));
```

## Common Testing Scenarios

### 1. Testing Forms

```typescript
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

test('form submission', async () => {
  render(<LoginForm />);
  
  await userEvent.type(screen.getByLabelText(/email/i), 'test@example.com');
  await userEvent.type(screen.getByLabelText(/password/i), 'password123');
  
  fireEvent.click(screen.getByRole('button', { name: /submit/i }));
  
  expect(await screen.findByText(/success/i)).toBeInTheDocument();
});
```

### 2. Testing Async Operations

```typescript
test('async data loading', async () => {
  render(<DataComponent />);
  
  expect(screen.getByText(/loading/i)).toBeInTheDocument();
  
  const data = await screen.findByText(/loaded data/i);
  expect(data).toBeInTheDocument();
});
```

### 3. Testing Error States

```typescript
test('error handling', async () => {
  server.use(
    http.get('/api/data', () => {
      return new HttpResponse(null, { status: 500 });
    })
  );
  
  render(<DataComponent />);
  
  expect(await screen.findByText(/error/i)).toBeInTheDocument();
});
```

## Debugging Tests

1. Use `screen.debug()` to print the current DOM state
2. Use `console.log` in test files (they will show in Jest output)
3. Use the `--verbose` flag with Jest for more details
4. Use the `debug` option in render for RTL debugging

## Resources

- [Jest Documentation](https://jestjs.io/docs/getting-started)
- [React Testing Library Documentation](https://testing-library.com/docs/react-testing-library/intro/)
- [Playwright Documentation](https://playwright.dev/docs/intro)
- [MSW Documentation](https://mswjs.io/docs/) 