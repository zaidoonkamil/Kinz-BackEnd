const express = require("express");

function timerRoute(io) {
  const router = express.Router();

  router.get("/start/:seconds", (req, res) => {
    const seconds = parseInt(req.params.seconds);
    let remainingTime = seconds;

    const timer = setInterval(() => {
      if (remainingTime > 0) {
        remainingTime--;
      } else {
        clearInterval(timer);
      }
    }, 1000);

    res.send(`تم بدء العداد لمدة ${seconds} ثانية`);
  });

  return router;
}

module.exports = timerRoute;
