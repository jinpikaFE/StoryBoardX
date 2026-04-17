import { Module } from '@nestjs/common';
import { SupabaseModule } from './modules/supabase/supabase.module';
import { HistoryModule } from './modules/history/history.module';
import { GenerateModule } from './modules/generate/generate.module';

@Module({
  imports: [SupabaseModule, HistoryModule, GenerateModule],
})
export class AppModule {}
