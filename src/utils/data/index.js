export const poseInstructions = {
    Treepose: [
        'Vrksasana',
        'Stand in Mountain Pose with hands in Anjali mudra at heart center. Shift weight into right foot, lifting left foot off floor.',
        'Bend left knee and bring sole of left foot high onto inner right thigh. Press foot into thigh and thigh back into foot with equal pressure.',
        'Focus gaze on something that doesn’t move. Take 5-10 breaths, then lower left foot to floor and do other side.',
        'To know more about pose: https://www.verywellfit.com/tree-pose-vrksasana-3567128'
        ],
    Godesspose: [
        'Utkata Konasana',
        'Come to hands and knees with wrists under shoulders and knees under hips. Curl toes under and push back through hands to lift hips and straighten legs.',
        'Begin to squat down while bending your knees. Meanwhile raise your hand and bend the elbow as shown in picture',
        'Hold the pose for as long as necessary, making sure to breathe properly.',    
        'To know more about pose: https://blog.alomoves.com/movement/how-to-do-goddess-pose-in-yoga'
    ],
    Dogpose: [
        'Adho Mukha Svanasana',
        'Come onto your hands and knees, with your hands a tiny bit in front of your shoulders and your knees directly below your hips. Spread your palms, rooting down through all four corners of your hands, and turn your toes under.',
        'Spread fingers and ground down from forearms into fingertips. Rotate upper arms outward to broaden collarbones. Let head hang and move shoulder blades away from ears towards hips.',
        'Engage quadriceps strongly to take weight off arms. Rotate thighs inward, keep tail high, and sink heels towards floor.',
        'To know more about pose: https://www.yogajournal.com/poses/types/downward-facing-dog/'
    
    ],
    Chairpose: [
        'Utkatasana',
        'Stand with feet together, hands on hips. Find center of balance in each foot.',
        'Exhale and bend knees, sitting on an imaginary chair. Stop when you lose the tripod effect in your feet.',
        'Engage legs and hips by pressing legs toward each other and hugging hips toward midline. Raise arms overhead.',
        'To know more about pose :https://classpass.com/movements/chair-pose'
    ],
    Warrior2Pose: [
        'Virabhadrasana II',
        'Face the long side of your mat with your arms stretched straight out from your shoulders and your feet parallel to each other in a wide stance. Turn your right foot and knee to face the front of the mat.',
        'Angle your left toes slightly in toward the upper left corner of the mat. Bend your right knee and stack it over your right ankle.',
        'Distribute your weight evenly between both legs. Press down through the outer edge of your back foot.',
        'To know more about pose: https://www.yogajournal.com/poses/warrior-ii-pose/'
    ],
    Trianglepose: [
        'Start in a wide stance with your feet parallel. You should be facing the long edge of your mat. Turn your left foot inward slightly to about 85 degrees.',
        'Rotate your right foot 90 degrees. Keep your hips and shoulders facing the long edge of your mat, and your hips directly under your shoulders.',
        'Bend your body side ways and Lengthen your spine as you continue to press your feet into the ground.',
        'To know more about pose: https://classpass.com/movements/triangle-pose'
    ],
}
export const POINTS = {
    NOSE : 0,
    LEFT_EYE : 1,
    RIGHT_EYE : 2,
    LEFT_EAR : 3,
    RIGHT_EAR : 4,
    LEFT_SHOULDER : 5,
    RIGHT_SHOULDER : 6,
    LEFT_ELBOW : 7,
    RIGHT_ELBOW : 8,
    LEFT_WRIST : 9,
    RIGHT_WRIST : 10,
    LEFT_HIP : 11,
    RIGHT_HIP : 12,
    LEFT_KNEE : 13,
    RIGHT_KNEE : 14,
    LEFT_ANKLE : 15,
    RIGHT_ANKLE : 16,
}

export const keypointConnections = {
    nose: ['left_ear', 'right_ear'],
    left_ear: ['left_shoulder'],
    right_ear: ['right_shoulder'],
    left_shoulder: ['right_shoulder', 'left_elbow', 'left_hip'],
    right_shoulder: ['right_elbow', 'right_hip'],
    left_elbow: ['left_wrist'],
    right_elbow: ['right_wrist'],
    left_hip: ['left_knee', 'right_hip'],
    right_hip: ['right_knee'],
    left_knee: ['left_ankle'],
    right_knee: ['right_ankle']
}