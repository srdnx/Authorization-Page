module.exports = {
	// Login and Password parser
	parseLoginPassword: function (str, min, max) {
			if(str.match(/^[a-zA-Z0-9]+$/) && str.length >= min && str.length <= max) {
			return true;
		}
		else
		{
			return false;
		}
	},

	// E-mail parser
	parseEmail: function (str) {
		return str.match(/^[-\w.]+@([A-z0-9][-A-z0-9]+\.)+[A-z]{2,4}$/);
	},

	// Full name parser
	parseName: function (str) {
		return str.match(/^[а-яА-ЯёЁa-zA-Z\s]+$/);
	},

	// Date parser
	parseDate: function (str) {
		return str.match(/(19|20)\d\d-((0[1-9]|1[012])-(0[1-9]|[12]\d)|(0[13-9]|1[012])-30|(0[13578]|1[02])-31)/);
	},

	// Checker of password matching
	checkPasswords: function (str1, str2) {
		return str1 == str2;
	}
};
