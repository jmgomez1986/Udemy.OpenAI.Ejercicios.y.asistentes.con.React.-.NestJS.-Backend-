import * as fs from 'fs';
import OpenAI, { toFile } from 'openai';
import { downloadBase64ImageAsPng, downloadImageAsPng } from 'src/helpers';

interface Options {
  prompt: string;
  originalImage?: string;
  maskImage?: string;
}

const getGeneratedImage = async (openai: OpenAI, prompt: string) => {
  const response = await openai.images.generate({
    prompt,
    model: 'dall-e-3',
    n: 1, // number of images we want to generate
    size: '1024x1024',
    quality: 'standard',
    response_format: 'url',
  });
  const responseUrl = response.data?.[0].url || '';

  // Save image in file system
  const fileName = await downloadImageAsPng(responseUrl);
  const url = `${process.env.SERVER_URL}/gpt/image-generation/${fileName}`;

  return {
    url,
    openAIUrl: responseUrl,
    revised_prompt: response.data?.[0].revised_prompt,
  };
};

const getEditedImage = async (
  openai: OpenAI,
  prompt: string,
  originalImage: string,
  maskImage: string,
) => {
  // originalImage=http://localhost:3000/gpt/image-generation/1748735874397.png
  // maskImage=Base64;ASDASDdgsfgsfgfghDFSADFDFDAFaDfadgfdagDGDGDASGDAFGADGF
  const pngImagePath = await downloadImageAsPng(originalImage, true);
  const maskPath = await downloadBase64ImageAsPng(maskImage, true);

  const response = await openai.images.edit({
    model: 'dall-e-2',
    prompt,
    image: await toFile(fs.createReadStream(pngImagePath), null, {
      type: 'image/png',
    }), // fs.createReadStream(pngImagePath),
    mask: await toFile(fs.createReadStream(maskPath), null, {
      type: 'image/png',
    }), // fs.createReadStream(maskPath),
    n: 1,
    size: '1024x1024',
    response_format: 'url',
  });
  const responseUrl = response.data?.[0].url || '';

  const fileName = await downloadImageAsPng(responseUrl);
  const url = `${process.env.SERVER_URL}/gpt/image-generation/${fileName}`;

  return {
    url,
    openAIUrl: responseUrl,
    revised_prompt: response.data?.[0].revised_prompt,
  };
};

export const imageGenerationUseCase = async (
  openai: OpenAI,
  options: Options,
) => {
  const { prompt, originalImage, maskImage } = options;
  const isNotEdit = !originalImage || !maskImage;

  if (isNotEdit) return await getGeneratedImage(openai, prompt);
  return await getEditedImage(openai, prompt, originalImage, maskImage);
};
