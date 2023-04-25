import React, {useState, useCallback, useRef, useMemo, memo} from "react";
import PropTypes from "prop-types";
import styled, {css} from "styled-components";
import {getYouTubeId} from "utils/getYouTubeId";
import {isVimeoUrl, isYouTubeUrl} from "utils/validators";
import {YoutubeVideo} from "modules/Block/Elements/Video/Youtube";
import {VimeoVideo} from "modules/Block/Elements/Video/Vimeo";
import {defaultStaticImg} from "config/consts";
import {createWidgetPath, setScriptConfig} from "modules/Static/utils";

const Video = memo(
  ({source, onlyPreview, isHero, thumbnail, scriptConfig, border, index}) => {
    const ref = useRef(null);

    const {prov, Component, videoId} = useMemo(() => {
      let prov = "",
        Component,
        videoId;
      if (isYouTubeUrl(source)) {
        prov = "youtube";
        Component = YoutubeVideo;
      } else if (isVimeoUrl(source)) {
        prov = "vimeo";
        Component = VimeoVideo;
      }
      if (prov === "youtube") {
        const youTubeId = getYouTubeId(source);
        if (youTubeId) {
          videoId = youTubeId;
        }
      } else if (prov === "vimeo") {
        try {
          videoId = source;
        } catch (e) {
          videoId = source;
        }
      }

      return {
        prov,
        Component,
        videoId,
      };
    }, [source]);

    const [showPreview, setShowPreview] = useState(true);

    const hidePreview = useCallback(() => {
      setShowPreview(false);
    }, []);

    const hasScriptConfig = useMemo(() => Object.keys(scriptConfig).length > 0, [
      scriptConfig,
    ]);

    let path, previewPath;
    if (hasScriptConfig) {
      let videoIdx;

      if (prov === "youtube") {
        videoIdx = Object.keys(scriptConfig["youtube"]).length;
        path = createWidgetPath("youtube", index, videoIdx);
        previewPath = createWidgetPath("preview", index, videoIdx);
      } else if (prov === "vimeo") {
        const videoIdx = Object.keys(scriptConfig["vimeo"]).length;
        path = createWidgetPath("vimeo", index, videoIdx);
        previewPath = createWidgetPath("preview", index, videoIdx);
      }
      if (prov) {
        setScriptConfig({
          config: scriptConfig,
          path,
          widget: prov,
          props: {src: videoId, isHero, preview: previewPath},
        });
        setScriptConfig({
          config: scriptConfig,
          path: previewPath,
          widget: "videoPreview",
          props: {src: thumbnail},
        });
      }
    }

    return (
      <VideoStyled isHero={isHero}>
        {isHero && <Overlay />}
        <PlayerWrapper>
          <VideoWrapper
            ref={ref}
            //height={height}
            data-video-container={true}
            border={border}
          >
            {!prov ? (
              "Only YouTube and Vimeo videos are supported"
            ) : (
              <>
                {!onlyPreview && (
                  <Component
                    videoId={videoId}
                    isHero={isHero}
                    hidePreview={hidePreview}
                    staticPath={path}
                  />
                )}
                {showPreview && (
                  <img src={!path && thumbnail} alt={""} id={previewPath} />
                )}
              </>
            )}
          </VideoWrapper>
        </PlayerWrapper>
      </VideoStyled>
    );
  }
);

const Overlay = styled.div`
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.001);
  z-index: 1;
`;

const VideoStyled = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
  width: 100%;
  height: 100%;
  img {
    margin: auto;
    position: absolute;
    top: 0;
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
  ${({isHero}) =>
    isHero &&
    css`
      width: 200%;
      transform: translateX(-25%);
    `}
  @media print {
    img {
      display: block;
    }
    iframe {
      display: none;
    }
  }
`;
const PlayerWrapper = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
  padding-top: 56.25%;
  //@media all and (max-width: 900px) {
  //  padding-top: 0 !important;
  //  height: 100%;
  //}
`;
const VideoWrapper = styled.div`
  position: absolute;
  top: 0;
  right: 0;
  left: 0;
  bottom: 0;
  height: ${({height}) => height}px;
  border: ${(props) => props.border + "px solid #FFFFFF"};
`;
Video.propTypes = {
  source: PropTypes.string,
  onlyPreview: PropTypes.bool,
  thumbnail: PropTypes.string,
  isHero: PropTypes.bool,
  scriptConfig: PropTypes.object,
  border: PropTypes.number,
  index: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
};

Video.defaultProps = {
  source: "",
  onlyPreview: false,
  isHero: false,
  thumbnail: defaultStaticImg,
  scriptConfig: {},
  border: 0,
};

export default Video;
