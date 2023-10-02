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

function compare(arr1:Array<any>, arr2:Array<any>, equalCheck:Function|null=null){
	return arr1.find((item1, index1) => {
		if (!arr2[index1])
			return true
		else if (equalCheck && equalCheck(item1, arr2[index1]))
			return false
		else if (item1 == arr2[index1])
			return false
		else 
			return true
	})
}

export {
	powerOfTwo,
	compare,
	sum
}