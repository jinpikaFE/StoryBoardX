import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class StoryboardConfigDto {
  @IsString({ message: 'brief 必须是 String 类型' })
  @IsNotEmpty({ message: 'brief 不能为空' })
  @ApiProperty()
  brief: string;

  @IsNumber({}, { message: 'duration 必须是 Number 类型' })
  @ApiProperty()
  duration: number;

  @IsString({ message: 'aspectRatio 必须是 String 类型' })
  @IsNotEmpty({ message: 'aspectRatio 不能为空' })
  @ApiProperty()
  aspectRatio: string;

  @IsString({ message: 'visualStyle 必须是 String 类型' })
  @IsNotEmpty({ message: 'visualStyle 不能为空' })
  @ApiProperty()
  visualStyle: string;

  @IsString({ message: 'narrativePace 必须是 String 类型' })
  @IsNotEmpty({ message: 'narrativePace 不能为空' })
  @ApiProperty()
  narrativePace: string;

  @IsBoolean({ message: 'includeDialogue 必须是 Boolean 类型' })
  @ApiProperty()
  includeDialogue: boolean;

  @IsString({ message: 'dialogueLanguage 必须是 String 类型' })
  @IsOptional()
  @ApiProperty({ required: false })
  dialogueLanguage?: string;

  @IsString({ message: 'narrationStyle 必须是 String 类型' })
  @IsOptional()
  @ApiProperty({ required: false })
  narrationStyle?: string;

  @IsString({ message: 'musicStyle 必须是 String 类型' })
  @IsOptional()
  @ApiProperty({ required: false })
  musicStyle?: string;

  @IsString({ message: 'model 必须是 String 类型' })
  @IsOptional()
  @ApiProperty({ required: false })
  model?: string;

  @IsString({ message: 'promptMode 必须是 String 类型' })
  @IsOptional()
  @ApiProperty({ required: false, enum: ['time', 'scene', 'battle'] })
  promptMode?: 'time' | 'scene' | 'battle';

  @IsString({ message: 'startFrame 必须是 String 类型' })
  @IsOptional()
  @ApiProperty({ required: false })
  startFrame?: string | null;

  @IsString({ message: 'endFrame 必须是 String 类型' })
  @IsOptional()
  @ApiProperty({ required: false })
  endFrame?: string | null;

  @IsString({ message: 'startFrameDesc 必须是 String 类型' })
  @IsOptional()
  @ApiProperty({ required: false })
  startFrameDesc?: string;

  @IsString({ message: 'endFrameDesc 必须是 String 类型' })
  @IsOptional()
  @ApiProperty({ required: false })
  endFrameDesc?: string;
}

