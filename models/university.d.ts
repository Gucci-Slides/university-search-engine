export interface University {
	ranking: number
	title: string
	location: string
	numberStudents: string
	studentsStaffRatio: string
	percIntlStudents: string
	genderRatio: string
	_geoloc?: {
		lat: number
		lng: number
	}
}
