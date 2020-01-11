const express = require("express");
const router = express.Router();
const _ = require("lodash");
const puppeteer = require("puppeteer");
const path = require("path");
//  1. when someone is searching for any state you need to give all the Districts name belongs to that state.
router.get("/search", async (req, res) => {
  try {
    if (req.query.symbol && req.query.period) {
      let symbol = req.query.symbol;
      let period = req.query.period;
      console.log(symbol, period);
      let a = await scraper();
      //   a = JSON.stringify(a);
      res.send(a);
      // res.send({ scraper: 'a' });
    }
  } catch (err) {
    console.log(`this is the error ${err}`);
    res.send({
      error: "Something went wrong or the Query parameter did not match"
    });
  }
});

// method to run scrapper
async function scraper() {
  try {
    const nseUrl =
      "https://www1.nseindia.com/companytracker/cmtracker.jsp?symbol=INFY&cName=cmtracker_nsedef.css";
    // let browser = await puppeteer.launch({
    //   headless: true,
    //   args: ["--no-sandbox", "--disable-setuid-sandbox"]
    // });
    console.log(nseUrl);
    let browser = await puppeteer.launch({
      executablePath: path.resolve(
        __dirname,
        "../../../node_modules/puppeteer/.local-chromium/linux-706915/chrome-linux/chrome"
      ),
      headless: true,
      args: ["--no-sandbox", "--disable-setuid-sandbox"]
    });
    let page = await browser.newPage();
    await page.goto(nseUrl, { waitUntil: "networkidle2" });

    let data = await page.evaluate(() => {
      let headers = [];
      let data = "";
      table1_values = [];
      table2_values = [];
      table3_values = [];
      let a = document.querySelectorAll(".style6");
      let b = Array.from(a);
      b.forEach(el => {
        headers.push(el.textContent);
      });

      let companyName = document.querySelector("nobr").textContent;

      let raw_tables = Array.from(
        document.querySelectorAll(
          "tr:nth-of-type(5)  tr:nth-of-type(2) div table"
        )
      );
      let tables = Array.from(raw_tables);
      const table1 = tables[0].rows;
      const table2 = tables[1].rows;
      const table3 = tables[2].rows;

      for (let i in table1) {
        table1_values.push(String(table1[i].innerText).replace(/\t|_/g, ""));
      }
      for (let i in table2) {
        table2_values.push(String(table2[i].innerText).replace(/\t|_/g, ""));
      }
      for (let i in table3) {
        table3_values.push(String(table3[i].innerText).replace(/\t|_/g, ""));
      }
      return {
        headers,
        companyName,
        table1_values,
        table2_values,
        table3_values
      };
    });
    console.log(data);
    return data;
    await browser.close();
  } catch (err) {
    console.log(`this is the error in the scrapper function: ${err}`);
  }
}

function fetchHeaders() {
  return headers;
}

module.exports = router;
