import { ApiProperty } from '@nestjs/swagger';
import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'storyboard_history' })
export class StoryboardHistory {
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty()
  @Column({ type: 'text' })
  brief: string;

  @ApiProperty()
  @Column({ type: 'int' })
  duration: number;

  @ApiProperty()
  @Column({ type: 'text', name: 'aspect_ratio' })
  aspect_ratio: string;

  @ApiProperty()
  @Column({ type: 'text', name: 'visual_style' })
  visual_style: string;

  @ApiProperty()
  @Column({ type: 'text', name: 'narrative_pace' })
  narrative_pace: string;

  @ApiProperty()
  @Column({ type: 'int', name: 'include_dialogue', default: 0 })
  include_dialogue: number;

  @ApiProperty()
  @Column({ type: 'text', name: 'dialogue_language', default: 'auto' })
  dialogue_language: string;

  @ApiProperty()
  @Column({ type: 'text', name: 'narration_style', default: 'none' })
  narration_style: string;

  @ApiProperty()
  @Column({ type: 'text', name: 'music_style', default: 'auto' })
  music_style: string;

  @ApiProperty()
  @Column({ type: 'text' })
  model: string;

  @ApiProperty()
  @Column({ type: 'text', name: 'prompt_mode', default: 'scene' })
  prompt_mode: string;

  @ApiProperty({ required: false })
  @Column({ type: 'jsonb', nullable: true })
  result?: any;

  @ApiProperty({ required: false })
  @Column({ type: 'text', name: 'start_frame', nullable: true, default: null })
  start_frame?: string | null;

  @ApiProperty({ required: false })
  @Column({ type: 'text', name: 'end_frame', nullable: true, default: null })
  end_frame?: string | null;

  @ApiProperty({ required: false })
  @Column({ type: 'text', name: 'start_frame_desc', nullable: true, default: null })
  start_frame_desc?: string | null;

  @ApiProperty({ required: false })
  @Column({ type: 'text', name: 'end_frame_desc', nullable: true, default: null })
  end_frame_desc?: string | null;

  @CreateDateColumn({ type: 'timestamptz', name: 'created_at' })
  created_at: Date;
}

