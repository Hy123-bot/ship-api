import { Controller, Get, Post, Body, UseInterceptors, UploadedFile } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ShipDesignsService } from './ship-designs.service';

@Controller('ship-designs')
export class ShipDesignsController {
  constructor(private readonly shipDesignsService: ShipDesignsService) {}

  @Get('debug-env')
  async debugEnv() {
    // 显示所有 COZE 相关的环境变量
    const allEnvVars: Record<string, string> = {};
    Object.keys(process.env).forEach(key => {
      if (key.startsWith('COZE_')) {
        const value = process.env[key] || '';
        allEnvVars[key] = value.length > 50 ? value.substring(0, 50) + '...' : value;
      }
    });

    // 检查 API Key 的正确性
    let apiKeyStatus = 'NOT SET';
    let apiKeyFound = '';
    for (const envKey of Object.keys(process.env)) {
      if (envKey.includes('COZE_WORKLOAD_IDENTITY_API_KEY')) {
        const value = process.env[envKey] || '';
        const trimmed = value.trim();
        apiKeyFound = `Found in "${envKey}" (len=${envKey.length}), value starts with "${value.substring(0, 10)}", trimmed starts with "${trimmed.substring(0, 10)}"`;
        apiKeyStatus = trimmed ? `SET (len=${trimmed.length})` : 'EMPTY after trim';
        break;
      }
    }

    return {
      // 核心变量
      COZE_WORKLOAD_IDENTITY_API_KEY: process.env.COZE_WORKLOAD_IDENTITY_API_KEY 
        ? `SET (len=${process.env.COZE_WORKLOAD_IDENTITY_API_KEY.length})` 
        : 'NOT SET',
      COZE_SUPABASE_URL: process.env.COZE_SUPABASE_URL || 'NOT SET',
      COZE_SUPABASE_ANON_KEY: process.env.COZE_SUPABASE_ANON_KEY 
        ? `SET (len=${process.env.COZE_SUPABASE_ANON_KEY.length})` 
        : 'NOT SET',
      
      // API Key 详细状态
      api_key_status: apiKeyStatus,
      api_key_found: apiKeyFound || 'NOT FOUND IN ANY ENV VAR',
      
      // 所有 COZE 环境变量
      all_coze_vars: allEnvVars,
      
      // 部署时间
      deploy_time: new Date().toISOString(),
    };
  }

  @Get('test-ai')
  async testAI() {
    try {
      // 显示当前环境变量
      const envInfo = {
        COZE_WORKLOAD_IDENTITY_API_KEY: process.env.COZE_WORKLOAD_IDENTITY_API_KEY ? 'SET' : 'NOT SET',
        COZE_INTEGRATION_BASE_URL: process.env.COZE_INTEGRATION_BASE_URL,
        COZE_INTEGRATION_MODEL_BASE_URL: process.env.COZE_INTEGRATION_MODEL_BASE_URL,
      };
      
      const result = await this.shipDesignsService.testAI();
      return { success: true, result, env: envInfo };
    } catch (error) {
      return { 
        success: false, 
        error: error.message,
        stack: error.stack?.split('\n').slice(0, 3)
      };
    }
  }

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
