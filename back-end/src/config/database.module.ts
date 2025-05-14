import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { createClient } from '@supabase/supabase-js';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
  ],
  providers: [
    {
      provide: 'SUPABASE_CLIENT',
      useFactory: (configService: ConfigService) => {
        const supabaseUrl = configService.get<string>(
          'EXPO_PUBLIC_SUPABASE_URL',
        );
        const supabaseKey = configService.get<string>(
          'EXPO_PUBLIC_SUPABASE_ANON_KEY',
        );

        if (!supabaseUrl || !supabaseKey) {
          throw new Error(
            'SUPABASE_URL and SUPABASE_KEY environment variables are required',
          );
        }

        return createClient(supabaseUrl, supabaseKey);
      },
      inject: [ConfigService],
    },
  ],
  exports: ['SUPABASE_CLIENT'],
})
export class DatabaseModule {}
