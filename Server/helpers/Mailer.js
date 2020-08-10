const nodemailer = require("nodemailer");
const path = require('path');
const fs = require('fs');
const Config = require('../helpers/Config');

const Mailer = {

	sendVerificationMail: async (user, VerificationLink) => {
		const htmlFile = path.resolve(__dirname, "EMailTemplates", "ConfirmAccount.htm");
		var fileData = await fs.readFileSync(htmlFile, { encoding: 'utf8', flag: 'r' });
		fileData = fileData.replace("{MyWebsiteUrl}", Config.websiteURL);
		fileData = fileData.replace("{UserName}", user.displayname);
		fileData = fileData.replace("{UserVerificationURL}", VerificationLink);
		fileData = fileData.replace("{Validity}", Config.jwt_token_expire_in_hours);
		const emailData = {
			subject: "Account Verification",
			htmlData: fileData
		};
		var mailInfo = await sendMail(user, emailData);
		return mailInfo;
	},

	sendPasswordResetMail: async (user, PasswordResetLink) => {
		const htmlFile = path.resolve(__dirname, "EMailTemplates", "ResetAccountPassword.htm");
		var fileData = await fs.readFileSync(htmlFile, { encoding: 'utf8', flag: 'r' });
		fileData = fileData.replace("{MyWebsiteUrl}", Config.websiteURL);
		fileData = fileData.replace("{UserPasswordResetURL}", PasswordResetLink);
		fileData = fileData.replace("{Validity}", Config.jwt_token_expire_in_hours);
		const emailData = {
			subject: "Password Reset",
			htmlData: fileData
		};
		var mailInfo = await sendMail(user, emailData);
		return mailInfo;
	},
};

var sendMail = async (user, emailData) => {
	const MailAccount = Config.mailAccount;
	var transporter = nodemailer.createTransport({
		host: MailAccount.SMTP.host,
		port: MailAccount.SMTP.port,
		secure: false, // true for 465, false for other ports
		auth: {
			user: MailAccount.Username,
			pass: MailAccount.Password
		}
	});
	const info = await transporter.sendMail({
		from: `"th3az.superuser" <${MailAccount.Username}>`, // sender address
		to: user.email, // list of receivers
		subject: emailData.subject, // Subject line
		//text: "", // plain text body
		html: emailData.htmlData // html body
	});
	return info;
};

module.exports = Mailer;