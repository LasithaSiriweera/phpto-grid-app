class PhotoGridModelUtil {
    static convertDbToLocal = (photoGrid) => {
        const photos = [];
        photoGrid.photos.forEach((photo) => {
            photos.push({
                index: photo.index,
                id: photo.id,
                picture: photo.picture,
                timestamp: photo.timestamp
            });
        })

        return {
            id: photoGrid._id,
            userId: photoGrid.userId,
            photos: photos
        };
    }

    static convertLocalToDb = (photoGrid) => {
        const photos = [];
        photoGrid.photos.forEach((photo, index) => {
            photos.push({
                index: index,
                id: photo.id,
                picture: photo.picture,
                timestamp: photo.timestamp
            });
        })
        return {
            userId: photoGrid.userId,
            photos: photos
        };
    }
}

export default PhotoGridModelUtil;
