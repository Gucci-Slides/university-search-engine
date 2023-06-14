// App.tsx
"use client"
import algoliasearch from "algoliasearch/lite"
import {
	Hits,
	HitsProps,
	InstantSearch,
	SearchBox,
	UseHitsProps,
} from "react-instantsearch-hooks-web"
import { MapContainer, TileLayer } from "react-leaflet"
import { Universities } from "./Universities"
import { useGeoSearch } from "@/lib/useGeoSearch"
import "leaflet/dist/leaflet.css"
import { University } from "@/models/university"
import { divIcon } from "leaflet"

export type UniversityRecord = Record<number, University[]>

export default function Map() {
	const searchClient = algoliasearch(
		"GX4DKB4AM6",
		"95fff3b0df30d00aefab059d4f2f2d9e"
	)
	return (
		<InstantSearch searchClient={searchClient} indexName={"ranking_2021"}>
			<div className='flex flex-row h-screen'>
				<div className='w-1/2 h-full max-h-screen overflow-y-auto flex flex-col flex-grow scroll-smooth border shadow-sm'>
					<SearchBox
						placeholder='Search for the top 1500 schools'
						classNames={{
							root: "flex justify-center p-5",
							form: "flex flex-grow flex-shrink w-1/3 rounded-full shadow-md p-3 bg-gray-300 border border-gray-300 focus:border-slate-400 hover:border-slate-400",
							input: "flex flex-grow flex-shrink outline-none text-start bg-gray-300 overflow-hidden placeholder:text-gray-600",
						}}
						autoFocus
					/>
					<Hits
						hitComponent={({ hit }) => (
							<div className='border rounded-md p-2 m-2 shadow-md'>
								<p>School Name: {String(hit.title)}</p>
								<p className=''>
									World Ranking: #{String(hit.ranking)}
								</p>
								<p>Country: {String(hit.location)}</p>
							</div>
						)}
						className=''
					></Hits>
				</div>
				<div className='w-1/2'>
					<MapContainer
						style={{ height: "100vh" }}
						center={[37.4274745, -122.169719]}
						zoom={10}
						minZoom={4}
						scrollWheelZoom={true}
						dragging={true}
					>
						<TileLayer
							attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
							url='https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
							className='flex'
						/>
						<Universities />
					</MapContainer>
				</div>
			</div>
		</InstantSearch>
	)
}
