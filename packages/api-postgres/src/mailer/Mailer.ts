import nodemailer from 'nodemailer';

interface MailOptions {
    port?: number;
    jsonTransport?: boolean;
}

class Mailer {
    public static async sendVerificationEmail(): Promise<any> {
        const transporter = nodemailer.createTransport(Mailer.getMailOptions());
        const verifiedTransporter =
            process.env.NODE_ENV === 'testing' ? true : await transporter.verify();

        if (verifiedTransporter) {
            return transporter.sendMail({
                from: 'account.verify@sandbox.com',
                to: 'newUser@desc.org',
                subject: 'Email Verification',
                text: 'Thank you for registering',
                html: 'Thank you for registering'
            });
        }
    }

    private static getMailOptions(): MailOptions {
        let mailOpts = {};
        switch (process.env.NODE_ENV) {
            case 'testing':
                mailOpts = {
                    jsonTransport: true
                };
                break;

            case 'development':
                // configure for local 'mailhog' smtp server
                mailOpts = {
                    port: 1025
                };
                break;

            default:
                break;
        }
        return mailOpts;
    }
}

export default Mailer;
