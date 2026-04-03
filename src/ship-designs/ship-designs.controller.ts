import { Controller, Get, Post, Body, UseInterceptors, UploadedFile } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ShipDesignsService } from './ship-designs.service';

@Controller('ship-designs')
export class ShipDesignsController {
  constructor(private readonly shipDesignsService: ShipDesignsService) {}

  @Get()
  async findAll() {
    return this.shipDesignsService.findAll();
  }

  @Post()
  async create(@Body() createDto: {
    group_id: number;
    group_name: string;
    river_id: string;
    material: string;
    bow_shape: string;
    bottom_shape: string;
    propulsion: string;
    cargo_info?: string;
    cargo_count?: number;
    special_design?: string;
    image_url?: string;
    score: number;
    total_cost: number;
    report: string;
  }) {
    return this.shipDesignsService.upsert(createDto);
  }

  @Post('upload-image')
  @UseInterceptors(FileInterceptor('file'))
  async uploadImage(@UploadedFile() file: Express.Multer.File) {
    return this.shipDesignsService.uploadImage(file);
  }

  @Post('recognize')
  @UseInterceptors(FileInterceptor('file'))
  async recognizeImage(@UploadedFile() file: Express.Multer.File) {
    return this.shipDesignsService.recognizeImage(file);
  }

  @Post('chat')
  async chat(@Body() body: { message: string; history?: { role: string; content: string }[] }) {
    return this.shipDesignsService.chatWithAI(body.message, body.history || []);
  }
}
