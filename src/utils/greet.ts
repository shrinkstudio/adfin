// NOTE: `@finsweet/ts-utils` is installed as a dependency but no longer imported
// anywhere in src. It ships Webflow helpers (e.g. `getPublishDate`, CMS/list
// utilities) — keep it if you plan to use them, otherwise it's safe to remove
// with `pnpm remove @finsweet/ts-utils`.

/**
 * Greets the user by printing a message in the console.
 * @param name The user's name.
 */
export const greetUser = (name: string) => {
  console.log(`Hello ${name}!`);
};
