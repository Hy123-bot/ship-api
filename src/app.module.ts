import { Module } from '@nestjs/common';
import { AppController } from '@/app.controller';
import { AppService } from '@/app.service';
import { ShipDesignsModule } from '@/ship-designs/ship-designs.module';

@Module({
  imports: [ShipDesignsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
