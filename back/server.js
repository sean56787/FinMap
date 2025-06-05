const express = require('express'); //處理http
const mysql = require('mysql2') //連接mysql/maria
const cors = require('cors'); //cors協議
const yahooFinance = require('yahoo-finance2').default; 
const axios = require('axios');
const jwt = require('jsonwebtoken');
const path = require('node:path');

const app = express(); //express實例
app.use(cors());
app.use(express.json()); //可解析json
app.use(express.static(path.join(__dirname, 'public')));

const currencyAPI = '82a69ade4b87d545894fac25';

const secretKey = 'abcd1234';

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'finmap_db',
});

app.post('/api/Regist', (req, res) => {
    try{
        const {acnt, pwd} = req.body;

        if (!acnt || !pwd) {
            return res.status(400).json({ error: 'Missing account or password' });
        }

        const sqlSearch = 'SELECT * FROM users WHERE account = ?';
        if(!db){
            return res.status(421).json({error:'No Data base available'});
        }
        db.query(sqlSearch, [acnt], (err, result) => {
            if(err){
                console.error('Data base query error: ', err);
                return res.status(422).json({error:'Data base query error'});
            }
            if(result.length > 0){
                return res.status(423).json({error:'Account already exists'});
            } 
            else {
                const sqlInsert = 'INSERT INTO users (account, password) VALUES (?, ?)';
                const values = [acnt, pwd];
                db.query(sqlInsert,values, (err, result) => {
                    if(err){
                        console.error('Data base insert error: ', err);
                        return res.status(424).json({error:'Data base insert error'});
                    }
                    console.log('Data base Insert success');
                    res.status(200).json({ message: 'Data base Insert success', data: result });
                })
            }
        })
    } catch(err){
        console.log(err);
        res.status(500).json({error:JSON.stringify(err)});
    }
});

app.post('/api/Login', (req, res) => {
    try{
        const {acnt, pwd} = req.body;

        if (!acnt || !pwd) {
            return res.status(400).json({ error: 'Missing account or password' });
        }

        const sqlSearch = 'SELECT * FROM users WHERE account = ? AND password = ?';
        if(!db){
            return res.status(421).json({error:'No Data base available'});
        }
        db.query(sqlSearch, [acnt, pwd], (err, result) => {
            if(err){
                console.error('Data base query error: ', err);
                return res.status(422).json({error:'Data base query error'});
            }
            if(result.length > 0){
                const token = jwt.sign({acnt: acnt}, secretKey, {expiresIn: '1h'});
                res.status(200).json({ message: 'User found', token: token , user: {acnt:acnt}});
            } 
            else {
                console.error('User not registed: ', err);
                return res.status(425).json({error:'User not registed'});
            }
        })
    } catch(err){
        console.log(err);
        res.status(500).json({error:'unkown error'});
    }
});

function verifyToken(req, res, next){
    const token = req.headers['authorization'];
    if(!token){
        return res.status(426).json({ error: '沒有提供 Token' });
    }

    jwt.verify(token, secretKey, (err, decoded) => {
        if(err){
            return res.status(427).json({ error: '無效的 Token' });
        }
        req.user = decoded;
        next();
    });
}

app.get('/api/protected', verifyToken, (req, res) => {
    console.log("已經登入")
    res.status(200).json({ message: '你已經登入', user: req.user });
});

app.get('/api/TGSI', async (req, res) => { 
    try{
        const {symbol} = req.query;
        
        if(!symbol){
            return res.status(444).json({error: 'missing symbol'});
        }

        const results = await yahooFinance.quote(symbol);        
        res.json({
            symbol:results.longName,
            regularMarketPrice: results.regularMarketPrice,
            regularMarketChange: results.regularMarketChange,
            regularMarketChangePercent: results.regularMarketChangePercent,
            regularMarketOpen: results.regularMarketOpen,
            regularMarketPreviousClose: results.regularMarketPreviousClose,
            regularMarketDayHigh: results.regularMarketDayHigh,
            regularMarketDayLow: results.regularMarketDayLow,
            regularMarketVolume: results.regularMarketVolume,
            regularMarketTime: results.regularMarketTime,
            regularMarketPrice: results.regularMarketPrice,
        })
    } catch(err){
        console.log(`${symbol} cause error`);
        res.status(500).json({error: `cant fetch from ${symbol}`});
    }
});

app.get('/api/Currency', async (req, res) => { 
    const {fromC, toC} = req.query;

    if(!fromC || !toC){
        return res.status(444).json({error: 'missing currency'});
    }

    axios.get(`https://v6.exchangerate-api.com/v6/${currencyAPI}/latest/${fromC}`)
        .then(response=>{
            console.log(response.data)
            let rate = response.data.conversion_rates[toC];
            res.json({rate})
        })
        .catch(error =>{
            console.log(`Currency error`);
            res.status(444).json({error: error});
        })
});

app.listen(3000, ()=>{
  console.log('Server running at http://localhost:3000');
})