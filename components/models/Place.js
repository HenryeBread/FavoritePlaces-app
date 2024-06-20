export class Place {
    constructor(title, imagePath, location, id) {
        this.title = title;
        this.imagePath = imagePath;
        this.address = location.address
        this.location = { lat: location.lat, lng: location.lng}
        this.id = id;
    }
}