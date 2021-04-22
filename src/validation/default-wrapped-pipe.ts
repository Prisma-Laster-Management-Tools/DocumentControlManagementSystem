/**
 * @Signature Idealized & created by Thiti-Dev
 * @Version 1.0.0
 */

import { BadRequestException, ValidationPipe } from '@nestjs/common';
import { CONFIG } from './config';

interface ILegacyValidationError {
  target: Object;
  property: string;
  children: Array<any>;
  constraints: Record<string, string>;
}

export default new ValidationPipe({
  exceptionFactory: (err) => {
    return new BadRequestException(format(err));
  },
  stopAtFirstError: true, // we don't want multiple error -> we should stop at first <and the class validator priority starts from bottom to top  so pay attention when defining it>
  transform: true, // allow transforming streamline
});

function format(basedValidationError: any) {
  const formatted_error_key_pair = {};
  basedValidationError.forEach((error: ILegacyValidationError) => {
    //const key = Object.keys(error.constraints)[0];
    const value = Object.values(error.constraints)[0];
    formatted_error_key_pair[error.property] = value;
  });

  return {
    status: CONFIG.STATUS_CODE,
    message: CONFIG.VALIDATION_ERROR_MSG,
    [CONFIG.ERRORS_CONTAINING_KEYNAME]: formatted_error_key_pair,
  };
}
