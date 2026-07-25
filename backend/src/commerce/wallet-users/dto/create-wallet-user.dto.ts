import { Type } from 'class-transformer';
import {
  ArrayMinSize,
  IsArray,
  IsEmail,
  IsNumber,
  IsOptional,
  IsString,
  Min,
  MinLength,
  ValidateNested,
} from 'class-validator';

// Powers the "New Swift User" action.
export class CreateWalletUserDto {
  @IsString()
  @MinLength(2)
  name!: string;

  @IsString()
  @MinLength(6)
  rfid!: string;

  @IsString()
  @MinLength(10)
  phone!: string;

  @IsOptional()
  @IsEmail()
  email?: string = '';

  @IsOptional()
  @IsNumber()
  @Min(0)
  initialBalance?: number = 0;
}

// Powers the "Bulk Add Users" import action.
export class BulkAddWalletUsersDto {
  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => CreateWalletUserDto)
  users!: CreateWalletUserDto[];
}
