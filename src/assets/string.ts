
function limitedString(original:string, limit:number):string{
	if (original.length <= limit) {
		return original;
	} else {
		return original.slice(0, limit) + "...";
	}
}

export {
	limitedString
}