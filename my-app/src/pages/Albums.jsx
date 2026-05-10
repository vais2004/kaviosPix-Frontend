import React, { useEffect, useState } from "react";

export default function Albums() {
  const [albums, setAlbums] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [newAlbum, setNewAlbums] = useState({ name: "", description: "" });
  const [editAlbum, setEditAlbum] = useState(null);

  const [showShareModal, setShowShareModal] = useState(false);
  const [selectedAlbum, setSelectedAlbum] = useState(null);
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState("");
  console.log(selectedAlbum);

  const fetchAlbums = async () => {
    const data = await getData("/albums");
    if (data) setAlbums(data);
  };

  const fetchUsers = async () => {
    const data = await getData("/users");
    if (data) {
      console.log("Users fetched:", data);
      setUsers(data.filter((d) => d.name));
    } else {
      console.log("No users found or error fetching users");
    }
  };

  useEffect(() => {
    fetchAlbums();
    fetchUsers();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (editAlbum) setEditAlbum((prev) => ({ ...prev, [name]: value }));
    else setNewAlbums((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddAlbum = async (e) => {
    e.preventDefault();
    if (!newAlbum.name.trim()) {
      return alert("Please enter album name!");
    }

    const result = await postData("/albums", newAlbum);

    if (result?.album) {
      setAlbums((prev) => [...prev, result.album]);
      setNewAlbums({ name: "", description: "" });
      setShowModal(false);
    } else {
      alert(result?.message || "Failed to add album");
    }
  };

  const handleUpdateAlbum = async (e) => {
    e.preventDefault();
    const result = await getData(`/albums/${editAlbum.albumId}`, {
      description: editAlbum.description,
    });

    if (result?.updatedAlbum) {
      setAlbums((prev) =>
        prev.map((a) =>
          a.albumId === editAlbum.albumId ? result.updatedAlbum : a,
        ),
      );
      setEditAlbum(null);
      setShowModal(false);
    } else {
      alert("Failed to update album");
    }
  };

  const openEditModal = (album) => {
    setEditAlbum(album);
    setShowModal(true);
  };

  return <div>Albums</div>;
}
