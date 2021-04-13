import { ISessionItems } from 'src/@types/session';

export function SESSION_ExtractDataAndClear(
  obj_ref: ISessionItems,
  $key: keyof ISessionItems,
) {
  const copied = { ...obj_ref[$key] };
  delete obj_ref[$key];
  return copied;
}
