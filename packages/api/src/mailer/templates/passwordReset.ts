import { styles } from './common';

export function getPasswordResetTemplateHTML(baseUrl: string, token: string): string {
    return `
${styles}
<div class="container">
    <div class="banner">
        <p>Password Reset</p>
    </div>
    <p class="text">
        You recently requested to reset your password for the DESC In-Kind Portal. If you did not initiate this request,
        no action is required.  If you did, then you will need to click on the link below and change your password when
        redirected to the "Change Password" form.  This link is only valid for the next 2 hours.
    </p>
    <a class="btn" href="${baseUrl}/changepassword/${token}">Password Reset</a>
    <p class="text">or click on the below link:</p>
    <p class="text"><a href="${baseUrl}/confirmemail/${token}">${baseUrl}/changepassword/${token}</a></p>
    <p class="text">If you did not request a password reset for your DESC In-Kind Portal account, please disregard this email.</p>
    <p class="text">Thank you!</p>
    <p class="text">&mdash; The DESC In-Kind Portal Team</p>
</div>
<p class="footer">&copy; 2020 &bull; All Rights Reserved &bull; Downtown Emergency Service Center</p>
`;
}

export function getPasswordResetTemplateText(baseUrl: string, token: string): string {
    return `
You recently requested to reset your password for the DESC In-Kind Portal. If you did not initiate this request,
no action is required.  If you did, then you will need to click on the link below and change your password when
redirected to the "Change Password" form.  This link is only valid for the next 2 hours.

    ${baseUrl}/changepassword/${token}

If you did not request a password reset for your DESC In-Kind Portal account, please disregard this email.

Thank you!
-- The DESC In-Kind Portal Team
`;
}
