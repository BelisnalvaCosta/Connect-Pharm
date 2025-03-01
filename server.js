const express = require('express');
const mysql = require('mysql2');
const bcrypt = require('bcrypt');
const cors = require('cors');
const nodemailer = require('nodemailer');

const app = express();
app.use(express.json());
app.use(cors());

// Configuração do banco de dados MySQL
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root', // Substitua pelo seu usuário MySQL
    password: '', // Substitua pela senha do MySQL
    database: 'connectPharm_db'
});

db.connect(err => {
    if (err) {
        console.error('Erro ao conectar ao banco de dados:', err);
        return;
    }
    console.log('Conectado ao MySQL');
});

// Configuração do transporte de e-mail (Nodemailer)
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: '', // Seu e-mail
        pass: ''  // Sua senha de aplicativo do Gmail
    }
});

// Rota para cadastrar2 cliente
app.post('/cadastro2_cliente', async (req, res) => {
    const { nome, telefone, email, senha, endereco } = req.body;
    const hashedSenha = await bcrypt.hash(senha, 10);

    db.query('INSERT INTO clientes (nome, telefone, email, senha, endereco) VALUES (?, ?, ?, ?, ?)', 
        [nome, telefone, email, hashedSenha, endereco], 
        (err, result) => {
            if (err) return res.status(500).json({ error: err });
            res.json({ message: 'Cliente cadastrado com sucesso!' });
        }
    );
});

// Rota para login
app.post('/login', (req, res) => {
    const { email, senha } = req.body;

    db.query('SELECT * FROM clientes WHERE email = ?', [email], async (err, result) => {
        if (err) return res.status(500).json({ error: err });

        if (result.length === 0) return res.status(400).json({ message: 'Email ou senha incorretos' });

        const match = await bcrypt.compare(senha, result[0].senha);
        if (!match) return res.status(400).json({ message: 'Email ou senha incorretos' });

        res.json({ message: 'Login bem-sucedido!', user: result[0] });
    });
});

// Rota para cadastrar medicamento
app.post('/gerenc-pharm', (req, res) => {
    const { nome, descricao, preco, local } = req.body;

    db.query('INSERT INTO medicamentos (nome, descricao, preco, local) VALUES (?, ?, ?, ?)', 
        [nome, descricao, preco, local], 
        (err, result) => {
            if (err) return res.status(500).json({ error: err });
            res.json({ message: 'Medicamento cadastrado com sucesso!' });
        }
    );
});

// Rota para buscar medicamento
app.post('/buscar_medicamento', (req, res) => {
    const { nome } = req.body;

    db.query('SELECT * FROM medicamentos WHERE nome = ?', [nome], (err, result) => {
        if (err) return res.status(500).json({ error: err });

        if (result.length === 0) {
            return res.json({ message: 'Medicamento não encontrado' });
        }

        // Enviar e-mail informando que o medicamento foi encontrado
        const mailOptions = {
            from: '',
            to: '',
            subject: 'Medicamento Encontrado',
            text: `O medicamento ${result[0].nome} foi encontrado no local: ${result[0].local}.`
        };

        transporter.sendMail(mailOptions, (error, info) => {
            if (error) console.log(error);
            else console.log('Email enviado: ' + info.response);
        });

        res.json(result[0]);
    });
});

// Iniciar servidor
app.listen(3000, () => {
    console.log('Servidor rodando na porta 3000');
});
