// Client-side logger that properly handles development vs production
export const clientLogger = {
  error: (message: string, error?: unknown) => {
    if (process.env.NODE_ENV === "development") {
      console.error(message, error);
    } else {
      // In production, you might want to send this to an error reporting service
      // For now, we'll silently fail in production to avoid console noise
    }
  },

  warn: (message: string, context?: unknown) => {
    if (process.env.NODE_ENV === "development") {
      console.warn(message, context);
    }
  },

  info: (message: string, context?: unknown) => {
    if (process.env.NODE_ENV === "development") {
      // eslint-disable-next-line no-console
      console.info(message, context);
    }
  },

  debug: (message: string, context?: unknown) => {
    if (process.env.NODE_ENV === "development") {
      // eslint-disable-next-line no-console
      console.debug(message, context);
    }
  },
};
