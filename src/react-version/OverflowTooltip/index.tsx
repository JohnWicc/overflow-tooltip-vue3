import { Tooltip } from 'antd';
import {
  CSSProperties,
  ReactNode,
  useCallback,
  useMemo,
  useRef,
  useState,
} from 'react';
import styles from './index.less';
interface Props {
  disabled?: boolean;
  maxWidth?: number;
  isCheckMaxWidth?: boolean;
  lineNum?: number;
  title: ReactNode | (() => ReactNode);
}

// 该组件用于实现仅在文本溢出时才展示tooltip
const OverflowTooltip: React.FC<Props> = (props) => {
  const {
    disabled = false,
    maxWidth = 100,
    isCheckMaxWidth = true,
    lineNum = 1,
    children,
    title,
  } = props;
  const [needDisabled, setNeedDisabled] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const containerStyle = useMemo<CSSProperties>(() => {
    return {
      maxWidth: maxWidth,
      WebkitLineClamp: lineNum !== 1 ? lineNum : '',
    };
  }, [lineNum, maxWidth]);
  const checkIsShowPopover = useCallback(() => {
    // 多行的情况下 只需要判断高度是否超出即可
    if (!containerRef.current || !isCheckMaxWidth) return;
    const { width, height } = containerRef.current.getBoundingClientRect();
    if (lineNum !== 1) {
      // scrollHeight对应的是实际应该渲染的高度
      const realHeight = containerRef.current.scrollHeight;
      setNeedDisabled(height >= realHeight);
    } else if (isCheckMaxWidth) {
      // 通过获取div节点的getBoundingClientRect属性，拿到div的实际宽度和高度
      setNeedDisabled(width < maxWidth);
    }
  }, [containerRef, isCheckMaxWidth, lineNum, maxWidth]);

  const tooltipTitle = useMemo(() => {
    // title传空字符串时会禁用tooltip
    return disabled || needDisabled ? '' : title;
  }, [title, needDisabled, disabled]);
  return (
    <Tooltip title={tooltipTitle}>
      {/* 这样写的好处是div的宽高会被内容撑开，通过getBoundingClientRect()方法可以
      获得这个div的实际宽高，通过比较实际宽高和设置的最大宽度，就可以判断是否禁用tooltip */}
      <div
        style={containerStyle}
        className={
          lineNum === 1
            ? styles['overflow-hidden']
            : styles['multi-overflow-hidden']
        }
        ref={containerRef}
        onMouseEnter={checkIsShowPopover}
        onMouseLeave={checkIsShowPopover}
      >
        {children}
      </div>
    </Tooltip>
  );
};

export default OverflowTooltip;
