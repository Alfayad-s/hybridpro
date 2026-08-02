"use client";

import {
  animate,
  motion,
  useMotionValue,
  useMotionValueEvent,
  useTransform,
} from "motion/react";
import { useEffect, useRef, useState, type ReactNode } from "react";
import { IconVolume, IconVolumeOff } from "@tabler/icons-react";

import "./ElasticSlider.css";

const MAX_OVERFLOW = 50;

export type ElasticSliderProps = {
  defaultValue?: number;
  startingValue?: number;
  maxValue?: number;
  className?: string;
  isStepped?: boolean;
  stepSize?: number;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  onValueChange?: (value: number) => void;
  showValue?: boolean;
};

export default function ElasticSlider({
  defaultValue = 50,
  startingValue = 0,
  maxValue = 100,
  className = "",
  isStepped = false,
  stepSize = 1,
  leftIcon = <IconVolumeOff stroke={1.75} />,
  rightIcon = <IconVolume stroke={1.75} />,
  onValueChange,
  showValue = false,
}: ElasticSliderProps) {
  return (
    <div className={`slider-container ${className}`}>
      <Slider
        defaultValue={defaultValue}
        startingValue={startingValue}
        maxValue={maxValue}
        isStepped={isStepped}
        stepSize={stepSize}
        leftIcon={leftIcon}
        rightIcon={rightIcon}
        onValueChange={onValueChange}
        showValue={showValue}
      />
    </div>
  );
}

type SliderProps = Required<
  Pick<
    ElasticSliderProps,
    | "defaultValue"
    | "startingValue"
    | "maxValue"
    | "isStepped"
    | "stepSize"
    | "leftIcon"
    | "rightIcon"
    | "showValue"
  >
> & {
  onValueChange?: (value: number) => void;
};

function Slider({
  defaultValue,
  startingValue,
  maxValue,
  isStepped,
  stepSize,
  leftIcon,
  rightIcon,
  onValueChange,
  showValue,
}: SliderProps) {
  const [value, setValue] = useState(defaultValue);
  const sliderRef = useRef<HTMLDivElement>(null);
  const [region, setRegion] = useState<"left" | "right" | "middle">("middle");
  const clientX = useMotionValue(0);
  const overflow = useMotionValue(0);
  const scale = useMotionValue(1);

  const leftX = useTransform(() =>
    region === "left" ? -overflow.get() / scale.get() : 0,
  );
  const rightX = useTransform(() =>
    region === "right" ? overflow.get() / scale.get() : 0,
  );
  const opacity = useTransform(scale, [1, 1.2], [0.7, 1]);
  const scaleX = useTransform(() => {
    if (sliderRef.current) {
      const { width } = sliderRef.current.getBoundingClientRect();
      return 1 + overflow.get() / width;
    }
    return 1;
  });
  const scaleY = useTransform(overflow, [0, MAX_OVERFLOW], [1, 0.8]);
  const transformOrigin = useTransform(() => {
    if (sliderRef.current) {
      const { left, width } = sliderRef.current.getBoundingClientRect();
      return clientX.get() < left + width / 2 ? "right" : "left";
    }
    return "left";
  });
  const height = useTransform(scale, [1, 1.2], [6, 12]);
  const marginTop = useTransform(scale, [1, 1.2], [0, -3]);
  const marginBottom = useTransform(scale, [1, 1.2], [0, -3]);

  useEffect(() => {
    queueMicrotask(() => setValue(defaultValue));
  }, [defaultValue]);

  useMotionValueEvent(clientX, "change", (latest) => {
    if (!sliderRef.current) return;

    const { left, right } = sliderRef.current.getBoundingClientRect();
    let newValue: number;

    if (latest < left) {
      setRegion("left");
      newValue = left - latest;
    } else if (latest > right) {
      setRegion("right");
      newValue = latest - right;
    } else {
      setRegion("middle");
      newValue = 0;
    }

    overflow.jump(decay(newValue, MAX_OVERFLOW));
  });

  const commitValue = (next: number) => {
    setValue(next);
    onValueChange?.(next);
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (e.buttons > 0 && sliderRef.current) {
      const { left, width } = sliderRef.current.getBoundingClientRect();
      let newValue =
        startingValue +
        ((e.clientX - left) / width) * (maxValue - startingValue);

      if (isStepped) {
        newValue = Math.round(newValue / stepSize) * stepSize;
      }

      newValue = Math.min(Math.max(newValue, startingValue), maxValue);
      commitValue(newValue);
      clientX.jump(e.clientX);
    }
  };

  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    handlePointerMove(e);
    e.currentTarget.setPointerCapture(e.pointerId);
  };

  const handlePointerUp = () => {
    animate(overflow, 0, { type: "spring", bounce: 0.5 });
  };

  const getRangePercentage = () => {
    const totalRange = maxValue - startingValue;
    if (totalRange === 0) return 0;
    return ((value - startingValue) / totalRange) * 100;
  };

  return (
    <>
      {showValue && <p className="value-indicator">{Math.round(value)}</p>}
      <motion.div
        onHoverStart={() => animate(scale, 1.2)}
        onHoverEnd={() => animate(scale, 1)}
        onTouchStart={() => animate(scale, 1.2)}
        onTouchEnd={() => animate(scale, 1)}
        style={{ scale, opacity }}
        className="slider-wrapper"
      >
        <motion.div
          className="slider-icon"
          animate={{
            scale: region === "left" ? [1, 1.4, 1] : 1,
            transition: { duration: 0.25 },
          }}
          style={{ x: leftX }}
        >
          {leftIcon}
        </motion.div>

        <div
          ref={sliderRef}
          className="slider-root"
          onPointerMove={handlePointerMove}
          onPointerDown={handlePointerDown}
          onPointerUp={handlePointerUp}
          onPointerCancel={handlePointerUp}
          onLostPointerCapture={handlePointerUp}
        >
          <motion.div
            style={{
              scaleX,
              scaleY,
              transformOrigin,
              height,
              marginTop,
              marginBottom,
            }}
            className="slider-track-wrapper"
          >
            <div className="slider-track">
              <div
                className="slider-range"
                style={{ width: `${getRangePercentage()}%` }}
              />
            </div>
          </motion.div>
        </div>

        <motion.div
          className="slider-icon"
          animate={{
            scale: region === "right" ? [1, 1.4, 1] : 1,
            transition: { duration: 0.25 },
          }}
          style={{ x: rightX }}
        >
          {rightIcon}
        </motion.div>
      </motion.div>
    </>
  );
}

function decay(value: number, max: number) {
  if (max === 0) return 0;
  const entry = value / max;
  const sigmoid = 2 * (1 / (1 + Math.exp(-entry)) - 0.5);
  return sigmoid * max;
}
