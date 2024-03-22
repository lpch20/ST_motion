const nodemailer = require("nodemailer");

export class motionMail {
    /**
     * 
     * @param subject 
     * @param textOrHtml 
     * @param isHtml 
     * @param mailTo 
     * @param attachments 
     * @param callBack 
     * @param callBackError 
     */
    public static sendMail(subject: string, textOrHtml: string, isHtml: boolean, mailTo: string, attachments: any[] | any, callBack: any, callBackError: any): void {
        var transporter = nodemailer.createTransport({
            name: 'stmotion.io',
            service: 'Gmail',
            auth: {
                user: 'stmotion.requiro@gmail.com',
                pass: 'st2016motion'
            }
        });
        var mailOptions = {
            from: 'stmotion.requiro@gmail.com', // sender address
            to: mailTo, // list of receivers
            subject: subject, // Subject line
            text: isHtml ? null : textOrHtml, //, // plaintext body
            html: isHtml ? textOrHtml : null, // You can choose to send an HTML body instead
            attachments: attachments
        };
        transporter.sendMail(mailOptions, (errorMail: any, info: any) => {
            if (errorMail) {
                callBackError(errorMail);
            } else {
                callBack('Message sent: ' + info.response);
            };
        });
    }
}