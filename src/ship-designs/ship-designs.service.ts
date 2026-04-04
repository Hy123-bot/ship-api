import { Injectable, OnModuleInit } from '@nestjs/common';
import { getSupabaseClient } from '@/storage/database/supabase-client';
import { S3Storage, LLMClient, Config } from 'coze-coding-dev-sdk';

export interface ShipDesign {
  id: number;
  group_id: number;
  group_name: string;
  river_id: string;
  material: string;
  bow_shape: string;
  bottom_shape: string;
  propulsion: string;
  cargo_info: string;
  cargo_count: number;
  special_design: string;
  image_url: string;
  score: number;
  total_cost: number;
  report: string;
  created_at: string;
}

export interface RecognizeResult {
  material: string;
  bow_shape: string;
  bottom_shape: string;
  propulsion: string;
  cargo_count: number;
  cargo_info: string;
  special_design: string;
}

@Injectable()
export class ShipDesignsService {
  private storage: S3Storage | null = null;
  private llmClient: LLMClient | null = null;

  private getStorage(): S3Storage {
    if (!this.storage) {
      this.storage = new S3Storage({
        endpointUrl: process.env.COZE_BUCKET_ENDPOINT_URL || '',
        accessKey: '',
        secretKey: '',
        bucketName: process.env.COZE_BUCKET_NAME || '',
        region: 'cn-beijing',
      });
    }
    return this.storage;
  }

  private getLLMClient(): LLMClient {
    if (!this.llmClient) {
      this.llmClient = new LLMClient(new Config());
    }
    return this.llmClient;
  }

