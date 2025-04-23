import { PartialType } from '@nestjs/mapped-types';
import { CreateMenuTemplateDto } from './create-menu-template.dto';

export class UpdateMenuTemplateDto extends PartialType(CreateMenuTemplateDto) {} 