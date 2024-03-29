import { Test, TestingModule } from '@nestjs/testing';
import { PrismaModule } from '../../prisma/prisma.module';
import { ClientRequestController } from '../client-requests.controller';
import { ClientRequestService } from '../client-requests.service';

describe('ClientRequestController', () => {
    let controller: ClientRequestController;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            imports: [PrismaModule],
            controllers: [ClientRequestController],
            providers: [ClientRequestService]
        }).compile();

        controller = module.get<ClientRequestController>(ClientRequestController);
    });

    it('should be defined', () => {
        expect(controller).toBeDefined();
    });
});
