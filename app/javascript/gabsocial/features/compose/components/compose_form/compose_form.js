import { defineMessages, injectIntl } from 'react-intl';
import ImmutablePureComponent from 'react-immutable-pure-component';
import { length } from 'stringz';
import ImmutablePropTypes from 'react-immutable-proptypes';
import classNames from 'classnames/bind'
import CharacterCounter from '../character_counter';
import UploadForm from '../upload_form';
import ReplyIndicatorContainer from '../../containers/reply_indicator_container';
import AutosuggestTextbox from '../../../../components/autosuggest_textbox';
import PollButton from '../../components/poll_button';
import UploadButton from '../../components/upload_button';
import SpoilerButton from '../../components/spoiler_button';
import PrivacyDropdown from '../../components/privacy_dropdown';
import EmojiPickerButton from '../../components/emoji_picker_button'
import EmojiPickerDropdown from '../../containers/emoji_picker_dropdown_container';
import PollFormContainer from '../../containers/poll_form_container';
import SchedulePostDropdown from '../../components/schedule_post_dropdown';
import QuotedStatusPreviewContainer from '../../containers/quoted_status_preview_container';
import Icon from '../../../../components/icon';
import Button from '../../../../components/button';
import Avatar from '../../../../components/avatar'
import { isMobile } from '../../../../utils/is_mobile';
import { countableText } from '../../util/counter';

const allowedAroundShortCode = '><\u0085\u0020\u00a0\u1680\u2000\u2001\u2002\u2003\u2004\u2005\u2006\u2007\u2008\u2009\u200a\u202f\u205f\u3000\u2028\u2029\u0009\u000a\u000b\u000c\u000d';
const maxPostCharacterCount = 3000;

const messages = defineMessages({
  placeholder: { id: 'compose_form.placeholder', defaultMessage: 'What is on your mind?' },
  spoiler_placeholder: { id: 'compose_form.spoiler_placeholder', defaultMessage: 'Write your warning here' },
  publish: { id: 'compose_form.publish', defaultMessage: 'Gab' },
  publishLoud: { id: 'compose_form.publish_loud', defaultMessage: '{publish}' },
  schedulePost: { id: 'compose_form.schedule_post', defaultMessage: 'Schedule Post' }
});

const cx = classNames.bind(_s)

export default
@injectIntl
class ComposeForm extends ImmutablePureComponent {

  state = {
    composeFocused: false,
  }

  static contextTypes = {
    router: PropTypes.object,
  };

  static propTypes = {
    intl: PropTypes.object.isRequired,
    edit: PropTypes.bool.isRequired,
    text: PropTypes.string.isRequired,
    suggestions: ImmutablePropTypes.list,
    account: ImmutablePropTypes.map.isRequired,
    status: ImmutablePropTypes.map,
    spoiler: PropTypes.bool,
    privacy: PropTypes.string,
    spoilerText: PropTypes.string,
    focusDate: PropTypes.instanceOf(Date),
    caretPosition: PropTypes.number,
    preselectDate: PropTypes.instanceOf(Date),
    isSubmitting: PropTypes.bool,
    isChangingUpload: PropTypes.bool,
    isUploading: PropTypes.bool,
    onChange: PropTypes.func.isRequired,
    onSubmit: PropTypes.func.isRequired,
    onClearSuggestions: PropTypes.func.isRequired,
    onFetchSuggestions: PropTypes.func.isRequired,
    onSuggestionSelected: PropTypes.func.isRequired,
    onChangeSpoilerText: PropTypes.func.isRequired,
    onPaste: PropTypes.func.isRequired,
    onPickEmoji: PropTypes.func.isRequired,
    showSearch: PropTypes.bool,
    anyMedia: PropTypes.bool,
    shouldCondense: PropTypes.bool,
    autoFocus: PropTypes.bool,
    group: ImmutablePropTypes.map,
    isModalOpen: PropTypes.bool,
    scheduledAt: PropTypes.instanceOf(Date),
    setScheduledAt: PropTypes.func.isRequired,
  };

  static defaultProps = {
    showSearch: false,
  };

  handleChange = (e) => {
    this.props.onChange(e.target.value);
  }

  handleComposeFocus = () => {
    this.setState({
      composeFocused: true,
    });
  }

  handleKeyDown = (e) => {
    if (e.keyCode === 13 && (e.ctrlKey || e.metaKey)) {
      this.handleSubmit();
    }
  }

