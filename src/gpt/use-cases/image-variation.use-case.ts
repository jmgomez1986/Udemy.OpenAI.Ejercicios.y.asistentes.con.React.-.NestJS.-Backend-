import * as fs from 'fs';
import OpenAI from 'openai';
import { downloadImageAsPng } from 'src/helpers';

interface Options {
  baseImage: string;
}

export const imageVariationUseCase = async (
  openai: OpenAI,
  { baseImage }: Options,
) => {
  const pngImagePath = await downloadImageAsPng(baseImage, true);
  const response = await openai.images.createVariation({
    model: 'dall-e-2',
    image: fs.createReadStream(pngImagePath),
    n: 1,
    size: '1024x1024',
    response_format: 'url',
  });

  const responseData = response.data;

  const fileName = await downloadImageAsPng(
    responseData ? responseData[0].url! : '',
  );
  const url = `${process.env.SERVER_URL}/gpt/image-generation/${fileName}`;

  return {
    url, // http://localhost:3000/gpt/image-generation/1770920379111.png
    urloOpenAI: responseData ? responseData[0].url! : '',
    revised_promp: responseData ? responseData[0].revised_prompt! : '',
  };
};
