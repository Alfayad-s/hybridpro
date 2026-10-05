"use client";

import { useEffect, useRef, useState } from "react";

export type DeliveryPin = {
  address: string;
  city: string;
  pincode: string;
};

type MapsNamespace = {
  maps: {
    Map: new (el: HTMLElement, options: Record<string, unknown>) => GoogleMap;
    Marker: new (options: Record<string, unknown>) => GoogleMarker;
    Geocoder: new () => {
      geocode: (
        request: { location: { lat: number; lng: number } },
        callback: (results: GeocodeResult[] | null, status: string) => void,
      ) => void;
    };
    places: {
      Autocomplete: new (
        input: HTMLInputElement,
        options: Record<string, unknown>,
      ) => GoogleAutocomplete;
    };
    event: {
      addListener: (
        target: object,
        name: string,
        handler: (event?: { latLng?: GoogleLatLng }) => void,
      ) => void;
    };
  };
};

type GoogleLatLng = { lat: () => number; lng: () => number };
type GoogleMap = {
  panTo: (position: { lat: number; lng: number }) => void;
  setZoom: (zoom: number) => void;
};
type GoogleMarker = {
  setPosition: (position: { lat: number; lng: number }) => void;
  getPosition: () => GoogleLatLng | null;
};
type GoogleAutocomplete = {
  getPlace: () => { geometry?: { location?: GoogleLatLng } };
};
type GeocodeResult = {
  formatted_address?: string;
  address_components?: { long_name: string; types: string[] }[];
};

declare global {
  interface Window {
    google?: MapsNamespace;
  }
}

const defaultCenter = { lat: 10.0261, lng: 76.3125 };

let mapsLoader: Promise<void> | null = null;

function loadMaps(mapsKey: string) {
  if (window.google?.maps) return Promise.resolve();
  if (!mapsLoader) {
    mapsLoader = new Promise((resolve, reject) => {
      const script = document.createElement("script");
      script.src = `https://maps.googleapis.com/maps/api/js?key=${encodeURIComponent(mapsKey)}&libraries=places`;
      script.async = true;
      script.onload = () => resolve();
      script.onerror = () => reject(new Error("map-load-failed"));
      document.head.appendChild(script);
    });
  }
  return mapsLoader;
}

function readPin(result: GeocodeResult | undefined): DeliveryPin | null {
  if (!result?.formatted_address) return null;
  const parts = result.address_components ?? [];
  const find = (...types: string[]) =>
    parts.find((part) => types.some((type) => part.types.includes(type)))?.long_name ||
    "";
  return {
    address: result.formatted_address,
    city: find("locality", "administrative_area_level_2", "sublocality"),
    pincode: find("postal_code").replace(/\D/g, "").slice(0, 6),
  };
}

export function DeliveryPinMap({
  onChange,
}: {
  onChange: (pin: DeliveryPin | null) => void;
}) {
  const mapNode = useRef<HTMLDivElement>(null);
  const searchNode = useRef<HTMLInputElement>(null);
  const onChangeRef = useRef(onChange);
  const [apiKey, setApiKey] = useState("");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    onChangeRef.current = onChange;
  }, [onChange]);

  useEffect(() => {
    let cancelled = false;
    fetch("/api/shop/maps-key")
      .then((res) => res.json())
      .then((data: { apiKey?: string }) => {
        if (cancelled) return;
        const key = data.apiKey?.trim() || "";
        if (!key) setError("The delivery map is unavailable.");
        else setApiKey(key);
      })
      .catch(() => {
        if (!cancelled) setError("The delivery map is unavailable.");
      });
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (!apiKey || !mapNode.current) return;
    let cancelled = false;
    loadMaps(apiKey)
      .then(() => {
        if (cancelled || !mapNode.current || !window.google) return;
        const maps = window.google.maps;
        const map = new maps.Map(mapNode.current, {
          center: defaultCenter,
          zoom: 13,
          disableDefaultUI: true,
          zoomControl: true,
          clickableIcons: false,
          gestureHandling: "greedy",
        });
        const marker = new maps.Marker({
          map,
          position: defaultCenter,
          draggable: true,
        });
        const geocoder = new maps.Geocoder();

        const placePin = (latLng: GoogleLatLng) => {
          const position = { lat: latLng.lat(), lng: latLng.lng() };
          marker.setPosition(position);
          map.panTo(position);
          geocoder.geocode({ location: position }, (results, status) => {
            if (cancelled) return;
            if (status !== "OK") {
              onChangeRef.current(null);
              return;
            }
            onChangeRef.current(readPin(results?.[0]));
          });
        };

        maps.event.addListener(marker, "dragend", () => {
          const position = marker.getPosition();
          if (position) placePin(position);
        });
        maps.event.addListener(map, "click", (event) => {
          if (event?.latLng) placePin(event.latLng);
        });

        if (searchNode.current) {
          const search = new maps.places.Autocomplete(searchNode.current, {
            fields: ["geometry"],
            componentRestrictions: { country: "in" },
          });
          maps.event.addListener(search, "place_changed", () => {
            const location = search.getPlace().geometry?.location;
            if (!location) return;
            map.setZoom(16);
            placePin(location);
          });
        }

        if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition((position) => {
            if (cancelled) return;
            placePin({
              lat: () => position.coords.latitude,
              lng: () => position.coords.longitude,
            });
            map.setZoom(16);
          });
        }
      })
      .catch(() => {
        if (!cancelled) setError("The map could not be loaded.");
      });
    return () => {
      cancelled = true;
    };
  }, [apiKey]);

  return (
    <div className="flex flex-col gap-3">
      <label className="text-sm">
        <span className="mb-1.5 block text-[color:var(--muted)]">
          Search or pin the delivery location
        </span>
        <input
          ref={searchNode}
          placeholder="Search an area"
          className="w-full rounded-xl border border-[color:var(--border)] bg-transparent px-4 py-3 outline-none"
        />
      </label>
      <div className="overflow-hidden rounded-2xl border border-[color:var(--border)]">
        {error ? (
          <p className="px-4 py-10 text-center text-sm text-[color:var(--muted)]">
            {error}
          </p>
        ) : (
          <div ref={mapNode} className="h-64 w-full" />
        )}
      </div>
    </div>
  );
}
