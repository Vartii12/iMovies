import React from "react";
import "./style.scss";

const Loader = () => {
  return (
    <div className="loader-container">
      <div className="custom-spinner"></div>
      <p>Loading iMovies experience...</p>
    </div>
  );
};

export default Loader;
