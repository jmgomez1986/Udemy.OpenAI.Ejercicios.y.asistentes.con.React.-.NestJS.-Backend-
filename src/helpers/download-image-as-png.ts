import { InternalServerErrorException } from '@nestjs/common';
import * as path from 'path';
import * as fs from 'fs';
import sharp from 'sharp';

export const downloadImageAsPng = async (
  imageUrl: string,
  fullPath: boolean = false,
) => {
  const response = await fetch(imageUrl);

  if (!response.ok) {
    throw new InternalServerErrorException(
      `Failed to download image from ${imageUrl}`,
    );
  }

  const folderPath = path.resolve('./', './generated/images/');
  fs.mkdirSync(folderPath, { recursive: true });

  const imageName = `${new Date().getTime()}.png`;
  const buffer = Buffer.from(await response.arrayBuffer());
  const completePath = path.join(folderPath, imageName);

  // fs.writeFileSync(imagePath, buffer);
  await sharp(buffer).png().ensureAlpha().toFile(completePath);

  return fullPath ? completePath : imageName;
};

export const downloadBase64ImageAsPng = async (
  base64Image: string,
  fullPath: boolean = false,
) => {
  // Remover encabezado
  base64Image = base64Image.split(';base64,').pop() ?? base64Image;
  const imageBuffer = Buffer.from(base64Image, 'base64');

  const folderPath = path.resolve('./', './generated/images/');
  fs.mkdirSync(folderPath, { recursive: true });

  const imageNamePng = `${new Date().getTime()}-64.png`;
  const completePath = path.join(folderPath, imageNamePng);

  // Transformar a RGBA, png // Así lo espera OpenAI
  await sharp(imageBuffer).png().ensureAlpha().toFile(completePath);

  return fullPath ? completePath : imageNamePng;
};
