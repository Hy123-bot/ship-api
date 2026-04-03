import { Module } from '@nestjs/common';
import { ShipDesignsController } from './ship-designs.controller';
import { ShipDesignsService } from './ship-designs.service';

@Module({
  controllers: [ShipDesignsController],
  providers: [ShipDesignsService],
  exports: [ShipDesignsService],
})
export class ShipDesignsModule {}
