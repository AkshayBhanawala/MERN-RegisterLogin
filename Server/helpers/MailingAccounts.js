const MailingAccounts = {
	Ethereal: {
		// Fake SMTP host for testing
		Username: '*******DELETED*******',
		Password: '*******DELETED*******',
		SMTP: {
			host: 'smtp.ethereal.email',
			port: '587',
			portSecure: '465',
			security: 'STARTTLS',
		},
		IMAP: {
			host: 'imap.ethereal.email',
			port: '993',
			portSecure: '465',
			security: 'TLS',
		},
		POP3: {
			host: 'pop3.ethereal.email',
			port: '995',
			portSecure: '465',
			security: 'TLS',
		}
	},
	Zoho: {
		Username: '*******DELETED*******',
		Password: '*******DELETED*******',
		SMTP: {
			host: 'smtp.zoho.com',
			port: '587',
			portSecure: '587',
			security: 'SSL'
		}
	}
};

module.exports = MailingAccounts;
