import { NextResponse } from "next/server"
import rankings from "@/data/universities_ranking.json"
import { University } from "@/models/university"
import fs from "fs/promises"

export async function GET(request: Request) {
	try {
		const fetchPromises = rankings.map(async (ranking, i) => {
			try {
				const response: Response = await fetch(
					`https://maps.googleapis.com/maps/api/geocode/json?address=` +
						encodeURIComponent(ranking.title) +
						`&key=${process.env.GOOGLE_MAPS_API_KEY}`
				)

				if (!response.ok) {
					throw new Error(
						`Request failed with status ${response.status}`
					)
				}

				const { results } = await response.json()
				const university: University = {
					ranking: ranking.ranking,
					title: ranking.title,
					location: ranking.location,
					numberStudents: ranking["number students"],
					genderRatio: ranking["gender ratio"],
					percIntlStudents: ranking["perc intl students"],
					studentsStaffRatio: ranking["students staff ratio"],
					_geoloc: results[0]?.geometry?.location,
				}
				return university
			} catch (error) {
				console.error(error)
				return null
			}
		})

		const universities = await Promise.all(fetchPromises)
		const filteredUniversities = universities.filter(
			(university) => university !== null
		)
		await fs.writeFile(
			"data/universities.json",
			JSON.stringify(filteredUniversities, null, 2)
		)
		return NextResponse.json(filteredUniversities)
	} catch (error) {
		console.error(error)
	}
}
