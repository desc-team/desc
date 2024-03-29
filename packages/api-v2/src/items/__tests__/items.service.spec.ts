import { Test, TestingModule } from '@nestjs/testing';
import { PrismaModule } from '../../prisma/prisma.module';
import { ItemsService } from '../items.service';

describe('ItemsService', () => {
    let service: ItemsService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            imports: [PrismaModule],
            providers: [ItemsService]
        }).compile();

        service = module.get<ItemsService>(ItemsService);
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });
});
