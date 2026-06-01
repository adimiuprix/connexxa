'use client';

import { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';

// Fix default marker icons (Leaflet + webpack issue)
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
    iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
    iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
    shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

const activeIcon = new L.Icon({
    iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
    iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
    shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
    iconSize: [30, 46],
    iconAnchor: [15, 46],
    popupAnchor: [0, -46],
    shadowSize: [46, 46],
});

const defaultIcon = new L.Icon({
    iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
    iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
    shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
    iconSize: [20, 31],
    iconAnchor: [10, 31],
    popupAnchor: [0, -31],
    shadowSize: [31, 31],
});

export interface Store {
    id: number;
    name: string;
    address: string;
    city: string;
    hours: string;
    phone: string;
    lat: number;
    lng: number;
}

// Sub-component to fly to selected store
function FlyTo({ store }: { store: Store | null }) {
    const map = useMap();
    useEffect(() => {
        if (store) {
            map.flyTo([store.lat, store.lng], 16, { duration: 1.2 });
        }
    }, [store, map]);
    return null;
}

interface StoreMapProps {
    stores: Store[];
    selectedStore: Store | null;
    onSelectStore: (store: Store) => void;
}

export default function StoreMap({ stores, selectedStore, onSelectStore }: StoreMapProps) {
    return (
        <MapContainer
            center={[-2.5, 118]}
            zoom={5}
            className="w-full h-full"
            scrollWheelZoom
        >
            <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <FlyTo store={selectedStore} />
            {stores.map((store) => (
                <Marker
                    key={store.id}
                    position={[store.lat, store.lng]}
                    icon={selectedStore?.id === store.id ? activeIcon : defaultIcon}
                    eventHandlers={{ click: () => onSelectStore(store) }}
                >
                    <Popup>
                        <div className="text-[12px] min-w-[160px]">
                            <p className="font-black uppercase tracking-tight text-black text-[13px] mb-1">{store.name}</p>
                            <p className="text-gray-600">{store.address}</p>
                            <p className="text-gray-500 mt-1">{store.hours}</p>
                            <p className="text-gray-500">{store.phone}</p>
                        </div>
                    </Popup>
                </Marker>
            ))}
        </MapContainer>
    );
}
