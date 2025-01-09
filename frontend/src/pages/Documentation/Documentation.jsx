import React, { useEffect, useState } from "react";
import "./Documentation.css"; // Yukarıdaki CSS'i içe aktar

const Documentation = () => {
  const [documentation, setDocumentation] = useState([]);
  const [selectedSection, setSelectedSection] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingTitle, setEditingTitle] = useState(null);
  const [editingText, setEditingText] = useState('');

  // Dokümantasyonu fetch et
  useEffect(() => {
    fetch("http://localhost:5002/documentation") // Backend'den veri çeker
      .then((response) => {
        if (!response.ok) {
          throw new Error("Veri yüklenemedi.");
        }
        return response.json();
      })
      .then((data) => {
        setDocumentation(data);
        setSelectedSection(data[0]); // İlk bölümü seçili yap
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  const handleTitleDoubleClick = (sectionId, title) => {
    setEditingTitle(sectionId);
    setEditingText(title);
  };

  const handleTitleSave = (sectionId) => {
    // Burada API'ye kaydetme işlemi yapılabilir
    setDocumentation(documentation.map(section => {
      if (section.id === sectionId) {
        return { ...section, title: editingText };
      }
      return section;
    }));
    setEditingTitle(null);
  };

  const renderSidebar = () => (
    <div className="sidebar">
      <h2 className="sidebar-title">Dokümantasyon</h2>
      <ul className="sidebar-menu">
        {documentation.map((section) => (
          <li
            key={section.id}
            className="menu-item"
            onClick={() => setSelectedSection(section)}
          >
            {editingTitle === section.id ? (
              <div className="editable-title">
                <input
                  type="text"
                  value={editingText}
                  onChange={(e) => setEditingText(e.target.value)}
                  onBlur={() => handleTitleSave(section.id)}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      handleTitleSave(section.id);
                    }
                  }}
                  autoFocus
                />
              </div>
            ) : (
              <div 
                className="menu-item-title"
                onDoubleClick={() => handleTitleDoubleClick(section.id, section.title)}
              >
                {section.title}
              </div>
            )}
            {section.subsections && (
              <ul className="submenu">
                {section.subsections.map((sub) => (
                  <li key={sub.id} className="submenu-item">
                    <a href={`#${sub.slug}`}>{sub.title}</a>
                  </li>
                ))}
              </ul>
            )}
          </li>
        ))}
      </ul>
    </div>
  );

  const renderContent = () => (
    <div className="content">
      {selectedSection ? (
        <>
          <h1>{selectedSection.title}</h1>
          {selectedSection.subsections.map((sub) => (
            <div key={sub.id} id={sub.slug} className="subsection">
              <h3>{sub.title}</h3>
              <div dangerouslySetInnerHTML={{ __html: sub.content }} />
            </div>
          ))}
        </>
      ) : (
        <p>Bir bölüm seçin.</p>
      )}
    </div>
  );

  if (loading) {
    return (
      <div className="loading">
        <div className="loading-spinner"></div>
        <p>Yükleniyor...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error">
        <p>{error}</p>
        <button className="retry-button" onClick={() => window.location.reload()}>
          Tekrar Dene
        </button>
      </div>
    );
  }

  return (
    <div className="documentation-container">
      {renderSidebar()}
      {renderContent()}
    </div>
  );
};

export default Documentation;