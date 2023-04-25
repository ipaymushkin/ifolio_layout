import React, {memo, useCallback, useContext, useMemo} from "react";
import PropTypes from "prop-types";
import {useDispatch, useSelector} from "react-redux";
import get from "lodash/get";
import {show} from "redux-modal";
import {IconCrop} from "icons/IconCrop";
import {IconMediaAdd} from "icons/IconMediaAdd";
import MediaController from "modules/Block/Elements/MediaController";
import {defaultStaticImg, defaultMediaElement} from "config/consts";
import {roundingPercent} from "utils/roundingPercent";
import MediaContainer from "modules/Block/Wrappers/Media/Container";
import {MediaActions} from "reducers/media";
import {isSvgOrGif} from "utils/isSvgOrGif";
import {BlockContext} from "../../context";

const MediaReduxWrapper = memo(
  ({
    path,
    pathToProps,
    pathToContent,
    pathToLayout,
    pathToAvatarShape,
    pathToAvatarBorder,
    currentIndex,
    placeholderType,
    placeholderShape,
    bottomHandler: bottomHandlerProps = [],
    rightHandler: rightHandlerProps,
    maxElements,
    defaultAspect,
    isHero,
    isAdaptive,
    isTurntable,
    isParallax,
  }) => {
    const {fraction, onlyPreview, isEdit, index: blockIndex} = useContext(BlockContext);

    const dispatch = useDispatch();
    // content props
    const configSelectorState = useSelector((state) => get(state.folio, path));

    const configSelector = useMemo(() => {
      if (
        !configSelectorState ||
        (configSelectorState &&
          (Array.isArray(configSelectorState) ||
            Object.keys(configSelectorState).length === 0))
      ) {
        return defaultMediaElement;
      } else {
        return configSelectorState;
      }
    }, [configSelectorState]);

    // placeholder props
    const props = useSelector((state) => get(state.folio, pathToProps, {}));

    const {config, isPlaceholder} = useMemo(() => {
      const configObj = {
        ...configSelector,
        src: configSelector.src,
        size: props.size,
      };
      let isPlaceholderBool = false;
      if (!configObj.src) {
        isPlaceholderBool = true;
        configObj.src = defaultStaticImg;
      }
      return {config: configObj, isPlaceholder: isPlaceholderBool};
    }, [configSelector, props.size]);

    const avatarShape = useSelector((state) => get(state.folio, pathToAvatarShape, null));
    const avatarBorder = useSelector((state) =>
      get(state.folio, pathToAvatarBorder, null)
    );

    const aspect = useMemo(
      () =>
        props.aspect ||
        config.aspect ||
        config.selectedAspect ||
        (defaultAspect !== 0 ? defaultAspect : false),
      [config.aspect, config.selectedAspect, defaultAspect, props.aspect]
    );

    const type = useMemo(() => placeholderType || props.type || config.type, [
      config.type,
      placeholderType,
      props.type,
    ]);

    const shape = useMemo(() => placeholderShape || props.shape || config.shape, [
      config.shape,
      placeholderShape,
      props.shape,
    ]);

    const fixedSize = useMemo(
      () => (aspect ? roundingPercent((1 / aspect) * 100) : false),
      [aspect]
    );

    const fit = useMemo(() => config.fit, [config.fit]);

    const blockAspect = useMemo(
      () =>
        type === "avatar"
          ? 1
          : props.aspect ||
            config.aspect ||
            (defaultAspect !== 0 ? defaultAspect : false),
      [config.aspect, defaultAspect, props.aspect, type]
    );

    const cropperOptions = useMemo(
      () => ({
        src: config.src,
        path,
        aspect: blockAspect,
        blockIndex,
        isHero,
        fit,
        selectedAspect: config.selectedAspect,
        hideFit: isTurntable || isHero || isParallax || type === "avatar",
      }),
      [
        blockAspect,
        blockIndex,
        config.selectedAspect,
        config.src,
        fit,
        isHero,
        isParallax,
        isTurntable,
        path,
        type,
      ]
    );

    const cropperOpen = useCallback(() => {
      dispatch(show("cropper-modal", cropperOptions));
    }, [cropperOptions, dispatch]);

    const mediaOptions = useMemo(
      () => ({
        path,
        pathToContent,
        pathToLayout,
        type,
        selectedIndex: currentIndex,
        maxElements,
        blockIndex,
        isHero,
        allowTypes: [
          {label: "All", value: "all_without_documents"},
          {label: "Images", value: "images"},
          {label: "Gifs", value: "gifs"},
          {label: "Videos", value: "videos"},
        ],
      }),
      [
        blockIndex,
        currentIndex,
        isHero,
        maxElements,
        path,
        pathToContent,
        pathToLayout,
        type,
      ]
    );

    const mediaOpen = useCallback(() => {
      dispatch(show("media-library", mediaOptions));
      dispatch(MediaActions.setIsFirstOpenQuery(true));
    }, [dispatch, mediaOptions]);

    const cropHandler = useMemo(() => ({icon: IconCrop, action: cropperOpen}), [
      cropperOpen,
    ]);

    const mediaHandler = useMemo(() => ({icon: IconMediaAdd, action: mediaOpen}), [
      mediaOpen,
    ]);

    const {topHandler, bottomHandler, rightHandler} = useMemo(() => {
      const topHandlerArr = [],
        bottomHandlerArr = [],
        rightHandlerArr = [];
      if (!rightHandlerProps) {
        bottomHandlerArr.push(mediaHandler, ...bottomHandlerProps);
        if (
          type !== "video" &&
          type !== "gif" &&
          !isSvgOrGif(config.src) &&
          !config.iconParams &&
          config.src &&
          !isPlaceholder
        ) {
          topHandlerArr.push(cropHandler);
        }
      } else {
        if (type !== "video") {
          rightHandlerArr.push(mediaHandler, cropHandler, ...rightHandlerProps);
        } else {
          rightHandlerArr.push(mediaHandler, ...rightHandlerProps);
        }
      }
      return {
        topHandler: topHandlerArr,
        bottomHandler: bottomHandlerArr,
        rightHandler: rightHandlerArr,
      };
    }, [
      bottomHandlerProps,
      config.iconParams,
      config.src,
      cropHandler,
      isPlaceholder,
      mediaHandler,
      rightHandlerProps,
      type,
    ]);

    const {crop, iconParams} = useMemo(() => {
      let cropObj = {};
      if (config.crop) cropObj = config.crop;
      let iconParamsObj = {};
      if (config.iconParams) iconParamsObj = config.iconParams;
      return {
        crop: cropObj,
        iconParams: iconParamsObj,
      };
    }, [config.crop, config.iconParams]);

    return (
      <MediaContainer
        crop={crop}
        avatarShape={avatarShape}
        avatarBorder={avatarBorder}
        isHero={isHero}
        fixedSize={fixedSize}
        isTurntable={isTurntable}
        shape={shape}
        config={config}
        type={type}
        fraction={fraction}
        isAdaptive={isAdaptive}
        iconParams={iconParams}
        onlyPreview={onlyPreview}
        ignoreMaxHeight={props.ignoreMaxHeight}
        fit={fit}
        aspect={aspect}
        controller={
          <MediaController
            topHandler={topHandler}
            bottomHandler={bottomHandler}
            rightHandler={rightHandler}
            isEdit={isEdit}
            mediaOptions={mediaOptions}
            cropperOptions={cropperOptions}
            isTurntable={isTurntable}
            isHero={rightHandler.length > 0}
          />
        }
      />
    );
  }
);

MediaReduxWrapper.propTypes = {
  path: PropTypes.string.isRequired,
  pathToProps: PropTypes.string,
  pathToLayout: PropTypes.string,
  pathToContent: PropTypes.string.isRequired,
  pathToAvatarShape: PropTypes.string,
  pathToAvatarBorder: PropTypes.string,
  currentIndex: PropTypes.number,
  placeholderType: PropTypes.string,
  placeholderShape: PropTypes.string,
  bottomHandler: PropTypes.array,
  maxElements: PropTypes.number,
  defaultAspect: PropTypes.number,
  isHero: PropTypes.bool,
  isAdaptive: PropTypes.bool,
};

MediaReduxWrapper.propTypes = {
  pathToProps: "",
  pathToLayout: "",
  pathToAvatarShape: null,
  pathToAvatarBorder: null,
  currentIndex: 0,
  placeholderType: "",
  placeholderShape: "",
  bottomHandler: [],
  maxElements: 0,
  defaultAspect: 0,
  isHero: false,
  isAdaptive: false,
};

export default MediaReduxWrapper;
