import { Fragment } from 'react'
import classNames from 'classnames/bind'
import Icon from './icon'
import Text from './text'

const cx = classNames.bind(_s)

export default class Input extends PureComponent {
  static propTypes = {
    placeholder: PropTypes.string,
    prependIcon: PropTypes.string,
    value: PropTypes.string,
    hasClear: PropTypes.bool,
    onChange: PropTypes.func,
    onKeyUp: PropTypes.func,
    onFocus: PropTypes.func,
    onBlur: PropTypes.func,
    onClear: PropTypes.func,
    title: PropTypes.string,
    small: PropTypes.bool,
  }

  render() {
    const {
      placeholder,
      prependIcon,
      value,
      hasClear,
      onChange,
      onKeyUp,
      onFocus,
      onBlur,
      onClear,
      title,
      small
    } = this.props

    const inputClasses = cx({
      default: 1,
      text: 1,
      outlineNone: 1,
      lineHeight125: 1,
      displayBlock: 1,
      paddingVertical10PX: 1,
      backgroundTransparent: 1,
      fontSize15PX: 1,
      flexGrow1: 1,
      paddingHorizontal5PX: !!prependIcon,
      paddingLeft15PX: !prependIcon,
      paddingRight15PX: !hasClear,
    })

    return (
      <Fragment>
        {
          !!title &&
          <div className={[_s.default, _s.marginBottom10PX, _s.paddingLeft15PX].join(' ')}>
            <Text size='small' weight='medium' color='secondary'>
              {title}
            </Text>
          </div>
        }
        <div className={[_s.default, _s.backgroundColorPrimary, _s.border1PX, _s.borderColorSecondary, _s.flexRow, _s.circle, _s.alignItemsCenter].join(' ')}>
          {
            !!prependIcon &&
            <Icon id={prependIcon} width='16px' height='16px' className={[_s.marginLeft15PX, _s.marginRight5PX].join(' ')} />
          }

          <input
            className={inputClasses}
            type='text'
            placeholder={placeholder}
            value={value}
            onChange={onChange}
            onKeyUp={onKeyUp}
            onFocus={onFocus}
            onBlur={onBlur}
          />

          {
            hasClear &&
            <div role='button' tabIndex='0' className={'btnClasses'} onClick={onClear}>
              <Icon id='close' width='10px' height='10px' className={_s.fillColorWhite} aria-label='Clear' />
            </div>
          }
        </div>
      </Fragment>
    )
  }
}