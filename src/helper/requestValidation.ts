import { ClassConstructor, plainToClass } from 'class-transformer';
import { validate } from 'class-validator';
import { resultStatus } from './resultStatus';

export const validatorDto = async <T extends ClassConstructor<any>>(
  dto: T,
  obj: any,
) => {
  let errorMessages = [];
  const objInstance = plainToClass(dto, obj);
  const errors = await validate(objInstance);
  if (errors.length > 0) {
    errors.map((error) => {
      errorMessages = [...errorMessages, ...Object.values(error.constraints)];
    });
    return resultStatus(errorMessages, false, errors);
  }
  return resultStatus('', true);
};
