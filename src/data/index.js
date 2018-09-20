
// mock of data repo
const videoA = {
    id: 'a', 
    title: 'video a',
    duration: 120,
    watched: true,
};

const videoB = {
id: 'b', 
title: 'video b',
duration: 240, 
watched: false,
};

const videos = [videoA, videoB];

// get by id
const getVideoById = (id) => new Promise((resolve) => {

const [video] = videos.filter((video) => {
    
        return video.id === id;
    });

    resolve(video);
});

// get all
const getVideos = () => new Promise((resolve) => resolve(videos));

// create by id
const createVideo = ({ title, duration, watched}) => {
    const video = {
        id: new Buffer.from(title).toString('base64'),
        title,
        duration,
        watched
    };

    videos.push(video);

    return video;
}
exports.getVideoById = getVideoById;
exports.getVideos = getVideos;
exports.createVideo = createVideo;