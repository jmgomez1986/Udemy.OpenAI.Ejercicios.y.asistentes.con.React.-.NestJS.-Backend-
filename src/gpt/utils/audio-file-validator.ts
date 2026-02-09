import { FileValidator } from '@nestjs/common';

export class CustomAudioValidator extends FileValidator {
  private detectedMimeType: string; // Propiedad para guardar el tipo detectado

  constructor() {
    super({});
  }

  isValid(file: Express.Multer.File): boolean {
    this.detectedMimeType = file.mimetype; // Guardamos el tipo actual

    // Definimos los mimetypes permitidos
    const allowedMimeTypes = [
      'audio/mpeg',
      'audio/mp3',
      'audio/wav',
      'audio/mp4',
      'audio/x-m4a',
      'audio/m4a',
      'video/mp4',
    ];

    return allowedMimeTypes.includes(file.mimetype);
  }

  buildErrorMessage(): string {
    return `Archivo no válido. Tipo detectado: ${this.detectedMimeType}. Se esperaba un formato de audio compatible (mp3, wav, m4a).`;
  }
}
