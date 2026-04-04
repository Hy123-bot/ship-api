import { ShipDesignsService } from './ship-designs.service';
export declare class ShipDesignsController {
    private readonly shipDesignsService;
    constructor(shipDesignsService: ShipDesignsService);
    findAll(): Promise<{
        code: number;
        msg: string;
        data: import("./ship-designs.service").ShipDesign[];
    }>;
    create(createDto: {
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
        data: import("./ship-designs.service").ShipDesign;
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
        data: import("./ship-designs.service").RecognizeResult;
    }>;
    chat(body: {
        message: string;
        history?: {
            role: string;
            content: string;
        }[];
    }): Promise<{
        code: number;
        msg: string;
        data: {
            reply: string;
        };
    }>;
}
