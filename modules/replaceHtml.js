// Changing placeholder in HTML template
module.exports = function (templ, product) {
	let output = templ;
	Object.keys(product).forEach((key) => {
		key === "organic" && !product[key]
			? (output = output.replace(new RegExp(`{%${key.toUpperCase()}%}`, "g"), "not-organic"))
			: "";
		output = output.replace(new RegExp(`{%${key.toUpperCase()}%}`, "g"), product[key]);
	});
	return output;
};
