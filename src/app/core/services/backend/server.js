const express = require('express');
const cors = require('cors');
const sqlite3 = require('sqlite3').verbose();

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

const db = new sqlite3.Database('database.db');

db.run(`
  CREATE TABLE IF NOT EXISTS companies (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    cnpj TEXT,
    cpf TEXT,
    email TEXT,
    phone TEXT,
    responsible_name TEXT,
    address TEXT,
    status TEXT,
    created_at TEXT,
    updated_at TEXT,
    funci_quanti INTEGER
  )
`);


app.post('/companies', (req, res) => {
  const {
    name, cnpj, cpf, email, phone,
    responsible_name, address, status,
    created_at, updated_at, funci_quanti
  } = req.body;

  const sql = `
    INSERT INTO companies (
      name, cnpj, cpf, email, phone,
      responsible_name, address, status,
      created_at, updated_at, funci_quanti
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;

  db.run(sql, [
    name, cnpj, cpf, email, phone,
    responsible_name, address, status,
    created_at, updated_at, funci_quanti
  ], function (err) {
    if (err) {
      return res.status(500).json({ error: 'Erro ao salvar empresa' });
    }
    res.status(201).json({ id: this.lastID });
  });
});

// LISTAR EMPRESAS
app.get('/companies', (req, res) => {
  db.all('SELECT * FROM companies', (err, rows) => {
    if (err) {
      return res.status(500).json({ error: 'Erro ao buscar empresas' });
    }
    res.json(rows);
  });
});

// BUSCAR EMPRESA POR ID
app.get('/companies/:id', (req, res) => {
  const id = req.params.id;
  db.get('SELECT * FROM companies WHERE id = ?', [id], (err, row) => {
    if (err) {
      return res.status(500).json({ eror: 'Erro ao buscar empresa' });
    }
    if (!row) {
      return res.status(404).json({ error: 'Empresa não encontrada' });
    }
    res.json(row);
  });
});

// ATUALIZAR EMPRESA
app.put('/companies/:id', (req, res) => {
  const id = req.params.id;
  const {
    name, cnpj, cpf, email, phone,
    responsible_name, address, status,
    created_at, updated_at, funci_quanti
  } = req.body;

  const sql = `
    UPDATE companies
    SET name = ?, cnpj = ?, cpf = ?, email = ?, phone = ?,
        responsible_name = ?, address = ?, status = ?,
        created_at = ?, updated_at = ?, funci_quanti = ?
    WHERE id = ?
  `;

  db.run(sql, [
    name, cnpj, cpf, email, phone,
    responsible_name, address, status,
    created_at, updated_at, funci_quanti,
    id
  ], function (err) {
    if (err) {
      return res.status(500).json({ error: 'Erro ao atualizar empresa' });
    }
    res.json({ message: 'Empresa atualizada' });
  });
});

// EXCLUIR EMPRESA
app.delete('/companies/:id', (req, res) => {
  const id = req.params.id;

  db.run('DELETE FROM companies WHERE id = ?', [id], function (err) {
    if (err) {
      return res.status(500).json({ error: 'Erro ao excluir empresa' });
    }
    res.json({ message: 'Empresa excluída' });
  });
});

// INICIA O SERVIDOR
app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});
