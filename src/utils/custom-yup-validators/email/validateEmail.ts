import { EMAIL_REGEX } from 'utils/constants';
import * as Yup from 'yup';

declare module 'yup' {
  export interface StringSchema {
    /**
     * Check for email validity.
     *
     * @param {String} [errorMsg] Custom error message.
     */
    validateEmail(errorMsg?: string): StringSchema;
  }
}

const YUP_EMAIL_METHOD = 'validateEmail';

Yup.addMethod(
  Yup.string,
  YUP_EMAIL_METHOD,
  function (errMsg = 'Please enter a valid email address.') {
    // @ts-ignore
    // Found this method here - https://github.com/manishsaraan/email-validator/blob/master/index.js
    return this.test(YUP_EMAIL_METHOD, errMsg, (value?: string) => {
      try {
        if (value === undefined) {
          return false;
        }
        const emailParts = value.split('@');

        if (emailParts.length !== 2) return false;

        const account = emailParts[0];
        const address = emailParts[1];

        if (account.length > 64) return false;
        else if (address.length > 255) return false;

        const domainParts = address.split('.');

        if (
          domainParts.some(function (part) {
            return part.length > 63;
          })
        )
          return false;

        return EMAIL_REGEX.test(value);
      } catch {
        return false;
      }
    });
  },
);
