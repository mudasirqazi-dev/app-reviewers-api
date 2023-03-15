module.exports = {
	TOKEN_NAME: `${process.env.APP_NAME?.replaceAll(
		" ",
		"_"
	).toLowerCase()}_auth`
};
