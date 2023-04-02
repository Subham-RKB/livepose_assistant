import * as poseDetection from "@tensorflow-models/pose-detection";
import * as tf from "@tensorflow/tfjs";
import React, { useRef, useState, useEffect } from "react";
// import backend from "@tensorflow/tfjs-backend-webgl";
import Webcam from "react-webcam";
import { count } from "../../utils/music";

import Instructions from "../../components/Instrctions/Instructions";

import "./Yoga.css";

import DropDown from "../../components/DropDown/DropDown";
import { poseImages } from "../../utils/pose_images";
import { POINTS, keypointConnections } from "../../utils/data";
import { drawPoint, drawSegment } from "../../utils/helper";

let skeletonColor = "rgb(255,255,255)";
let poseList = [
  "Treepose",
  "Chairpose",
  "Warrior2Pose",
  "Dogpose",
  "Trianglepose",
  "Godesspose",
];

let interval;
let flag = false;
function Yoga() {
  const webcamRef = useRef(null);
  const canvasRef = useRef(null);

  const [startingTime, setStartingTime] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [poseTime, setPoseTime] = useState(0);
  const [bestPerform, setBestPerform] = useState(0);
  const [currentPose, setCurrentPose] = useState("Treepose");
  const [isStartPose, setIsStartPose] = useState(false);

  useEffect(() => {
    const timeDiff = (currentTime - startingTime) / 1000;
    if (flag) {
      setPoseTime(timeDiff);
    }
    if ((currentTime - startingTime) / 1000 > bestPerform) {
      setBestPerform(timeDiff);
    }
  }, [currentTime]);

  useEffect(() => {
    setCurrentTime(0);
    setPoseTime(0);
    setBestPerform(0);
  }, [currentPose]);

  const CLASS_NO = {
    Chairpose: 0,
    Dogpose: 1,
    Godesspose: 2,
    NoPose: 3,
    Treepose: 4,
    Trianglepose: 5,
    Warrior2Pose: 6,
  };

  function get_center_point(landmarks, left_bodypart, right_bodypart) {
    let left = tf.gather(landmarks, left_bodypart, 1);
    let right = tf.gather(landmarks, right_bodypart, 1);
    const center = tf.add(tf.mul(left, 0.5), tf.mul(right, 0.5));
    return center;
  }

  function get_pose_size(landmarks, torso_size_multiplier = 2.5) {
    let hips_center = get_center_point(
      landmarks,
      POINTS.LEFT_HIP,
      POINTS.RIGHT_HIP
    );
    let shoulders_center = get_center_point(
      landmarks,
      POINTS.LEFT_SHOULDER,
      POINTS.RIGHT_SHOULDER
    );
    let torso_size = tf.norm(tf.sub(shoulders_center, hips_center));
    let pose_center_new = get_center_point(
      landmarks,
      POINTS.LEFT_HIP,
      POINTS.RIGHT_HIP
    );
    pose_center_new = tf.expandDims(pose_center_new, 1);

    pose_center_new = tf.broadcastTo(pose_center_new, [1, 17, 2]);
    // return: shape(17,2)
    let d = tf.gather(tf.sub(landmarks, pose_center_new), 0, 0);
    let max_dist = tf.max(tf.norm(d, "euclidean", 0));

    // normalize scale
    let pose_size = tf.maximum(
      tf.mul(torso_size, torso_size_multiplier),
      max_dist
    );
    return pose_size;
  }

  function normalize_pose_landmarks(landmarks) {
    let pose_center = get_center_point(
      landmarks,
      POINTS.LEFT_HIP,
      POINTS.RIGHT_HIP
    );
    pose_center = tf.expandDims(pose_center, 1);
    pose_center = tf.broadcastTo(pose_center, [1, 17, 2]);
    landmarks = tf.sub(landmarks, pose_center);

    let pose_size = get_pose_size(landmarks);
    landmarks = tf.div(landmarks, pose_size);
    return landmarks;
  }

  function landmarks_to_embedding(landmarks) {
    // normalize landmarks 2D
    landmarks = normalize_pose_landmarks(tf.expandDims(landmarks, 0));
    let embedding = tf.reshape(landmarks, [1, 34]);
    return embedding;
  }
  function calculateAngle(x1, y1, x2, y2, x3, y3, key) {
    const angle = Math.atan2(y3 - y2, x3 - x2) - Math.atan2(y1 - y2, x1 - x2);
    let degrees = angle * (180 / Math.PI);
    if (degrees < 0) {
      degrees += 360;
    }
    return degrees;
  }
  function angle_between_joints(X) {
    // console.log(X);
    let ls_x = X[5]["x"];
    let ls_y = X[5]["y"];
    let rs_x = X[6]["x"];
    let rs_y = X[6]["y"];
    let le_x = X[7]["x"];
    let le_y = X[7]["y"];
    let re_x = X[8]["x"];
    let re_y = X[8]["y"];
    let lw_x = X[9]["x"];
    let lw_y = X[9]["y"];
    let rw_x = X[10]["x"];
    let rw_y = X[10]["y"];
    let lh_x = X[11]["x"];
    let lh_y = X[11]["y"];
    let rh_x = X[12]["x"];
    let rh_y = X[12]["y"];
    let lk_x = X[13]["x"];
    let lk_y = X[13]["y"];
    let rk_x = X[14]["x"];
    let rk_y = X[14]["y"];
    let la_x = X[15]["x"];
    let la_y = X[15]["y"];
    let ra_x = X[16]["x"];
    let ra_y = X[16]["y"];
    let ns_x = X[0]["x"];
    let ns_y = X[0]["y"];
    let hmd_x = (lh_x + rh_x) / 2;
    let hmd_y = (lh_y + rh_y) / 2;
    //console.log("Helloooooooooooooooooooooooooooooooooooooooooooooooooooooo");
    //console.log(ns_x);
    let X1 = {};
    X1["LSLELW"] = calculateAngle(ls_x, ls_y, le_x, le_y, lw_x, lw_y, "LSLELW");
    X1["RSRERW"] = calculateAngle(rs_x, rs_y, re_x, re_y, rw_x, rw_y, "RSRERW");
    X1["LSNSRS"] = calculateAngle(ls_x, ls_y, ns_x, ns_y, rs_x, rs_y, "LSNSRS");
    X1["LHNSRH"] = calculateAngle(lh_x, lh_y, ns_x, ns_y, rh_x, rh_y, "LSNSRS");
    X1["LHLKLA"] = calculateAngle(lh_x, lh_y, lk_x, lk_y, la_x, la_y, "LSLKLA");
    X1["RHRKRA"] = calculateAngle(rh_x, rh_y, rk_x, rk_y, ra_x, ra_y, "RHRKRA");
    X1["LKLHLS"] = calculateAngle(lk_x, lk_y, lh_x, lh_y, ls_x, ls_y, "LKLHLS");
    X1["RKRHRS"] = calculateAngle(rk_x, rk_y, rh_x, rh_y, rs_x, rs_y, "RKRHRS");
    X1["LELSLH"] = calculateAngle(le_x, le_y, ls_x, ls_y, lh_x, lh_y, "LELSLH");
    X1["RERSRH"] = calculateAngle(re_x, re_y, rs_x, rs_y, rh_x, rh_y, "RERSRH");
    X1["LKHMDRK"] = calculateAngle(
      lk_x,
      lk_y,
      hmd_x,
      hmd_y,
      rk_x,
      rk_y,
      "LKHMDRK"
    );
    const batchNormalizationLayer = tf.layers.batchNormalization();
    // Convert your dictionary to a tensor
    const data = tf.tensor(Object.values(X1));
    // Reshape your data to have a rank of at least 2
    const reshapedData = data.reshape([data.shape[0], 1]);
    const reshapedData1 = reshapedData.reshape([-1, 11]);
    // Apply the batch normalization layer to your reshaped data
    const normalizedData = batchNormalizationLayer.apply(reshapedData1);
    return normalizedData;
  }

  const runMovenet = async () => {
    const detectorConfig = {
      modelType: poseDetection.movenet.modelType.SINGLEPOSE_THUNDER,
    };
    const detector = await poseDetection.createDetector(
      poseDetection.SupportedModels.MoveNet,
      detectorConfig
    );
    const poseClassifier = await tf.loadLayersModel(
      "https://firebasestorage.googleapis.com/v0/b/ml-api-5690c.appspot.com/o/model.json?alt=media&token=298b70c7-0740-4d9c-8a7e-2ef04a9c8c4f"
    );
    const countAudio = new Audio(count);
    // countAudio.loop = true;
    interval = setInterval(() => {
      detectPose(detector, poseClassifier, countAudio);
    }, 100);
  };

  const detectPose = async (detector, poseClassifier, countAudio) => {
    if (
      typeof webcamRef.current !== "undefined" &&
      webcamRef.current !== null &&
      webcamRef.current.video.readyState === 4
    ) {
      let notDetected = 0;
      const video = webcamRef.current.video;
      const pose = await detector.estimatePoses(video);
      const ctx = canvasRef.current.getContext("2d");
      ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
      try {
        const keypoints = pose[0].keypoints;
        //console.log(keypoints);
        let input = keypoints.map((keypoint) => {
          if (keypoint.score > 0.4) {
            if (
              !(keypoint.name === "left_eye" || keypoint.name === "right_eye")
            ) {
              drawPoint(ctx, keypoint.x, keypoint.y, 8, "rgb(255,255,255)");
              let connections = keypointConnections[keypoint.name];
              try {
                connections.forEach((connection) => {
                  let conName = connection.toUpperCase();
                  drawSegment(
                    ctx,
                    [keypoint.x, keypoint.y],
                    [
                      keypoints[POINTS[conName]].x,
                      keypoints[POINTS[conName]].y,
                    ],
                    skeletonColor
                  );
                });
              } catch (err) {}
            }
          } else {
            notDetected += 1;
          }
          return [keypoint.x, keypoint.y];
        });
        if (notDetected > 4) {
          skeletonColor = "rgb(255,255,255)";
          return;
        }
        //console.log(input);
        const angles = angle_between_joints(keypoints);
        const processedInput = landmarks_to_embedding(input);
        const classification = poseClassifier.predict([processedInput, angles]);

        classification.array().then((data) => {
          const classNo = CLASS_NO[currentPose];
          console.log(data[0][classNo]);
          if (classNo !== 3 && data[0][classNo] > 0.97) {
            if (!flag) {
              countAudio.play();
              setStartingTime(new Date(Date()).getTime());
              flag = true;
            }
            setCurrentTime(new Date(Date()).getTime());
            skeletonColor = "rgb(0,255,0)";
          } else {
            flag = false;
            skeletonColor = "rgb(255,255,255)";
            countAudio.pause();
            countAudio.currentTime = 0;
            //currentTime = 0;
          }
        });
      } catch (err) {
        console.log(err);
      }
    }
  };

  function startYoga() {
    setIsStartPose(true);
    runMovenet();
  }

  function stopPose() {
    setIsStartPose(false);
    //countAudio.pause();
    clearInterval(interval);
  }

  if (isStartPose) {
    return (
      <div className="yoga-container">
        <div className="performance-container">
          {/* <div className="pose-performance">
            <h4>Pose Time: {poseTime} s</h4>
          </div> */}
          <div className="pose-performance">
            <h4>Best: {bestPerform} s</h4>
          </div>
        </div>
        <div>
          <Webcam
            width="720px"
            height="540px"
            id="webcam"
            ref={webcamRef}
            style={{
              position: "absolute",
              left: 120,
              top: 100,
              padding: "0px",
            }}
          />
          <canvas
            ref={canvasRef}
            id="my-canvas"
            width="720px"
            height="540px"
            style={{
              position: "absolute",
              left: 120,
              top: 100,
              zIndex: 1,
            }}
          ></canvas>
          <div>
            <img src={poseImages[currentPose]} className="pose-img" />
          </div>
        </div>
        <button onClick={stopPose} className="secondary-btn1">
          Stop Pose
        </button>
      </div>
    );
  }

  return (
    <div className="yoga-container">
      <DropDown
        poseList={poseList}
        currentPose={currentPose}
        setCurrentPose={setCurrentPose}
        poseTime={poseTime}
        setPoseTime = {setPoseTime}
      />
      <Instructions currentPose={currentPose} />
      <button onClick={startYoga} className="secondary-btn2">
        Start Pose
      </button>
    </div>
  );
}

export default Yoga;