  handleClick = (e) => {
    if (!this.form) return false;
    if (e.target) {
      if (e.target.classList.contains('react-datepicker__time-list-item')) return;
    }
    if (!this.form.contains(e.target)) {
      this.handleClickOutside();
    }
  }

  handleClickOutside = () => {
    const { shouldCondense, scheduledAt, text, isModalOpen } = this.props;
    const condensed = shouldCondense && !text;
    if (condensed && scheduledAt && !isModalOpen) { //Reset scheduled date if condensing
      this.props.setScheduledAt(null);
    }

    this.setState({
      composeFocused: false,
    });
  }

  handleSubmit = () => {
    if (this.props.text !== this.autosuggestTextarea.textbox.value) {
      // Something changed the text inside the textarea (e.g. browser extensions like Grammarly)
      // Update the state to match the current text
      this.props.onChange(this.autosuggestTextarea.textbox.value);
    }

    // Submit disabled:
    const { isSubmitting, isChangingUpload, isUploading, anyMedia } = this.props;
    const fulltext = [this.props.spoilerText, countableText(this.props.text)].join('');

    if (isSubmitting || isUploading || isChangingUpload || length(fulltext) > maxPostCharacterCount || (fulltext.length !== 0 && fulltext.trim().length === 0 && !anyMedia)) {
      return;
    }

    this.props.onSubmit(this.context.router ? this.context.router.history : null, this.props.group);
  }

  onSuggestionsClearRequested = () => {
    this.props.onClearSuggestions();
  }

  onSuggestionsFetchRequested = (token) => {
    this.props.onFetchSuggestions(token);
  }

  onSuggestionSelected = (tokenStart, token, value) => {
    this.props.onSuggestionSelected(tokenStart, token, value, ['text']);
  }

  onSpoilerSuggestionSelected = (tokenStart, token, value) => {
    this.props.onSuggestionSelected(tokenStart, token, value, ['spoiler_text']);
  }

  handleChangeSpoilerText = (e) => {
    this.props.onChangeSpoilerText(e.target.value);
  }

  componentDidMount() {
    document.addEventListener("click", this.handleClick, false);
  }

  componentWillUnmount() {
    document.removeEventListener("click", this.handleClick, false);
  }

  componentDidUpdate(prevProps) {
    if (!this.autosuggestTextarea) return;

    // This statement does several things:
    // - If we're beginning a reply, and,
    //     - Replying to zero or one users, places the cursor at the end of the textbox.
    //     - Replying to more than one user, selects any usernames past the first;
    //       this provides a convenient shortcut to drop everyone else from the conversation.
    if (this.props.focusDate !== prevProps.focusDate) {
      let selectionEnd, selectionStart;

      if (this.props.preselectDate !== prevProps.preselectDate) {
        selectionEnd = this.props.text.length;
        selectionStart = this.props.text.search(/\s/) + 1;
      } else if (typeof this.props.caretPosition === 'number') {
        selectionStart = this.props.caretPosition;
        selectionEnd = this.props.caretPosition;
      } else {
        selectionEnd = this.props.text.length;
        selectionStart = selectionEnd;
      }

      this.autosuggestTextarea.textbox.setSelectionRange(selectionStart, selectionEnd);
      this.autosuggestTextarea.textbox.focus();
    }
  }

  setAutosuggestTextarea = (c) => {
    this.autosuggestTextarea = c;
  }

  setForm = (c) => {
    this.form = c;
  }

  setSpoilerText = (c) => {
    this.spoilerText = c;
  }

  handleEmojiPick = (data) => {
    const { text } = this.props;
    const position = this.autosuggestTextarea.textbox.selectionStart;
    const needsSpace = data.custom && position > 0 && !allowedAroundShortCode.includes(text[position - 1]);

    this.props.onPickEmoji(position, data, needsSpace);
  }

