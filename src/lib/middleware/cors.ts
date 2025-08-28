import { NextRequest, NextResponse } from 'next/server';

export interface CorsOptions {
  origin?: string | string[] | boolean;
  methods?: string[];
  allowedHeaders?: string[];
  exposedHeaders?: string[];
  credentials?: boolean;
  maxAge?: number;
  preflightContinue?: boolean;
  optionsSuccessStatus?: number;
}

const defaultOptions: CorsOptions = {
  origin: true,
  methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-API-Key'],
  credentials: true,
  maxAge: 86400, // 24 hours
  optionsSuccessStatus: 200
};

/**
 * CORS middleware for API routes
 */
export function cors(options: CorsOptions = {}) {
  const opts = { ...defaultOptions, ...options };

  return function (handler: (request: NextRequest) => Promise<NextResponse>) {
    return async (request: NextRequest) => {
      const response = request.method === 'OPTIONS' 
        ? new NextResponse(null, { status: opts.optionsSuccessStatus })
        : await handler(request);

      // Set CORS headers
      setCorsHeaders(response, request, opts);

      return response;
    };
  };
}

function setCorsHeaders(response: NextResponse, request: NextRequest, options: CorsOptions) {
  const origin = request.headers.get('origin');

  // Set Access-Control-Allow-Origin
  if (options.origin === true) {
    response.headers.set('Access-Control-Allow-Origin', origin || '*');
  } else if (options.origin === false) {
    // Don't set any origin
  } else if (typeof options.origin === 'string') {
    response.headers.set('Access-Control-Allow-Origin', options.origin);
  } else if (Array.isArray(options.origin)) {
    if (origin && options.origin.includes(origin)) {
      response.headers.set('Access-Control-Allow-Origin', origin);
    }
  }

  // Set other CORS headers
  if (options.credentials) {
    response.headers.set('Access-Control-Allow-Credentials', 'true');
  }

  if (options.methods && options.methods.length > 0) {
    response.headers.set('Access-Control-Allow-Methods', options.methods.join(', '));
  }

  if (options.allowedHeaders && options.allowedHeaders.length > 0) {
    response.headers.set('Access-Control-Allow-Headers', options.allowedHeaders.join(', '));
  }

  if (options.exposedHeaders && options.exposedHeaders.length > 0) {
    response.headers.set('Access-Control-Expose-Headers', options.exposedHeaders.join(', '));
  }

  if (options.maxAge) {
    response.headers.set('Access-Control-Max-Age', options.maxAge.toString());
  }
}