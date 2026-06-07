import React, { useCallback, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getData } from "../api/Api";
import UploadButton from "../components/UploadButton";
import ImageGrid from "../components/ImageGrid";
import Header from "../components/Header";

export default function AlbumDetails() {
  const { albumId } = useParams();
  const [images, setImages] = useState([]);
  const navigate = useNavigate();

  const fetchImages = useCallback(async () => {
    try {
      const response = await getData(`/albums/${albumId}/images`);
      setImages(response);
    } catch (error) {
      console.error("Error fetching images", error);
    }
  }, [albumId]);

  useEffect(() => {
    fetchImages();
  }, [fetchImages]);

  return (
    <div style={{ backgroundColor: "#e4e4fc" }}>
      <div className="container mt-4" style={{ backgroundColor: "#e4e4fc" }}>
        <Header />
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h3>Album Images</h3>
          <div className="d-flex gap-2">
            <button
              className="btn btn-outline-secondary"
              onClick={() => navigate("/albums")}>
              {" "}
              Back to Albums
            </button>
            <UploadButton albumId={albumId} onUpload={fetchImages} />
          </div>
        </div>
        <ImageGrid images={images} albumId={albumId} />
      </div>
    </div>
  );
}
