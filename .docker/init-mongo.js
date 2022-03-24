db.auth('admin', 'senhaadmin')

db = db.getSiblingDB('herois')

db.createUser({
  user: 'felipe',
  pwd: 'fe2022',
  roles: [
    {
      role: 'readWrite',
      db: 'herois',
    },
  ],
});