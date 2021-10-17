import "./PhotoGrid.css";
import React, { useState, useEffect, useRef } from "react";
import Modal from "react-modal";
import { AiFillEdit } from "react-icons/ai";
import PhotoService from "../services/PhotoService";
import ReactLoading from "react-loading";

import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const customStyles = {
	content: {
		display: "flex",
		flexDirection: "column",
		flexWrap: "wrap",
		border: "2px solid #ccc",
		width: "60%",
		margin: "auto",
	},
};

Modal.setAppElement("#root");

const PhotoGrid = () => {
	const userId = process.env.REACT_APP_DEFAULT_USER;
	const [isLoading, setLoading] = useState(false);
	const [items, setItems] = useState([]);
	const [gridId, setGridId] = useState([]);
	const [newGrid, setNewGrid] = useState(true);
	const [saveMode, setSaveMode] = useState(false);
	const [dragging, setDragging] = useState(false);
	const [gridItems, setGridItems] = useState([]);
	const [selectedIndex, setSelectedIndex] = useState(null);
	const [modalIsOpen, setIsOpen] = useState(false);

	useEffect(() => {
		const loadData = async () => {
			try {
				setLoading(true);
				const promises = [
					PhotoService.getAllImages(),
					PhotoService.getUserPhotoGrid(),
				];
				const [allPhotos, userPhotoGrid] = await Promise.all(promises);
				setItems(allPhotos);
				if (userPhotoGrid) {
					setNewGrid(false);
					setGridId(userPhotoGrid.id);
					setGridItems(userPhotoGrid.photos);
				} else {
					setNewGrid(true);
					setSaveMode(true);
                    displayToastMessage('Select nine photos from gallery');
				}
				setLoading(false);
			} catch (error) {
				alert(error);
			}
		};
		loadData();
	}, []);

	const openModal = (index) => {
		setSelectedIndex(index);
		setIsOpen(true);
	};

	const onItemSelected = (item) => {
		const nextState = [...gridItems];
		nextState[selectedIndex] = item;
		setGridItems(nextState);
		setIsOpen(false);
		setSaveMode(true);
	};

	const dragItemNode = useRef();

	const handletDragStart = (event, index) => {
		dragItemNode.current = event.target;
		setSelectedIndex(index);
		dragItemNode.current.addEventListener("dragend", handleDragEnd);

		setTimeout(() => {
			setDragging(true);
		}, 50);
	};

	const handleDragEnter = (index) => {
		if (selectedIndex && selectedIndex !== index) {
			let nextState = [...gridItems];
			arrayMove(nextState, selectedIndex, index);
			setSelectedIndex(index);
			setGridItems(nextState);
			setSaveMode(true);
		}
	};

    const displayToastMessage = (message) => {
        toast.info(message, {
            position: 'top-right',
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
        });
    }

	const arrayMove = (arr, fromIndex, toIndex) => {
		var element = arr[fromIndex];
		arr.splice(fromIndex, 1);
		arr.splice(toIndex, 0, element);
	};

	const handleDragEnd = (e) => {
		setDragging(false);
		dragItemNode.current.removeEventListener("dragend", handleDragEnd);
		dragItemNode.current = null;
	};

	const selectItem = (item) => {
		const itemIndex = gridItems.findIndex((photo) => photo.id === item.id);
		const updateArray = [...gridItems];
		if (itemIndex < 0 && gridItems.length < 9) {
			updateArray.push(item);
			setGridItems(updateArray);
		}

		if (gridItems.length === 9) {
            displayToastMessage('You can save favourite photos');
		}

		if (itemIndex >= 0) {
			updateArray.splice(itemIndex, 1);
			setGridItems(updateArray);
		}
	};

	const isSelected = (item) => {
		return gridItems.find((photo) => photo.id === item.id);
	};

	const saveGrid = async () => {
		try {
			setLoading(true);
			let photogrid;
			if (newGrid) {
				photogrid = await PhotoService.addPhotoGrid({
					userId,
					photos: gridItems,
				});
			} else {
				photogrid = await PhotoService.updatePhotoGrid(
					{ userId, photos: gridItems },
					gridId
				);
			}
			setGridId(photogrid.id);
			setGridItems(photogrid.photos);
			setNewGrid(false);
			setSaveMode(false);
			setLoading(false);
		} catch (error) {
			alert(error);
			setLoading(false);
		}
	};

	const removeGrid = async () => {
		try {
			setLoading(true);
			await PhotoService.removeGrid(gridId);
			setSaveMode(true);
			setNewGrid(true);
			setGridItems([]);
			setLoading(false);
		} catch (error) {
			alert(error);
			setLoading(true);
		}
	};

	const renderModal = () => {
		return (
			<Modal isOpen={modalIsOpen} style={customStyles}>
				<div className="modal-body">
					{items.map((item, index) => (
						<div draggable className="modal-image" key={index}>
							<img
								onClick={onItemSelected.bind(this, item)}
								key={index}
								className="image"
								src={item.picture + item.id}
								alt="Loading error"
							/>
						</div>
					))}
				</div>
			</Modal>
		);
	};

	return (
		<div className="app-content">
			{isLoading ? (
				<div>
					<ReactLoading
						type={"spin"}
						color={"#2c3e50"}
						height={"100px"}
						width={"100px"}
					/>
				</div>
			) : (
				<div className="container">
					<ToastContainer />
					<div>
						<h2>
							{newGrid
								? "My Photos Gallery"
								: "My Favourite Photos"}
						</h2>
					</div>
					{newGrid ? (
						<div className="photo-grid">
							{items.map((item, index) => (
								<div
									onClick={selectItem.bind(this, item)}
									className="image-card"
									key={index}
								>
									{isSelected(item) ? (
										<span className="image__button select-image"></span>
									) : null}
									<img
										key={index}
										className="image image-grid"
										src={
											item && item.id
												? item.picture + item.id
												: `https://cdn3.iconfinder.com/data/icons/buttons/512/Icon_31-512.png`
										}
										alt="Error in loading"
									/>
								</div>
							))}
						</div>
					) : (
						<div className="photo-grid">
							{gridItems.map((item, index) => (
								<div
									draggable
									className="image-card grid-image-card"
									onDragStart={(e) =>
										handletDragStart(e, index)
									}
									onDragEnter={
										dragging
											? (e) => {
													handleDragEnter(index);
											  }
											: null
									}
									key={index}
								>
									<span
										className="image__button"
										onClick={openModal.bind(this, index)}
									>
										<AiFillEdit />
									</span>
									<img
										draggable
										key={index}
										className="image"
										src={
											item && item.id
												? item.picture + item.id
												: `https://cdn3.iconfinder.com/data/icons/buttons/512/Icon_31-512.png`
										}
										alt="https://cdn3.iconfinder.com/data/icons/buttons/512/Icon_31-512.png"
									/>
								</div>
							))}
						</div>
					)}

					<div className="button-panel">
						<button
							disabled={!(saveMode && gridItems.length === 9)}
							onClick={saveGrid}
							className="button"
						>
							Save
						</button>
						{!newGrid ? (
							<button
								disabled={newGrid}
								onClick={removeGrid}
								className="button"
							>
								Clear Photos
							</button>
						) : null}
					</div>
					{renderModal()}
				</div>
			)}
		</div>
	);
};

export default PhotoGrid;
