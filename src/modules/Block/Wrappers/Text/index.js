import React, {useCallback, memo, useEffect, useRef, useMemo, useContext} from "react";
import PropTypes from "prop-types";
import Text from "modules/Block/Elements/Text";
import {useDispatch, useSelector} from "react-redux";
import get from "lodash/get";
import {defaultTextElement} from "config/consts";
import {FolioActions} from "reducers/folio";
import {setBlockConfig, setHeroConfig} from "actions/folio";
import {decodeURIComponentSafe} from "utils/decodeURIComponentSafe";
import {BlockContext} from "../../context";

const removeClassesByPrefix = (el, prefix) => {
  for (let i = el.classList.length - 1; i >= 0; i--) {
    if (el.classList[i].startsWith(prefix)) {
      el.classList.remove(el.classList[i]);
    }
  }
};

const TextReduxWrapper = memo(({path, isHero, type, color, position}) => {
  const {index: blockIndex, isEdit, onlyPreview} = useContext(BlockContext);
  const dispatch = useDispatch();
  const ref = useRef();

  const config = useSelector((state) => get(state.folio, path, defaultTextElement));

  const decodedConfig = useMemo(() => {
    const decodedConfigObj = {
      ...config,
      text: config,
    };

    if (typeof config !== "string") {
      decodedConfigObj["text"] = {
        ops: config.text.ops.map((op) => {
          return {
            ...op,
            insert: decodeURIComponentSafe(op.insert),
          };
        }),
      };
    }
    return decodedConfigObj;
  }, [config]);

  const onChange = useCallback(
    (value) => {
      let props;
      const isString = typeof value === "string";
      if (isString) {
        props = value;
      } else {
        const ops = value.ops.map((op) => ({
          ...op,
          insert: encodeURIComponent(op.insert),
        }));
        props = {text: {ops}};
      }

      dispatch(FolioActions.setElementProps({path, props, fullUpdate: isString}));
    },
    [dispatch, path]
  );

  const onBlur = useCallback(() => {
    if (blockIndex !== -1) dispatch(setBlockConfig(blockIndex));
    if (isHero) dispatch(setHeroConfig());
  }, [blockIndex, dispatch, isHero]);

  useEffect(() => {
    if (isHero) {
      const container = ref.current.querySelector(".ql-editor");
      if (container) {
        const elements = [...container.querySelectorAll("*")];
        elements.forEach((el) => removeClassesByPrefix(el, "custom-size-"));
        const handleFontSize = () => {
          try {
            const hasMoreWidth = container.scrollWidth > container.clientWidth;
            if (hasMoreWidth) {
              const list = [container, ...elements];
              let smallestSizes = 0;
              list.forEach((el) => {
                const fontSize = window
                  .getComputedStyle(el)
                  .getPropertyValue("font-size");
                const size = Number(fontSize.replace("px", ""));
                const newSize = size > 1 ? size - 1 : 1;
                // el.style.fontSize = `${size - 1}px`;
                removeClassesByPrefix(el, "custom-size-");
                el.classList.add(`custom-size-${newSize}px`);
                if (newSize === 1) smallestSizes += 1;
              });
              if (smallestSizes !== list.length) {
                handleFontSize();
              }
            }
          } catch (e) {
            //
          }
        };
        handleFontSize();
        let timer;
        const handleResize = () => {
          clearTimeout(timer);
          timer = setTimeout(() => {
            elements.forEach((el) => removeClassesByPrefix(el, "custom-size-"));
            handleFontSize();
          }, 500);
        };
        window.addEventListener("resize", handleResize);
        return () => {
          window.removeEventListener("resize", handleResize);
        };
      }
    }
  }, [isHero, config]);

  return (
    <Text
      ref={ref}
      isEdit={isEdit}
      onChange={onChange}
      {...decodedConfig}
      onBlur={onBlur}
      onlyPreview={onlyPreview}
      type={type}
      color={color}
      position={position}
      isHero={isHero}
    />
  );
});

TextReduxWrapper.propTypes = {
  path: PropTypes.string.isRequired,
  isHero: PropTypes.bool,
  type: PropTypes.string,
  color: PropTypes.string,
  position: PropTypes.string,
};

TextReduxWrapper.defaultProps = {
  isHero: false,
  type: "",
  color: "",
  position: "left",
};

export default TextReduxWrapper;
