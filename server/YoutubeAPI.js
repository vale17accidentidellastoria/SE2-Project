class YoutubeAPI {

    constructor() {
        let youtube = require('youtube-finder');
        this.client = youtube.createClient({ key: 'AIzaSyB96bQA4UdZD94cWRhGE4y-K-dfWYCmrjE'})
    }

    find(searchQuery, callback) {
        let params = {
            part: 'snippet',
            type: 'video',
            q: searchQuery,
            maxResults: 4
        };
        this.client.search(params, function (err, data) {
            let results = [];
            if(data && data.items) {
                data.items.forEach((r) => {
                    results.push(
                        {   title: r.snippet.title,
                            description: r.snippet.description,
                            videoId: r.id.videoId,
                            thumbnail: r.snippet.thumbnails.medium.url
                        });
                });
            }
            callback(results);
        })
    }

}

module.exports = YoutubeAPI;