const fs = require("fs");
const http = require("http");
const url = require("url");

// Reading Json
const data = fs.readFileSync(`${__dirname}/dev-data/data.json`, "utf-8");
const dataObj = JSON.parse(data);

// Reading HTML Template
const templOverview = fs.readFileSync(`${__dirname}/templates/template-overview.html`, "utf-8");
const templCards = fs.readFileSync(`${__dirname}/templates/template-card.html`, "utf-8");
const templProduct = fs.readFileSync(`${__dirname}/templates/template-product.html`, "utf-8");

// Changing placeholder in HTML template
const replaceHTML = function (templ, product) {
	let output = templ;
	Object.keys(product).forEach((key) => {
		key === "organic" && !product[key]
			? (output = output.replace(new RegExp(`{%${key.toUpperCase()}%}`, "g"), "not-organic"))
			: "";
		output = output.replace(new RegExp(`{%${key.toUpperCase()}%}`, "g"), product[key]);
	});
	return output;
};

// Create Server and Route
const server = http.createServer((req, res) => {
	const {
		query: { id },
		pathname,
	} = url.parse(req.url, true);

	res.writeHead(200, { "content-type": "text/html" });

	if (pathname === "/" || pathname === "/overview") {
		const output = templOverview.replace(
			new RegExp(`{%PRODUCT_CARDS%}`, "g"),
			dataObj.map((el) => replaceHTML(templCards, el)).join("")
		);
		res.end(output);
	} else if (pathname === "/product") {
		const output = replaceHTML(templProduct, dataObj[id]);
		res.end(output);
	}
});

// Listen the request
const PORT = 8000;
const HOST = "127.0.0.1";
server.listen(PORT, HOST, () => {
	console.log(`Server is running on http://localhost:${PORT}/`);
});
