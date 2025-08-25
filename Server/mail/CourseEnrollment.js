// enrollment mail
import { Meteor } from 'meteor/meteor';
import { Email } from 'meteor/email';
import { TAPi18n } from 'meteor/rocketchat:tap-i18n
';
import { settings } from 'meteor/rocketchat:settings';          
import { getURL } from 'meteor/rocketchat:utils';
import { Users } from 'meteor/rocketchat:models';
import { Logger } from 'meteor/rocketchat:logger';
import { SystemLogger } from 'meteor/rocketchat:lib';
import { getUserEmailAddress } from 'meteor/rocketchat:lib';
import { getUserLanguage } from 'meteor/rocketchat:lib';


const logger = new Logger('Courseenrollmentmail', {});
const systemLogger = new SystemLogger('Courseenrollmentmail');
const fromEmail = settings.get('From_Email');
const siteName = settings.get('Site_Name');
const siteUrl = settings.get('Site_Url');
const emailTemplates = {
    subject({ courseName }) {
        return TAPi18n.__('Your_enrollment_in_course', { courseName }, getUserLanguage());
    },
    text({ courseName, courseUrl, user }) {
        return TAPi18n.__('You_have_been_enrolled_in_course', { courseName, courseUrl, siteName, user }, getUserLanguage());
    },
};
const getEmailTemplate = (template, variables) => {
    if (emailTemplates[template]) {
        return emailTemplates[template](variables);
    }
    return '';
};
export const sendEnrollmentEmail = function(userId, courseName, courseUrl) {
    try {
        const user = Users.findOneById(userId);
        if (!user) {
            return;
        }
        const to = getUserEmailAddress(user);
        if (!to) {
            return;
        }
        const subject = getEmailTemplate('subject', { courseName });
        const text = getEmailTemplate('text', { courseName, courseUrl: getURL(courseUrl, { full: true }), user: user.name || user.username });
        Email.send({
            to,
            from: fromEmail,
            subject,
            text,
        });
        systemLogger.info(`Enrollment email sent to user ${user.username} for course ${courseName}`);
    } catch (e) {
        logger.error(`Error sending enrollment email to userId ${userId} for course ${courseName}:`, e);
    }
};
