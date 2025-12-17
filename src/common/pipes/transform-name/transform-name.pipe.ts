import { ArgumentMetadata, Injectable, PipeTransform } from '@nestjs/common';

@Injectable()
export class TransformNamePipe implements PipeTransform {
  transform(value: any, metadata: ArgumentMetadata) {
    if (metadata.type === 'body' && value.name) {
      value.name = value.name.trim().toLowerCase().replace(/\s+/g, ' ');
    }
    return value;
  }
}
