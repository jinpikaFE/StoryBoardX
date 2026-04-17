import { ApiProperty } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';
import { StoryboardConfigDto } from './storyboard-config.dto';

export class CreateHistoryDto extends StoryboardConfigDto {
  @IsOptional()
  @ApiProperty({ required: false })
  result?: any;
}

