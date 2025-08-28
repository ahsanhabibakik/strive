import { http, HttpResponse } from 'msw';

interface LoginRequestBody {
  email: string;
  password: string;
}

export const handlers = [
  // Add your API mock handlers here
  http.get('/api/example', () => {
    return HttpResponse.json({
      message: 'Mocked API Response',
    });
  }),

  // Example of a POST request mock
  http.post('/api/auth/signin', async ({ request }) => {
    if (!request.body) {
      return new HttpResponse(null, {
        status: 400,
        statusText: 'Bad Request - Missing request body',
      });
    }

    try {
      const requestData = await request.json();
      
      // Type guard to check if the request data matches our expected structure
      const isValidLoginRequest = (data: unknown): data is LoginRequestBody => {
        return (
          typeof data === 'object' &&
          data !== null &&
          'email' in data &&
          'password' in data &&
          typeof (data as LoginRequestBody).email === 'string' &&
          typeof (data as LoginRequestBody).password === 'string'
        );
      };

      if (!isValidLoginRequest(requestData)) {
        return new HttpResponse(null, {
          status: 400,
          statusText: 'Bad Request - Invalid request format',
        });
      }

      const { email, password } = requestData;

      if (email === 'test@example.com' && password === 'password') {
        return HttpResponse.json({
          user: {
            id: '1',
            email: 'test@example.com',
            name: 'Test User',
          },
          token: 'mock-jwt-token',
        });
      }

      return new HttpResponse(null, {
        status: 401,
        statusText: 'Unauthorized',
      });
    } catch {
      return new HttpResponse(null, {
        status: 400,
        statusText: 'Bad Request - Invalid JSON',
      });
    }
  }),
]; 