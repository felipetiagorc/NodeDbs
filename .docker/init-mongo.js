/** 
 * Esse script é executado em um ambiente shell
 *  mongo assim que o contêiner é criado.
 */ 
 
db.auth('admin-user', 'admin-password')

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