function powerOfTwo(num:number) {
	let result = [];
	let power = 0;
	while (num > 0) {
	  if (num % 2 === 1) {
		result.push(Math.pow(2, power));
	  }
	  power++;
	  num = Math.floor(num / 2);
	}
	return result;
}

function sum(array:Array<number>):number {
	let totalCount = 0
	array.forEach(item => {
		totalCount += item
	})
	return totalCount
}

export {
	powerOfTwo,
	sum
}