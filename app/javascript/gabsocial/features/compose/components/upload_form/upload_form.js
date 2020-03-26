import ImmutablePropTypes from 'react-immutable-proptypes'
import ImmutablePureComponent from 'react-immutable-pure-component'
import ProgressBar from '../../../../components/progress_bar'
import Upload from '../upload'
import SensitiveMediaButton from '../sensitive_media_button'

const mapStateToProps = state => ({
  mediaIds: state.getIn(['compose', 'media_attachments']).map(item => item.get('id')),
  isUploading: state.getIn(['compose', 'is_uploading']),
  uploadProgress: state.getIn(['compose', 'progress']),
});

export default
@connect(mapStateToProps)
class UploadForm extends ImmutablePureComponent {

  static propTypes = {
    mediaIds: ImmutablePropTypes.list.isRequired,
    isUploading: PropTypes.bool,
    uploadProgress: PropTypes.number,
  };

  render () {
    const {
      mediaIds,
      isUploading,
      uploadProgress
    } = this.props

    return (
      <div className={_s.default}>
        <div className={[_s.default, _s.flexRow, _s.flexWrap].join(' ')}>
          {
            mediaIds.map(id => (
              <Upload id={id} key={id} />
            ))
          }
        </div>

        {
          !mediaIds.isEmpty() &&
          <SensitiveMediaButton />
        }

        {
          isUploading &&
          <ProgressBar small progress={uploadProgress} />
        }
      </div>
    )
  }

}
