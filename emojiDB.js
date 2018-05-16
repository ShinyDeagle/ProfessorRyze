modules.export = {
	//emoji will be the string you are looking for.
	react = (emoji) => {
		//The most used emoji have ailases that allow me to refer to them easily.
		//Two x's will mean that is an invalid emoji in the database
		switch (emoji) {
			default:
				return "\❌\❌";

			case "cross":
			case "x":
			case "wrong":
			case "no":
			case "incorrect":
				return "\❌";

			case "tick":
			case "checkmark":
			case "yes":
			case "correct":
			case "good":
				return "\✅";

			case "think":
			case "thinking":
				return "\🤔";

			case "unamused":
			case "pathetic":
			case ":/":
			case ":|":
			case "df":
				return "\😒";
		}
	}
}
