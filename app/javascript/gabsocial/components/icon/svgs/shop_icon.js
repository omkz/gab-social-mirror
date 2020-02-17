const ShopIcon = ({
  className = '',
  width = '26px',
  height = '26px',
  viewBox = '0 0 64 64',
  title = 'Shop',
}) => (
  <svg
    className={className}
    version='1.1'
    xmlns='http://www.w3.org/2000/svg'
    x='0px'
    y='0px'
    width={width}
    height={height}
    viewBox={viewBox}
    xmlSpace='preserve'
    aria-label={title}
  >
    <g>
      <path d="M 49.921875 3.40625 L 30.269531 3.40625 C 29.027344 3.40625 27.832031 3.902344 26.953125 4.78125 L 1.375 30.355469 C -0.457031 32.1875 -0.457031 35.15625 1.375 36.992188 L 21.023438 56.644531 C 22.859375 58.476562 25.828125 58.476562 27.660156 56.644531 L 53.238281 31.070312 C 54.117188 30.1875 54.613281 28.992188 54.613281 27.746094 L 54.613281 8.097656 C 54.613281 5.507812 52.511719 3.40625 49.921875 3.40625 Z M 41.707031 19.832031 C 39.765625 19.832031 38.1875 18.253906 38.1875 16.3125 C 38.1875 14.371094 39.765625 12.792969 41.707031 12.792969 C 43.652344 12.792969 45.226562 14.371094 45.226562 16.3125 C 45.226562 18.253906 43.652344 19.832031 41.707031 19.832031 Z M 41.707031 19.832031" />
      <path d="M 59.308594 8.097656 L 59.304688 29.945312 C 59.304688 31.023438 58.875 32.066406 58.109375 32.828125 L 32.117188 58.820312 L 32.515625 59.21875 C 34.347656 61.050781 37.320312 61.050781 39.152344 59.21875 L 62.621094 35.753906 C 63.503906 34.875 64 33.679688 64 32.4375 L 64 12.792969 C 64 10.199219 61.898438 8.097656 59.308594 8.097656 Z M 59.308594 8.097656" />
    </g>
  </svg>
)

export default ShopIcon