import { Accounts } from 'meteor/accounts-base';
import '../../api/UserMethods';
import '../../api/UserPublications';

import dotenv from 'dotenv';
dotenv.config();

console.log('MAIL_URL definida?', !!process.env.MAIL_URL);

Accounts.urls.resetPassword = (token) => {
  return `http://localhost:3000/reset-password/${token}`;
};

Accounts.emailTemplates.siteName = 'Advanced Todo List';

Accounts.emailTemplates.from = 'Advanced Todo List <no-reply@advancedtodo.synergia.ufmg.br>';

Accounts.emailTemplates.resetPassword = {
  subject() {
    return 'Redefinição de senha';
  },
  text(user, url) {
    return `Olá ${user?.profile?.name || 'usuário'},

Recebemos uma solicitação para redefinir sua senha.

Clique no link abaixo para criar uma nova senha:
${url}

Se você não solicitou essa alteração, ignore este email.
`;
  },
};