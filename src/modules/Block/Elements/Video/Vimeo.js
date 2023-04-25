import React, {useRef, useEffect, useState, useCallback} from "react";
import PropTypes from "prop-types";
import Player from "@vimeo/player";
import styled from "styled-components";
import {useVideoHook} from "hooks/useVideoHook";
import {isIntoView} from "utils/checkElementIntoView";

export const VimeoVideo = ({videoId, isHero, hidePreview, staticPath}) => {
  const ref = useRef(null);
  const initialized = useRef(false);
  const player = useRef(null);
  const firstPlaying = useRef(isHero);

  const [playing, setPlaying] = useState(false);

  const stopVideo = useCallback(() => {
    if (!isHero) {
      player.current.pause();
    }
  }, [isHero]);

  const startVideo = useCallback(() => {
    if (!isHero && (playing || !firstPlaying.current)) {
      player.current.play();
    }
  }, [isHero, playing]);

  useVideoHook(ref.current, startVideo, stopVideo);

  const initPlayer = useCallback(() => {
    firstPlaying.current = false;
    player.current = new Player(ref.current, {
      url: videoId,
      height: "100%",
      width: "100%",
      loop: isHero,
      autoplay: isHero,
      muted: true,
      background: isHero,
    });
    player.current.setAutopause(false);
    player.current.ready().then(function () {
      player.current.setMuted(true).then(() => {
        if (!isHero && isIntoView(ref.current)) {
          player.current.play();
        }
      });
    });
    player.current.on("pause", () => {
      if (isIntoView(ref.current)) {
        player.current.getMuted().then((muted) => {
          if (muted) {
            player.current.setMuted(isHero).then(() => {
              player.current.play();
            });
          } else {
            setPlaying(false);
          }
        });
      } else {
        setPlaying(true);
      }
    });
    player.current.on("playing", () => {
      hidePreview();
      firstPlaying.current = true;
      setPlaying(true);
    });
  }, [hidePreview, isHero, videoId]);

  useEffect(() => {
    if (player.current && initialized.current) {
      setPlaying(false);
      player.current.destroy().then(initPlayer);
    }
  }, [initPlayer, videoId]);

  useEffect(() => {
    if (!initialized.current) {
      initialized.current = true;
      initPlayer();
    }
  }, [initPlayer]);

  return <VideoWrapper ref={ref} id={staticPath} />;
};

const VideoWrapper = styled.div`
  width: 100%;
  height: 100%;

  iframe {
    width: 100%;
    height: 100%;
  }
`;

VimeoVideo.propTypes = {
  videoId: PropTypes.any.isRequired,
  isHero: PropTypes.bool,
  hidePreview: PropTypes.func,
  staticPath: PropTypes.string,
};

VimeoVideo.defaultProps = {
  isHero: false,
  hidePreview: () => null,
  staticPath: "",
};
