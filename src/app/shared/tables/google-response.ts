export class GoogleResponse {
    results: Result
}

class Result {
    geometry: Geometry
}

class Geometry {
    location: Location
}

class Location {
    lat: string;
    lng: string;
}
