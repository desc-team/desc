import nodemailer from 'nodemailer';
import User from '../entity/User';
import {
    getEmailVerificatonTemplateText,
    getEmailVerificatonTemplateHTML
} from './templates/emailVerificaton';

interface MailOptions {
    port?: number;
    jsonTransport?: boolean;
}

class Mailer {
    public static async sendVerificationEmail(baseUrl: string, user: User): Promise<any> {
        const transporter = nodemailer.createTransport(Mailer.getMailOptions());
        const verifiedTransporter =
            process.env.NODE_ENV === 'testingE2E' || process.env.NODE_ENV === 'testing'
                ? true
                : await transporter.verify();

        if (verifiedTransporter) {
            return transporter.sendMail({
                from: 'account.verify@descportal.org',
                to: user.email,
                subject: 'Email Verification',
                text: getEmailVerificatonTemplateText(baseUrl, user.emailVerificationToken),
                html: getEmailVerificatonTemplateHTML(baseUrl, user.emailVerificationToken)
            });
        }
    }

    private static getMailOptions(): MailOptions {
        let mailOpts = {};
        switch (process.env.NODE_ENV) {
            case 'development':
                // configure for local 'mailhog' smtp server
                mailOpts = {
                    port: 1025
                };
                break;

            case 'testing':
            case 'testingE2E':
                mailOpts = {
                    jsonTransport: true
                };
                break;

            default:
                break;
        }
        return mailOpts;
    }
}

export default Mailer;
