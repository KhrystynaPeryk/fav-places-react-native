export class Place {
    constructor(title, imageUri, location, id) {
        this.title = title
        this.imageUri = imageUri
        this.address = location.address
        this.location = {lat: location.latitude, lng: location.longitude} // {lat: 0.2342, lng: 234.124}
        this.id = id
    }
}