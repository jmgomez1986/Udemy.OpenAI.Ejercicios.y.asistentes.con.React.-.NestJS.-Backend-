import { IsString } from 'class-validator';

export class ProsConsDiscusserStreamDto {
  @IsString()
  readonly prompt: string;
}
