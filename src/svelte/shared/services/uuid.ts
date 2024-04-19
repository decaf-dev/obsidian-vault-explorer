import { nanoid } from "nanoid"

export const generateUUID = () => {
	return nanoid(16)
}
