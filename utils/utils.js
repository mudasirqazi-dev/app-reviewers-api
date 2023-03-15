const fs = require("fs");
const path = require("path");
const mongoose = require("mongoose");
const { isUUID } = require("validator");

module.exports = {
	readTemplate: templateName => {
		return new Promise((resolve, reject) => {
			fs.readFile(
				path.join(__dirname, `../templates/${templateName}.html`),
				"utf8",
				(err, html) => {
					if (err) resolve(``);

					resolve(html);
				}
			);
		});
	},
	groupArrayOfObjects: (list, key) => {
		return list.reduce(function (rv, x) {
			(rv[x[key]] = rv[x[key]] || []).push(x);
			return rv;
		}, {});
	},
	replaceAll: (str, find, replace) =>
		str.replace(new RegExp(find, "g"), replace),
	isValidUUID4: id => isUUID(id, 4)
};
