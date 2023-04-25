import React, {memo, useCallback, useEffect, useMemo, useRef, useState} from "react";
import PropTypes from "prop-types";
import {useSelector} from "react-redux";
import {LayoutEdit} from "./BlockEdit";
import BlockContentWrapper from "./BlockWrapper";
import {useMediaQuery} from "react-responsive";
import {ParallaxContainer} from "./ParallaxContainer";
import {MAX_SLIDES_COUNT} from "../../config/consts";
import {IterateComponent} from "./IterateComponent";
import {BlockContext} from "./context";

const Block = memo(
  ({
    index,
    isEdit: isEditProps,
    fraction: customFraction,
    isAdaptiveView,
    isTemplate,
    folioIsLock,
    onlyPreview,
  }) => {
    const blockWidth = useRef(0);
    const blockRef = useRef(null);
    const timer = useRef(null);

    const id = useSelector((state) => state.folio.structure[index]?.id);
    const is_lock = useSelector((state) => state.folio.structure[index]?.is_lock);
    const cols = useSelector((state) => state.folio.structure[index]?.cols);
    const props = useSelector((state) => state.folio.structure[index]?.props);
    const layout = useSelector((state) => state.folio.structure[index]?.layout);

    const isMobile = useMediaQuery({maxWidth: 768});

    const counter = useMemo(() => ({}), []);
    const setCounter = useCallback(
      (type, count = 1) => {
        counter[type] === undefined ? (counter[type] = 0) : (counter[type] += count);
      },
      [counter]
    );
    const refreshCounter = useCallback(
      (type) => {
        counter[type] = -1;
      },
      [counter]
    );

    const getCounter = useCallback(
      (type) => {
        return counter[type];
      },
      [counter]
    );

    const {
      background,
      resize,
      adaptiveWidth,
      adaptiveCols,
      isParallax,
      noPadding,
    } = useMemo(() => {
      return {
        background: props.background,
        resize: props.resize,
        adaptiveWidth: props.adaptiveWidth,
        adaptiveCols: props.adaptiveCols,
        isParallax: props.isParallax,
        noPadding: props.noPadding,
      };
    }, [props]);

    const isEdit = useMemo(() => isEditProps && (!is_lock || isTemplate), [
      isEditProps,
      isTemplate,
      is_lock,
    ]);

    const fraction = useMemo(() => customFraction || cols, [cols, customFraction]);
    const isSpan = useMemo(() => fraction === 0, [fraction]);

    const isParallaxTemplate = useMemo(
      () => Object.keys(props).indexOf("isParallax") !== -1,
      [props]
    );

    const [isAdaptive, changeIsAdaptive] = useState(isAdaptiveView);

    const checkAdaptive = useCallback(() => {
      if (isMobile || isAdaptiveView) {
        changeIsAdaptive(true);
      } else {
        if (blockRef.current) {
          blockWidth.current = blockRef.current.getBoundingClientRect().width;
          let isAdaptiveKey = false;
          if (adaptiveWidth) {
            isAdaptiveKey = adaptiveWidth >= blockWidth.current;
          }
          if (!isAdaptiveKey && adaptiveCols) {
            isAdaptiveKey = adaptiveCols >= fraction && fraction !== 0;
          }
          changeIsAdaptive(isAdaptiveKey);
        }
      }
    }, [adaptiveCols, adaptiveWidth, fraction, isAdaptiveView, isMobile]);

    const checkAdaptiveWithTimeout = useCallback(
      (timeout = 250) => {
        clearTimeout(timer.current);
        timer.current = setTimeout(checkAdaptive, timeout);
      },
      [checkAdaptive]
    );

    useEffect(() => {
      checkAdaptive();
    }, [adaptiveWidth, checkAdaptive, fraction, adaptiveCols]);

    useEffect(() => {
      window.addEventListener("resize", checkAdaptiveWithTimeout);
      return () => {
        window.removeEventListener("resize", checkAdaptiveWithTimeout);
      };
    }, [checkAdaptiveWithTimeout]);

    const pathToProps = useMemo(() => `structure[${index}].layout`, [index]);

    const isFetchingFolioDuplicate = useSelector(
      (state) => state.folio?.isFetchingFolioDuplicate
    );
    const isFetchingFolioDelete = useSelector(
      (state) => state.folio?.isFetchingFolioDelete
    );

    const content = useMemo(
      () => (
        <>
          {isEditProps && id !== -1 && (
            <LayoutEdit
              key={`layout-edit-${index}`}
              resize={resize}
              is_lock={is_lock}
              folioIsLock={folioIsLock}
              isParallaxTemplate={isParallaxTemplate}
              isFetching={isFetchingFolioDuplicate || isFetchingFolioDelete}
            />
          )}
        </>
      ),
      [
        folioIsLock,
        id,
        index,
        isEditProps,
        isFetchingFolioDelete,
        isFetchingFolioDuplicate,
        isParallaxTemplate,
        is_lock,
        resize,
      ]
    );

    const createContent = useCallback(
      (isParallax) => {
        const params = {
          layout: JSON.stringify(layout),
          adaptiveCols,
          adaptiveWidth,
          blockWidth: blockWidth.current,
          onlyPreview,
          isParallax,
          pathToProps,
          isAdaptive,
        };
        return <IterateComponent {...params} />;
      },
      [adaptiveCols, adaptiveWidth, isAdaptive, layout, onlyPreview, pathToProps]
    );

    const component = useMemo(() => {
      if (isParallax !== undefined) {
        return (
          <ParallaxContainer
            content={content}
            layout={new Array(MAX_SLIDES_COUNT)
              .fill(0)
              .map(() => createContent(isParallax))}
            ref={blockRef}
            enabledParallax={isParallax}
          />
        );
      }

      return (
        <BlockContentWrapper
          background={background}
          content={content}
          noPadding={noPadding}
          layout={createContent()}
          ref={blockRef}
          onlyPreview={onlyPreview}
        />
      );
    }, [background, content, createContent, isParallax, noPadding, onlyPreview]);

    return (
      <BlockContext.Provider
        value={{
          isEdit,
          index,
          isTemplate,
          fraction,
          isSpan,
          blockId: id,
          getCounter,
          setCounter,
          refreshCounter,
          isMobile,
          adaptiveCols,
          adaptiveWidth,
          blockWidth: blockWidth.current,
          onlyPreview,
          isParallax,
        }}
      >
        {component}
      </BlockContext.Provider>
    );
  }
);

Block.propTypes = {
  isEdit: PropTypes.bool,
  index: PropTypes.number.isRequired,
  fraction: PropTypes.number,
  isAdaptiveView: PropTypes.bool,
  isTemplate: PropTypes.bool,
  folioIsLock: PropTypes.bool,
  onlyPreview: PropTypes.bool,
  reducerName: PropTypes.string.isRequired,
};

Block.defaultProps = {
  isEdit: false,
  fraction: null,
  isAdaptiveView: false,
  isTemplate: false,
  folioIsLock: false,
  onlyPreview: false,
};

export default Block;
