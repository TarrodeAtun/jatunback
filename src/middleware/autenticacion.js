const jwt = require("jsonwebtoken");

var verificarToken = (req, res, next) => {
  
  // console.log(req);
  let token = req.get("Authorization");
  // console.log(token);
  if (token) {
    jwt.verify(token, process.env.SECRET, (err, decoded) => {
      if (err) {
        console.log("error1");
        return res.status(401).json({
          status: 401,
          ok: false,
          mensaje: 'Token inválida'
        });
      }
      next();
    });
  } else {
    console.log("error2");
    return res.status(403).json({
      status: 403,
      ok: false,
      mensaje: 'Token no proveída.'
    });
  }
};

module.exports = {
  verificarToken
};