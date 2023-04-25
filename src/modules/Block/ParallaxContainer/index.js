import React, {
  forwardRef,
  memo,
  useRef,
  useEffect,
  useState,
  useCallback,
  useMemo,
  useContext,
} from "react";
import PropTypes from "prop-types";
import {useDispatch, useSelector} from "react-redux";
import get from "lodash/get";
import {Slider} from "components/Slider";
import {IconMediaAdd} from "icons/IconMediaAdd";
import MediaController from "../Elements/MediaController";
import {show} from "redux-modal";
import {MAX_SLIDES_COUNT, parallaxSliderClassName} from "config/consts";
import {IconCrop} from "icons/IconCrop";
import ParallaxIcon from "icons/ParallaxIcon";
import isEmpty from "lodash/isEmpty";
import {getCropperQueryString} from "utils/getCropperQueryString";
import {FolioActions} from "reducers/folio";
import {setBlockConfig} from "actions/folio";
import {
  BlockContent,
  BlockWrapper,
  ChildContent,
  LayoutWrapper,
  MediaContent,
  ParallaxImage,
  SlideParallax,
} from "./styled";
import styled, {css} from "styled-components";
import CropImage from "modules/Block/Elements/Image/CropImage";
import {BlockContext} from "../context";

const createParallaxStyle = (scrolled) => `translate3d(0px, ${scrolled}px, 0px)`;

const getCoords = (elem) => {
  // crossbrowser version
  const box = elem.getBoundingClientRect();

  const body = document.body;
  const docEl = document.documentElement;

  const scrollTop = window.pageYOffset || docEl.scrollTop || body.scrollTop;
  const scrollLeft = window.pageXOffset || docEl.scrollLeft || body.scrollLeft;

  const clientTop = docEl.clientTop || body.clientTop || 0;
  const clientLeft = docEl.clientLeft || body.clientLeft || 0;

  const top = box.top + scrollTop - clientTop;
  const left = box.left + scrollLeft - clientLeft;

  return {top: Math.round(top), left: Math.round(left)};
};

