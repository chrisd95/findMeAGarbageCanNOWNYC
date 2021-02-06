const router = require("express").Router();
const bodyParser = require("body-parser");
let AddressSearch = require("../models/search.model.js");
var urlencodedParser = bodyParser.urlencoded({ extended: false });

router.route("/").post(urlencodedParser, (req, res) => {
  address = req.body.search;
  console.log(address);
  console.log(typeof address);
  const newAddressSearch = new AddressSearch({ address });

  newAddressSearch
    .save()
    .then(() => res.render("searchresult.ejs", { data: req.body }));
  // .catch((err) => res.status(400).json("Error: " + err));
});

module.exports = router;
