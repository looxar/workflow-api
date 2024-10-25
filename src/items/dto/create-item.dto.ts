import { IsNotEmpty, IsNumber, IsOptional, IsString, ValidationArguments } from "class-validator";

const isNumberMesssage = (validationArguments: ValidationArguments): string => {
  return `${validationArguments.property}: ต้องเป็นตัวเลข`
}

export class CreateItemDto {

    @IsString()
    @IsNotEmpty()
    title: string;

    @IsNumber({}, { message: (v) => (`${v.property}: ควรเป็นตัวเลข`)})
    @IsNotEmpty()
    amount: number;

    @IsNumber({}, { message: isNumberMesssage })
    @IsNotEmpty()
    price: number;

    @IsOptional()
    contactMobileNo: string;
}