  async findAll(): Promise<{ code: number; msg: string; data: ShipDesign[] }> {
    try {
      // 调试：检查环境变量
      console.log('=== Debug: Environment Variables ===');
      console.log('COZE_SUPABASE_URL:', process.env.COZE_SUPABASE_URL ? 'SET' : 'NOT SET');
      console.log('COZE_SUPABASE_ANON_KEY:', process.env.COZE_SUPABASE_ANON_KEY ? 'SET' : 'NOT SET');
      
      const client = getSupabaseClient();
      console.log('Supabase client created successfully');

      const { data, error } = await client
        .from('ship_designs')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Supabase query error:', error);
        throw new Error(`查询失败: ${error.message}`);
      }

      console.log('Query successful, returned', data?.length, 'records');

      return {
        code: 200,
        msg: 'success',
        data: data as ShipDesign[],
      };
    } catch (err) {
      console.error('=== findAll Error ===');
      console.error('Error message:', err.message);
      console.error('Error stack:', err.stack);
      throw err;
    }
  }

  async upsert(createDto: {
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
  }): Promise<{ code: number; msg: string; data: ShipDesign }> {
    const client = getSupabaseClient();

    const { data, error } = await client
      .from('ship_designs')
      .upsert(createDto, { onConflict: 'group_id' })
      .select()
      .single();

    if (error) {
      throw new Error(`保存失败: ${error.message}`);
    }

    return {
      code: 200,
      msg: 'success',
      data: data as ShipDesign,
    };
  }

  async uploadImage(file: Express.Multer.File): Promise<{ code: number; msg: string; data: { url: string } }> {
    // 读取文件内容
    let fileBuffer: Buffer | null = null;
    
    if (file.buffer) {
      fileBuffer = file.buffer;
    } else if ((file as any).path) {
      const fs = await import('fs');
      try {
        fileBuffer = fs.readFileSync((file as any).path);
      } catch (e) {
        console.error('读取临时文件失败:', e);
      }
    }
    
    if (!fileBuffer) {
      throw new Error('无法读取文件内容');
    }

    // 上传到对象存储
    const fileKey = await this.getStorage().uploadFile({
      fileContent: fileBuffer,
      fileName: `ship-designs/${Date.now()}_${file.originalname || 'image.jpg'}`,
      contentType: file.mimetype || 'image/jpeg',
    });

    // 生成签名 URL（有效期30天）
    const imageUrl = await this.getStorage().generatePresignedUrl({
      key: fileKey,
      expireTime: 2592000, // 30天
    });

    return {
      code: 200,
      msg: 'success',
      data: { url: imageUrl },
    };
  }

  async recognizeImage(file: Express.Multer.File): Promise<{ code: number; msg: string; data: RecognizeResult }> {
    // 读取文件内容
    let fileBuffer: Buffer | null = null;
    
    if (file.buffer) {
      fileBuffer = file.buffer;
    } else if ((file as any).path) {
      const fs = await import('fs');
      try {
        fileBuffer = fs.readFileSync((file as any).path);
      } catch (e) {
        console.error('读取临时文件失败:', e);
      }
    }
    
    if (!fileBuffer) {
      throw new Error('无法读取文件内容');
    }

    // 上传图片到对象存储
    const fileKey = await this.getStorage().uploadFile({
      fileContent: fileBuffer,
      fileName: `ship-images/${Date.now()}_${file.originalname || 'image.jpg'}`,
      contentType: file.mimetype || 'image/jpeg',
    });

    // 生成签名 URL
    const imageUrl = await this.getStorage().generatePresignedUrl({
      key: fileKey,
      expireTime: 3600,
    });

    // 调用 LLM Vision 模型识别图片
    const prompt = `你是一个船舶设计专家。请仔细分析这张船舶设计图片，识别并提取以下信息：

1. 船体材料（如：柚木船体、铝合金船体、钢铁船体、木质船体、塑料船体、轮胎船体、泡沫船体）
2. 船首形状（如：尖削型船首、平头型船首、圆头型船首、勺型船首、上翘型船首）
3. 船底形状（如：深V型船底、平底型船底、圆舭型船底）
4. 动力方式（如：喷水推进、喷气推进、蒸汽推进、螺旋桨推进、电动推进、人力划桨、风帆动力）
5. 货物识别（重要！）：
   - 仔细查找图片中船上标注的"货"字或货物标记
   - 统计"货"字的数量，每个"货"字代表一个货物单位
   - 观察货物的摆放方式：是否均匀对称分布（重要！）
   - 描述货物的位置（如：船舱内左右两侧对称摆放、甲板前后均匀分布等）
6. 特殊设计（如：防腐涂层、水密隔舱、防撞护舷等）

重要规则：
- 货物必须均匀对称分布，这是船舶稳定的基本要求
- 如果货物偏向一侧或集中堆叠，需要在cargo_info中明确指出

请以JSON格式返回结果，格式如下：
{
  "material": "识别出的船体材料",
  "bow_shape": "识别出的船首形状",
  "bottom_shape": "识别出的船底形状",
  "propulsion": "识别出的动力方式",
  "cargo_count": 货字的数量（数字）,
  "cargo_info": "货物摆放方式描述，必须说明是否均匀对称分布，如：3个货物，均匀对称分布在船舱左右两侧",
  "special_design": "识别出的特殊设计"
}

注意：
- cargo_count 必须是数字，表示"货"字的个数
- cargo_info 必须描述货物分布是否均匀对称
- 如果某个字段无法识别，material等返回空字符串，cargo_count返回0

只返回JSON，不要有其他说明文字。`;

    const messages = [
      {
        role: 'user' as const,
        content: [
          { type: 'text' as const, text: prompt },
          {
            type: 'image_url' as const,
            image_url: {
              url: imageUrl,
              detail: 'high' as const,
            },
          },
        ],
      },
    ];

    const response = await this.getLLMClient().invoke(messages, {
      model: 'doubao-seed-1-6-vision-250815',
      temperature: 0.3,
    });

    // 解析 LLM 返回的 JSON
    let result: RecognizeResult = {
      material: '',
      bow_shape: '',
      bottom_shape: '',
      propulsion: '',
      cargo_count: 0,
      cargo_info: '',
      special_design: '',
    };

    try {
      const content = response.content;
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        result = JSON.parse(jsonMatch[0]);
      }
    } catch (e) {
      console.error('解析 LLM 返回结果失败:', e);
    }

    return {
      code: 200,
      msg: 'success',
      data: result,
    };
  }

  async chatWithAI(message: string, history: { role: string; content: string }[]): Promise<{ code: number; msg: string; data: { reply: string } }> {
    // AI船舶分析师系统提示词
    const systemPrompt = `你是一位专业的AI船舶分析师。你的职责是：

1. 帮助学生理解船舶设计的基本原理
2. 解答关于船体材料、船首形状、船底形状、动力系统的问题
3. 分析不同河流环境（山间激流、城市运河、宽阔江面、湿地浅滩、近海河口）对船舶设计的要求
4. 指导学生如何优化船舶设计以提高适航性
5. 解释货物分布、载重平衡的重要性

回答要求：
- 用通俗易懂的语言解释专业概念
- 给出具体的设计建议和改进方向
- 鼓励学生思考和实践
- 回答要简洁明了，一般不超过200字`;

    // 构建消息列表
    const messages: { role: 'system' | 'user' | 'assistant'; content: string }[] = [
      { role: 'system', content: systemPrompt },
    ];

    // 添加历史对话
    for (const msg of history) {
      messages.push({
        role: msg.role as 'user' | 'assistant',
        content: msg.content,
      });
    }

    // 添加当前问题
    messages.push({ role: 'user', content: message });

    // 调用 LLM
    const response = await this.getLLMClient().invoke(messages, {
      model: 'doubao-seed-1-6-vision-250815',
      temperature: 0.7,
    });

    return {
      code: 200,
      msg: 'success',
      data: { reply: response.content },
    };
  }
}