const ParallaxSlider = memo(({layout, enabledParallax}) => {
  const {index, isSpan, fraction, isEdit} = useContext(BlockContext);
  const dispatch = useDispatch();
  const [height, setHeight] = useState(0);
  const refs = useRef([]);
  const refsWrapper = useRef([]);
  const refsWrapperSlideParalax = useRef([]);

  const pathToContent = useMemo(() => `structure[${index}].content`, [index]);

  const {media = [], text = []} = useSelector((state) =>
    get(state.folio, pathToContent, {})
  );

  const checkAndSetBlockHeight = useCallback(() => {
    let maxHeight = 0;
    refs.current.forEach((el) => {
      if (el) {
        const curHeight = el.getBoundingClientRect().height;
        if (curHeight > maxHeight) maxHeight = curHeight;
      }
    });
    setHeight(maxHeight);
  }, [setHeight]);

  useEffect(() => {
    checkAndSetBlockHeight();
  }, [checkAndSetBlockHeight, refs, text]);

  useEffect(() => {
    setTimeout(checkAndSetBlockHeight, 500);
  }, [checkAndSetBlockHeight]);

  const mediaOpen = useCallback(
    (idx) => {
      dispatch(
        show("media-library", {
          pathToContent: `${pathToContent}.media`,
          blockIndex: index,
          maxElements: MAX_SLIDES_COUNT,
          selectedIndex: idx,
          allowTypes: [{label: "Images", value: "images"}],
        })
      );
    },
    [dispatch, index, pathToContent]
  );

  const cropOpen = useCallback(
    (idx) => {
      const image = media[idx];
      dispatch(
        show("cropper-modal", {
          src: image.src,
          blockIndex: index,
          path: `${pathToContent}.media[${idx}]`,
          hideFit: true,
        })
      );
    },
    [dispatch, index, media, pathToContent]
  );

  const createParallax = useCallback(() => {
    const scrolled = window.scrollY;
    refsWrapper.current.forEach((el, index) => {
      if (el) {
        el.style.transform = createParallaxStyle(
          scrolled -
            getCoords(refsWrapperSlideParalax.current[index]).top +
            Math.abs(el.offsetTop)
        );
      }
    });
  }, []);

  const toggleParallax = useCallback(() => {
    dispatch(
      FolioActions.setElementProps({
        props: {
          isParallax: !enabledParallax,
        },
        path: `structure[${index}].props`,
      })
    );
    dispatch(setBlockConfig(index));
  }, [dispatch, enabledParallax, index]);

  useEffect(() => {
    if (enabledParallax) {
      createParallax();
      window.addEventListener("scroll", createParallax);
    } else {
      window.removeEventListener("scroll", createParallax);
    }
    return () => {
      window.removeEventListener("scroll", createParallax);
    };
  }, [createParallax, enabledParallax]);

  const showControls = useMemo(() => media.filter(({src}) => src).length > 1, [media]);

  return (
    <Slider
      fraction={fraction}
      draggable={!isEdit}
      isParallax={true}
      className={parallaxSliderClassName}
      pagination={false}
      navigation={showControls}
      loop={false}
    >
      {media.map((element, idx) => {
        const {src, crop} = element;
        if (!src) return null;
        const isCropped = crop && !isEmpty(crop);
        return (
          <SlideParallax
            key={`slider-${index}-${idx}`}
            height={height}
            ref={(e) => (refsWrapperSlideParalax.current[idx] = e)}
          >
            <MediaContent ref={(e) => (refsWrapper.current[idx] = e)}>
              {isCropped ? (
                <CropImage
                  source={src + getCropperQueryString(crop)}
                  crop={crop}
                  height={window.innerHeight}
                  ignoreMaxHeight={true}
                  isParallax={true}
                />
              ) : (
                <ParallaxImage src={src} />
              )}
            </MediaContent>
            <ChildContent ref={(e) => (refs.current[idx] = e)}>
              <MediaController
                bottomHandler={[]}
                topHandler={[
                  {icon: IconCrop, action: () => cropOpen(idx)},
                  {icon: IconMediaAdd, action: () => mediaOpen(idx)},
                  {
                    icon: ParallaxIcon,
                    action: toggleParallax,
                    highlighted: enabledParallax,
                  },
                ]}
                isEdit={isEdit}
              />
              <LayoutWrapper isSpan={isSpan}>{layout[idx]}</LayoutWrapper>
            </ChildContent>
          </SlideParallax>
        );
      })}
    </Slider>
  );
});

const ParallaxContainer = memo(
  forwardRef(({content, layout, enabledParallax}, ref) => {
    const {index, isEdit, fraction, isSpan} = useContext(BlockContext);

    return (
      <BlockWrapper
        width={fraction}
        ref={ref}
        index={index}
        isSpan={isSpan}
        isEdit={isEdit}
      >
        <BlockContent isSpan={isSpan}>
          {content}
          <ParallaxWrapper isSpan={isSpan}>
            <ParallaxSlider layout={layout} enabledParallax={enabledParallax} />
          </ParallaxWrapper>
        </BlockContent>
      </BlockWrapper>
    );
  })
);

const ParallaxWrapper = styled.div`
  position: relative;
  height: calc(100% - 37px);
  ${({isSpan}) =>
    isSpan &&
    css`
      width: 100vw;
      left: 50%;
      right: 50%;
      transform: translate(-50%, 0);
    `}
  @media screen and (max-width: ${({theme}) => theme.breakpoints.values.md}px) {
    height: 100%;
  }  
  @media print {
    width: 100%;
    right: 0;
    left: auto;
    transform: none;
  }
`;

ParallaxContainer.propTypes = {
  content: PropTypes.element,
  layout: PropTypes.element.isRequired,
  enabledParallax: PropTypes.bool.isRequired,
};

ParallaxContainer.defaultProps = {
  content: <></>,
};

export {ParallaxContainer};
