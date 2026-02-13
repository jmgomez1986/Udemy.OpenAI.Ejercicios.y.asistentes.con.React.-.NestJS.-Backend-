import * as fs from 'fs';
import OpenAI from 'openai';
import {
  downloadBase64ImageAsPng,
  downloadImageAsPng,
} from 'src/helpers/download-image-as-png';

interface Options {
  prompt: string;
  originalImage?: string;
  maskImage?: string;
}

export const imageGenerationUseCase = async (
  openAI: OpenAI,
  options: Options,
) => {
  let url: string = '';
  const { prompt, originalImage, maskImage } = options;

  if (!originalImage || !maskImage) {
    const response = await openAI.images.generate({
      prompt: prompt,
      model: 'dall-e-3',
      n: 1,
      size: '1024x1024',
      quality: 'standard',
      response_format: 'url',
    });
    if (response.data) {
      const fileName = await downloadImageAsPng(response.data[0].url!);
      url = `${process.env.SERVER_URL}/gpt/image-generation/${fileName}`;
    }

    return {
      url, // http://localhost:3000/gpt/image-generation/1770920379111.png
      urloOpenAI: response.data ? response.data[0].url : '',
      revised_promp: response.data ? response.data[0].revised_prompt : '',
    };
  }

  // originalImage = http://localhost:3000/gpt/image-generation/1770920379111.png
  // maskImage = data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAoAAAAHgCAYAAADqYy9VAAAABHNCSVQICAgIfAhkiAAAAAlwSFlzAAALEgAACxIB0t1+/AAAADlJREFUeJztwTEBAAAAwqD1T20ND6AAAAAAAAAAAAAAAAPgG4AAGiQABXoAAHjQAAAAASUVORK5CYII=
  const pngImagePath = await downloadImageAsPng(originalImage, true);
  const maskPath = await downloadBase64ImageAsPng(maskImage, true);

  const response = openAI.images.edit({
    model: 'gpt-image-1.5',
    prompt: prompt,
    image: fs.createReadStream(pngImagePath),
    mask: fs.createReadStream(maskPath),
    n: 1,
    size: '1024x1024',
    quality: 'standard',
    response_format: 'url',
  });

  const responseData = (await response).data;
  if (responseData) {
    url = responseData[0].url!;
    const fileName = await downloadImageAsPng(responseData[0].url!);
    url = `${process.env.SERVER_URL}/gpt/image-generation/${fileName}`;

    return {
      url, // http://localhost:3000/gpt/image-generation/1770920379111.png
      urloOpenAI: responseData[0].url || '',
      revised_promp: responseData[0].revised_prompt || '',
    };
  }
};
