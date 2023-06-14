// Airports.tsx
import L, { Map } from "leaflet"
import MarkerIcon from "../node_modules/leaflet/dist/images/marker-icon.png"
import MarkerShadow from "../node_modules/leaflet/dist/images/marker-shadow.png"
import React, { useState } from "react"
import { Marker, Popup, useMapEvents } from "react-leaflet"
import { useGeoSearch } from "@/lib/useGeoSearch"
import { University } from "@/models/university"
import { useSearchBox } from "react-instantsearch-hooks-web"

export function Universities() {
	const { query, refine: refineQuery } = useSearchBox()
	const {
		items,
		refine: refineItems,
		currentRefinement,
		clearMapRefinement,
	} = useGeoSearch<Record<string, University>>()

	const [previousQuery, setPreviousQuery] = useState(query)
	const [skipViewEffect, setSkipViewEffect] = useState(false)

	const onViewChange = ({ target }: { target: Map }) => {
		setSkipViewEffect(true)

		if (query.length > 0) {
			refineQuery("")
		}

		refineItems({
			northEast: target.getBounds().getNorthEast().wrap(),
			southWest: target.getBounds().getSouthWest().wrap(),
		})
	}
	const map = useMapEvents({
		zoomend: onViewChange,
		dragend: onViewChange,
	})

	if (query !== previousQuery) {
		if (currentRefinement) {
			clearMapRefinement()
		}

		if (items.length > 0 && !skipViewEffect) {
			map.setView(items[0]._geoloc)
		}
		setSkipViewEffect(false)
		setPreviousQuery(query)
	}

	return (
		<>
			{items.map((item) => (
				<Marker
					key={item.objectID}
					position={item._geoloc}
					icon={
						new L.Icon({
							iconUrl: MarkerIcon.src,
							iconRetinaUrl: MarkerIcon.src,
							iconSize: [25, 41],
							iconAnchor: [12.5, 41],
							popupAnchor: [0, -41],
							shadowUrl: MarkerShadow.src,
							shadowSize: [41, 41],
						})
					}
				>
					<Popup>
						<strong>{String(item.title)}</strong>
						<br />
						{String(item.location)}
					</Popup>
				</Marker>
			))}
		</>
	)
}
