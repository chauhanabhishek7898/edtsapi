import { PartialType } from '@nestjs/mapped-types';
import { CreateEdtDto } from './create-edt.dto';

export class UpdateEdtDto extends PartialType(CreateEdtDto) {}
