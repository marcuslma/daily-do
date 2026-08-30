export type AuthField =
  | "name"
  | "email"
  | "password"
  | "passwordConfirmation"
  | "token";

export type AuthActionState = {
  message?: string;
  fieldErrors?: Partial<Record<AuthField, string[]>>;
};

export const initialAuthActionState: AuthActionState = {};
