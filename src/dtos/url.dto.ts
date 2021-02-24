import { IsString } from 'class-validator';

export class CreateURLDto {
  @IsString()
  public originalUrl: string;
}
