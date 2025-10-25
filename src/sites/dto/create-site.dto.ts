import { IsString, Length } from 'class-validator';

export class CreateSiteDto {
  @IsString()
  @Length(3, 20)
  readonly name: string;
}
