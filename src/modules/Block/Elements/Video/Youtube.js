import React, {useRef, useEffect, useCallback, useState} from "react";
import YouTubePlayer from "youtube-player";
import PropTypes from "prop-types";
import styled from "styled-components";
import {useVideoHook} from "hooks/useVideoHook";
import {isIntoView} from "utils/checkElementIntoView";
/*
stateNames = {
        '-1': 'unstarted',
        0: 'ended',
        1: 'playing',
        2: 'paused',
        3: 'buffering',
        5: 'video cued'
    };
 */

const videoIsPlaying = (state) => state === 1 || state === 5;

export const YoutubeVideo = ({videoId, isHero, hidePreview, staticPath}) => {
  const initialized = useRef(false);
  const ref = useRef(null);
  const refVideo = useRef(null);
  const player = useRef(null);
  const firstPlaying = useRef(isHero);

  const [playing, setPlaying] = useState(false);

  const stopVideo = useCallback(() => {
    if (!isHero) {
      player.current.getPlayerState().then((state) => {
        if (videoIsPlaying(state)) {
          setPlaying(true);
          player.current.pauseVideo();
        }
      });
    }
  }, [isHero]);

  const startVideo = useCallback(() => {
    if (!isHero && (playing || !firstPlaying.current)) {
      player.current.getPlayerState().then((state) => {
        if (state === 2 || state === 5) {
          setPlaying(true);
          player.current.playVideo();
        }
      });
    }
  }, [isHero, playing]);

  useVideoHook(ref.current, startVideo, stopVideo);

  const initPlayer = useCallback(() => {
    firstPlaying.current = false;
    const params = {};
    if (isHero) params.playlist = videoId;
    player.current = new YouTubePlayer(refVideo.current, {
      videoId,
      // height: "100%",
      // width: "100%",
      playerVars: {
        autoplay: isHero ? 1 : 0,
        mute: 1,
        controls: isHero ? 0 : 1,
        loop: isHero ? 1 : 0,
        background: isHero ? 1 : 0,
        ...params,
        modestbranding: 1,
        disablekb: 0,
        enablejsapi: 1,
        fs: 0,
        showinfo: 0,
        iv_load_policy: 3,
        rel: 0,
      },
    });
    player.current.on("ready", function (e) {
      e.target.mute();
      if (!isHero && isIntoView(ref.current)) {
        e.target.playVideo();
      }
    });
    player.current.on("stateChange", (e) => {
      const event = e.data;
      if (isHero) {
        if (videoIsPlaying(event)) {
          hidePreview();
        }
      } else if (isIntoView(ref.current)) {
        if (event === 2) {
          setPlaying(false);
        } else if (videoIsPlaying(event)) {
          firstPlaying.current = true;
          setPlaying(true);
          hidePreview();
        }
      }
    });
  }, [hidePreview, isHero, videoId]);

  useEffect(() => {
    if (player.current && initialized.current) {
      setPlaying(false);
      player.current.destroy();
      initPlayer();
    }
  }, [initPlayer, videoId]);
  //
  useEffect(() => {
    if (!player.current && !initialized.current) {
      initialized.current = true;
      initPlayer();
    }
  }, [initPlayer]);

  return (
    <Wrapper ref={ref}>
      <VideoWrapper ref={refVideo} id={staticPath} />
    </Wrapper>
  );
};

const Wrapper = styled.div`
  width: 100%;
  height: 100%;
`;

const VideoWrapper = styled.div`
  width: 100%;
  height: 100%;
`;

YoutubeVideo.propTypes = {
  videoId: PropTypes.any.isRequired,
  isHero: PropTypes.bool,
  hidePreview: PropTypes.func,
  staticPath: PropTypes.string,
};

YoutubeVideo.defaultProps = {
  isHero: false,
  hidePreview: () => null,
  staticPath: "",
};
