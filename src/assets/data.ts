function UTCString(date:Date)
{
    return date.toISOString().replace('.000', '')
}

export {
	UTCString
}