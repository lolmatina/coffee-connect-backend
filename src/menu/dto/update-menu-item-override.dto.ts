import { PartialType } from '@nestjs/mapped-types';
import { CreateMenuItemOverrideDto } from './create-menu-item-override.dto';

export class UpdateMenuItemOverrideDto extends PartialType(CreateMenuItemOverrideDto) {} 