import { ApiProperty } from "@nestjs/swagger";
import { IsInt, IsString } from "class-validator";

export class CustomerDto {
    @ApiProperty()
    @IsString()
    name: string;

    @ApiProperty()
    @IsInt()
    id: number;
}
