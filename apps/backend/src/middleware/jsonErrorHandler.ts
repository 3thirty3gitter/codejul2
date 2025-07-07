import { Request, Response, NextFunction } from 'express';

export const jsonErrorHandler = (error: any, req: Request, res: Response, next: NextFunction) => {
  // Handle JSON parsing errors specifically
  if (error instanceof SyntaxError && 'body' in error) {
    console.error('? JSON Parse Error:', {
      message: error.message,
      url: req.url,
      method: req.method,
      body: req.body,
      rawBody: error.body || 'No raw body available'
    });

    return res.status(400).json({
      error: 'Invalid JSON format',
      message: 'The request body contains malformed JSON',
      details: error.message,
      timestamp: new Date().toISOString()
    });
  }

  // Handle other body-parser errors
  if (error.type && error.type.includes('entity')) {
    console.error('? Body Parser Error:', error.message);
    return res.status(413).json({
      error: 'Request entity too large',
      message: 'The request body is too large'
    });
  }

  // Pass other errors to the next error handler
  next(error);
};

export const requestLogger = (req: Request, res: Response, next: NextFunction) => {
  console.log(`?? ${req.method} ${req.url}`, {
    contentType: req.get('Content-Type'),
    contentLength: req.get('Content-Length'),
    body: req.body
  });
  next();
};
