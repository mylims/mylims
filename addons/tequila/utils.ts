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
  { email, name, firstname, user }: Record<string, string | undefined>,
) {
  // Update email
  if (email && !internalUser.emails.includes(email)) {
    internalUser.emails.push(email);
  }

  // Update name
  if (name && internalUser.lastName !== name) {
    internalUser.lastName = name;
  }
  if (firstname && internalUser.firstName !== firstname) {
    internalUser.firstName = firstname;
  }

  // Update usernames
  if (user && !internalUser.usernames.includes(user)) {
    internalUser.usernames.push(user);
  }
  return internalUser.save();
}
