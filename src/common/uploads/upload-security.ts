import { BadRequestException } from '@nestjs/common';
import { extname } from 'path';

const DANGEROUS_EXTENSIONS = new Set([
  '.bat',
  '.cmd',
  '.com',
  '.cpl',
  '.exe',
  '.js',
  '.jse',
  '.msi',
  '.ps1',
  '.scr',
  '.sh',
  '.vbs',
]);

const SAFE_EXTENSIONS_BY_MIME_TYPE: Record<string, ReadonlySet<string>> = {
  'application/pdf': new Set(['.pdf']),
  'application/vnd.ms-excel': new Set(['.xls']),
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': new Set(['.xlsx']),
  'image/heic': new Set(['.heic']),
  'image/heif': new Set(['.heif']),
  'image/jpeg': new Set(['.jpg', '.jpeg']),
  'image/png': new Set(['.png']),
  'image/webp': new Set(['.webp']),
  'text/csv': new Set(['.csv']),
  'video/mp4': new Set(['.mp4']),
  'video/quicktime': new Set(['.mov', '.qt']),
  'video/webm': new Set(['.webm']),
};

export function assertUploadSeguro(
  file: { originalname?: string; mimetype?: string },
  allowedMimeTypes: ReadonlySet<string>,
  label: string,
) {
  const originalName = file.originalname || '';
  const extension = extname(originalName).toLowerCase();
  const mimeType = file.mimetype || '';

  if (originalName.includes('..') || /[\\/]/.test(originalName)) {
    throw new BadRequestException(`${label} possui nome invalido.`);
  }

  if (DANGEROUS_EXTENSIONS.has(extension)) {
    throw new BadRequestException(`${label} possui extensao nao permitida.`);
  }

  if (!allowedMimeTypes.has(mimeType)) {
    throw new BadRequestException(`${label} possui tipo de arquivo nao permitido.`);
  }

  const safeExtensions = SAFE_EXTENSIONS_BY_MIME_TYPE[mimeType];
  if (safeExtensions && !safeExtensions.has(extension)) {
    throw new BadRequestException(`${label} possui extensao incompativel com o tipo do arquivo.`);
  }
}

export function fileFilterSeguro(
  allowedMimeTypes: ReadonlySet<string>,
  label: string,
) {
  return (
    _req: unknown,
    file: { originalname?: string; mimetype?: string },
    callback: (error: Error | null, acceptFile: boolean) => void,
  ) => {
    try {
      assertUploadSeguro(file, allowedMimeTypes, label);
      callback(null, true);
    } catch (error) {
      callback(error as Error, false);
    }
  };
}
