import React from "react";
import "./Profile.css";

const Profile = () => {
  return (
    <div className="profile-container">
      <div className="profile-header">
        <div className="profile-avatar">
          <img src="https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png" alt="Profil Resmi" />
        </div>
        <h1 className="profile-name">Kullanıcı Adı</h1>
        <p className="profile-bio">Kullanıcı biyografisi burada yer alacak.</p>
      </div>
      <div className="profile-content">
        <h2>Gönderiler</h2>
        {/* Kullanıcının gönderileri burada listelenecek */}
      </div>
    </div>
  );
};

export default Profile;
