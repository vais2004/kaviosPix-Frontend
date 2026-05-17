import React, { useEffect, useState } from "react";
import {FaTag,FaStar,FaTrash} from 'react-icons'
import BASE_URL from "../api/Api";
import axios from "axios";

export default function ImageGrid() {
  const [imageList, setImageList] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);
  const [tagFilter, setTagFilter] = useState("");
  const [filteredImages, setFilteredImages] = useState([]);

  useEffect(() => {
    const formatted = imageList.map((img) => ({
      imageId: img._id,
      imageUrl: img.imageUrl,
      comments: img.comments || [],
      isFavorite: img.isFavorite || false,
      tags: img.tags || [],
    }));

    setImageList(formatted);
    setFavorites(formatted.filter((img) => img.isFavorite));
    setFilteredImages(formatted);
  }, [images]);

  const toggleFavorite = async (imageId, currentFav) => {
    try {
      const token = localStorage.getItem("token");
      await axios.put(
        `${BASE_URL}/albums/${albumId}/images/${imageId}/favorite`,
        { isFavorite: !currentFav },
        { headers: { Authorization: `Bearer ${token}` } },
      );

      const updatedList = imageList.map((img) =>
        img.imageId === imageId ? { ...img, isFavorite: !img.isFavorite } : img,
      );

      setImageList(updatedList);
      setFavorites(updatedList.filter((img) => img.isFavorite));
      setFilteredImages(updatedList);
    } catch (error) {
      console.error("Favorite update failed:", error);
      alert("Failed to update favorite status");
    }
  };

  const handleDeleteImage = async (imageId) => {
    if (!window.confirm("Are you sure you want to delete this image?")) {
      return;
    }
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`${BASE_URL}/albums/${albumId}/images/${imageId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const updatedList = imageList.filter.filter(
        (img) => img.imageId !== imageId,
      );
      setImageList(updatedList);
      setFavorites(updatedList.filter((img) => img.isFavorite));
      setFilteredImages(updatedList);
      alert("Image deleted successfully!");
    } catch (error) {
      console.error("Failed to delete image:", error);
      alert("Failed to delete image");
    }
  };

  const handleAddComment = async (imageId, commentText) => {
    if (!commentText.trim()) return;

    try {
      const token = localStorage.getItem("token");
      const response = await axios.post(
        `${BASE_URL}/albums/${albumId}/images/${imageId}/comments`,
        { comment: commentText },
        { headers: { Authorization: `Bearer ${token}` } },
      );

      setImageList((prev) =>
        prev.map((img) =>
          img.imageId === imageId
            ? { ...img, comments: response.data.image.comments }
            : img,
        ),
      );
    } catch (error) {
      console.error("Failed to add comment:", error);
      alert("Failed to add comment");
    }
  };

  const handleTagSearch = async (e) => {
    e.preventDefault();
    if (!tagFilter.trim()) {
      setFilteredImages(imageList);
      return;
    }

    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(
        `${BASE_URL}/albums/${albumId}/images/search?tags=${tagFilter}`,
        { headers: { Authorization: `Bearer ${token}` } },
      );

      const formatted = response.data.map((img) => ({
        imageId: img._id,
        imageUrl: img.imageUrl,
        comments: img.comments || [],
        isFavorite: img.isFavorite || false,
        tags: img.tags || [],
      }));

      setFilteredImages(formatted);
    } catch (error) {
      console.error("Tag filter failed:", error);
      alert("Failed to fetch images by tag");
    }
  };

  const handleToggleView = () => setShowFavoritesOnly((prev) => !prev);

  const displayList = showFavoritesOnly ? favorites : filteredImages;

  return (
    <div className="mt-3">
      <div className="d-flex justify-content-between align-items-center mb-3 flex-wrap gap-2">
        <h5 className="mb-0">
          {showFavoritesOnly ? "❤️ Favorite Images" : "🖼️ All Images"}
        </h5>

        <div className="d-flex gap-2">
          <form onSubmit={handleTagSearch} className="d-flex">
            <input
              type="text"
              className="form-control form-control-sm me-2"
              placeholder="Search by tag..."
              value={tagFilter}
              onChange={(e) => setTagFilter(e.target.value)}
            />

            <button type="submit" className="btn btn-sm btn-outline-success">
              <FaTag className="me-1" />
            </button>
          </form>

          <button
            className="btn btn-outline-primary btn-sm"
            onClick={handleToggleView}>
            {showFavoritesOnly ? "Show All" : "Show Favorites"}
          </button>
        </div>
      </div>

      <div className="row">
        {displayList.length > 0 ? (
          displayList.map((img) => (
            <div key={img.imageId} className="col-md-4 mb-4">
              <div className="card shadow-sm position-relative">
                <img
                  src={img.imageUrl}
                  alt={`Image_${img.imageId}`}
                  className="card-img-top"
                  style={{ height: "200px", objectFit: "cover" }}
                />
                {/* ⭐ + 🗑️ */}
                <div className="positive-absolute top-0 end-0 m-2 d-flex gap-2">
                  <button
                    className="btn p-1 bg-light rounded-circle"
                    onClick={() => toggleFavorite(img.imageId, img.isFavorite)}>
                    {img.isFavorite ? (
                      <FaStar color="gold" size={20} />
                    ) : (
                      <FaStar color="gray" size={20} />
                    )}
                  </button>

                  <button
                    className="btn p-1 bg-light rounded-circle"
                    onClick={() => handleDeleteImage(img.imageId)}>
                    <FaTrash color="red" size={18} />
                  </button>
                </div>

                <div className="card-body">
                  <h6>Comments</h6>
                  <ul className="list-unstyled">
                    {img.comments?.length > 0 ? (
                      img.comments.map((comment, index) => (
                        <li key={index} className="text-muted small">
                          {" "}
                          • {comment}
                        </li>
                      ))
                    ) : (
                      <li className="text-muted small">No comments yet.</li>
                    )}
                  </ul>
                  <AddCommentForm
                    onAddComment={(text) => handleAddComment(img.imageId, text)}
                  />

                  {img.tags?.length > 0 && (
                    <div className="mt-3 border-top pt-2 small text-muted">
                      <strong>Tag:</strong>{" "}
                      {img.tags.map((tag, index) => (
                        <span key={index} className="badge bg-secondary me-1">
                          #{tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))
        ) : (
          <p className="text-muted text-center mt-3">
            {showFavoritesOnly
              ? "No favorite images yet."
              : "No available for this tag."}
          </p>
        )}
      </div>
    </div>
  );
}

function AddCommentForm({ onAddComment }) {
  const [comment, setComment] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    onAddComment(comment);
    setComment("");
  };
  return (
    <form>
      <input
        type="text"
        className="form-control form-contro;-sm me-2"
        placeholder="Add a comment..."
        value={comment}
        onChange={(e) => setComment(e.target.value)}
      />
      <button type="submit" className="btn btn-sm btn-primary">
        Post
      </button>
    </form>
  );
}
