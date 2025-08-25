// email verification mail
import { Meteor } from 'meteor/meteor';
import { Email } from 'meteor/email';
import { TAPi18n } from 'meteor/rocketchat:tap-i18n';
import { settings } from 'meteor/rocketchat:settings';
import { getURL } from 'meteor/rocketchat:utils';
import { Users } from 'meteor/rocketchat:models';
import { Logger } from 'meteor/rocketchat:logger';
import { SystemLogger } from 'meteor/rocketchat:lib';
import { getUserEmailAddress } from 'meteor/rocketchat:lib';
import { getUserLanguage } from 'meteor/rocketchat:lib';
const logger = new Logger('EmailVerification', {});
const systemLogger = new SystemLogger('EmailVerification');

const fromEmail = settings.get('From_Email');
const siteName = settings.get('Site_Name');
const siteUrl = settings.get('Site_Url');
const emailTemplates = {
    subject() {
        return TAPi18n.__('Email_Verification_Subject', null, getUserLanguage());
    },
    text({ verificationUrl, user }) {
        return TAPi18n.__('Email_Verification_Text', { verificationUrl, siteName, user }, getUserLanguage());
    },
};
const getEmailTemplate = (template, variables) => {
    if (emailTemplates[template]) {
        return emailTemplates[template](variables);
    }
    return '';
};
export const sendVerificationEmail = function(userId, verificationToken) {
    try {
        const user = Users.findOneById(userId);
        if (!user) {
            return;
        }
        const to = getUserEmailAddress(user);
        if (!to) {
            return;
        }
        const verificationUrl = getURL(`/email-verification/${verificationToken}`, { full: true });
        const subject = getEmailTemplate('subject', {});
        const text = getEmailTemplate('text', { verificationUrl, user: user.name || user.username });
        Email.send({
            to,
            from: fromEmail,
            subject,
            text,
        });
        systemLogger.info(`Verification email sent to user ${user.username}`);
    } catch (e) {
        logger.error(`Error sending verification email to userId ${userId}:`, e);
    }
};