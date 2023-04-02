import React from "react";
import { Link } from "react-router-dom";

import "./Home.css";

export default function Home() {
  return (
    <>
      <div className="home-container">
        <div className="image"> 
        <img src="../yoga_pose.jpg" className="image" />
          </div>
        <div className="home-formContainer">
          <h1 align="center">Welcome, Let's Do Some Yoga</h1>
          <div className="btn-section">
            <Link to="/start">
              <button className="btn-start-btn">Let's Start</button>
            </Link>
          </div>
        </div>
      </div>
    </>
    // <div className="home-container">
    //   <div className="home-header">
    //     <h1 className="home-heading">YogaIntelliJ</h1>
    //   </div>
    //   <div className="home-flex">
    //     <div className="left-container">
    //       <h1 className="description">Start Yoga Now</h1>
    //       <div className="btn-section">
    //         <Link to="/start">
    //           <button className="btn-start-btn">Let's Start</button>
    //         </Link>
    //       </div>
    //     </div>
    //     <div className="home-main"></div>
    //   </div>
    // </div>
  );
}
