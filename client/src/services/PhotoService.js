import axios from 'axios';
import PhotoGridModelUtil from '../utils/PhotoGridModelUtil';

class PhotoService {
	path = `${process.env.REACT_APP_API_ROOT_URL}/photogrids`;
	userId = process.env.REACT_APP_DEFAULT_USER;
	imageStoreUrl = process.env.REACT_APP_IMG_STORE_URL;

	/**
	 * Create new photo grid for user.
	 * 
	 * @param photoGrid 
	 * @returns new photo grid.
	 */
	addPhotoGrid = async (photoGrid) => {
		try {
			const res = await axios.post(this.path, PhotoGridModelUtil.convertLocalToDb(photoGrid));
			return PhotoGridModelUtil.convertDbToLocal(res.data);
		} catch (error) {
			throw error;
		}
	}

	/**
	 * Update photo grid.
	 * 
	 * @param photoGrid 
	 * @param id 
	 * @returns updated photo grid.
	 */
	updatePhotoGrid = async (photoGrid, id) => {
		try {
			const res = await axios.put(`${this.path}/${id}`, PhotoGridModelUtil.convertLocalToDb(photoGrid));
			return PhotoGridModelUtil.convertDbToLocal(res.data);;
		} catch (error) {
			throw error;
		}
	}

	/**
	 * Remove the grid
	 * 
	 * @param id grid id
	 */
	removeGrid = async (id) => {
		try {
			const res = await axios.delete(`${this.path}/${id}`);
			return res;
		} catch (error) {
			throw error;
		}
	}

	/**
	 * Get user's photo grid.
	 * 
	 * @returns 
	 */
	getUserPhotoGrid = async () => {
		try {
			const res = await axios.get(`${this.path}/?userId=${this.userId}`);
			return res.data && res.data.length > 0 ? PhotoGridModelUtil.convertDbToLocal(res.data[0]) : null;
		} catch (error) {
			throw error;
		}
	}

	getAllImages = async () => {
		try {
			const res = await axios.get(this.imageStoreUrl);
			return res.data.entries;
		} catch (error) {
			throw error;
		}
	}
}

export default new PhotoService();
