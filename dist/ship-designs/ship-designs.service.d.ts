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
export declare class ShipDesignsService {
    private storage;
    private llmClient;
    findAll(): Promise<{
        code: number;
        msg: string;
        data: ShipDesign[];
    }>;
    upsert(createDto: {
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
    }): Promise<{
        code: number;
        msg: string;
        data: ShipDesign;
    }>;
    uploadImage(file: Express.Multer.File): Promise<{
        code: number;
        msg: string;
        data: {
            url: string;
        };
    }>;
    recognizeImage(file: Express.Multer.File): Promise<{
        code: number;
        msg: string;
        data: RecognizeResult;
    }>;
    chatWithAI(message: string, history: {
        role: string;
        content: string;
    }[]): Promise<{
        code: number;
        msg: string;
        data: {
            reply: string;
        };
    }>;
}
