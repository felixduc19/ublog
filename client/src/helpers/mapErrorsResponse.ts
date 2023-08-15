import { FieldError } from "../generated/graphql";

export const mapErrorValidationErrorResponse = (
    errors: FieldError[]
): { [key: string]: string } => {
    return errors.reduce(
        (accumulatedErrors, error) => ({
            ...accumulatedErrors,
            [error.field]: error.message,
        }),
        {}
    );
};
