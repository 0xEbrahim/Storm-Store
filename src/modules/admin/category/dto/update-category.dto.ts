import { PartialType } from '@nestjs/mapped-types';
import { AdminCreateCategoryDto } from './create-category.dto';

export class UpdateCategoryDto extends PartialType(AdminCreateCategoryDto) {}
