const express = require('express');
const moment = require('moment-timezone');

const app = express();
const port = 3333;

app.get('/timenow', (req, res) => {
  const timezone = req.query.tz;

  if (!timezone || !moment.tz.zone(timezone)) {
    return res.status(400).json({
      error: 'Fuso horário inválido ou não informado. Ex: America/Sao_Paulo'
    });
  }

  const now = moment().tz(timezone).format('YYYY-MM-DD HH:mm:ss');

  res.json({
    timezone,
    datetime: now
  });
});

app.listen(port, () => {
  console.log(`Servidor rodando em http://localhost:${port}`);
});
