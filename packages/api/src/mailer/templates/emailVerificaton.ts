import { styles } from './common';

export function getEmailVerificatonTemplateHTML(baseUrl: string, token: string): string {
    return `
${styles}
<div class="container">
    <div class="banner">
        <p>Thank You for Registering</p>
    </div>
    <p class="text">Thank you for using the DESC In-Kind Portal!</p>
    <p class="text">
        Please confirm your email address by clicking on the button below. We'll communicate with
        you from time to time via email so it's important that we have an up-to-date email address on file.
    </p>
    <a class="btn" href="${baseUrl}/confirmemail/${token}">Verify Email</a>
    <p class="text">or click on the below link:</p>
    <p class="text"><a href="${baseUrl}/confirmemail/${token}">${baseUrl}/confirmemail/${token}</a></p>
    <p class="text">If you did not sign up for a DESC In-Kind Portal account please disregard this email.</p>
    <p class="text">Thank you!</p>
    <p class="text">&mdash; The DESC In-Kind Portal Team</p>
</div>
<p class="footer">&copy; 2020 &bull; All Rights Reserved &bull; Downtown Emergency Service Center</p>
`;
}

export function getEmailVerificatonTemplateText(baseUrl: string, token: string): string {
    return `
Thank you for registering for the DESC In-Kind Portal!

Please confirm your email address by clicking on the button below. We'll communicate with
you from time to time via email so it's important that we have an up-to-date email address on file.

    ${baseUrl}/confirmemail/${token}

If you did not sign up for a DESC In-Kind Portal account please disregard this email.

Thank you!
-- The DESC In-Kind Portal Team
`;
}
