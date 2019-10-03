(function() {

    "use strict"

    const API_KEY = config.api_key;

    //**************************************************************
    // 2. This code loads the IFrame Player API code asynchronously.
    let tag = document.createElement('script');
    tag.src = "https://www.youtube.com/iframe_api";
    let firstScriptTag = document.getElementsByTagName('script')[0];
    firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
    //**************************************************************

    function getYoutubePlaylist(){
        let userid = "UCJdWFFx0gaQswqQQZHw2new";
        let playlistid = "PL_iLoxbFb7q4J4KnGtTBhU5ZdroxO8rxx";
        let maxnumbervideos = 100;

        let queryStr = "https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&maxResults=50&playlistId=" + playlistid + "&key=" + API_KEY;
        let playlist = JSON.parse(getJSONData(queryStr));
        let items = playlist.items;

        while(playlist.nextPageToken){
            queryStr = "https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&maxResults=50&playlistId=" + playlistid + "&pageToken=" + playlist.nextPageToken + "&key=" + API_KEY;
            playlist = JSON.parse(getJSONData(queryStr));
            items = [...items, ...playlist.items];
        }

        //Changed to use reduce instead of map as I can more easily skip deleted videos rather than returning null elements in the 
        //array.
        return items.reduce( (result, item) => {
            try{
                if(item.snippet.resourceId.kind == "youtube#video" && item.snippet.title != "Deleted video"){
                    let new_item = {
                        title: item.snippet.title,
                        id: item.snippet.resourceId.videoId,
                        thumbUrl: item.snippet.thumbnails.high.url,
                    }
                    result.push(new_item);  
                }else{
                    console.log(`Skipped deleted video at position ${item.snippet.position}`);
                    console.log(item);
                }  
            }catch(err){
                console.log(err);
                console.log(item);
            }
            return result;
        }, []); //the [] is just our initial empty array for result
    }

    function getJSONData(yourUrl) {
        
        let Httpreq = new XMLHttpRequest();
        try {
            Httpreq.open("GET", yourUrl, false);
            Httpreq.send(null);
            } catch (ex) {
            alert(ex.message);
        }
        
        return Httpreq.responseText;
    }

    window.getYoutubePlaylist = getYoutubePlaylist;
    

})();
