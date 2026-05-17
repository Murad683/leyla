const { pool } = require('../../config/db');

const insertContact = async (contact) => {
  const query = `
    INSERT INTO contacts (name, email, phone, company, service, budget, subject, message, ip_address)
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
    RETURNING id, created_at;
  `;
  const values = [
    contact.name, 
    contact.email, 
    contact.phone, 
    contact.company, 
    contact.service, 
    contact.budget, 
    contact.subject, 
    contact.message, 
    contact.ip_address
  ];
  const { rows } = await pool.query(query, values);
  return rows[0];
};

module.exports = {
  insertContact
};
