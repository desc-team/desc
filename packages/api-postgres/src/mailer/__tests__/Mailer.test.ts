import Mailer from '../Mailer';

describe('Mailer', () => {
    it('sends default verification email', async () => {
        const email = await Mailer.sendVerificationEmail();

        expect(email).toEqual(
            expect.objectContaining({
                envelope: expect.any(Object),
                messageId: expect.any(String)
            })
        );
    });
});
