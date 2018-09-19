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

const getVideoById = (id) => new Promise((resolve) => {

const [video] = videos.filter((video) => {
    
        return video.id === id;
    });

    resolve(video);
});

const getVideos = () => new Promise((resolve) => resolve(videos));

exports.getVideoById = getVideoById;
exports.getVideos = getVideos