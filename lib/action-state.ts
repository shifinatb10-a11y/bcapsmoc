export type ActionState = {
  ok?: boolean;
  error?: string;
  message?: string;
};

export const emptyActionState: ActionState = {};

export const NOT_AUTHORIZED: ActionState = {
  error: "You are not authorised to perform this action.",
};
