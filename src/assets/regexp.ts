const yyyymmddRegexp = /^\d{4}\-\d{2}\-\d{2}$/;
const ddmmyyyyRegexp = /^(0[1-9]|1\d|2\d|3[01])\.(0[1-9]|1[0-2])\.\d{4}$/;
const hhmmRegexp = /^([01][0-9]|2[0-3]):[0-5][0-9]$/;

export {
	ddmmyyyyRegexp,
	yyyymmddRegexp,
	hhmmRegexp,
}	