  render() {
    const {
      intl,
      account,
      onPaste,
      showSearch,
      anyMedia,
      shouldCondense,
      autoFocus,
      isModalOpen,
      quoteOfId,
      edit,
      scheduledAt,
      spoiler
    } = this.props
    const condensed = shouldCondense && !this.props.text && !this.state.composeFocused;
    const disabled = this.props.isSubmitting;
    const text = [this.props.spoilerText, countableText(this.props.text)].join('');
    const disabledButton = disabled || this.props.isUploading || this.props.isChangingUpload || length(text) > maxPostCharacterCount || (text.length !== 0 && text.trim().length === 0 && !anyMedia);
    const shouldAutoFocus = autoFocus && !showSearch && !isMobile(window.innerWidth)

    const containerClasses = cx({
      default: 1,
      flexGrow1: 1,
      flexRow: shouldCondense,
      radiusSmall: shouldCondense,
      backgroundSubtle: shouldCondense,
      paddingHorizontal5PX: shouldCondense,
    })

    const actionsContainerClasses = cx({
      default: 1,
      flexRow: 1,
      alignItemsCenter: 1,
      marginTop10PX: !shouldCondense,
    })

    const avatarContainerClasses = cx({
      default: 1,
      marginRight10PX: 1,
      marginTop5PX: shouldCondense,
    })

    const contentWarningClasses = cx({
      default: 1,
      paddingTop5PX: 1,
      paddingBottom10PX: 1,
      borderBottom1PX: 1,
      borderColorSecondary: 1,
      displayNone: !spoiler
    })

    const avatarSize = shouldCondense ? 28 : 46

    return (
      <div className={[_s.default, _s.flexRow, _s.width100PC].join(' ')}>
        <div className={avatarContainerClasses}>
          <Avatar account={account} size={avatarSize} />
        </div>

        <div
          className={containerClasses}
          ref={this.setForm}
          onClick={this.handleClick}
        >

          { /* !shouldCondense && <ReplyIndicatorContainer /> */}

          <div className={contentWarningClasses}>
            <AutosuggestTextbox
              placeholder={intl.formatMessage(messages.spoiler_placeholder)}
              value={this.props.spoilerText}
              onChange={this.handleChangeSpoilerText}
              onKeyDown={this.handleKeyDown}
              disabled={!this.props.spoiler}
              ref={this.setSpoilerText}
              suggestions={this.props.suggestions}
              onSuggestionsFetchRequested={this.onSuggestionsFetchRequested}
              onSuggestionsClearRequested={this.onSuggestionsClearRequested}
              onSuggestionSelected={this.onSpoilerSuggestionSelected}
              searchTokens={[':']}
              id='cw-spoiler-input'
              className='spoiler-input__input'
            />
          </div>

          { /*
        <div className='emoji-picker-wrapper'>
          <EmojiPickerDropdown onPickEmoji={this.handleEmojiPick} />
        </div> */ }

          <AutosuggestTextbox
            ref={(isModalOpen && shouldCondense) ? null : this.setAutosuggestTextarea}
            placeholder={intl.formatMessage(messages.placeholder)}
            disabled={disabled}
            value={this.props.text}
            onChange={this.handleChange}
            suggestions={this.props.suggestions}
            onKeyDown={this.handleKeyDown}
            onFocus={this.handleComposeFocus}
            onSuggestionsFetchRequested={this.onSuggestionsFetchRequested}
            onSuggestionsClearRequested={this.onSuggestionsClearRequested}
            onSuggestionSelected={this.onSuggestionSelected}
            onPaste={onPaste}
            autoFocus={shouldAutoFocus}
            small={shouldCondense}
            textarea
          >

            <div className='compose-form__modifiers'>
              <UploadForm />
              {
                !edit &&
                <PollFormContainer />
              }
            </div>

          </AutosuggestTextbox>

          { /* quoteOfId && <QuotedStatusPreviewContainer id={quoteOfId} /> */}

          <div className={actionsContainerClasses}>
            <div className={[_s.default, _s.flexRow, _s.marginRightAuto].join(' ')}>
              <UploadButton small={shouldCondense} />
              {
                !edit && <PollButton small={shouldCondense} />
              }
              {
                !shouldCondense &&
                <PrivacyDropdown />
              }
              <SpoilerButton small={shouldCondense} />
              <SchedulePostDropdown small={shouldCondense} position={isModalOpen ? 'top' : undefined} />
              <EmojiPickerButton small={shouldCondense} />
            </div>
            <CharacterCounter max={maxPostCharacterCount} text={text} small={shouldCondense} />
            {
              !shouldCondense &&
              <Button
                className={[_s.fontSize15PX, _s.paddingHorizontal15PX].join(' ')}
                onClick={this.handleSubmit}
                disabled={disabledButton}
              >
                {intl.formatMessage(scheduledAt ? messages.schedulePost : messages.publish)}
              </Button>
            }
          </div>

        </div>
      </div>
    )
  }

}
