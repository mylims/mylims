import User from 'App/Models/User';

/**
 * Parses a string to an object
 * @param input Text to separate using =
 */
export function textToObject(input: string): Record<string, string> {
  const lines = input.split('\n');
  let ans: Record<string, string> = {};
  for (const line of lines) {
    const [key, val] = line.split('=');
    ans[key] = val;
  }
  return ans;
}

/**
 * Appends the query params to the base URL
 * @param initial Base URL
 * @param object Dictionary with values to use as query params
 */
export function objectToUrl(
  initial: string,
  object: Record<string, string | undefined>,
) {
  const url = new URL(initial);
  for (const key in object) {
    if (object[key] !== undefined) {
      url.searchParams.append(key, object[key] as string);
    }
  }
  return url;
}

/**
 * Updates user based on the tequila response
 * @param internalUser User from the database
 * @param tequilaUser User from tequila information
 */
export function reconciliate(
  internalUser: User,
  tequilaUser: Record<string, string>,
) {
  if (tequilaUser.email && !internalUser.emails.includes(tequilaUser.email)) {
    internalUser.emails.push(tequilaUser.email);
  }
  if (tequilaUser.name && internalUser.lastName !== tequilaUser.name) {
    internalUser.lastName = tequilaUser.name;
  }
  if (
    tequilaUser.firstname &&
    internalUser.firstName !== tequilaUser.firstname
  ) {
    internalUser.firstName = tequilaUser.firstname;
  }
  return internalUser.save();
}
