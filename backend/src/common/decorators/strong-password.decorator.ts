import { registerDecorator, ValidationOptions } from 'class-validator';

// Password: 8-16 chars, at least one uppercase letter and one special character
export function IsStrongPassword(validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      name: 'isStrongPassword',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: {
        validate(value: any) {
          if (typeof value !== 'string') return false;
          if (value.length < 8 || value.length > 16) return false;
          const hasUpper = /[A-Z]/.test(value);
          const hasSpecial = /[!@#$%^&*(),.?":{}|<>_\-+=\[\]\\\/~`;']/.test(value);
          return hasUpper && hasSpecial;
        },
        defaultMessage() {
          return 'Password must be 8-16 characters and include at least one uppercase letter and one special character';
        },
      },
    });
  };
}
