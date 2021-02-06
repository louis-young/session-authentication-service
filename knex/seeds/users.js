export const seed = (knex) => {
  return knex("users")
    .del()
    .then(() => {
      return knex("users").insert([
        { name: "John", email: "john@domain.tld" },
        { name: "Alan", email: "alan@domain.tld" },
        { name: "Bob", email: "bob@domain.tld" },
      ]);
    });
};
