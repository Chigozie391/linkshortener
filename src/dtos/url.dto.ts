import { IsString, IsUrl } from 'class-validator';

export class CreateURLDto {
  @IsString()
  @IsUrl()
  public originalUrl: string;
}
