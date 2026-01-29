import React, { useState, useEffect } from "react";
import { FaUser, FaEnvelope, FaPhone, FaMapMarkerAlt, FaEdit, FaSave } from "react-icons/fa";
import { AiOutlineClose } from "react-icons/ai";
import api from "../utils/api";
import { useNavigate } from "react-router-dom";

const ProfilePage = () => {
  const navigate = useNavigate();
  const storedUser = JSON.parse(localStorage.getItem("user"));

  const [isEditing, setIsEditing] = useState(false);
  const [profile, setProfile] = useState({
    name: "",
    email: "",
    phone: "",
    location: "",
    bio: "",
    skills: []
  });

  const [newSkill, setNewSkill] = useState("");

  useEffect(() => {
    // Load user profile from backend
    const fetchProfile = async () => {
      try {
        const res = await api.get("/auth/me", {
          headers: { Authorization: `Bearer ${storedUser.token}` },
        });
        setProfile(res.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchProfile();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfile((prev) => ({ ...prev, [name]: value }));
  };

  const addSkill = () => {
    if (newSkill.trim() && !profile.skills.includes(newSkill.trim())) {
      setProfile((prev) => ({ ...prev, skills: [...prev.skills, newSkill.trim()] }));
      setNewSkill("");
    }
  };

  const removeSkill = (skill) => {
    setProfile((prev) => ({ ...prev, skills: prev.skills.filter((s) => s !== skill) }));
  };

  const handleSave = async () => {
    try {
      await api.put("/auth/profile", profile, {
        headers: { Authorization: `Bearer ${storedUser.token}` },
      });
      setIsEditing(false);
      alert("Profile updated successfully!");

      // Redirect after completing profile
      navigate(storedUser.role === "admin" ? "/admin/dashboard" :
               storedUser.role === "staff" ? "/staff/dashboard" : "/student/events");
    } catch (err) {
      console.error(err);
      alert("Error updating profile");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 py-6 flex flex-col justify-center sm:py-12">
      <div className="relative py-3 sm:max-w-xl sm:mx-auto">
        <div className="absolute inset-0 bg-gradient-to-r from-cyan-400 to-light-blue-500 shadow-lg transform -skew-y-6 sm:skew-y-0 sm:-rotate-6 sm:rounded-3xl"></div>
        <div className="relative px-4 py-10 bg-white shadow-lg sm:rounded-3xl sm:p-20">
          <div className="max-w-md mx-auto">
            <div className="flex items-center space-x-5">
              <div className="h-16 w-16 bg-yellow-200 rounded-full flex justify-center items-center text-yellow-500 text-3xl font-bold">
                {profile.name?.[0] || "U"}
              </div>
              <div>
                {isEditing ? (
                  <input
                    type="text"
                    name="name"
                    value={profile.name}
                    onChange={handleChange}
                    placeholder="Full Name"
                    className="w-full border-b border-gray-300 focus:outline-none focus:border-indigo-500 pb-1"
                  />
                ) : (
                  <h2 className="text-2xl font-semibold">{profile.name}</h2>
                )}
                <p className="text-gray-500 mt-1">{profile.bio}</p>
              </div>
            </div>

            <div className="mt-6 space-y-4">
              <div className="flex items-center space-x-3">
                <FaEnvelope className="text-gray-400" />
                {isEditing ? (
                  <input
                    type="email"
                    name="email"
                    value={profile.email}
                    onChange={handleChange}
                    placeholder="Email"
                    className="w-full border-b border-gray-300 focus:outline-none focus:border-indigo-500 pb-1"
                  />
                ) : (
                  <p>{profile.email}</p>
                )}
              </div>

              <div className="flex items-center space-x-3">
                <FaPhone className="text-gray-400" />
                {isEditing ? (
                  <input
                    type="tel"
                    name="phone"
                    value={profile.phone}
                    onChange={handleChange}
                    placeholder="Phone"
                    className="w-full border-b border-gray-300 focus:outline-none focus:border-indigo-500 pb-1"
                  />
                ) : (
                  <p>{profile.phone}</p>
                )}
              </div>

              <div className="flex items-center space-x-3">
                <FaMapMarkerAlt className="text-gray-400" />
                {isEditing ? (
                  <input
                    type="text"
                    name="location"
                    value={profile.location}
                    onChange={handleChange}
                    placeholder="Location"
                    className="w-full border-b border-gray-300 focus:outline-none focus:border-indigo-500 pb-1"
                  />
                ) : (
                  <p>{profile.location}</p>
                )}
              </div>

              <div>
                <p className="font-semibold">Skills</p>
                <div className="flex flex-wrap gap-2 mt-1">
                  {profile.skills.map((skill, idx) => (
                    <span key={idx} className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full flex items-center gap-1">
                      {skill}
                      {isEditing && (
                        <button onClick={() => removeSkill(skill)} className="text-red-500 font-bold">x</button>
                      )}
                    </span>
                  ))}
                </div>

                {isEditing && (
                  <div className="mt-2 flex gap-2">
                    <input
                      type="text"
                      value={newSkill}
                      onChange={(e) => setNewSkill(e.target.value)}
                      placeholder="Add skill"
                      className="flex-1 border-b border-gray-300 focus:outline-none focus:border-indigo-500 pb-1"
                    />
                    <button
                      onClick={addSkill}
                      className="bg-green-500 text-white px-3 rounded hover:bg-green-600"
                    >
                      Add
                    </button>
                  </div>
                )}
              </div>
            </div>

            <div className="mt-6 flex justify-end gap-3">
              {isEditing ? (
                <>
                  <button
                    onClick={handleSave}
                    className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 flex items-center gap-2"
                  >
                    <FaSave /> Save
                  </button>
                  <button
                    onClick={() => setIsEditing(false)}
                    className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 flex items-center gap-2"
                  >
                    <AiOutlineClose /> Cancel
                  </button>
                </>
              ) : (
                <button
                  onClick={() => setIsEditing(true)}
                  className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 flex items-center gap-2"
                >
                  <FaEdit /> Edit Profile
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
