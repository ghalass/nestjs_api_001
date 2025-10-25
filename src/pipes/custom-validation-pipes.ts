import {
  PipeTransform,
  Injectable,
  ArgumentMetadata,
  BadRequestException,
} from '@nestjs/common';

@Injectable()
export class CustomValidationPipe implements PipeTransform<string, number> {
  transform(value: string, metadata: ArgumentMetadata): number {
    const val = parseInt(value, 10);
    console.log(val);

    if (isNaN(val)) {
      throw new BadRequestException('Validation failed');
    }
    return val;
  }
}
