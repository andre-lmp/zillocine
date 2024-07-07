import '../player-css/Player.css';
import YouTube from 'react-youtube';
import { useRef, useEffect } from 'react';

function Player(props){
    const playerRef = useRef(undefined);
    const playerContainerRef = useRef(undefined);

    const opts = {
        height: '100%',
        width: '100%',
        playerVars: {
            autoplay: 0,
        }
    };

    useEffect(() => {

        const playVideo = () => {
            if (playerRef.current){
                props.youtubeRef(playerRef.current);
            }else{
                setTimeout(playVideo, 100);
            }
        };

        playVideo();
    },[props.youtubeRef]);

    useEffect(() => {
        if (props.isVisible){
            playerContainerRef.current.style.opacity = '1';
        }else{
            playerContainerRef.current.style.opacity = '0';
        };
    },[props.isVisible]);

    return(
        <section ref={playerContainerRef} className='player'>
            <YouTube videoId={props.id} ref={playerRef} opts={opts} className='player-video'/>
        </section>
    );
};

export default Player;