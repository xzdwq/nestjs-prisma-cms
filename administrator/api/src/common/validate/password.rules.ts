import {
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
  registerDecorator,
} from 'class-validator';

@ValidatorConstraint({ async: false })
export class PasswordRules implements ValidatorConstraintInterface {
  validate(password: string): boolean {
    if (password.length < 8 || password.length > 20) return false;
    return /((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/.test(password);
  }
  defaultMessage(): string {
    return 'The password must be at least 8 and no more than 20 characters, contain lowercase and uppercase letters and at least one special character';
  }
}

export function Password(validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string): any {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [],
      validator: PasswordRules,
    });
  };
}
