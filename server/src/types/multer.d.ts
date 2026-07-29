/**
 * Minimal type declarations for multer 2.x.
 * multer 2.x does not ship its own TypeScript declarations and @types/multer
 * targets v1.x only.
 *
 * Pattern used: function + namespace merge so that:
 *   - multer(options)         is callable  → returns a MulterInstance
 *   - multer.memoryStorage()  is a static
 *   - multer.FileFilterCallback is a type in the namespace
 *
 * Revisit when multer ships first-party types.
 *
 * No top-level imports — this file must be a global script, not a module.
 */

declare module 'multer' {
  import { RequestHandler, Request } from 'express';

  namespace multer {
    /**
     * The object returned by calling multer(options).
     * Use .single() / .array() etc. to get the actual Express middleware.
     * Lives inside the namespace so TypeScript can name it as multer.Instance.
     */
    interface Instance {
      /** Accept a single file with the given field name. */
      single(fieldname: string): RequestHandler;
      /** Accept up to maxCount files with the given field name. */
      array(fieldname: string, maxCount?: number): RequestHandler;
      /** Accept files for multiple fields. */
      fields(fields: ReadonlyArray<{ name: string; maxCount?: number }>): RequestHandler;
      /** Accept no files — text fields only. */
      none(): RequestHandler;
      /** Accept any file, regardless of field name. */
      any(): RequestHandler;
    }

    /** Callback passed to the fileFilter option. Pass null/false to reject. */
    type FileFilterCallback = (error: Error | null, acceptFile?: boolean) => void;

    interface StorageEngine {
      _handleFile(
        req: Request,
        file: Express.Multer.File,
        callback: (error?: unknown, info?: Partial<Express.Multer.File>) => void
      ): void;
      _removeFile(
        req: Request,
        file: Express.Multer.File,
        callback: (error: Error | null) => void
      ): void;
    }

    interface Options {
      storage?: StorageEngine;
      dest?: string;
      limits?: {
        fieldNameSize?: number;
        fieldSize?: number;
        fields?: number;
        fileSize?: number;
        files?: number;
        parts?: number;
        headerPairs?: number;
      };
      preservePath?: boolean;
      fileFilter?(
        req: Request,
        file: Express.Multer.File,
        callback: FileFilterCallback
      ): void;
    }

    /** Returns an in-memory storage engine (files available as req.file.buffer). */
    function memoryStorage(): StorageEngine;
    /** Returns a disk storage engine. */
    function diskStorage(options?: {
      destination?: string | ((req: Request, file: Express.Multer.File, cb: (error: Error | null, destination: string) => void) => void);
      filename?: (req: Request, file: Express.Multer.File, cb: (error: Error | null, filename: string) => void) => void;
    }): StorageEngine;
  }

  /** Creates a multer middleware builder from the given options. */
  function multer(options?: multer.Options): multer.Instance;

  export = multer;
}

/** Augments the global Express namespace with the Multer.File type. */
declare namespace Express {
  namespace Multer {
    interface File {
      fieldname: string;
      originalname: string;
      encoding: string;
      mimetype: string;
      size: number;
      destination: string;
      filename: string;
      path: string;
      buffer: Buffer;
    }
  }
}
