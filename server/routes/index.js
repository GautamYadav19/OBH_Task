const express = require("express");
const { async } = require("rxjs");
const db = require("../database");
const e = require("express");
const rootdb = require("../database");
const PDFDocument = require("pdfkit");
const fs = require("fs");
const axios = require("axios");

const router = express.Router();
router.get("/getlist", async (req, res, next) => {
  try {
    let result = await db.getAuthorBooks();
    res.json(result);
  } catch (e) {
    console.log(e);
    res.sendStatus(500);
  }
});
router.post("/insertItem", async (req, res, next) => {
  try {
    console.log(req.body);
    let result = await db.insertAuthorBooks(req.body);
    console.log(result);
    res.json(result);
  } catch (e) {
    console.log(e);
    res.sendStatus(500);
  }
});
router.put("/updateItem", async (req, res, next) => {
  try {
    console.log(req.body);
    let result = await db.updateAuthorBooks(req.body);
    // console.log(result);
    res.json(result);
  } catch (e) {
    console.log(e);
    res.sendStatus(500);
  }
});
router.delete("/deteteItem/:id", async (req, res, next) => {
  try {
    let result = await db.deletAuthorBooks(req.params.id);
    console.log(result);
    res.json(result);
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
});
router.get("/generate-pdf", (req, res) => {
  try {
    const pdfDoc = new PDFDocument();
    const outputStream = fs.createWriteStream("text_alignment.pdf");

    async function fetchDataFromAPI() {
      try {
        const response = await axios.get("http://localhost:3000/api/getlist"); // Replace with your API URL
        return response.data;
      } catch (error) {
        console.error("Failed to fetch data from the API:", error);
        return null;
      }
    }

    async function generatePDF() {
      try {
        const data = await fetchDataFromAPI();

        pdfDoc.pipe(outputStream);
        pdfDoc.fontSize(12).text("ID | Title | Name", { align: "left" });
        pdfDoc.fontSize(12).text("-".repeat(40), { align: "left" });
        pdfDoc.fontSize(12);
        for (const item of data) {
          pdfDoc.text(
            `${item.id.toString().padEnd(4)}, ${item.title.padEnd(14)}, ${
              item.name
            }`,
            { align: "left" }
          );
        }

        pdfDoc.end();
        console.log("PDF generation completed successfully.");
        res.json("PDF generation completed successfully.");
      } catch (error) {
        console.error("Error generating PDF:", error);
      }
    }

    generatePDF();
  } catch (error) {
    res.status(500).send("Error generating PDF");
  }
});
module.exports = router;
