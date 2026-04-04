"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ShipDesignsController = void 0;
const common_1 = require("@nestjs/common");
const platform_express_1 = require("@nestjs/platform-express");
const ship_designs_service_1 = require("./ship-designs.service");
let ShipDesignsController = class ShipDesignsController {
    constructor(shipDesignsService) {
        this.shipDesignsService = shipDesignsService;
    }
    async findAll() {
        return this.shipDesignsService.findAll();
    }
    async create(createDto) {
        return this.shipDesignsService.upsert(createDto);
    }
    async uploadImage(file) {
        return this.shipDesignsService.uploadImage(file);
    }
    async recognizeImage(file) {
        return this.shipDesignsService.recognizeImage(file);
    }
    async chat(body) {
        return this.shipDesignsService.chatWithAI(body.message, body.history || []);
    }
};
exports.ShipDesignsController = ShipDesignsController;
__decorate([
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], ShipDesignsController.prototype, "findAll", null);
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], ShipDesignsController.prototype, "create", null);
__decorate([
    (0, common_1.Post)('upload-image'),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('file')),
    __param(0, (0, common_1.UploadedFile)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], ShipDesignsController.prototype, "uploadImage", null);
__decorate([
    (0, common_1.Post)('recognize'),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('file')),
    __param(0, (0, common_1.UploadedFile)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], ShipDesignsController.prototype, "recognizeImage", null);
__decorate([
    (0, common_1.Post)('chat'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], ShipDesignsController.prototype, "chat", null);
exports.ShipDesignsController = ShipDesignsController = __decorate([
    (0, common_1.Controller)('ship-designs'),
    __metadata("design:paramtypes", [ship_designs_service_1.ShipDesignsService])
], ShipDesignsController);
//# sourceMappingURL=ship-designs.controller.js.map