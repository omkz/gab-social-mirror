const MoreIcon = ({
  className = '',
  width = '16px',
  height = '16px',
  viewBox = '0 0 64 64',
  title = 'More',
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
    <path d="M 32 0 C 14.355 0 0 14.355 0 32 C 0 49.644 14.355 64 32 64 C 49.644 64 64 49.644 64 32 C 64 14.355 49.644 0 32 0 Z M 16.484 36.847 C 13.812 36.847 11.636 34.671 11.636 32 C 11.636 29.328 13.812 27.152 16.484 27.152 C 19.16 27.152 21.332 29.328 21.332 32 C 21.332 34.671 19.16 36.847 16.484 36.847 Z M 32 36.847 C 29.328 36.847 27.152 34.671 27.152 32 C 27.152 29.328 29.328 27.152 32 27.152 C 34.671 27.152 36.847 29.328 36.847 32 C 36.847 34.671 34.671 36.847 32 36.847 Z M 47.515 36.847 C 44.839 36.847 42.667 34.671 42.667 32 C 42.667 29.328 44.839 27.152 47.515 27.152 C 50.187 27.152 52.363 29.328 52.363 32 C 52.363 34.671 50.187 36.847 47.515 36.847 Z M 47.515 36.847" />
  </g>
</svg>

)

export default MoreIcon