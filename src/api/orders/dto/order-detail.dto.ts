import { ApiProperty } from "@nestjs/swagger";
import { IsNumber } from "class-validator";

export class OrderDetailDto {
    @ApiProperty()
    @IsNumber()
    product_id: number;

    @ApiProperty()
    @IsNumber()
    qty: number;
}
