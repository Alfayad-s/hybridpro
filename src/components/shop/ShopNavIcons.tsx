import styles from "./ShopNavIcons.module.css";

type IconProps = {
  play?: number;
  size?: number;
  color?: string;
};

const stroke = {
  fill: "none",
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  strokeWidth: 2,
};

export function HouseIcon({ play = 0, size = 22, color = "currentColor" }: IconProps) {
  return (
    <span className={styles.icon} aria-hidden>
      <svg
        key={play}
        width={size}
        height={size}
        viewBox="0 0 24 24"
        stroke={color}
        className={`${styles.house}${play ? ` ${styles.play}` : ""}`}
        {...stroke}
      >
        <path d="M3 10a2 2 0 0 1 .709-1.528l7-5.999a2 2 0 0 1 2.582 0l7 5.999A2 2 0 0 1 21 10v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
        <path d="M15 21v-8a1 1 0 0 0-1-1h-4a1 1 0 0 0-1 1v8" className={styles.door} />
      </svg>
    </span>
  );
}

export function HeartIcon({
  play = 0,
  size = 22,
  color = "currentColor",
  filled = false,
}: IconProps & { filled?: boolean }) {
  return (
    <span className={styles.icon} aria-hidden>
      <svg
        key={play}
        width={size}
        height={size}
        viewBox="0 0 24 24"
        stroke={color}
        className={`${styles.heart}${play ? ` ${styles.play}` : ""}`}
        {...stroke}
      >
        <path
          d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"
          className={styles.heartPath}
          fill={filled ? color : "none"}
        />
      </svg>
    </span>
  );
}

export function SearchIcon({ play = 0, size = 22, color = "currentColor" }: IconProps) {
  return (
    <span className={styles.icon} aria-hidden>
      <svg
        key={play}
        width={size}
        height={size}
        viewBox="0 0 24 24"
        stroke={color}
        className={`${styles.search}${play ? ` ${styles.play}` : ""}`}
        {...stroke}
      >
        <circle cx="11" cy="11" r="8" />
        <path d="m21 21-4.3-4.3" />
      </svg>
    </span>
  );
}

export function CartIcon({ play = 0, size = 22, color = "currentColor" }: IconProps) {
  return (
    <span className={styles.icon} aria-hidden>
      <svg
        key={play}
        width={size}
        height={size}
        viewBox="0 0 24 24"
        stroke={color}
        className={`${styles.cart}${play ? ` ${styles.play}` : ""}`}
        {...stroke}
      >
        <path d="M6.29977 5H21L19 12H7.37671M20 16H8L6 3H3M9 20C9 20.5523 8.55228 21 8 21C7.44772 21 7 20.5523 7 20C7 19.4477 7.44772 19 8 19C8.55228 19 9 19.4477 9 20ZM20 20C20 20.5523 19.5523 21 19 21C18.4477 21 18 20.5523 18 20C18 19.4477 18.4477 19 19 19C19.5523 19 20 19.4477 20 20Z" />
      </svg>
    </span>
  );
}
